import { useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AppMainLayout from "@/layouts/app/app-main-layout";
import { mockMonitoringData } from "./components/mock-monitoring-data";
import { MonitoringGrid, type MonitoringGridHandle } from "./components/monitoring-grid";

export default function MonitoringPage() {
   // Dipakai nanti untuk simpan/kirim data: gridRef.current?.getRows()
   const gridRef = useRef<MonitoringGridHandle>(null);

   return (
      <AppMainLayout>
         <Card className="min-w-0">
            <CardHeader>
               <CardTitle>Cartrack Monitoring</CardTitle>
               <CardDescription>Form hasil monitoring cartrack harian per unit. Kolom berwarna oranye dihitung otomatis.</CardDescription>
            </CardHeader>
            <CardContent>
               <MonitoringGrid ref={gridRef} initialRows={mockMonitoringData} />
            </CardContent>
         </Card>
      </AppMainLayout>
   );
}
