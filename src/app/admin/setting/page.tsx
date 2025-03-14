import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
    return (
        <div className="container max-w-3xl py-6 space-y-8 mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Navigation bar</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label htmlFor="header-logo">Header logo</Label>
                        <Input id="header-logo" type="file" accept="image/*" />
                        <p className="text-sm text-muted-foreground">
                            Maximum file size is 1MB. Pages are optimized for a 28px tall header logo
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Favicon</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label htmlFor="favicon">Favicon</Label>
                        <Input id="favicon" type="file" accept=".ico,.png" />
                        <p className="text-sm text-muted-foreground">
                            Maximum file size is 1MB. Image size must be 32x32px. Allowed image formats are &apos;.png&apos; and
                            &apos;.ico&apos;.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Images with incorrect dimensions are not resized automatically, and may result in unexpected behavior.
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>System header and footer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="header-message">Header message</Label>
                        <Input id="header-message" placeholder="State your message to activate" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="footer-message">Footer message</Label>
                        <Input id="footer-message" placeholder="State your message to activate" />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox id="emails" />
                        <Label htmlFor="emails">Enable header and footer in emails</Label>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        Add header and footer to emails. Please note that color settings will only be applied within the application
                        interface
                    </p>

                    <Button variant="link" className="p-0 h-auto text-primary">
                        Customize colors
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Sign in/Sign up pages</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" defaultValue="Hello" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" defaultValue="Hello" rows={4} />
                        <p className="text-sm text-muted-foreground">Content parsed with GitLab Flavored Markdown</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="logo">Logo</Label>
                        <Input id="logo" type="file" accept="image/*" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

