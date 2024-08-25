'use server'

import { db } from "@/db"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

export const getAuthStatus = async () => {
    const {getUser} = getKindeServerSession()
    const user = await getUser()

    //checking to the userId and email is available, if not throw an error
    if(!user?.id || !user.email) {
        throw new Error('Invalid user data')
    }

    const existingUser = await db.user.findFirst({
        where: {
            id: user.id
        }
    })

    //if the user does not exist then createnew user

    if(!existingUser){
        await db.user.create({
            data: {
                id: user.id,
                email: user.email,
            }
        })
    }

    return {success: true }
}