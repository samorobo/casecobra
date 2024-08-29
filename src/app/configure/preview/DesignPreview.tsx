'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import Confetti from 'react-dom-confetti'
import { ArrowRight, Check } from 'lucide-react'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { Configuration } from '@prisma/client'
import Phone from '@/components/Phone'
import { Button } from '@/components/ui/button'
import LoginModal from '@/components/LoginModal'
import { useToast } from '@/components/ui/use-toast'
import { BASE_PRICE, PRODUCT_PRICES } from '@/config/products'
//import { COLORS, FINISHES, MATERIALS, MODELS } from '@/validators/option-validator'
import { COLORS, FINISHES, MATERIALS, MODELS } from '@/validators/option- validator'

import { cn, formatPrice } from '@/lib/utils'
import { createCheckoutSession } from './actions'

const DesignPreview = ({ configuration }: { configuration: Configuration }) => {
  const { color, model, finish, material, id, croppedImageUrl } = configuration
  const { user } = useKindeBrowserClient()
  const router = useRouter()
  const { toast } = useToast()

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    setShowConfetti(true)
  }, [])

  // Handle case when material or finish is null by providing default values
  const totalPrice = calculateTotalPrice(BASE_PRICE, material ?? '', finish ?? '')

   // Show error toast notification
   const showErrorToast = () => {
    toast({
      title: 'Something went wrong',
      description: 'There was an error on our end. Please try again.',
      variant: 'destructive',
    })
  }

  // Function to create a checkout session
  const { mutate: createPaymentSession } = useMutation({
    mutationKey: ['get-checkout-session'],
    mutationFn: createCheckoutSession,
    onSuccess: ({ url }) => {
      if (url) {
        router.push(url)
      } else {
        showErrorToast()
      }
    },
    onError: showErrorToast,
  })

  // Handle checkout process
  const handleCheckout = () => {
    if (user) {
      createPaymentSession({ configId: id })
    } else {
      localStorage.setItem('configurationId', id)
      setIsLoginModalOpen(true)
    }
  }
 

  // Calculate the total price based on selected options
  function calculateTotalPrice(basePrice: number, material: string, finish: string) {
    let price = basePrice
    if (material === 'polycarbonate') price += PRODUCT_PRICES.material.polycarbonate
    if (finish === 'textured') price += PRODUCT_PRICES.finish.textured
    return price
  }

  // Get the display label for the selected model
  const { label: modelLabel } = MODELS.options.find(({ value }) => value === model)!

  // Get the Tailwind class for the selected color
  const colorClass = COLORS.find((c) => c.value === color)?.tw

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 overflow-hidden flex justify-center"
      >
        <Confetti active={showConfetti} config={{ elementCount: 500, spread: 120, duration: 5000 }} />
      </div>

      <LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} />

      <div className="mt-20 grid grid-cols-1 text-sm sm:grid-cols-12 sm:grid-row-1 sm:gap-x-6 md:gap-x-8 lg:gap-x-12">
        <div className="sm:col-span-4 md:col-span-3 md:row-span-2 md:row-end-2">
          <Phone className={cn(`bg-${colorClass}`)} imgSrc={croppedImageUrl!} />
        </div>

        <div className="mt-6 sm:col-span-9 sm:mt-0 md:row-end-1">
          <h3 className="text-3xl font-bold tracking-tight text-gray-900">Your {modelLabel} Case</h3>
          <div className="mt-3 flex items-center gap-1.5 text-base">
            <Check className="h-4 w-4 text-green-500" />
            in stock and ready to ship
          </div>
        </div>

        <div className="sm:col-span-12 md:col-span-9 text-base">
          <div className="grid grid-cols-1 gap-y-8 border-b border-gray-200 py-8 sm:grid-cols-2 sm:gap-x-6 sm:py-6 md:py-10">
            <HighlightSection />
            <MaterialSection />
          </div>

          <div className="mt-8">
            <PriceDetails
              totalPrice={totalPrice}
              material={material}
              finish={finish}
              basePrice={BASE_PRICE}
            />
            <div className="mt-8 flex justify-end pb-12">
              <Button onClick={handleCheckout} className="px-4 sm:px-6 lg:px-8">
                Check out <ArrowRight className="h-4 w-4 ml-1.5 lnline" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const HighlightSection = () => (
  <div>
    <p className="font-medium text-zinc-950">Highlights</p>
    <ol className="mt-3 text-zinc-700 list-disc list-inside">
      <li>Wireless charging compatible</li>
      <li>TPU shock absorption</li>
      <li>Packaging made from recycled materials</li>
      <li>5 year print warranty</li>
    </ol>
  </div>
)

const MaterialSection = () => (
  <div>
    <p className="font-medium text-zinc-950">Materials</p>
    <ol className="mt-3 text-zinc-700 list-disc list-inside">
      <li>High-quality, durable material</li>
      <li>Scratch and fingerprint resistant coating</li>
    </ol>
  </div>
)

const PriceDetails = ({
  totalPrice,
  material,
  finish,
  basePrice,
}: {
  totalPrice: number
  material: string | null
  finish: string | null
  basePrice: number
}) => (
  <div className="bg-gray-50 p-6 sm:rounded-lg sm:p-8">
    <div className="flow-root text-sm">
      <PriceRow label="Base price" price={basePrice} />
      {finish === 'textured' && (
        <PriceRow label="Textured finish" price={PRODUCT_PRICES.finish.textured} />
      )}
      {material === 'polycarbonate' && (
        <PriceRow label="Soft polycarbonate material" price={PRODUCT_PRICES.material.polycarbonate} />
      )}
      <div className="my-2 h-px bg-gray-200" />
      <PriceRow label="Order total" price={totalPrice} isTotal />
    </div>
  </div>
)

const PriceRow = ({
  label,
  price,
  isTotal = false,
}: {
  label: string
  price: number
  isTotal?: boolean
}) => (
  <div className={`flex items-center justify-between py-1 mt-2 ${isTotal ? 'font-semibold' : ''}`}>
    <p className={`text-${isTotal ? 'gray-900' : 'gray-600'}`}>{label}</p>
    <p className={`font-${isTotal ? 'bold' : 'medium'}`}>{formatPrice(price / 100)}</p>
  </div>
)

export default DesignPreview
