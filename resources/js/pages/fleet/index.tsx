import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AppMainLayout from "@/layouts/app/app-main-layout";
import { EllipsisVertical, Pencil, Plus, Trash } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const fleets = [
   { noPolisi: "KB 8082 CG", merek: "Mitsubishi", model: "FE 71 N 4X2 MT", warna: "Kuning", keterangan: "Kondisi prima" },
   { noPolisi: "KB 8546 YL", merek: "Toyota", model: "Dyna 110 ET", warna: "Merah", keterangan: "Servis rutin bulan depan" },
   { noPolisi: "KB 8259 CE", merek: "Isuzu", model: "NMR 71", warna: "Putih", keterangan: "Operasional wilayah kota" },
   { noPolisi: "KB 8238 YM", merek: "Mitsubishi", model: "FE 74 HD", warna: "Kuning", keterangan: "Muatan berat" },
   { noPolisi: "KB 8240 YM", merek: "Hino", model: "135 HD", warna: "Hijau", keterangan: "Standby pool" },
];

export default function Page() {
   return (
      <AppMainLayout>
         <Card>
            <CardHeader>
               <CardTitle>Fleet</CardTitle>
               <CardDescription>Monitoring dan pengelolaan armada kendaraan</CardDescription>
               <CardAction>
                  <Dialog>
                     <DialogTrigger asChild>
                        <Button>
                           <Plus />
                           Tambah Fleet
                        </Button>
                     </DialogTrigger>
                     <DialogContent>
                        <DialogHeader>
                           <DialogTitle>Tambah fleet</DialogTitle>
                           <DialogDescription>Pastikan data yang anda masukan benar</DialogDescription>
                        </DialogHeader>
                        <form>
                           <FieldGroup>
                              <Field>
                                 <Label htmlFor="foto">Foto</Label>
                                 <Input id="foto" name="foto" placeholder="Masukan foto kendaraan" type="file" />
                              </Field>
                              <Field>
                                 <Label htmlFor="nopol">Nomor Polisi</Label>
                                 <Input id="nopol" name="nopol" />
                              </Field>
                              <Field>
                                 <Label htmlFor="merek">Merek</Label>
                                 <Input id="merek" name="merek" placeholder="Contoh: Mitsubishi" />
                              </Field>
                              <Field>
                                 <Label htmlFor="model">Model</Label>
                                 <Input id="model" name="model" placeholder="Contoh: FE 71 N 4X2 MT" />
                              </Field>
                              <Field>
                                 <Label htmlFor="warna">Warna</Label>
                                 <Input id="warna" name="warna" />
                              </Field>
                              <Field>
                                 <Label htmlFor="keterangan">Keterangan</Label>
                                 <Textarea id="keterangan" name="keterangan" />
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
                        <TableHead>Nomor Polisi</TableHead>
                        <TableHead>Merek & Model</TableHead>
                        <TableHead>Warna</TableHead>
                        <TableHead>Keterangan</TableHead>
                        <TableHead className="text-right pr-5">Aksi</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {fleets.map((fleet, index) => (
                        <TableRow key={index}>
                           <TableCell className="font-medium">{fleet.noPolisi}</TableCell>
                           <TableCell>{fleet.merek} {fleet.model}</TableCell>
                           <TableCell>{fleet.warna}</TableCell>
                           <TableCell className="text-muted-foreground">{fleet.keterangan}</TableCell>
                           <TableCell className="text-right">
                              <Popover>
                                 <PopoverTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                       <EllipsisVertical />
                                    </Button>
                                 </PopoverTrigger>
                                 <PopoverContent className="w-25 p-1 gap-1" align="end">
                                    <Button variant="outline" className="justify-start w-full" size="sm">
                                       <Pencil />
                                       Edit
                                    </Button>
                                    <Dialog>
                                       <DialogTrigger asChild>
                                          <Button variant="outline" className="justify-start w-full" size="sm">
                                             <Trash />
                                             Hapus
                                          </Button>
                                       </DialogTrigger>
                                       <DialogContent>
                                          <DialogHeader>
                                             <DialogTitle>
                                                Hapus fleet
                                             </DialogTitle>
                                             <DialogDescription>Aksi ini tidak dapat diundur</DialogDescription>
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