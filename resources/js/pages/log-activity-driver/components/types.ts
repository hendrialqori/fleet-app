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

let lastId = 0;
const nextId = () => String(++lastId);

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
