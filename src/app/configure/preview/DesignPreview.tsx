'use client'

import Phone from '@/components/Phone'
import { Configuration } from '@prisma/client'
import { useEffect, useState } from 'react'
import Confetti from 'react-dom-confetti'

const DesignPreview = ({configuration}: {configuration: Configuration}) => {
    const [showConfetti, setShowConfetti] = useState(false)
    // once the component mounts let setConfetti be set to true
    useEffect(() => setShowConfetti(true))

    return (
    <>
    <div aria-hidden="true" className="pointer-events-none select-none absolute inset-0 overflow-hidden flex justify-center">
        <Confetti active={showConfetti} config={{ elementCount: 500, spread: 120, duration: 5000 }} />
    </div>

    <div className="mt-20 grid grid-cols-1 text-sm sm:grid-cols-12 sm:grid-row-1 sm:gap-x-6 md:gap-x-8 lg:gap-x-12">
        <div className="sm:col-span-4 md:col-span-3 md:row-span-2 md:row-end-2">
            {/* The exclamtion "!" mark that was appended to the croppedImageUrl is to make typescript happy 
            because we know that our configuration database has updated from step 2 already */}
            <Phone imgSrc={configuration.croppedImageUrl!} />
        </div>
    </div>
    </>
    )

}

export default DesignPreview