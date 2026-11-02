// Data sementara (dummy) sampai tersedia endpoint backend
export const drivers = [
   { noPolisi: "KB 8082 CG", nama: "ANGGA HARI MUKTI" },
   { noPolisi: "KB 8546 YL", nama: "BERNANDUS DESI SUSANTO" },
   { noPolisi: "KB 8259 CE", nama: "DERY ARIANDI" },
   { noPolisi: "KB 8238 YM", nama: "EKODEMUS" },
   { noPolisi: "KB 8240 YM", nama: "HARTAMANSYAH" },
   { noPolisi: "KB 8239 YM", nama: "SATRIYO WIRA HARTANTO" },
   { noPolisi: "KB 8134 CF", nama: "SUPARNO" },
   { noPolisi: "KB 8472 AL", nama: "SUSILO" },
   { noPolisi: "KB 8520 YL", nama: "ZULFIANSYAH" },
   { noPolisi: "KB 8514 YL", nama: "YULIANUS APEN" },
   { noPolisi: "KB 8560 YM", nama: "SURIANTO" },
   { noPolisi: "B 9026 VCF", nama: "WARI SANDI" },
   { noPolisi: "B 9264 TCR", nama: "TRI" },
   { noPolisi: "KB 8145 YM", nama: "NURDIN" },
   { noPolisi: "KB 8417 YM", nama: "TINO" },
   { noPolisi: "-", nama: "REZA" },
   { noPolisi: "-", nama: "ARIE YUTA ANANDA" },
   { noPolisi: "-", nama: "MUHAMMAD ARIF KENCESARI" },
];

export const vehicles = drivers.map((d) => d.noPolisi).filter((noPolisi) => noPolisi !== "-");
