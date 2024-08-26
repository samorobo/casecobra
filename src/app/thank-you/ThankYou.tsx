"use client"

import { useQuery } from "@tanstack/react-query"
import { getPaymentStatus } from "./actions"
import { useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"


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
                <h1 className="text-base font-medium text-primary">Thank you!</h1>
                <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
                    Your case is on the way!
                </p>
                </div>  
            </div>
        </div>
    )
}

export default ThankYou