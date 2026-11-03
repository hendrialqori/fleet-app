import type { ColDef, ColGroupDef, ValueParserParams } from "ag-grid-community";
import {
   durasiOperasionalJam,
   formatNumber,
   formatTanggal,
   isValidJam,
   selisihKirimDokumentasiMenit,
   selisihLiterSistem,
   selisihSistemNota,
   statusBbm,
   statusDokBbm,
   statusIdle,
   statusJam,
   statusKehilanganBbm,
   statusServis,
   statusSpeeding,
   totalKm,
   type MonitoringRow,
   type Status,
} from "./monitoring-rules";

type Col = ColDef<MonitoringRow>;
type Field = keyof MonitoringRow & string;

// Warna header per grup, didefinisikan di monitoring-grid.css (class mon-c-*)
type GroupColor = "navy" | "blue" | "orange" | "purple" | "dark-green" | "teal" | "red" | "dark-orange" | "green";

// ===== Kolom input (editable) =====

const textCol = (field: Field, headerName: string, width = 120): Col => ({
   field,
   headerName,
   width,
   valueParser: ({ newValue }: ValueParserParams) => (String(newValue ?? "").trim() || null),
});

const numberCol = (field: Field, headerName: string, digits = 1, width = 110): Col => ({
   field,
   headerName,
   width,
   type: "rightAligned",
   cellEditor: "agNumberCellEditor",
   filter: "agNumberColumnFilter",
   valueFormatter: ({ value }) => formatNumber(value, digits),
});

// Jam format HH:mm; input "5:32" dirapikan jadi "05:32", input tidak valid diabaikan
const timeCol = (field: Field, headerName: string, width = 95): Col => ({
   field,
   headerName,
   width,
   cellClass: "mon-center",
   valueParser: ({ newValue, oldValue }: ValueParserParams) => {
      const value = String(newValue ?? "").trim();
      if (!value) return null;
      const padded = value.padStart(5, "0");
      return isValidJam(padded) ? padded : oldValue;
   },
});

const selectCol = (field: Field, headerName: string, values: string[], width = 110): Col => ({
   field,
   headerName,
   width,
   cellClass: "mon-center",
   cellEditor: "agSelectCellEditor",
   cellEditorParams: { values: ["", ...values] },
   valueParser: ({ newValue }: ValueParserParams) => newValue || null,
});

// ===== Kolom hitungan (read-only, tidak disimpan di state) =====

const computedCol = (colId: string, headerName: string, getter: (row: MonitoringRow) => number | null, digits = 1, width = 110): Col => ({
   colId,
   headerName,
   width,
   editable: false,
   // cellClass menimpa class bawaan type rightAligned, jadi tambahkan ulang
   cellClass: ["mon-computed", "ag-right-aligned-cell"],
   filter: "agNumberColumnFilter",
   valueGetter: ({ data }) => (data ? getter(data) : null),
   valueFormatter: ({ value }) => formatNumber(value, digits),
});

const statusCol = (colId: string, headerName: string, getter: (row: MonitoringRow) => Status, width = 105): Col => ({
   colId,
   headerName,
   width,
   editable: false,
   cellClass: ["mon-computed", "mon-center"],
   cellClassRules: {
      "mon-status-normal": ({ value }) => value === "NORMAL",
      "mon-status-temuan": ({ value }) => value === "TEMUAN",
   },
   valueGetter: ({ data }) => (data ? getter(data) : ""),
});

const group = (headerName: string, color: GroupColor, children: Col[], pinned?: "left"): ColGroupDef<MonitoringRow> => ({
   headerName,
   headerClass: ["mon-group", `mon-c-${color}`],
   children: children.map((child) => ({ ...child, pinned, headerClass: ["mon-sub", `mon-c-${color}`] })),
});

const YA_TIDAK = ["Ya", "Tidak"];

export const defaultColDef: Col = {
   editable: true,
   filter: true,
   sortable: true,
   resizable: true,
   suppressMovable: true,
   minWidth: 60,
};

export const columnDefs: (Col | ColGroupDef<MonitoringRow>)[] = [
   group("IDENTITAS UNIT", "navy", [
      {
         colId: "no",
         headerName: "No",
         width: 55,
         editable: false,
         filter: false,
         sortable: false,
         cellClass: "mon-center",
         valueGetter: ({ node }) => (node?.rowIndex ?? 0) + 1,
      },
      {
         field: "tanggal",
         headerName: "Tanggal",
         width: 105,
         cellClass: "mon-center",
         cellEditor: "agDateStringCellEditor",
         filter: "agDateColumnFilter",
         filterParams: {
            // Tanggal disimpan sebagai string yyyy-MM-dd
            comparator: (filterDate: Date, cellValue: string | null) => {
               if (!cellValue) return -1;
               const [year, month, day] = cellValue.split("-").map(Number);
               return new Date(year, month - 1, day).getTime() - filterDate.getTime();
            },
         },
         valueFormatter: ({ value }) => formatTanggal(value),
      },
      textCol("noPolisi", "No Polisi", 110),
      textCol("driver", "Driver", 170),
   ], "left"),

   group("1. MONITORING ODOMETER", "blue", [
      numberCol("odometerAwal", "Odometer Awal"),
      numberCol("odometerAkhir", "Odometer Akhir"),
      computedCol("totalKm", "Total KM", totalKm, 1, 95),
   ]),

   group("2. MONITORING JAM START & END", "orange", [
      selectCol("lokasi", "Lokasi Operasional", ["Luar Kota", "Dalam Kota"], 115),
      timeCol("jamStart", "Jam Start"),
      timeCol("jamEndKunjungan", "Jam End Kunjungan"),
      timeCol("jamEndFinal", "Jam End Final"),
      computedCol("durasiOperasional", "Durasi Operasional (Jam)", durasiOperasionalJam, 1, 110),
      statusCol("statusJam", "Status Jam", statusJam),
   ]),

   group("3. MONITORING IDLE", "purple", [
      numberCol("durasiIdle", "Durasi Idle (Jam)", 1, 95),
      statusCol("statusIdle", "Status Idle", statusIdle),
   ]),

   group("4. MONITORING & PENCOCOKAN PENGISIAN BBM", "dark-green", [
      numberCol("literSebelum", "Liter Sebelum Pengisian", 2),
      numberCol("literSetelah", "Liter Setelah Pengisian", 2),
      computedCol("selisihLiterSistem", "Selisih Liter Sistem", selisihLiterSistem, 2),
      numberCol("literNota", "Liter Nota/Dokumen", 2),
      computedCol("selisihSistemNota", "Selisih Sistem dan Nota BBM", selisihSistemNota, 2, 120),
      statusCol("statusBbm", "Status BBM", statusBbm),
   ]),

   group("5. MONITORING NOTIFIKASI BBM", "teal", [
      timeCol("waktuIsiBbm", "Waktu Isi BBM"),
      timeCol("waktuDokumentasi", "Waktu Dokumentasi", 110),
      computedCol("selisihKirimDokumentasi", "Selisih Kirim Dokumentasi (Menit)", selisihKirimDokumentasiMenit, 0, 120),
      statusCol("statusDokBbm", "Status Dok BBM", statusDokBbm),
   ]),

   group("6. MONITORING KECEPATAN TINGGI", "red", [
      numberCol("durasiKecepatanTinggi", "Durasi Kecepatan Tinggi (Menit)", 0, 120),
      statusCol("statusSpeeding", "Status Speeding", statusSpeeding),
   ]),

   group("7. MONITORING KEHILANGAN BBM", "dark-orange", [
      selectCol("notifKehilanganBbm", "Notifikasi Kehilangan BBM?", YA_TIDAK, 120),
      statusCol("statusKehilanganBbm", "Status Kehilangan BBM", statusKehilanganBbm, 115),
   ]),

   group("8. MONITORING JADWAL SERVIS", "green", [
      selectCol("notifServis", "Notif Servis?", YA_TIDAK, 95),
      numberCol("kmNotifServis", "KM Saat Notif Servis", 1, 110),
      statusCol("statusServis", "Status Servis", statusServis),
      textCol("konfirmasiSpv", "Konfirmasi SPV Fleet", 150),
      textCol("progresServis", "Progres Status Servis", 150),
   ]),
];
