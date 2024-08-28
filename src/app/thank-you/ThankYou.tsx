"use client"

import { useQuery } from "@tanstack/react-query"
import { getPaymentStatus } from "./actions"
import { useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import PhonePreview from "@/components/PhonePreview"

const ThankYou = () => {
    const searchParams = useSearchParams()
    const orderId = searchParams.get("orderId") || ''

    const { data } = useQuery({
        queryKey: ['get-payment-status'],
        queryFn: async () => await getPaymentStatus({ orderId }),
        retry: true,
        retryDelay: 500,
    })

    // if data is equal to undefined its means that it hasnt fetch the orderId yet from the parsed ur
    // therefore its still loading and this progress should be displayed

if(data === undefined){
    return (
        <div className="w-full mt-24 flex justify-center">
            <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />
                <h3 className="font-semibold text-xl">Loading your order...</h3>
                <p>This won't take long.</p>
            </div>
        </div>
    )
}

// we are waiting for the webhook to update our database
if ( data === false){
    return (
        <div className="w-full mt-24 flex justify-center">
            <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />
                <h3 className="font-semibold text-xl">Verifying your payment...</h3>
                <p>This might take a moment.</p>
            </div>
        </div>
    )
}

const { configuration, billingAddress, shippingAddress, amount} = data
const { color } = configuration

    return (
        <div className="bg-white">
            <div className="mx-auto max-3xl  py-16 sm:py-24 lg: px-8">
              <div className="max-w-xl">
                <p className="text-base font-medium text-primary">Thank you!</p>
                <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
                    Your case is on the way
                </h1 >
                <p className="mt-2 txet-base text-zinc-500 ">We've received your order and are now processing it.</p>
                <div className="mt-12 text-sm font-medium">
                    <p className="text-zinc-900">Order number</p>
                    <p className="mt-2 text-zinc-500">{orderId}</p>
                </div>
                </div>  

                <div className="mt-10 bodrer-t border-zinc-200">
                    <div className="mt-10 flex flex-auto flex-col">
                        <h4 className="font-semibold text-zinc-900">
                            You made a great choice!
                        </h4>
                        <p className="mt-2">we at casecobra believe that a phone case doesn't only need
                        to look good, but also last you for the years to come. We offer a 1-year print gurantee; If you case isn,t of the highest quality.
                        we'll replace it for free </p>
                    </div>
                </div>
                <div className="flex space-x-6 overflow-hidden mt-4 rounded-xl bg-gray-900/5 ring-inset ring-gray-900/10 lg:rounded-2xl">
                    <PhonePreview croppedImageUrl={configuration.croppedImageUrl!} color={color!} />
                </div>
            </div>
        </div>
    )
}

export default ThankYou