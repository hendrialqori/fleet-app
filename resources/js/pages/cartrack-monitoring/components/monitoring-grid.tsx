import { useCallback, useImperativeHandle, useRef, useState } from "react";
import {
   AllCommunityModule,
   ModuleRegistry,
   themeQuartz,
   type CellValueChangedEvent,
   type GetRowIdParams,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { columnDefs, defaultColDef } from "./column-defs";
import { createEmptyRow, type MonitoringRow } from "./monitoring-rules";
import "./monitoring-grid.css";

ModuleRegistry.registerModules([AllCommunityModule]);

const theme = themeQuartz.withParams({
   fontSize: 11,
   headerFontSize: 11,
   headerFontWeight: 700,
   spacing: 4,
   rowHeight: 28,
   borderColor: "#9ca3af",
   columnBorder: true,
   headerColumnBorder: true,
   headerRowBorder: true,
   rowBorder: true,
   wrapperBorderRadius: 0,
});

// Tinggi header tetap (lebih ringan daripada autoHeaderHeight); teks header di-wrap lewat CSS
const HEADER_HEIGHT = 48;
const GROUP_HEADER_HEIGHT = 30;

const getRowId = ({ data }: GetRowIdParams<MonitoringRow>) => data.id;

export type MonitoringGridHandle = {
   // Data mentah (tanpa kolom hitungan) untuk disimpan/dikirim nanti
   getRows: () => MonitoringRow[];
};

type MonitoringGridProps = {
   initialRows: MonitoringRow[];
   ref?: React.Ref<MonitoringGridHandle>;
};

const formatPeriode = (tanggal: string | undefined) => {
   const [year, month, day] = (tanggal ?? "").split("-").map(Number);
   const date = tanggal ? new Date(year, month - 1, day) : new Date();
   return new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(date).toUpperCase();
};

const todayString = () => {
   const now = new Date();
   return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};

export function MonitoringGrid({ initialRows, ref }: MonitoringGridProps) {
   const gridRef = useRef<AgGridReact<MonitoringRow>>(null);
   // Data dipegang oleh grid (bukan React state) agar edit sel tidak memicu render ulang React.
   // Disalin karena grid mengubah objek baris secara langsung saat diedit.
   const [rowData] = useState(() => initialRows.map((row) => ({ ...row })));
   const [periode, setPeriode] = useState(() => formatPeriode(initialRows[0]?.tanggal));

   const readRows = useCallback(() => {
      const rows: MonitoringRow[] = [];
      gridRef.current?.api.forEachNode((node) => node.data && rows.push({ ...node.data }));
      return rows;
   }, []);

   useImperativeHandle(ref, () => ({ getRows: readRows }), [readRows]);

   const handleCellValueChanged = useCallback(({ api, node, colDef }: CellValueChangedEvent<MonitoringRow>) => {
      // Perbarui kolom hitungan di baris yang diedit saja
      api.refreshCells({ rowNodes: [node] });
      if (colDef.field === "tanggal") {
         setPeriode(formatPeriode(api.getDisplayedRowAtIndex(0)?.data?.tanggal));
      }
   }, []);

   const addRow = useCallback(() => {
      const api = gridRef.current?.api;
      if (!api) return;
      const rows = readRows();
      const row = createEmptyRow(rows.at(-1)?.tanggal ?? todayString());
      const node = api.applyTransaction({ add: [row] })?.add[0];
      if (node?.rowIndex == null) return;
      api.ensureIndexVisible(node.rowIndex, "bottom");
      api.setFocusedCell(node.rowIndex, "noPolisi");
   }, [readRows]);

   return (
      <div className="flex flex-col gap-3">
         <div className="flex justify-end">
            <Button size="sm" onClick={addRow}>
               <Plus />
               Tambah Baris
            </Button>
         </div>
         <div className="monitoring-grid flex flex-col">
            <div className="bg-[#1f3864] px-3 py-2 text-center text-sm font-bold text-white">
               FORM HASIL MONITORING CARTRACK - {periode}
            </div>
            <div className="h-[calc(100svh-17rem)] min-h-[420px] w-full">
               <AgGridReact<MonitoringRow>
                  ref={gridRef}
                  theme={theme}
                  rowData={rowData}
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                  getRowId={getRowId}
                  headerHeight={HEADER_HEIGHT}
                  groupHeaderHeight={GROUP_HEADER_HEIGHT}
                  stopEditingWhenCellsLoseFocus
                  onCellValueChanged={handleCellValueChanged}
               />
            </div>
         </div>
      </div>
   );
}
