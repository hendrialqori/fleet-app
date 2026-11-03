import { useState } from "react";
import { Check, Copy, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export type Driver = {
	noPolisi: string;
	nama: string;
	username: string;
	password: string;
};

type DriverDetailSheetProps = {
	driver: Driver | null;
	onOpenChange: (open: boolean) => void;
};

// navigator.clipboard hanya tersedia di https/localhost, jadi sediakan fallback untuk akses via http
const copyToClipboard = async (text: string) => {
	if (navigator.clipboard && window.isSecureContext) {
		await navigator.clipboard.writeText(text);
		return;
	}
	const textarea = document.createElement("textarea");
	textarea.value = text;
	textarea.style.cssText = "position:fixed;opacity:0;";
	document.body.appendChild(textarea);
	textarea.select();
	document.execCommand("copy");
	textarea.remove();
};

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div className="flex flex-col gap-1">
			<span className="text-xs text-muted-foreground">{label}</span>
			<div className="text-sm font-medium">{children}</div>
		</div>
	);
}

function PasswordField({ password }: { password: string }) {
	const [visible, setVisible] = useState(false);
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		await copyToClipboard(password);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="flex items-center gap-1 rounded-md border bg-muted/40 py-1 pr-1 pl-3">
			<span className="flex-1 truncate font-mono">{visible ? password : "•".repeat(password.length)}</span>
			<Button
				variant="ghost"
				size="icon-sm"
				onClick={() => setVisible((value) => !value)}
				aria-label={visible ? "Sembunyikan password" : "Tampilkan password"}
				aria-pressed={visible}
			>
				{visible ? <EyeOff /> : <Eye />}
			</Button>
			<Button variant="ghost" size="icon-sm" onClick={handleCopy} aria-label="Salin password">
				{copied ? <Check className="text-green-600" /> : <Copy />}
			</Button>
		</div>
	);
}

export function DriverDetailSheet({ driver, onOpenChange }: DriverDetailSheetProps) {
	return (
		<Sheet open={driver !== null} onOpenChange={onOpenChange}>
			<SheetContent side="right" className="w-full sm:max-w-md">
				<SheetHeader className="border-b">
					<SheetTitle>Detail Driver</SheetTitle>
					<SheetDescription>Informasi driver dan akun login aplikasi</SheetDescription>
				</SheetHeader>
				{driver && (
					<div className="flex flex-col gap-4 px-4">
						<DetailRow label="Nama">{driver.nama}</DetailRow>
						<DetailRow label="No Polisi">{driver.noPolisi}</DetailRow>
						<DetailRow label="Username">{driver.username}</DetailRow>
						<DetailRow label="Password">
							{/* key agar password kembali tersembunyi saat berganti driver */}
							<PasswordField key={driver.username} password={driver.password} />
						</DetailRow>
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
}
