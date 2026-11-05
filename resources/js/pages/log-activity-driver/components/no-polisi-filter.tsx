import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuCheckboxItem,
   DropdownMenuContent,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// "all" = semua no polisi, selain itu daftar no polisi yang dicentang
export type NoPolisiSelection = "all" | string[];

type NoPolisiFilterProps = {
   options: string[];
   value: NoPolisiSelection;
   onChange: (value: NoPolisiSelection) => void;
};

export function NoPolisiFilter({ options, value, onChange }: NoPolisiFilterProps) {
   const isAll = value === "all";

   // Memilih no polisi saat "Semua" tercentang akan melepas "Semua";
   // jika semua no polisi dilepas, kembali ke "Semua"
   const toggle = (noPolisi: string) => {
      const selected = isAll ? [] : value;
      const next = selected.includes(noPolisi) ? selected.filter((item) => item !== noPolisi) : [...selected, noPolisi];
      onChange(next.length ? next : "all");
   };

   const label = isAll ? "Semua No Polisi" : value.length === 1 ? value[0] : `${value.length} No Polisi`;

   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-44 justify-between px-2.5 font-normal">
               <span className="truncate">{label}</span>
               <ChevronDownIcon className="text-muted-foreground" />
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="start" className="max-h-72 w-44 overflow-y-auto">
            {/* preventDefault agar menu tetap terbuka saat mencentang beberapa item */}
            <DropdownMenuCheckboxItem
               checked={isAll}
               onCheckedChange={() => onChange("all")}
               onSelect={(event) => event.preventDefault()}
            >
               Semua No Polisi
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            {options.map((noPolisi) => (
               <DropdownMenuCheckboxItem
                  key={noPolisi}
                  checked={!isAll && value.includes(noPolisi)}
                  onCheckedChange={() => toggle(noPolisi)}
                  onSelect={(event) => event.preventDefault()}
               >
                  {noPolisi}
               </DropdownMenuCheckboxItem>
            ))}
         </DropdownMenuContent>
      </DropdownMenu>
   );
}
