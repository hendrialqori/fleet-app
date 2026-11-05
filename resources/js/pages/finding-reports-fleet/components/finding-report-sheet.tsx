import { useState } from "react";
import { FileDown, Loader2, Plus, RotateCcw, Save } from "lucide-react";
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
import { ConfirmDialog } from "./confirm-dialog";
import { FindingCard } from "./finding-card";
import { createFinding, isFindingValid, type Finding } from "./types";

const revokeFinding = (finding: Finding) => {
   finding.cartrack.forEach((image) => URL.revokeObjectURL(image.url));
   if (finding.nota) URL.revokeObjectURL(finding.nota.url);
};

// Library PDF cukup besar, jadi dimuat hanya saat dibutuhkan
const loadPdfModule = () => import("./export-finding-report");

type FindingReportSheetProps = {
   onSave: (report: { periode: string; fileName: string; blob: Blob }) => void;
};

export function FindingReportSheet({ onSave }: FindingReportSheetProps) {
   const [open, setOpen] = useState(false);
   const [periode, setPeriode] = useState("");
   const [findings, setFindings] = useState<Finding[]>(() => [createFinding()]);
   const [showErrors, setShowErrors] = useState(false);
   const [busy, setBusy] = useState<"export" | "save" | null>(null);
   const [confirm, setConfirm] = useState<"reset" | "save" | null>(null);

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

   const validate = () => {
      setShowErrors(!isValid);
      return isValid;
   };

   const handleExport = async () => {
      if (!validate()) return;

      setBusy("export");
      try {
         const { exportFindingReport } = await loadPdfModule();
         await exportFindingReport(periode, findings);
      } finally {
         setBusy(null);
      }
   };

   const handleSave = async () => {
      setBusy("save");
      try {
         const { generateFindingReport, getReportFileName } = await loadPdfModule();
         const blob = await generateFindingReport(periode, findings);
         onSave({ periode, fileName: getReportFileName(periode), blob });
         reset();
         setOpen(false);
      } finally {
         setBusy(null);
      }
   };

   return (
      <Sheet open={open} onOpenChange={setOpen}>
         <SheetTrigger asChild>
            <Button>
               <Plus />
               Buat Laporan Temuan
            </Button>
         </SheetTrigger>
         <SheetContent side="bottom" className="h-[83.333vh]! gap-0">
            <SheetHeader className="border-b">
               <SheetTitle>Form Temuan Monitoring Cartrack</SheetTitle>
               <SheetDescription>Isi setiap temuan beserta lampiran dokumentasi, lalu export atau simpan sebagai PDF</SheetDescription>
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

            <SheetFooter className="mt-0 flex-row items-center justify-between gap-4 border-t">
               <div className="flex items-center gap-4">
                  <Button type="button" variant="outline" disabled={busy !== null} onClick={() => setConfirm("reset")}>
                     <RotateCcw />
                     Reset
                  </Button>
                  {showErrors && !isValid && (
                     <p className="text-sm text-destructive">Lengkapi periode, no polisi, waktu, kendala, dan driver di setiap temuan.</p>
                  )}
               </div>
               <div className="flex gap-2">
                  <Button type="button" variant="outline" disabled={busy !== null} onClick={handleExport}>
                     {busy === "export" ? <Loader2 className="animate-spin" /> : <FileDown />}
                     {busy === "export" ? "Membuat PDF..." : "Export PDF"}
                  </Button>
                  <Button type="button" disabled={busy !== null} onClick={() => validate() && setConfirm("save")}>
                     {busy === "save" ? <Loader2 className="animate-spin" /> : <Save />}
                     {busy === "save" ? "Menyimpan..." : "Simpan"}
                  </Button>
               </div>
            </SheetFooter>

            <ConfirmDialog
               open={confirm === "reset"}
               onOpenChange={(value) => setConfirm(value ? "reset" : null)}
               title="Reset form?"
               description="Semua temuan dan lampiran yang sudah diisi akan dihapus. Aksi ini tidak dapat diurungkan."
               confirmLabel="Reset"
               destructive
               onConfirm={reset}
            />
            <ConfirmDialog
               open={confirm === "save"}
               onOpenChange={(value) => setConfirm(value ? "save" : null)}
               title="Simpan laporan temuan?"
               description={`Laporan berisi ${findings.length} temuan akan dibuat menjadi PDF dan disimpan ke daftar Laporan Temuan.`}
               confirmLabel="Simpan"
               onConfirm={handleSave}
            />
         </SheetContent>
      </Sheet>
   );
}
