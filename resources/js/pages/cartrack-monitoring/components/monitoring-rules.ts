// Aturan monitoring cartrack: tipe data, threshold, rumus kolom hitungan, dan status.
// File ini sengaja tanpa React agar bisa dipakai ulang (mis. validasi atau export).

export type Lokasi = "Luar Kota" | "Dalam Kota";
export type YaTidak = "Ya" | "Tidak";
export type Status = "NORMAL" | "TEMUAN" | "";

// Data mentah per baris (tanpa kolom hitungan)
export type MonitoringRow = {
   id: string;
   tanggal: string; // yyyy-MM-dd
   noPolisi: string;
   driver: string;
   odometerAwal: number | null;
   odometerAkhir: number | null;
   lokasi: Lokasi | null;
   jamStart: string | null; // HH:mm
   jamEndKunjungan: string | null;
   jamEndFinal: string | null;
   durasiIdle: number | null; // jam
   literSebelum: number | null;
   literSetelah: number | null;
   literNota: number | null;
   waktuIsiBbm: string | null; // HH:mm
   waktuDokumentasi: string | null; // HH:mm
   durasiKecepatanTinggi: number | null; // menit
   notifKehilanganBbm: YaTidak | null;
   notifServis: YaTidak | null;
   kmNotifServis: number | null;
   konfirmasiSpv: string | null;
   progresServis: string | null;
};

// TODO: semua nilai threshold di bawah masih placeholder, tentukan nilai final bersama tim Fleet
export const monitoringRules = {
   // Batas maksimal durasi operasional (jam) per lokasi
   maxDurasiOperasionalJam: {
      "Luar Kota": 14, // TODO: placeholder
      "Dalam Kota": 10, // TODO: placeholder
   } satisfies Record<Lokasi, number>,
   // Batas maksimal durasi idle (jam)
   maxDurasiIdleJam: 1, // TODO: placeholder
   // Toleransi selisih liter sistem vs nota (absolut, liter)
   toleransiSelisihBbmLiter: 1, // TODO: placeholder
   // Batas maksimal keterlambatan kirim dokumentasi BBM (menit)
   maxSelisihKirimDokumentasiMenit: 30, // TODO: placeholder
   // Batas maksimal durasi kecepatan tinggi (menit)
   maxDurasiKecepatanTinggiMenit: 5, // TODO: placeholder
};

const isNumber = (value: number | null | undefined): value is number => typeof value === "number" && !Number.isNaN(value);

export const isValidJam = (value: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(value);

const toMinutes = (jam: string | null) => {
   if (!jam || !isValidJam(jam)) return null;
   const [hours, minutes] = jam.split(":").map(Number);
   return hours * 60 + minutes;
};

// Selisih menit antara dua jam di hari yang sama; jika akhir < awal dianggap melewati tengah malam
const diffMinutes = (start: string | null, end: string | null) => {
   const from = toMinutes(start);
   const to = toMinutes(end);
   if (from === null || to === null) return null;
   return to >= from ? to - from : to + 24 * 60 - from;
};

const round = (value: number, digits: number) => Math.round(value * 10 ** digits) / 10 ** digits;

// ===== Rumus kolom hitungan =====

export const totalKm = (row: MonitoringRow) =>
   isNumber(row.odometerAwal) && isNumber(row.odometerAkhir) ? round(row.odometerAkhir - row.odometerAwal, 1) : null;

export const durasiOperasionalJam = (row: MonitoringRow) => {
   const minutes = diffMinutes(row.jamStart, row.jamEndFinal);
   return minutes === null ? null : round(minutes / 60, 1);
};

export const selisihLiterSistem = (row: MonitoringRow) =>
   isNumber(row.literSebelum) && isNumber(row.literSetelah) ? round(row.literSetelah - row.literSebelum, 2) : null;

export const selisihSistemNota = (row: MonitoringRow) => {
   const sistem = selisihLiterSistem(row);
   return sistem !== null && isNumber(row.literNota) ? round(row.literNota - sistem, 2) : null;
};

export const selisihKirimDokumentasiMenit = (row: MonitoringRow) => diffMinutes(row.waktuIsiBbm, row.waktuDokumentasi);

// ===== Status (kosong jika data belum lengkap) =====

const status = (isTemuan: boolean): Status => (isTemuan ? "TEMUAN" : "NORMAL");

export const statusJam = (row: MonitoringRow): Status => {
   const durasi = durasiOperasionalJam(row);
   if (durasi === null || !row.lokasi) return "";
   return status(durasi > monitoringRules.maxDurasiOperasionalJam[row.lokasi]);
};

export const statusIdle = (row: MonitoringRow): Status =>
   isNumber(row.durasiIdle) ? status(row.durasiIdle > monitoringRules.maxDurasiIdleJam) : "";

export const statusBbm = (row: MonitoringRow): Status => {
   const selisih = selisihSistemNota(row);
   return selisih === null ? "" : status(Math.abs(selisih) > monitoringRules.toleransiSelisihBbmLiter);
};

export const statusDokBbm = (row: MonitoringRow): Status => {
   const selisih = selisihKirimDokumentasiMenit(row);
   return selisih === null ? "" : status(selisih > monitoringRules.maxSelisihKirimDokumentasiMenit);
};

export const statusSpeeding = (row: MonitoringRow): Status =>
   isNumber(row.durasiKecepatanTinggi)
      ? status(row.durasiKecepatanTinggi > monitoringRules.maxDurasiKecepatanTinggiMenit)
      : "";

export const statusKehilanganBbm = (row: MonitoringRow): Status =>
   row.notifKehilanganBbm ? status(row.notifKehilanganBbm === "Ya") : "";

export const statusServis = (row: MonitoringRow): Status =>
   row.notifServis ? status(row.notifServis === "Ya" && !row.konfirmasiSpv?.trim()) : "";

// ===== Format tampilan gaya Indonesia (99.786,0) =====

const formatters = new Map<number, Intl.NumberFormat>();

export const formatNumber = (value: number | null | undefined, digits = 1) => {
   if (!isNumber(value)) return "";
   if (!formatters.has(digits)) {
      formatters.set(digits, new Intl.NumberFormat("id-ID", { minimumFractionDigits: digits, maximumFractionDigits: digits }));
   }
   return formatters.get(digits)!.format(value);
};

export const formatTanggal = (tanggal: string | null) => {
   if (!tanggal) return "";
   const [year, month, day] = tanggal.split("-");
   return `${day}/${month}/${year}`;
};

let lastId = 0;

export const createEmptyRow = (tanggal: string): MonitoringRow => ({
   id: `row-${Date.now()}-${++lastId}`,
   tanggal,
   noPolisi: "",
   driver: "",
   odometerAwal: null,
   odometerAkhir: null,
   lokasi: null,
   jamStart: null,
   jamEndKunjungan: null,
   jamEndFinal: null,
   durasiIdle: null,
   literSebelum: null,
   literSetelah: null,
   literNota: null,
   waktuIsiBbm: null,
   waktuDokumentasi: null,
   durasiKecepatanTinggi: null,
   notifKehilanganBbm: null,
   notifServis: null,
   kmNotifServis: null,
   konfirmasiSpv: null,
   progresServis: null,
});
