import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AppMainLayout from "@/layouts/app/app-main-layout";
import { EllipsisVertical, Pencil, Plus, Trash, AlertTriangle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogClose } from "@radix-ui/react-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const drivers = [
	{ noPolisi: "KB 8082 CG", nama: "ANGGA HARI MUKTI" },
	{ noPolisi: "KB 8546 YL", nama: "BERNANDUS DESI SUSANTO" },
	{ noPolisi: "KB 8259 CE", nama: "DERY ARIANDI" },
	{ noPolisi: "KB 8238 YM", nama: "EKODEMUS" },
	{ noPolisi: "KB 8240 YM", nama: "HARTAMANSYAH" },
	{ noPolisi: "KB 8239 YM", nama: "SATRIYO WIRA HARTANTO" },
	{ noPolisi: "KB 8134 CF", nama: "SUPARNO" },
	{ noPolisi: "KB 8472 AL", nama: "SUSILO" },
	{ noPolisi: "KB 8520 YL", nama: "ZULFIANSYAH" },
	// { noPolisi: "KB 8514 YL", nama: "YULIANUS APEN" },
	// { noPolisi: "KB 8560 YM", nama: "SURIANTO" },
	// { noPolisi: "B 9026 VCF", nama: "WARI SANDI" },
	// { noPolisi: "B 9264 TCR", nama: "TRI" },
	// { noPolisi: "KB 8145 YM", nama: "NURDIN" },
	// { noPolisi: "KB 8417 YM", nama: "TINO" },
	// { noPolisi: "-", nama: "REZA" },
	// { noPolisi: "-", nama: "ARIE YUTA ANANDA" },
	// { noPolisi: "-", nama: "MUHAMMAD ARIF KENCESARI" },
];

// Helper function untuk membuat inisial avatar (maksimal 2 huruf)
const getInitials = (name: string) => {
	const parts = name.trim().split(" ");
	if (parts.length >= 2) {
		return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
	}
	return name.substring(0, 2).toUpperCase();
};

export default function Page() {
	return (
		<AppMainLayout>
			<Card>
				<CardHeader>
					<CardTitle>Driver</CardTitle>
					<CardDescription>Pengelolaan data dan aktivitas pengemudi</CardDescription>
					<CardAction>
						<Dialog>
							<DialogTrigger>
								<Button>
									<Plus />
									Tambah Driver
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Tambah driver</DialogTitle>
									<DialogDescription>Pastikan data yang anda masukan benar</DialogDescription>
								</DialogHeader>
								<form>
									<FieldGroup>
										<Field>
											<Label htmlFor="name">Nama</Label>
											<Input id="name" name="name" placeholder="Masukan nama" />
										</Field>
										<Field>
											<Label htmlFor="fleet">Kendaraan</Label>
											<Select>
												<SelectTrigger className="w-[180px]">
													<SelectValue placeholder="Pilih kendaraan" />
												</SelectTrigger>
												<SelectContent>
													<SelectGroup>
														{drivers.map((driver, i) => (
															<SelectItem key={i} value={driver.noPolisi}>{driver.noPolisi}</SelectItem>
														))}
													</SelectGroup>
												</SelectContent>
											</Select>
										</Field>
										<Field>
											<Label htmlFor="foto">Foto</Label>
											<Input id="foto" name="foto" placeholder="Masukan foto driver" type="file" />
										</Field>
										<Field>
											<Label htmlFor="keterangan">Keterangan</Label>
											<Textarea id="keterangan" name="keterangan" />
										</Field>
										<DialogFooter>
											<DialogClose asChild>
												<Button variant="outline">Batal</Button>
											</DialogClose>
											<Button type="submit">Simpan</Button>
										</DialogFooter>
									</FieldGroup>
								</form>
							</DialogContent>
						</Dialog>
					</CardAction>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[80px]">Avatar</TableHead>
								<TableHead>Nomor Polisi</TableHead>
								<TableHead>Nama</TableHead>
								<TableHead className="text-right pr-5">Aksi</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{drivers.map((driver, index) => (
								<TableRow key={index}>
									<TableCell>
										<Avatar className="h-9 w-9">
											<AvatarFallback className="text-xs bg-muted font-semibold">
												{getInitials(driver.nama)}
											</AvatarFallback>
										</Avatar>
									</TableCell>
									<TableCell>{driver.noPolisi}</TableCell>
									<TableCell className="font-medium">{driver.nama}</TableCell>
									<TableCell className="text-right">
										<Popover>
											<PopoverTrigger asChild>
												<Button variant="ghost" size="icon">
													<EllipsisVertical />
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-25 p-1 gap-1" align="end">
												<Button variant="outline" className="justify-start" size="sm">
													<Pencil />
													Edit
												</Button>
												<Dialog>
													<DialogTrigger asChild>
														<Button variant="outline" className="justify-start" size="sm">
															<Trash />
															Hapus
														</Button>
													</DialogTrigger>
													<DialogContent>
														<DialogHeader>
															<DialogTitle>
																Hapus driver
															</DialogTitle>
															<DialogDescription>Aksi ini tidak dapat diundur</DialogDescription>
														</DialogHeader>
														<div className="flex justify-end gap-2">
															<DialogClose asChild>
																<Button variant="outline">Batal</Button>
															</DialogClose>
															<Button type="submit">Hapus</Button>
														</div>
													</DialogContent>
												</Dialog>
											</PopoverContent>
										</Popover>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</AppMainLayout>
	)
}
