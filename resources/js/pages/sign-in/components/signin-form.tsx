import { useState } from "react"
import { cn } from "cn"
import { ShieldCheck, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PasswordInput } from "./password-input"

type Role = "admin" | "driver"

const roles = {
  admin: {
    label: "Admin",
    icon: <ShieldCheck />,
    title: "Masuk sebagai Admin",
    description: "Kelola armada dan monitoring cartrack",
  },
  driver: {
    label: "Driver",
    icon: <Truck />,
    title: "Masuk sebagai Driver",
    description: "Laporkan aktivitas dan pengisian BBM",
  },
} satisfies Record<Role, unknown>

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [role, setRole] = useState<Role>("admin")

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Tabs
            value={role}
            onValueChange={(value) => setRole(value as Role)}
            className="gap-6 p-6 md:p-8"
          >
            <TabsList className="w-full">
              {(Object.keys(roles) as Role[]).map((key) => (
                <TabsTrigger key={key} value={key}>
                  {roles[key].icon}
                  {roles[key].label}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold">{roles[role].title}</h1>
              <p className="text-balance text-muted-foreground">
                {roles[role].description}
              </p>
            </div>

            <TabsContent value="admin">
              <form>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="admin-username">Username</FieldLabel>
                    <Input
                      id="admin-username"
                      name="username"
                      placeholder="Masukkan username"
                      autoComplete="username"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="admin-password">Password</FieldLabel>
                    <PasswordInput
                      id="admin-password"
                      name="password"
                      placeholder="Masukkan password"
                      autoComplete="current-password"
                      required
                    />
                  </Field>
                  <Field>
                    <Button type="submit">Masuk</Button>
                  </Field>
                </FieldGroup>
              </form>
            </TabsContent>

            <TabsContent value="driver">
              <form>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="driver-username">Username</FieldLabel>
                    <Input
                      id="driver-username"
                      name="username"
                      placeholder="Masukkan username"
                      autoComplete="username"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="driver-password">Password</FieldLabel>
                    <PasswordInput
                      id="driver-password"
                      name="password"
                      placeholder="Masukkan password"
                      autoComplete="current-password"
                      required
                    />
                  </Field>
                  <Field>
                    <Button type="submit">Masuk</Button>
                  </Field>
                  <FieldDescription className="text-center">
                    Lupa password? Hubungi admin fleet.
                  </FieldDescription>
                </FieldGroup>
              </form>
            </TabsContent>
          </Tabs>
          <div className="hidden flex-col items-center justify-center gap-4 bg-muted p-10 md:flex">
            <img
              src="/pb1.png"
              alt="Logo CV. Putra Borneo Satu"
              className="w-48 object-contain"
            />
            <div className="text-center">
              <p className="font-semibold">CV. PUTRA BORNEO SATU</p>
              <p className="text-sm text-muted-foreground">Departemen Fleet</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
