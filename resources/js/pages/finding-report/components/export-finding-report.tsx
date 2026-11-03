import { Document, Image, Page, StyleSheet, Text, View, pdf } from "@react-pdf/renderer";
import type { Finding } from "./types";

type PdfImage = { src: string; width: number; height: number };

type ReportFinding = Omit<Finding, "cartrack" | "nota"> & {
   cartrack: PdfImage[];
   nota: PdfImage | null;
};

const BLUE = "#c5d0f5";
const NAVY = "#1f3864";
const BORDER = { borderWidth: 0.75, borderColor: "#000" };

// Lebar area konten A4 (595pt) dikurangi margin, lalu dibagi 2 kolom lampiran
const ATTACHMENT_WIDTH = (595 - 2 * 42) / 2 - 16;

const styles = StyleSheet.create({
   page: { paddingVertical: 42, paddingHorizontal: 42, fontFamily: "Times-Roman", fontSize: 11 },
   kop: { flexDirection: "row", ...BORDER },
   kopLogo: { width: 80, alignItems: "center", justifyContent: "center", padding: 6, borderRightWidth: 0.75, borderColor: "#000" },
   kopText: { flex: 1, justifyContent: "center", paddingHorizontal: 10 },
   company: { fontFamily: "Times-Bold", fontSize: 15 },
   dept: { fontFamily: "Times-Italic", fontSize: 10 },
   title: { marginVertical: 20, padding: 9, backgroundColor: BLUE, textAlign: "center", fontFamily: "Times-Bold", fontSize: 15 },
   section: { flexDirection: "row", marginTop: 18, marginBottom: 10, color: NAVY, fontFamily: "Times-Bold", fontSize: 12 },
   roman: { width: 30 },
   row: { flexDirection: "row" },
   cell: { ...BORDER, marginLeft: -0.75, marginTop: -0.75, padding: 5, justifyContent: "center" },
   th: { backgroundColor: BLUE, textAlign: "center" },
   center: { textAlign: "center" },
   attachment: { flexDirection: "row", marginBottom: 12 },
   attachmentCell: { flex: 1, ...BORDER, marginLeft: -0.75, padding: 8, justifyContent: "space-between" },
   images: { alignItems: "center", gap: 6 },
   caption: { marginTop: 10, textAlign: "center", fontSize: 10 },
   captionTitle: { fontFamily: "Times-Bold" },
   empty: { paddingVertical: 40, textAlign: "center", color: "#777", fontFamily: "Times-Italic" },
});

const columns = [
   { label: "No", width: "6%" },
   { label: "No Polisi/Unit", width: "16%" },
   { label: "Waktu", width: "10%" },
   { label: "Kendala", width: "19%" },
   { label: "Keterangan", width: "33%" },
   { label: "Driver", width: "16%" },
];

const formatPeriode = (tanggal: string) => {
   const [year, month, day] = tanggal.split("-").map(Number);
   return new Date(year, month - 1, day)
      .toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
      .toUpperCase();
};

// Normalisasi gambar ke JPEG (react-pdf hanya mendukung PNG/JPG) sekaligus ambil ukurannya
const loadImage = (url: string, maxHeight: number) =>
   new Promise<PdfImage>((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
         // Batasi resolusi agar ukuran file PDF tetap kecil
         const resize = Math.min(1600 / Math.max(img.naturalWidth, img.naturalHeight), 1);
         const canvas = document.createElement("canvas");
         canvas.width = Math.round(img.naturalWidth * resize);
         canvas.height = Math.round(img.naturalHeight * resize);
         const context = canvas.getContext("2d")!;
         context.fillStyle = "#fff";
         context.fillRect(0, 0, canvas.width, canvas.height);
         context.drawImage(img, 0, 0, canvas.width, canvas.height);

         const scale = Math.min(ATTACHMENT_WIDTH / img.naturalWidth, maxHeight / img.naturalHeight, 1);
         resolve({
            src: canvas.toDataURL("image/jpeg", 0.9),
            width: img.naturalWidth * scale,
            height: img.naturalHeight * scale,
         });
      };
      img.onerror = reject;
      img.src = url;
   });

function AttachmentCell({ images, emptyText, caption }: { images: PdfImage[]; emptyText: string; caption: string }) {
   return (
      <View style={styles.attachmentCell}>
         <View style={styles.images}>
            {images.length
               ? images.map((image, i) => <Image key={i} src={image.src} style={{ width: image.width, height: image.height }} />)
               : <Text style={styles.empty}>{emptyText}</Text>}
         </View>
         <View style={styles.caption}>
            {caption.split("\n").map((line, i) => (
               <Text key={i} style={i === 0 ? styles.captionTitle : undefined}>{line}</Text>
            ))}
         </View>
      </View>
   );
}

function ReportDocument({ periode, findings, logo }: { periode: string; findings: ReportFinding[]; logo: string }) {
   const title = `Form Temuan Monitoring Cartrack - ${formatPeriode(periode)}`;

   return (
      <Document title={title} author="CV. Putra Borneo Satu">
         <Page size="A4" style={styles.page}>
            <View style={styles.kop}>
               <View style={styles.kopLogo}>
                  <Image src={logo} style={{ width: 48, height: 48, objectFit: "contain" }} />
               </View>
               <View style={styles.kopText}>
                  <Text style={styles.company}>CV. PUTRA BORNEO SATU</Text>
                  <Text style={styles.dept}>Departemen Fleet</Text>
               </View>
            </View>

            <Text style={styles.title}>FORM TEMUAN MONITORING CARTRACK</Text>

            <View style={styles.section}>
               <Text style={styles.roman}>I.</Text>
               <View>
                  <Text>DAFTAR TEMUAN (KENDALA & KETERANGAN)</Text>
                  <Text>PERIODE TANGGAL {formatPeriode(periode)}</Text>
               </View>
            </View>

            <View style={{ paddingLeft: 0.75, paddingTop: 0.75 }}>
               <View style={styles.row} fixed>
                  {columns.map((column) => (
                     <Text key={column.label} style={[styles.cell, styles.th, { width: column.width }]}>{column.label}</Text>
                  ))}
               </View>
               {findings.map((finding, index) => {
                  const values = [String(index + 1), finding.noPolisi, finding.waktu, finding.kendala, finding.keterangan || "-", finding.driver];
                  return (
                     <View key={finding.id} style={styles.row} wrap={false}>
                        {values.map((value, i) => (
                           <View key={i} style={[styles.cell, { width: columns[i].width }]}>
                              <Text style={[0, 2, 5].includes(i) ? styles.center : undefined}>{value}</Text>
                           </View>
                        ))}
                     </View>
                  );
               })}
            </View>

            {findings.map((finding, index) => (
               // Judul bagian II ikut blok lampiran pertama agar tidak tertinggal sendirian di akhir halaman
               <View key={finding.id} wrap={false}>
                  {index === 0 && (
                     <View style={styles.section}>
                        <Text style={styles.roman}>II.</Text>
                        <Text>LAMPIRAN DOKUMENTASI</Text>
                     </View>
                  )}
                  <View style={[styles.attachment, { paddingLeft: 0.75 }]}>
                     <AttachmentCell
                        images={finding.cartrack}
                        emptyText="Tidak ada screenshot"
                        caption={`Dokumentasi ${index + 1}\nKeterangan: Refuel report dan notifikasi cartrack (${finding.noPolisi})`}
                     />
                     <AttachmentCell
                        images={finding.nota ? [finding.nota] : []}
                        emptyText="Tidak ada nota"
                        caption={`Dokumentasi ${index + 1}\nKeterangan: Nota BBM (${finding.noPolisi})`}
                     />
                  </View>
               </View>
            ))}
         </Page>
      </Document>
   );
}

export const getReportFileName = (periode: string) => `form-temuan-monitoring-cartrack-${periode}.pdf`;

export async function generateFindingReport(periode: string, findings: Finding[]) {
   const [logo, reportFindings] = await Promise.all([
      loadImage("/pb1.png", 48).then((image) => image.src),
      Promise.all(
         findings.map(async (finding) => ({
            ...finding,
            cartrack: await Promise.all(finding.cartrack.map((image) => loadImage(image.url, 220))),
            nota: finding.nota ? await loadImage(finding.nota.url, 360) : null,
         }))
      ),
   ]);

   return pdf(<ReportDocument periode={periode} findings={reportFindings} logo={logo} />).toBlob();
}

export async function exportFindingReport(periode: string, findings: Finding[]) {
   const blob = await generateFindingReport(periode, findings);
   const url = URL.createObjectURL(blob);
   const link = document.createElement("a");
   link.href = url;
   link.download = getReportFileName(periode);
   link.click();
   setTimeout(() => URL.revokeObjectURL(url), 1000);
}
