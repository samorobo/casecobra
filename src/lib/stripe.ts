import Stripe from 'stripe'

//we passed in empty string "" just to make typescript happy just incase the env is undefined
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
    apiVersion: '2024-06-20',
    typescript: true,
})