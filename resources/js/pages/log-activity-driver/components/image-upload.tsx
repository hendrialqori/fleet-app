import { useRef } from "react";
import { ImagePlus, X } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import type { Attachment } from "./types";

type ImageUploadProps = {
   id: string;
   label: string;
   description: string;
   images: Attachment[];
   multiple?: boolean;
   onAdd: (files: File[]) => void;
   onRemove: (id: string) => void;
};

export function ImageUpload({ id, label, description, images, multiple = false, onAdd, onRemove }: ImageUploadProps) {
   const inputRef = useRef<HTMLInputElement>(null);
   const canAdd = multiple || images.length === 0;

   return (
      <div className="flex flex-col gap-2">
         <div>
            <label htmlFor={id} className="text-sm font-medium">{label}</label>
            <p className="text-xs text-muted-foreground">{description}</p>
         </div>
         <div className={cn("grid gap-3", multiple ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-1")}>
            {images.map((image) => (
               <div key={image.id} className="group relative overflow-hidden rounded-md border bg-muted">
                  <img
                     src={image.url}
                     alt={image.file.name}
                     className={cn("w-full object-contain", multiple ? "h-32" : "h-64")}
                  />
                  <Button
                     type="button"
                     variant="destructive"
                     size="icon-sm"
                     className="absolute top-1.5 right-1.5"
                     onClick={() => onRemove(image.id)}
                  >
                     <X />
                     <span className="sr-only">Hapus gambar</span>
                  </Button>
                  <p className="truncate border-t bg-background/80 px-2 py-1 text-xs text-muted-foreground">{image.file.name}</p>
               </div>
            ))}
            {canAdd && (
               <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className={cn(
                     "flex flex-col items-center justify-center gap-1 rounded-md border border-dashed text-muted-foreground transition-colors hover:border-ring hover:bg-muted/50 focus:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                     multiple ? "h-[9.75rem]" : "h-64"
                  )}
               >
                  <ImagePlus className="size-6" />
                  <span className="text-xs">{multiple && images.length > 0 ? "Tambah gambar" : "Pilih gambar"}</span>
               </button>
            )}
         </div>
         <input
            ref={inputRef}
            id={id}
            type="file"
            accept="image/*"
            multiple={multiple}
            className="hidden"
            onChange={(event) => {
               const files = Array.from(event.target.files ?? []);
               if (files.length) onAdd(files);
               event.target.value = "";
            }}
         />
      </div>
   );
}
