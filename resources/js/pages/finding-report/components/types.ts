export type Attachment = {
   id: string;
   file: File;
   url: string;
};

export type Finding = {
   id: string;
   noPolisi: string;
   waktu: string;
   kendala: string;
   keterangan: string;
   driver: string;
   cartrack: Attachment[];
   nota: Attachment | null;
};

// Laporan yang sudah disimpan. Sementara url berupa blob URL lokal,
// nanti diganti path file dari server
export type FindingReport = {
   id: string;
   periode: string;
   fileName: string;
   url: string;
   createdAt: Date;
};

let lastId = 0;
export const nextId = () => String(++lastId);

export const createAttachment = (file: File): Attachment => ({
   id: nextId(),
   file,
   url: URL.createObjectURL(file),
});

export const createFinding = (): Finding => ({
   id: nextId(),
   noPolisi: "",
   waktu: "",
   kendala: "",
   keterangan: "",
   driver: "",
   cartrack: [],
   nota: null,
});

export const isFindingValid = (finding: Finding) =>
   Boolean(finding.noPolisi && finding.waktu && finding.kendala.trim() && finding.driver);

export const formatTanggal = (tanggal: string) => {
   const [year, month, day] = tanggal.split("-").map(Number);
   return new Date(year, month - 1, day).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
};
