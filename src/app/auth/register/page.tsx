"use client"

import { useState } from "react"
import { useNavigate as useRouter } from "react-router-dom"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import {ApiAuthRegister} from "@/service/api";
import { useTranslation } from "react-i18next"

export default function Register() {
  const { t } = useTranslation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const router = useRouter();
  const { toast } = useToast()

  const handleCredentialSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
        const resp = await ApiAuthRegister({ email, password, name })
        toast({
            title: t('register-page.Register successfully'),
        });

    } catch (error) {
        toast({
            title: t('register-page.Register fail'),
            description:  String(error),
            variant: "destructive",
        })
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{t('register-page.Register')}</CardTitle>
          <CardDescription>{t('register-page.Create a new account')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCredentialSignup}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">{t('register-page.Name')}</Label>
                <Input
                    id="name"
                    type="text"
                    placeholder={t('register-page.Name')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">{t('register-page.Email')}</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder={t('register-page.Email')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">{t('register-page.Password')}</Label>
                <Input
                    id="password"
                    type="password"
                    placeholder={t('register-page.Password')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
              </div>
            </div>
            {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <Button type="submit" className="w-full mt-4">
              {t('register-page.Register')}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link to="/login" className="text-sm text-blue-500 hover:text-blue-700">
            {t('register-page.Already have an account? Login')}
          </Link>
        </CardFooter>
      </Card>
      </main>
  )
}

