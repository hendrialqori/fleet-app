import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AppMainLayout from "@/layouts/app/app-main-layout";
import { EllipsisVertical, Plus, Trash, Image as ImageIcon } from "lucide-react";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table"
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Data sampel menggunakan gambar placeholder agar preview berfungsi
const activityLogs = [
   {
      id: 1,
      tanggal: "23/09/2026 18:58:12",
      platKendaraan: "KB 8546 YL",
      fotoBbm0: null,
      fotoOdometerAwal: null,
      fotoOdometerAkhir: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800",
      fotoNotaBbm: null
   },
   {
      id: 2,
      tanggal: "23/09/2026 19:04:44",
      platKendaraan: "KB 8239 YM",
      fotoBbm0: null,
      fotoOdometerAwal: null,
      fotoOdometerAkhir: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800",
      fotoNotaBbm: null
   },
   {
      id: 3,
      tanggal: "24/09/2026 06:07:45",
      platKendaraan: "KB 8417 YM",
      fotoBbm0: "https://images.unsplash.com/photo-1527012077209-b411333cda4a?w=800",
      fotoOdometerAwal: null,
      fotoOdometerAkhir: null,
      fotoNotaBbm: null
   },
   {
      id: 4,
      tanggal: "24/09/2026 06:44:34",
      platKendaraan: "KB 8546 YL",
      fotoBbm0: null,
      fotoOdometerAwal: null,
      fotoOdometerAkhir: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800",
      fotoNotaBbm: null
   },
   {
      id: 5,
      tanggal: "24/09/2026 07:15:48",
      platKendaraan: "KB 8145 YM",
      fotoBbm0: null,
      fotoOdometerAwal: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800",
      fotoOdometerAkhir: null,
      fotoNotaBbm: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800"
   },
];

// Component Reusable untuk Preview Gambar Thumbnail + Dialog Zoom
function ImagePreviewDialog({ src, title }: { src: string | null; title: string }) {
   if (!src) {
      return <span className="text-muted-foreground">-</span>;
   }

   return (
      <Dialog>
         <DialogTrigger asChild>
            <button className="group relative h-10 w-14 overflow-hidden rounded-md border bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
               <img
                  src={src}
                  alt={title}
                  className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-110"
               />
               <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-white" />
               </div>
            </button>
         </DialogTrigger>
         <DialogContent className="max-w-2xl">
            <DialogHeader>
               <DialogTitle>{title}</DialogTitle>
               <DialogDescription>Detail tampilan foto bukti yang diunggah</DialogDescription>
            </DialogHeader>
            <div className="mt-2 flex items-center justify-center overflow-hidden rounded-lg border bg-black/5">
               <img src={src} alt={title} className="max-h-[70vh] w-auto object-contain" />
            </div>
         </DialogContent>
      </Dialog>
   );
}

export default function Page() {
   return (
      <AppMainLayout>
         <Card>
            <CardHeader>
               <CardTitle>Log Aktivitas Driver</CardTitle>
               <CardDescription>Monitoring riwayat perjalanan, odometer, dan catatan pengisian BBM kendaraan</CardDescription>
               <CardAction>
                  <Dialog>
                     <DialogTrigger asChild>
                        <Button>
                           <Plus />
                           Buat Report Temuan
                        </Button>
                     </DialogTrigger>
                     <DialogContent>
                        <DialogHeader>
                           <DialogTitle>Tambah Log Aktivitas</DialogTitle>
                           <DialogDescription>Masukkan data aktivitas atau laporan driver dengan benar</DialogDescription>
                        </DialogHeader>
                        <form>
                           <FieldGroup>
                              <Field>
                                 <Label htmlFor="tanggal">Tanggal & Waktu</Label>
                                 <Input id="tanggal" name="tanggal" placeholder="Contoh: 24/09/2026 07:00:00" />
                              </Field>
                              <Field>
                                 <Label htmlFor="plat">Plat Kendaraan</Label>
                                 <Input id="plat" name="plat" placeholder="Contoh: KB 8134 CF" />
                              </Field>
                              <Field>
                                 <Label htmlFor="fotoBbm0">Bukti Foto Pengisian BBM (Dari 0)</Label>
                                 <Input id="fotoBbm0" name="fotoBbm0" type="file" />
                              </Field>
                              <Field>
                                 <Label htmlFor="odoAwal">Bukti Foto Odometer Awal</Label>
                                 <Input id="odoAwal" name="odoAwal" type="file" />
                              </Field>
                              <Field>
                                 <Label htmlFor="odoAkhir">Bukti Foto Odometer Akhir</Label>
                                 <Input id="odoAkhir" name="odoAkhir" type="file" />
                              </Field>
                              <Field>
                                 <Label htmlFor="notaBbm">Bukti Foto Nota Pengisian BBM</Label>
                                 <Input id="notaBbm" name="notaBbm" type="file" />
                              </Field>
                              <DialogFooter>
                                 <DialogClose asChild>
                                    <Button variant="outline">Batal</Button>
                                 </DialogClose>
                                 <Button type="submit">Simpan</Button>
                              </DialogFooter>
                           </FieldGroup>
                        </form>
                     </DialogContent>
                  </Dialog>
               </CardAction>
            </CardHeader>
            <CardContent>
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Plat Kendaraan</TableHead>
                        <TableHead>Foto BBM (Dari 0)</TableHead>
                        <TableHead>Odometer Awal</TableHead>
                        <TableHead>Odometer Akhir</TableHead>
                        <TableHead>Nota BBM</TableHead>
                        <TableHead className="text-right pr-5">Aksi</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {activityLogs.map((log) => (
                        <TableRow key={log.id}>
                           <TableCell className="font-medium whitespace-nowrap">{log.tanggal}</TableCell>
                           <TableCell className="whitespace-nowrap">{log.platKendaraan}</TableCell>
                           <TableCell>
                              <ImagePreviewDialog
                                 src={log.fotoBbm0}
                                 title={`Foto BBM (Dari 0) - ${log.platKendaraan}`}
                              />
                           </TableCell>
                           <TableCell>
                              <ImagePreviewDialog
                                 src={log.fotoOdometerAwal}
                                 title={`Odometer Awal - ${log.platKendaraan}`}
                              />
                           </TableCell>
                           <TableCell>
                              <ImagePreviewDialog
                                 src={log.fotoOdometerAkhir}
                                 title={`Odometer Akhir - ${log.platKendaraan}`}
                              />
                           </TableCell>
                           <TableCell>
                              <ImagePreviewDialog
                                 src={log.fotoNotaBbm}
                                 title={`Nota BBM - ${log.platKendaraan}`}
                              />
                           </TableCell>
                           <TableCell className="text-right">
                              <Popover>
                                 <PopoverTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                       <EllipsisVertical />
                                    </Button>
                                 </PopoverTrigger>
                                 <PopoverContent className="w-25 p-1 gap-1" align="end">
                                    <Dialog>
                                       <DialogTrigger asChild>
                                          <Button variant="outline" className="justify-start w-full" size="sm">
                                             <Trash className="w-4 h-4 mr-2" />
                                             Hapus
                                          </Button>
                                       </DialogTrigger>
                                       <DialogContent>
                                          <DialogHeader>
                                             <DialogTitle>Hapus Log Aktivitas</DialogTitle>
                                             <DialogDescription>Aksi ini tidak dapat diurungkan</DialogDescription>
                                          </DialogHeader>
                                          <div className="flex justify-end gap-2">
                                             <DialogClose asChild>
                                                <Button variant="outline">Batal</Button>
                                             </DialogClose>
                                             <Button type="submit">Hapus</Button>
                                          </div>
                                       </DialogContent>
                                    </Dialog>
                                 </PopoverContent>
                              </Popover>
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </CardContent>
         </Card>
      </AppMainLayout>
   )
}