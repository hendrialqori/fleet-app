import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatTanggal, type FindingReport } from "./types";

type PdfPreviewSheetProps = {
   report: FindingReport | null;
   onOpenChange: (open: boolean) => void;
};

export function PdfPreviewSheet({ report, onOpenChange }: PdfPreviewSheetProps) {
   return (
      <Sheet open={report !== null} onOpenChange={onOpenChange}>
         <SheetContent side="bottom" className="h-[95vh]! gap-0">
            <SheetHeader className="flex-row items-center justify-between gap-4 border-b pr-14">
               <div className="flex flex-col gap-1.5">
                  <SheetTitle>{report?.fileName}</SheetTitle>
                  <SheetDescription>Laporan temuan periode {report && formatTanggal(report.periode)}</SheetDescription>
               </div>
               {report && (
                  <Button variant="outline" size="sm" asChild>
                     <a href={report.url} download={report.fileName}>
                        <Download />
                        Unduh
                     </a>
                  </Button>
               )}
            </SheetHeader>
            {report && <iframe src={report.url} title={report.fileName} className="w-full flex-1 bg-muted" />}
         </SheetContent>
      </Sheet>
   );
}
