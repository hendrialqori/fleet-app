import { endOfMonth, startOfMonth } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { id as localeId } from "react-day-picker/locale";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type { DateRange };

type DateRangePickerProps = {
   value: DateRange | undefined;
   onChange: (range: DateRange | undefined) => void;
   placeholder?: string;
   numberOfMonths?: number;
   clearable?: boolean;
   className?: string;
};

const dateFormat = new Intl.DateTimeFormat("id-ID", { dateStyle: "long" });

// Rentang default: tanggal 1 sampai tanggal terakhir bulan berjalan
export const getCurrentMonthRange = (date = new Date()): DateRange => ({
   from: startOfMonth(date),
   to: endOfMonth(date),
});

export function DateRangePicker({
   value,
   onChange,
   placeholder = "Pilih tanggal",
   numberOfMonths = 2,
   clearable = true,
   className,
}: DateRangePickerProps) {
   const showClear = clearable && value?.from;

   return (
      <div className={cn("relative w-72", className)}>
         <Popover>
            <PopoverTrigger asChild>
               <Button
                  variant="outline"
                  className={cn("w-full justify-start px-2.5 font-normal", showClear && "pr-9")}
               >
                  <CalendarIcon data-icon="inline-start" />
                  {value?.from ? (
                     <span className="truncate">
                        {value.to ? dateFormat.formatRange(value.from, value.to) : dateFormat.format(value.from)}
                     </span>
                  ) : (
                     <span className="text-muted-foreground">{placeholder}</span>
                  )}
               </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
               <Calendar
                  mode="range"
                  locale={localeId}
                  defaultMonth={value?.from}
                  selected={value}
                  onSelect={onChange}
                  numberOfMonths={numberOfMonths}
                  showOutsideDays={false}
               />
            </PopoverContent>
         </Popover>
         {showClear && (
            <button
               type="button"
               onClick={() => onChange(undefined)}
               className="absolute inset-y-0 right-0 flex w-9 items-center justify-center rounded-r-md text-muted-foreground outline-none hover:text-foreground focus-visible:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
               <X className="size-4" />
               <span className="sr-only">Hapus tanggal</span>
            </button>
         )}
      </div>
   );
}
