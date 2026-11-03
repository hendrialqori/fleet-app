import { useEffect, useRef, useState } from "react";
import { FileText } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { DateRangePicker, getCurrentMonthRange, type DateRange } from "@/components/date-range-picker";
import AppMainLayout from "@/layouts/app/app-main-layout";
import { FindingReportSheet } from "./components/finding-report-sheet";
import { PdfPreviewSheet } from "./components/pdf-preview-sheet";
import { nextId, type FindingReport } from "./components/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Page() {
   // Sementara disimpan di state lokal (hilang saat refresh) sampai endpoint backend tersedia
   const [reports, setReports] = useState<FindingReport[]>([]);
   const [preview, setPreview] = useState<FindingReport | null>(null);
   const [range, setRange] = useState<DateRange | undefined>(() => getCurrentMonthRange());

   // Filter berdasarkan tanggal laporan disimpan, sama dengan yang tampil di tabel
   const filteredReports = range?.from
      ? reports.filter((report) => {
         const from = format(range.from!, "yyyy-MM-dd");
         const to = format(range.to ?? range.from!, "yyyy-MM-dd");
         const tanggal = format(report.createdAt, "yyyy-MM-dd");
         return tanggal >= from && tanggal <= to;
      })
      : reports;

   const reportsRef = useRef(reports);
   reportsRef.current = reports;
   useEffect(() => () => reportsRef.current.forEach((report) => URL.revokeObjectURL(report.url)), []);

   return (
      <AppMainLayout>
         <Card>
            <CardHeader>
               <CardTitle>Laporan Temuan</CardTitle>
               <CardDescription>Daftar laporan temuan monitoring cartrack dalam format PDF</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
               <div className="flex flex-wrap items-center justify-between gap-2">
                  <DateRangePicker value={range} onChange={setRange} />
                  <FindingReportSheet
                     onSave={({ periode, fileName, blob }) =>
                        setReports((list) => [
                           { id: nextId(), periode, fileName, url: URL.createObjectURL(blob), createdAt: new Date() },
                           ...list,
                        ])
                     }
                  />
               </div>
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead className="w-48">Tanggal</TableHead>
                        <TableHead>File Temuan</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {filteredReports.length === 0 && (
                        <TableRow>
                           <TableCell colSpan={2} className="py-10 text-center text-muted-foreground">
                              {reports.length === 0 ? "Belum ada laporan temuan" : "Tidak ada laporan pada rentang tanggal ini"}
                           </TableCell>
                        </TableRow>
                     )}
                     {filteredReports.map((report) => (
                        <TableRow key={report.id}>
                           <TableCell className="font-medium whitespace-nowrap">{format(report.createdAt, "dd/MM/yyyy HH:mm:ss")}</TableCell>
                           <TableCell>
                              <Button
                                 type="button"
                                 variant="outline"
                                 size="sm"
                                 onClick={() => setPreview(report)}
                                 className="inline-flex items-center gap-2 text-left"
                              >
                                 <FileText className="size-4 shrink-0 text-red-600" />
                                 {report.fileName}
                                 <Badge>Preview</Badge>
                              </Button>
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </CardContent>
         </Card>

         <PdfPreviewSheet report={preview} onOpenChange={(open) => !open && setPreview(null)} />
      </AppMainLayout>
   );
}
