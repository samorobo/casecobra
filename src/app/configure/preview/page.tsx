import { notFound } from "next/navigation"
import { db } from "@/db"
import DesignPreview from "./DesignPreview"



interface PageProps {
    // let say for instance this is the searchParams ?id=cm05rgs820000uiiu9i2vvxie key is the id, and the string that is
    // required to be appended to id is the rest of the characteres that comes after this sign =
    // the id takes a string or a string array of if the id  is undefined
    searchParams: {
    [key: string]: string | string[] | undefined
    }
}

const Page = async ({searchParams} : PageProps) => {
    const { id } = searchParams

    //This condition checks if id is either missing (undefined) or not of type string.
    if(!id || typeof id !== 'string'){
        return notFound()
    }

    const configuration = await db.configuration.findUnique({
        //checking if the id already exist in the database
        where: { id }
    })

    //otherwise return notFound
    if(!configuration){
        return notFound()
    }

    return <DesignPreview configuration={configuration} />
}

export default Page