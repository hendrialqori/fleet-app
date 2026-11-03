import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { drivers, vehicles } from "@/data/drivers";
import { ImageUpload } from "./image-upload";
import { createAttachment, type Finding } from "./types";

type FindingCardProps = {
   index: number;
   finding: Finding;
   showErrors: boolean;
   canRemove: boolean;
   onChange: (finding: Finding) => void;
   onRemove: () => void;
};

export function FindingCard({ index, finding, showErrors, canRemove, onChange, onRemove }: FindingCardProps) {
   const prefix = `finding-${finding.id}`;
   const update = (patch: Partial<Finding>) => onChange({ ...finding, ...patch });
   const invalid = (value: string) => showErrors && !value.trim();

   const handleNoPolisiChange = (noPolisi: string) => {
      // Isi driver otomatis sesuai unit, tetap bisa diganti manual
      const driver = finding.driver || drivers.find((d) => d.noPolisi === noPolisi)?.nama || "";
      update({ noPolisi, driver });
   };

   return (
      <Card>
         <CardHeader>
            <CardTitle>Temuan #{index + 1}</CardTitle>
            <CardAction>
               <Button type="button" variant="ghost" size="sm" disabled={!canRemove} onClick={onRemove}>
                  <Trash />
                  Hapus
               </Button>
            </CardAction>
         </CardHeader>
         <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-6">
            <div className="flex flex-col gap-2 md:col-span-2">
               <Label htmlFor={`${prefix}-nopol`}>No Polisi/Unit</Label>
               <Select value={finding.noPolisi} onValueChange={handleNoPolisiChange}>
                  <SelectTrigger id={`${prefix}-nopol`} className="w-full" aria-invalid={invalid(finding.noPolisi)}>
                     <SelectValue placeholder="Pilih unit" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                     <SelectGroup>
                        {vehicles.map((noPolisi) => (
                           <SelectItem key={noPolisi} value={noPolisi}>{noPolisi}</SelectItem>
                        ))}
                     </SelectGroup>
                  </SelectContent>
               </Select>
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
               <Label htmlFor={`${prefix}-driver`}>Driver</Label>
               <Select value={finding.driver} onValueChange={(driver) => update({ driver })}>
                  <SelectTrigger id={`${prefix}-driver`} className="w-full" aria-invalid={invalid(finding.driver)}>
                     <SelectValue placeholder="Pilih driver" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                     <SelectGroup>
                        {drivers.map((d) => (
                           <SelectItem key={d.nama} value={d.nama}>{d.nama}</SelectItem>
                        ))}
                     </SelectGroup>
                  </SelectContent>
               </Select>
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
               <Label htmlFor={`${prefix}-waktu`}>Waktu</Label>
               <Input
                  id={`${prefix}-waktu`}
                  type="time"
                  value={finding.waktu}
                  aria-invalid={invalid(finding.waktu)}
                  onChange={(e) => update({ waktu: e.target.value })}
               />
            </div>
            <div className="flex flex-col gap-2 md:col-span-3">
               <Label htmlFor={`${prefix}-kendala`}>Kendala</Label>
               <Textarea
                  id={`${prefix}-kendala`}
                  placeholder="Contoh: Selisih BBM 6,29 liter"
                  value={finding.kendala}
                  aria-invalid={invalid(finding.kendala)}
                  onChange={(e) => update({ kendala: e.target.value })}
               />
            </div>
            <div className="flex flex-col gap-2 md:col-span-3">
               <Label htmlFor={`${prefix}-keterangan`}>Keterangan</Label>
               <Textarea
                  id={`${prefix}-keterangan`}
                  placeholder="Contoh: Pada sistem cartrack BBM terisi 18,51 liter, namun nota BBM 24,80 liter"
                  value={finding.keterangan}
                  onChange={(e) => update({ keterangan: e.target.value })}
               />
            </div>
         </CardContent>

         <Separator />

         <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-[2fr_1fr]">
            <ImageUpload
               id={`${prefix}-cartrack`}
               label="Screenshot Cartrack"
               description="Refuel report dan notifikasi cartrack (boleh lebih dari 1)"
               multiple
               images={finding.cartrack}
               onAdd={(files) => update({ cartrack: [...finding.cartrack, ...files.map(createAttachment)] })}
               onRemove={(id) => {
                  const removed = finding.cartrack.find((image) => image.id === id);
                  if (removed) URL.revokeObjectURL(removed.url);
                  update({ cartrack: finding.cartrack.filter((image) => image.id !== id) });
               }}
            />
            <ImageUpload
               id={`${prefix}-nota`}
               label="Nota BBM"
               description="Foto nota pengisian BBM (1 gambar)"
               images={finding.nota ? [finding.nota] : []}
               onAdd={([file]) => update({ nota: createAttachment(file) })}
               onRemove={() => {
                  if (finding.nota) URL.revokeObjectURL(finding.nota.url);
                  update({ nota: null });
               }}
            />
         </CardContent>
      </Card>
   );
}
