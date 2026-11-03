import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";

type ConfirmDialogProps = {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   title: string;
   description: string;
   confirmLabel: string;
   destructive?: boolean;
   onConfirm: () => void;
};

export function ConfirmDialog({ open, onOpenChange, title, description, confirmLabel, destructive = false, onConfirm }: ConfirmDialogProps) {
   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>{title}</DialogTitle>
               <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
               <DialogClose asChild>
                  <Button variant="outline">Batal</Button>
               </DialogClose>
               <Button
                  variant={destructive ? "destructive" : "default"}
                  onClick={() => {
                     onOpenChange(false);
                     onConfirm();
                  }}
               >
                  {confirmLabel}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
