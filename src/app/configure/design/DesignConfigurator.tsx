"use client";

import HandleComponent from "@/components/HandleComponent";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { RadioGroup } from "@headlessui/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, formatPrice } from "@/lib/utils";
//import { COLORS, FINISHES, MATERIALS, MODELS } from "@/validators/option-validator";
import { COLORS, FINISHES, MATERIALS, MODELS } from "@/validators/option- validator";
import NextImage from "next/image";
import { useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, ChevronsUpDown } from "lucide-react";
import { BASE_PRICE } from "@/config/products";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { saveConfig as _saveConfig, SaveConfigArgs } from "./actions";
import { useRouter } from "next/navigation";

interface DesignConfiguratorProps {
  configId: string;
  imageUrl: string;
  imageDimensions: { width: number; height: number };
}

const DesignConfigurator = ({
  configId,
  imageUrl,
  imageDimensions,
}: DesignConfiguratorProps) => {
  const { toast } = useToast();
  const router = useRouter();
  
// const phoneCaseRef = useRef<HTMLDivElement>(null);
// const containerRef = useRef<HTMLDivElement>(null);

// const [options, setOptions] = useState({
//   color: COLORS[0],
//   model: MODELS.options[0],
//   material: MATERIALS.options[0],
//   finish: FINISHES.options[0],
// });

// const [renderedDimension, setRenderedDimension] = useState({
//   width: imageDimensions.width / 4,
//   height: imageDimensions.height / 4,
// });

// const [renderedPosition, setRenderedPosition] = useState({
//   x: 150,
//   y: 205,
// });

// const { startUpload } = useUploadThing("imageUploader");

// const { mutate: saveConfig } = useMutation({
//   mutationKey: ["save-config"],
//   mutationFn: async (args: SaveConfigArgs) => {
//     try {
//       await saveConfiguration();
//       await _saveConfig(args);
//       router.push(`/configure/preview?id=${configId}`);
//     } catch (error) {
//       handleSaveError();
//     }
//   },
//   onError: handleSaveError,
// });

// function handleSaveError() {
//   toast({
//     title: "Something went wrong",
//     description: "There was an error on our end. Please try again.",
//     variant: "destructive",
//   });
// }

// async function saveConfiguration() {
//   try {
//     const positionOffsets = calculatePositionOffsets();
//     const canvas = createCanvas(positionOffsets.width, positionOffsets.height);

//     const userImage = await loadImage(imageUrl);
//     drawImageOnCanvas(canvas, userImage, positionOffsets);

//     const file = convertCanvasToFile(canvas);
//     await startUpload([file], { configId });
//   } catch (err) {
//     handleSaveError();
//   }
// }

// function calculatePositionOffsets() {
//   const { left: caseLeft, top: caseTop, width, height } = phoneCaseRef.current!.getBoundingClientRect();
//   const { left: containerLeft, top: containerTop } = containerRef.current!.getBoundingClientRect();

//   const leftOffset = caseLeft - containerLeft;
//   const topOffset = caseTop - containerTop;

//   return {
//     actualX: renderedPosition.x - leftOffset,
//     actualY: renderedPosition.y - topOffset,
//     width,
//     height,
//   };
// }

// function createCanvas(width: number, height: number) {
//   const canvas = document.createElement("canvas");
//   canvas.width = width;
//   canvas.height = height;
//   return canvas;
// }

// function loadImage(src: string): Promise<HTMLImageElement> {
//   return new Promise((resolve, reject) => {
//     const image = new Image();
//     image.crossOrigin = "anonymous";
//     image.src = src;
//     image.onload = () => resolve(image);
//     image.onerror = () => reject(new Error('Failed to load image'));
//   });
// }

// function drawImageOnCanvas(
//   canvas: HTMLCanvasElement,
//   image: HTMLImageElement,
//   { actualX, actualY, width, height }: { actualX: number; actualY: number; width: number; height: number }
// ) {
//   const ctx = canvas.getContext("2d");
//   ctx?.drawImage(image, actualX, actualY, width, height);
// }

// function convertCanvasToFile(canvas: HTMLCanvasElement): File {
//   const base64 = canvas.toDataURL();
//   const base64Data = base64.split(",")[1];
//   const blob = base64ToBlob(base64Data, "image/png");
//   return new File([blob], "fileName.png", { type: "image/png" });
// }

// function base64ToBlob(base64: string, mimeType: string) {
//   const byteCharacters = atob(base64);
//   const byteArray = Uint8Array.from(byteCharacters, (c) => c.charCodeAt(0));
//   return new Blob([byteArray], { type: mimeType });
// }




  const {mutate: saveConfig} = useMutation({
    mutationKey: ['save-config'],
    mutationFn: async(args: SaveConfigArgs) => {
        await Promise.all([saveConfiguration(), _saveConfig(args)])
    },

    onError: () => {
        toast({
            title: "Something went wrong",
            description: "There was an erroe on ours end. Please try again.",
            variant: 'destructive'
        })
    },

    onSuccess: () => {
        router.push(`/configure/preview?id=${configId}`)
    } 
})

const [options, setOptions] = useState<{
    color: (typeof COLORS)[number]
    model: (typeof MODELS.options)[number]
    material: (typeof MATERIALS.options)[number]
    finish: (typeof FINISHES.options)[number]
}>({ color:COLORS[0],
    model: MODELS.options[0],
    material: MATERIALS.options[0],
    finish: FINISHES.options[0]
})
const [renderedDimension,setRenderedDimension] = useState({
    width: imageDimensions.width/4,
    height: imageDimensions.height/ 4,
})

const [renderedPosition, setRenderedPosition] =  useState({
    x:150,
    y:205,
})

const phoneCaseRef = useRef<HTMLDivElement>(null);

const containerRef = useRef<HTMLDivElement>(null);
const {startUpload} = useUploadThing('imageUploader')

async function saveConfiguration(){
  
    try{
       const {left: caseLeft, top: caseTop, width, height} = phoneCaseRef.current!.getBoundingClientRect() 
       const {left: containerLeft, top: containerTop} = containerRef.current!.getBoundingClientRect()

       const leftOffset = caseLeft - containerLeft
       const topOffset =  caseTop - containerTop

       const actualX = renderedPosition.x - leftOffset
       const actualY  = renderedPosition.y - topOffset

       const canvas = document.createElement("canvas")

       canvas.width = width;
       canvas.height = height;
       const ctx = canvas.getContext("2d");

       const userImage = new Image()
       userImage.crossOrigin = "anonymous"
       userImage.src = imageUrl

       await new Promise((resolve) => (userImage.onload = resolve))

       ctx?.drawImage(
        userImage,
        actualX,
        actualY,
        renderedDimension.width,
        renderedDimension.height,
       )
       const base64 = canvas.toDataURL()
       const base64Data = base64.split(',')[1]

       const blob = base64ToBlob(base64Data, "image/png")
       const file = new File([blob], "fileName.png", {type: "image/png"})

      await startUpload([file], {configId})
    }
    catch(err){
            toast({
                title: "Something went wrong",
                description : "An error occured while saving your config, please try again",
                variant: "destructive",
            })
    }
}
function base64ToBlob(base64: string, mimeType: string){
    const byteCharacters = atob(base64)
    const byteNumbers = new Array(byteCharacters.length)
    for(let i = 0; i < byteCharacters.length; i++){
        byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    return new Blob([byteArray], { type: mimeType })
}

  function handleOptionChange(
    key: "color" | "model" | "material" | "finish",
    value: any
  ) {
    setOptions((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  const calculateTotalPrice = () => {
    const materialPrice = options.material.price;
    const finishPrice = options.finish.price;
    return BASE_PRICE + materialPrice + finishPrice;
  };

  return (
    <div className="relative grid grid-cols-1 lg:grid-cols-3 mt-20 mb-20 pb-20">
      <div
        ref={containerRef}
        className="relative h-[37.5rem] overflow-hidden col-span-2 w-full max-w-4xl flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <div className="relative w-60 bg-opacity-50 pointer-events-none aspect-[896/1831]">
          <AspectRatio
            ref={phoneCaseRef}
            ratio={896 / 1831}
            className="pointer-events-none relative z-50 aspect-[896/1831] w-full"
          >
            <NextImage
              fill
              alt="phone image"
              src="/phone-template.png"
              className="pointer-events-none z-50 select-none"
            />
          </AspectRatio>
          <div className="absolute z-40 inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px] shadow-[0_0_0_99999px_rgba(229,231,235,0.6)]" />
          <div
            className={cn(
              "absolute inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px]",
              `bg-${options.color.tw}`
            )}
          />
        </div>

        <Rnd
          default={{
            x: 150,
            y: 250,
            height: renderedDimension.height,
            width: renderedDimension.width,
          }}
          lockAspectRatio
          onResizeStop={(_, __, ref, ___, { x, y }) => {
            setRenderedDimension({
              height: parseInt(ref.style.height.slice(0, -2)),
              width: parseInt(ref.style.width.slice(0, -2)),
            });
            setRenderedPosition({ x, y });
          }}
          onDragStop={(_, data) => {
            const { x, y } = data;
            setRenderedPosition({ x, y });
          }}
          resizeHandleComponent={{
            bottomRight: <HandleComponent />,
            bottomLeft: <HandleComponent />,
            topRight: <HandleComponent />,
            topLeft: <HandleComponent />,
          }}
          className="absolute z-20 border-[3px] border-primary"
        >
          <div className="relative w-full h-full">
            <NextImage
              src={imageUrl}
              fill
              alt="pointer image"
              className="pointer-events-none"
            />
          </div>
        </Rnd>
      </div>

      <div className="h-[35.7rem] w-full col-span-full lg:col-span-1 flex flex-col bg-white">
        <ScrollArea className="relative flex-1 overflow-auto">
          <div
            aria-hidden="true"
            className="absolute z-10 inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white pointer-events-none"
          />
          <div className="pt-8 px-8 pb-12">
            <h2 className="text-lg font-medium">Device Options</h2>
            <div className="space-y-8 mt-6">
              <div>
                <Label className="block mb-2">Model</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded="false"
                      className="w-full justify-between"
                    >
                      {options.model.label}
                      <ChevronsUpDown className="ml-auto h-4 w-4 opacity-50 shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full p-1.5">
                    {MODELS.options.map((model) => (
                      <DropdownMenuItem
                        key={model.value}
                        onClick={() => handleOptionChange("model", model)}
                        className={cn("flex text-sm gap-1 items-center p-1.5 cursor-default hover:bg-zinc-100",{
                            "bg-zinc-100": model.label === options.model.label  
                        } )}

                      >
                        <span className="flex items-center justify-between">
                          {model.label}
                          {model.value === options.model.value && (
                            <Check className="ml-2 h-4 w-4 opacity-50" />
                          )}
                        </span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div>
                <RadioGroup 
                            value={options.color}
                            onChange={(val) => {
                                setOptions((prev) => ({
                                    ...prev,
                                    color: val
                                }))
                            }}
                            >
                            <Label>
                                Color: {options.color.label }
                            </Label>
                            <div className="mt-3 flex items-center space-x-3  ">
                                {
                                    COLORS.map((color, i) => (
                                        <RadioGroup.Option key={i} value={color} 
                                        className={({active,checked }) => cn("relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 active:ring-0 focus:ring-0 active:outline-none focus:outline-none border-transparent border-2 ", {
                                            [`border-${color.tw}`]: active || checked
                                        })}
                                        >
                                            <span className={cn(`bg-${color.tw}`, "h-8 w-8 rounded-full border border-black border-opacity-10 ")}/>
                                        </RadioGroup.Option>
                                    ))
                                }
                            </div>
                            </RadioGroup>
              </div>

              <div>
                {[MATERIALS,FINISHES].map(({name, options: selectableOptions}) => (
                            <RadioGroup key={name} value={options[name]} onChange={(val) => {
                                setOptions((prev) => ({
                                    ...prev,
                                    [name]: val,
                                }))
                            }}>
                            <Label>
                                {name.slice(0,1).toUpperCase() + name.slice(1)}
                            </Label>
                            <div className="mt-3 space-y-4">
                                {
                                    selectableOptions.map((option) => (
                                         <RadioGroup.Option key={option.value} value={option} className={({ active, checked}) =>cn("relative block cursor-pointer rounded-lg bg-white px-6 py-4 shadow-sm border-2 border-zinc-200 focus:outline-none ring-0 focus:ring-0 outline-none sm:flex sm:justify-between",{
                                            'border-primary' : active || checked,

                                         })}> 
                                            <span  className="flex items-center">
                                                <span className="flex flex-col text-sm">
                                                        <RadioGroup.Label as="span" className="font-medium text-gray-900">
                                                                {option.label}
                                                        </RadioGroup.Label>
                                                        {
                                                            option.description ? (
                                                                <RadioGroup.Description as="span" className="text-gray-500 ">
                                                                    <span className="block sm:inline" >
                                                                            {option.description}
                                                                    </span>
                                                                </RadioGroup.Description>
                                                            ) : null 
                                                        }
                                                </span>
                                            </span>
                                            <RadioGroup.Description as="span" className="mt-2 flex text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right">
                                                <span className="font-medium text-gray-900">
                                                     {formatPrice(option.price/ 100)}
                                                </span>
                                            </RadioGroup.Description>
                                         </RadioGroup.Option>
                                    ))
                                }
                            </div>
                            </RadioGroup>
                            ))}
                            
              </div>


            </div>
          </div>
        </ScrollArea>

        <div className="px-8 py-6 border-t">
          <div className="flex justify-between text-lg font-medium">
            <span>Total Price</span>
            {/* <span>{formatPrice(calculateTotalPrice())}</span> */}
            { formatPrice((BASE_PRICE + options.finish.price + options.material.price) / 100)}
          </div>
          <Button
            // onClick={() => saveConfig({ configId })}
            onClick={() => saveConfig({
                configId,
                color: options.color.value,
                finish: options.finish.value,
                material: options.material.value,
                model: options.model.value,
            })}
            className="w-full mt-4"
            size="lg"
          >
            Save and Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DesignConfigurator;
