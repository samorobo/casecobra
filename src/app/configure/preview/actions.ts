"use server"

import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products"
import { db } from "@/db"
import { stripe } from "@/lib/stripe"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { Order } from "@prisma/client"


export const createCheckoutSession = async ({configId}: { configId: string}) =>  {
    //first lets verify that this configuration(configId) exist by fetching it from the database
    const configuration = await db.configuration.findUnique({
        where: {
            id: configId
        }
        
    })
    if (!configuration){
        throw new Error("No such configuration found")
    }

    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if(!user){
        throw new Error("You need to be logged in")
    }

    const { material, finish } = configuration
    //we are recalculating the total price in the serverside because we dont want to fetch from 
    //the client side as the client user can manipulate the price and end up paying $0 which is nothing
    let price = BASE_PRICE
    if(finish === 'textured'){
        price += PRODUCT_PRICES.finish.textured
    }
    if(material === 'polycarbonate'){
        price += PRODUCT_PRICES.finish.textured
    }

    let order: Order | undefined = undefined

    //check for existing orderin db by using the userId and the configurationId
    const existingOrder = await db.order.findFirst({
        where: {
            userId: user.id,
            configurationId: configuration.id,
        },
    })

    console.log(user.id, configuration.id)

    //if we have an existingorder then set it to order otherwise create a new order
    if(existingOrder) {
        order = existingOrder
    } else {
        order = await db.order.create({
            data: {
                amount: price / 100,
                userId: user.id,
                configurationId: configuration.id
            },
        })
    }

    const product = await stripe.products.create({
        name: 'Custom iPhone Case',
        images: [configuration.imageUrl],
        default_price_data: {
            currency: 'USD',
            unit_amount: price,
        },
    })

    const stripeSession = await stripe.checkout.sessions.create({
        success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
           cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/configure/preview?id=${configuration.id}`,
           payment_method_types: ["card", "amazon_pay"],
           mode: "payment",
           shipping_address_collection: {allowed_countries: ["NG", "US","GB", "FR","CD", "CN", "VN", "AG"]},
           metadata: {
            userId: user.id,
            orderId: order.id,
           },
           line_items: [{price:  product.default_price as string, quantity: 1 }],
        })
    return { url: stripeSession.url}
}