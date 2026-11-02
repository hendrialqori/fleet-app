import { useState } from "react";
import { FileDown, Loader2, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
   Sheet,
   SheetContent,
   SheetDescription,
   SheetFooter,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
} from "@/components/ui/sheet";
import { FindingCard } from "./finding-card";
import { createFinding, isFindingValid, type Finding } from "./types";

const revokeFinding = (finding: Finding) => {
   finding.cartrack.forEach((image) => URL.revokeObjectURL(image.url));
   if (finding.nota) URL.revokeObjectURL(finding.nota.url);
};

export function FindingReportSheet() {
   const [periode, setPeriode] = useState("");
   const [findings, setFindings] = useState<Finding[]>(() => [createFinding()]);
   const [showErrors, setShowErrors] = useState(false);
   const [exporting, setExporting] = useState(false);

   const isValid = Boolean(periode) && findings.every(isFindingValid);

   const updateFinding = (finding: Finding) =>
      setFindings((list) => list.map((item) => (item.id === finding.id ? finding : item)));

   const removeFinding = (finding: Finding) => {
      revokeFinding(finding);
      setFindings((list) => list.filter((item) => item.id !== finding.id));
   };

   const reset = () => {
      findings.forEach(revokeFinding);
      setPeriode("");
      setFindings([createFinding()]);
      setShowErrors(false);
   };

   const handleExport = async () => {
      if (!isValid) {
         setShowErrors(true);
         return;
      }

      setExporting(true);
      try {
         // Library PDF cukup besar, jadi dimuat hanya saat export
         const { exportFindingReport } = await import("./export-finding-report");
         await exportFindingReport(periode, findings);
      } finally {
         setExporting(false);
      }
   };

   return (
      <Sheet>
         <SheetTrigger asChild>
            <Button>
               <Plus />
               Buat Report Temuan
            </Button>
         </SheetTrigger>
         <SheetContent side="bottom" className="h-[83.333vh]! gap-0">
            <SheetHeader className="border-b">
               <SheetTitle>Form Temuan Monitoring Cartrack</SheetTitle>
               <SheetDescription>Isi setiap temuan beserta lampiran dokumentasi, lalu export menjadi PDF</SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto bg-muted/30">
               <div className="mx-auto flex max-w-7xl flex-col gap-4 p-4">
                  <div className="flex max-w-xs flex-col gap-2">
                     <Label htmlFor="periode">Periode Tanggal</Label>
                     <Input
                        id="periode"
                        type="date"
                        value={periode}
                        aria-invalid={showErrors && !periode}
                        onChange={(e) => setPeriode(e.target.value)}
                     />
                  </div>

                  {findings.map((finding, index) => (
                     <FindingCard
                        key={finding.id}
                        index={index}
                        finding={finding}
                        showErrors={showErrors}
                        canRemove={findings.length > 1}
                        onChange={updateFinding}
                        onRemove={() => removeFinding(finding)}
                     />
                  ))}

                  <Button
                     type="button"
                     variant="outline"
                     className="border-dashed"
                     onClick={() => setFindings((list) => [...list, createFinding()])}
                  >
                     <Plus />
                     Tambah Temuan
                  </Button>
               </div>
            </div>

            <SheetFooter className="mt-0 flex-row items-center justify-between border-t">
               <p className="text-sm text-muted-foreground">
                  {showErrors && !isValid
                     ? <span className="text-destructive">Lengkapi periode, no polisi, waktu, kendala, dan driver di setiap temuan.</span>
                     : `${findings.length} temuan`}
               </p>
               <div className="flex gap-2">
                  <Button type="button" variant="outline" disabled={exporting} onClick={reset}>
                     <RotateCcw />
                     Reset
                  </Button>
                  <Button type="button" disabled={exporting} onClick={handleExport}>
                     {exporting ? <Loader2 className="animate-spin" /> : <FileDown />}
                     {exporting ? "Membuat PDF..." : "Export PDF"}
                  </Button>
               </div>
            </SheetFooter>
         </SheetContent>
      </Sheet>
   );
}
