"use client"

import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import Dropzone, { FileRejection } from "react-dropzone";
import { Divide, Image, Loader2, MousePointerSquareDashed } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useUploadThing } from "@/lib/uploadthing";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const Page = () => {
  const { toast } = useToast();
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: handleUploadComplete,
    onUploadProgress: handleUploadProgress,
  });

  function handleUploadComplete(res: { serverData: { configId: string } }[]) {
    if (res.length > 0) {
      const configId = res[0].serverData.configId;

      startTransition(() => {
        router.push(`/configure/design?id=${configId}`);
      });
    }
  }

  function handleUploadProgress(progress: number) {
    setUploadProgress(progress);
  }

  function handleDropRejected(rejectedFiles: FileRejection[]) {
    const [file] = rejectedFiles;

    setIsDragOver(false);

    toast({
      title: `${file.file.type} type is not supported.`,
      description: "Please choose a PNG, JPG, JPEG image instead.",
      variant: "destructive",
    });
  }

  function handleDropAccepted(acceptedFiles: File[]) {
    startUpload(acceptedFiles, { configId: undefined });
    setIsDragOver(false);
  }

  return (
    <div
      className={cn(
        "relative h-full flex-1 my-16 w-full rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl flex justify-center flex-col items-center",
        {
          "ring-blue-900/25 bg-900/10": isDragOver,
        }
      )}
    >
      <div className="relative flex flex-1 flex-col items-center justify-center w-full">
        <Dropzone
          onDropRejected={handleDropRejected}
          onDropAccepted={handleDropAccepted}
          accept={{
            "image/png": [".png"],
            "image/jpeg": [".jpeg"],
            "image/jpg": [".jpg"],
          }}
          onDragEnter={() => setIsDragOver(true)}
          onDragLeave={() => setIsDragOver(false)}
        >
          {({ getRootProps, getInputProps }) => (
            <div
              className="h-full w-full flex-1 flex flex-col items-center justify-center"
              {...getRootProps()}
            >
              <input className="text-green-500" {...getInputProps()} />
              {renderIcon()}
              {renderText()}
              {!isPending && (
                <p className="text-xs text-zinc-500">PNG, JPG, JPEG</p>
              )}
            </div>
          )}
        </Dropzone>
      </div>
    </div>
  );

  function renderIcon() {
    if (isDragOver) {
      return <MousePointerSquareDashed className="h-6 w-6 text-zinc-500" />;
    } else if (isUploading || isPending) {
      return <Loader2 className="animate-spin w-6 h-6 text-zinc-500" />;
    } else {
      return <Image className="h-6 w-6 text-zinc-500 mb-2" />;
    }
  }

  function renderText() {
    if (isUploading) {
      return (
        <div className="flex flex-col items-center">
          <p>Uploading</p>
          <Progress
            value={uploadProgress}
            className="mt-2 w-40 h-2 bg-gray-300"
          />
        </div>
      );
    } else if (isPending) {
      return <p>Redirecting, please wait...</p>;
    } else if (isDragOver) {
      return (
        <p>
          <span className="font-semibold">Drop file</span> to upload
        </p>
      );
    } else {
      return (
        <p>
          <span className="font-semibold">Click to upload</span> or drag and
          drop
        </p>
      );
    }
  }
};

export default Page;