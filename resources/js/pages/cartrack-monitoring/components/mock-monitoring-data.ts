import { createEmptyRow, type MonitoringRow } from "./monitoring-rules";

// Data dummy sampai import/backend tersedia
const TANGGAL = "2026-11-02";

const row = (values: Partial<MonitoringRow>): MonitoringRow => ({
   ...createEmptyRow(TANGGAL),
   lokasi: "Luar Kota",
   ...values,
});

export const mockMonitoringData: MonitoringRow[] = [
   row({
      noPolisi: "B 9026 VCF", driver: "WARI SANDI", odometerAwal: 99786, odometerAkhir: 99855.9, jamStart: "05:32", jamEndKunjungan: "16:40", jamEndFinal: "17:54",
      // Contoh TEMUAN BBM: sistem 18,51 L, nota 24,80 L (selisih 6,29 L)
      literSebelum: 20.5, literSetelah: 39.01, literNota: 24.8, waktuIsiBbm: "15:13", waktuDokumentasi: "15:20",
      durasiIdle: 0.5, durasiKecepatanTinggi: 2, notifKehilanganBbm: "Tidak", notifServis: "Tidak",
   }),
   row({
      noPolisi: "B 9264 TCR", driver: "TRI", odometerAwal: 59639, odometerAkhir: 59703.4, jamStart: "07:33", jamEndKunjungan: "15:50", jamEndFinal: "16:17",
      literSebelum: 15, literSetelah: 45, literNota: 30.4, waktuIsiBbm: "10:05", waktuDokumentasi: "11:10",
      durasiIdle: 2.3, durasiKecepatanTinggi: 0, notifKehilanganBbm: "Tidak",
   }),
   row({
      noPolisi: "KB 8082 CG", driver: "ANGGA HARI MUKTI", odometerAwal: 301128, odometerAkhir: 301333.9, jamStart: "07:15", jamEndKunjungan: "18:45", jamEndFinal: "19:32",
      durasiIdle: 0.8, durasiKecepatanTinggi: 12, notifServis: "Ya", kmNotifServis: 301200,
   }),
   row({
      noPolisi: "KB 8134 CF", driver: "SUPARNO", odometerAwal: 184480, odometerAkhir: 184614,
      notifServis: "Ya", kmNotifServis: 184500, konfirmasiSpv: "OK - jadwal 05/11", progresServis: "Terjadwal",
   }),
   row({ noPolisi: "KB 8145 YM", driver: "NURDIN", odometerAwal: 145571, odometerAkhir: 145669.6, notifKehilanganBbm: "Ya" }),
   row({ noPolisi: "KB 8238 YM", driver: "EKODEMUS", odometerAwal: 244256.7, odometerAkhir: 244293.1 }),
   row({ noPolisi: "KB 8239 YM", driver: "SATRIYO WIRA HARTANTO", odometerAwal: 108409, odometerAkhir: 108550.4 }),
   row({ noPolisi: "KB 8240 YM", driver: "HARTAMANSYAH", odometerAwal: 183995, odometerAkhir: 184063 }),
   row({ noPolisi: "KB 8259 CE", driver: "DERY ARIANDI", odometerAwal: 253557.6, odometerAkhir: 253579.5 }),
   row({ noPolisi: "KB 8417 YM", driver: "TINO", odometerAwal: 89616.2, odometerAkhir: 89757.4 }),
   row({ noPolisi: "KB 8472 AL", driver: "SUSILO", odometerAwal: 278666.7, odometerAkhir: 279032.4 }),
   row({ noPolisi: "KB 8514 YL", driver: "YULIANUS APEN", odometerAwal: 27334.7, odometerAkhir: 27334.7 }),
   row({ noPolisi: "KB 8520 YL", driver: "ZULFIANSYAH", odometerAwal: 285873.2, odometerAkhir: 285963.5 }),
   row({ noPolisi: "KB 8546 YL", driver: "BERNANDUS DESI SUSANTO", odometerAwal: 279501, odometerAkhir: 279631.9 }),
   row({ noPolisi: "KB 8556 YM", driver: "DRIVER DUMMY", odometerAwal: 90802.3, odometerAkhir: 91254.3 }),
   row({ noPolisi: "KB 8560 YM", driver: "SURIANTO", odometerAwal: 158317.2, odometerAkhir: 158586 }),
];
