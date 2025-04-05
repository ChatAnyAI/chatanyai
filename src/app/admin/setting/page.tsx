import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "react-i18next"

export default function SettingsPage() {
    const { t } = useTranslation()
    
    return (
        <div className="container max-w-3xl py-6 space-y-8 mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>{t("admin-setting-page.Navigation bar")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label htmlFor="header-logo">{t("admin-setting-page.Header logo")}</Label>
                        <Input id="header-logo" type="file" accept="image/*" />
                        <p className="text-sm text-muted-foreground">
                            {t("admin-setting-page.Maximum file size is 1MB. Pages are optimized for a 28px tall header logo")}
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t("admin-setting-page.Favicon")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label htmlFor="favicon">{t("admin-setting-page.Favicon")}</Label>
                        <Input id="favicon" type="file" accept=".ico,.png" />
                        <p className="text-sm text-muted-foreground">
                            {t("admin-setting-page.Maximum file size is 1MB. Image size must be 32x32px. Allowed image formats are '.png' and '.ico'.")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {t("admin-setting-page.Images with incorrect dimensions are not resized automatically, and may result in unexpected behavior.")}
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t("admin-setting-page.System header and footer")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="header-message">{t("admin-setting-page.Header message")}</Label>
                        <Input id="header-message" placeholder={t("admin-setting-page.State your message to activate")} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="footer-message">{t("admin-setting-page.Footer message")}</Label>
                        <Input id="footer-message" placeholder={t("admin-setting-page.State your message to activate")} />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox id="emails" />
                        <Label htmlFor="emails">{t("admin-setting-page.Enable header and footer in emails")}</Label>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        {t("admin-setting-page.Add header and footer to emails. Please note that color settings will only be applied within the application interface")}
                    </p>

                    <Button variant="link" className="p-0 h-auto text-primary">
                        {t("admin-setting-page.Customize colors")}
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t("admin-setting-page.Sign in/Sign up pages")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">{t("admin-setting-page.Title")}</Label>
                        <Input id="title" defaultValue="Hello" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">{t("admin-setting-page.Description")}</Label>
                        <Textarea id="description" defaultValue="Hello" rows={4} />
                        <p className="text-sm text-muted-foreground">{t("admin-setting-page.Content parsed with GitLab Flavored Markdown")}</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="logo">{t("admin-setting-page.Logo")}</Label>
                        <Input id="logo" type="file" accept="image/*" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

