"use client"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import useSWR from "swr";
import {
    ApiAdminTeamPreference,
    ApiGetAdminTeamPreference,
    ApiUpdateAdminTeamPreference,
    EmailConfig
} from "@/service/admin";

import { Loader2 } from "lucide-react"

// Form validation schema
const formSchema = z.object({
    emailEnable: z.boolean().default(false),
    host: z.string().min(1, { message: "Host is required" }).optional(),
    port: z.string().min(1, { message: "Port is required" }).optional(),
    username: z.string().min(1, { message: "Username is required" }).optional(),
    password: z.string().min(1, { message: "Password is required" }).optional(),
    subject: z.string().min(1, { message: "Subject is required" }).optional(),
    fromEmail: z.string().email({ message: "Invalid email address" }).optional(),
    fromName: z.string().min(1, { message: "From name is required" }).optional(),
})

export default function TeamPreferencesPage() {
    const { data: preference, error, isLoading } = useSWR<ApiAdminTeamPreference>('ApiGetAdminTeamPreference', ApiGetAdminTeamPreference);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            emailEnable: false,
            host: "",
            port: "",
            username: "",
            password: "",
            subject: "",
            fromEmail: "",
            fromName: "",
        },
    })
// Update form when preference data is loaded
    useEffect(() => {
        if (preference) {
            let smtpConfig: EmailConfig = {}

            // Parse the emailConfig JSON string if it exists and is not empty
            if (preference.emailConfig) {
                try {
                    smtpConfig = JSON.parse(preference.emailConfig)
                } catch (e) {
                    console.error("Error parsing emailConfig:", e)
                }
            }

            // Extract host and port from the combined string if available
            let host = ""
            let port = ""
            if (smtpConfig.host) {
                const hostParts = smtpConfig.host.split(":")
                host = hostParts[0] || ""
                port = hostParts[1] || ""
            }

            // Reset form with the loaded values
            form.reset({
                emailEnable: preference.emailEnable,
                host,
                port,
                username: smtpConfig.username || "",
                password: smtpConfig.password || "",
                subject: smtpConfig.subject || "",
                fromEmail: smtpConfig.fromEmail || "",
                fromName: smtpConfig.fromName || "",
            })
        }
    }, [preference, form])

    const emailEnabled = form.watch("emailEnable")

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            // Prepare the data according to the required structure
            const emailConfig = emailEnabled
                ? JSON.stringify({
                    host: `${values.host}:${values.port}`,
                    username: values.username,
                    password: values.password,
                    subject: values.subject,
                    fromEmail: values.fromEmail,
                    fromName: values.fromName,
                })
                : ""
            let requestData:ApiAdminTeamPreference={}
            if (values.emailEnable) {
                 requestData = {
                    emailEnable: values.emailEnable,
                    emailConfig: emailConfig,
                }
            }else {
                 requestData = {
                    emailEnable: values.emailEnable,
                }
            }

            await ApiUpdateAdminTeamPreference(requestData)

            toast({
                title: "Preferences saved",
                description: "Your team preferences have been updated successfully.",
            })
        } catch (error) {
            console.error("Error saving preferences:", error)
            toast({
                title: "Error",
                description: "Failed to save preferences. Please try again.",
                variant: "destructive",
            })
        }
    }

    if (isLoading) {
        return (
            <div className="container mx-auto py-10 flex justify-center items-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading preferences...</span>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto py-10">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Error</CardTitle>
                        <CardDescription>Failed to load team preferences. Please try again later.</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button onClick={() => window.location.reload()} className="ml-auto">
                            Retry
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-10">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Team Preferences</CardTitle>
                    <CardDescription>Configure your team's email settings and preferences.</CardDescription>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardContent className="space-y-6">
                            <FormField
                                control={form.control}
                                name="emailEnable"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Email Functionality</FormLabel>
                                            <FormDescription>Enable email notifications for your team</FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {emailEnabled && (
                                <div className="space-y-4 border rounded-lg p-4">
                                    <h3 className="text-lg font-medium">SMTP Configuration</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="host"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Host</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="smtp.example.com" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="port"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Port</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="587" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Username</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="username" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="••••••••" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="subject"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Default Subject</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Notification from Team" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="fromEmail"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>From Email</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="notifications@example.com" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="fromName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>From Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Team Notifications" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="ml-auto">
                                Save Preferences
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>
    )
}

