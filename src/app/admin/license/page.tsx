"use client"

import {useState} from "react"
import {motion} from "framer-motion"
import {Calendar, CheckCircle, Clock, Copy, Globe, Info, Server, Users, XCircle, Zap} from "lucide-react"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Textarea} from "@/components/ui/textarea"
import {Badge} from "@/components/ui/badge"
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert"
import useSWR from "swr";
import {ApiAdminTeamLicense, ApiAdminTeamLicenseResp, ApiUpdateAdminTeamLicense} from "@/service/admin";
import {toast} from "@/hooks/use-toast";
import {ProductTypeEnum} from "@/lib/constants/constants";

export default function LicensePage() {
    const [licenseKey, setLicenseKey] = useState("")
    const [isUpdating, setIsUpdating] = useState(false)
    const [updateSuccess, setUpdateSuccess] = useState<boolean | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [copied, setCopied] = useState(false)

    const { data: adminTeamLicense, error } = useSWR<ApiAdminTeamLicenseResp>('ApiAdminTeamLicense', ApiAdminTeamLicense);
    if (error) return <div>Failed to load adminTeamLicense</div>;
    if (!adminTeamLicense) return <div>Loading...</div>;


    // Mock license info
    const licenseInfo = {
        features: ["Advanced API access", "Custom model", "Priority support", "Data export"],

    }

    const handleUpdateLicense = async () => {
        if (!licenseKey.trim()) return
        setIsUpdating(true)
        try {
            await ApiUpdateAdminTeamLicense({
                license: licenseKey.trim()
            })
            toast({
                title: "Update team successfully",
                description: `Update team license OK`,
            })
            setIsDialogOpen(false)
        } catch (error) {
            toast({
                title: "Error",
                description:  String(error),
                variant: "destructive",
            })
        } finally {
            setIsUpdating(false)
        }
    }

    const copyLicenseId = () => {
        navigator.clipboard.writeText(adminTeamLicense.licenseId)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const calculateRemainingDays = () => {
        const expirationDate = new Date(adminTeamLicense.licenseExpirationTime*1000)
        const today = new Date()
        const diffTime = expirationDate.getTime() - today.getTime()
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    const remainingDays = calculateRemainingDays()

    return (
        <div className="container mx-auto py-8 px-4 max-w-6xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="shadow-md border-t-2 border-t-blue-500">
                    <CardHeader className="pb-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                    {adminTeamLicense.licenseIssuedTo}
                                    <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 hover:bg-blue-50">
                                        In Use
                                    </Badge>
                                </CardTitle>
                                <CardDescription className="mt-1 text-sm text-gray-500">
                                    License ID:
                                    <span className="font-mono ml-1">{adminTeamLicense.licenseId}</span>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 ml-1" onClick={copyLicenseId}>
                                                    {copied ? (
                                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                                    ) : (
                                                        <Copy className="h-4 w-4 text-blue-500" />
                                                    )}
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{copied ? "Copied!" : "Copy license ID"}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </CardDescription>
                            </div>
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-blue-500 hover:bg-blue-600">Update License</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Update License</DialogTitle>
                                        <DialogDescription>Please enter the new license key to update your license</DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <Textarea
                                            placeholder="Enter license key..."
                                            value={licenseKey}
                                            onChange={(e) => setLicenseKey(e.target.value)}
                                            className="min-h-[100px] font-mono"
                                        />
                                        {updateSuccess === true && (
                                            <Alert className="border-gray-200">
                                                <CheckCircle className="h-4 w-4" />
                                                <AlertTitle>Success</AlertTitle>
                                                <AlertDescription>License updated successfully</AlertDescription>
                                            </Alert>
                                        )}
                                        {updateSuccess === false && (
                                            <Alert className="border-gray-200">
                                                <XCircle className="h-4 w-4" />
                                                <AlertTitle>Error</AlertTitle>
                                                <AlertDescription>License update failed, please check the key</AlertDescription>
                                            </Alert>
                                        )}
                                    </div>
                                    <DialogFooter className="sm:justify-between">
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setIsDialogOpen(false)
                                                setLicenseKey("")
                                                setUpdateSuccess(null)
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleUpdateLicense}
                                            disabled={isUpdating || !licenseKey.trim()}
                                            className="relative"
                                        >
                                            {isUpdating ? (
                                                <>
                                                    <span className="opacity-0">Update</span>
                                                    <span className="absolute inset-0 flex items-center justify-center">
                            <svg
                                className="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                              <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                              ></circle>
                              <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                          </span>
                                                </>
                                            ) : (
                                                "Update"
                                            )}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardHeader>

                    <CardContent className="grid gap-8">
                        {/* License Status Area */}
                        <div className="bg-linear-to-br from-blue-50 to-indigo-50 border rounded-lg p-6">
                            <h3 className="text-lg font-medium mb-4 text-blue-800">License Status</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm text-blue-700">License Validity</span>
                                            <span className="text-sm font-medium text-blue-900">{remainingDays} days</span>
                                        </div>
                                        <div className="w-full bg-blue-100 rounded-full h-2">
                                            <div
                                                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${Math.min(100, (remainingDays / 365) * 100)}%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm text-blue-700">User Usage</span>
                                            <span className="text-sm font-medium text-blue-900">
                        {adminTeamLicense.staticActiveUsers} / {adminTeamLicense.licenseMaxUsers}
                      </span>
                                        </div>
                                        <div className="w-full bg-blue-100 rounded-full h-2">
                                            <div
                                                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${(adminTeamLicense.staticActiveUsers / adminTeamLicense.licenseMaxUsers) * 100}%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-blue-700">License Type</span>
                                        <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                                            {ProductTypeEnum[adminTeamLicense.licenseProduct]}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-blue-700">Version</span>
                                        <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200">
                                            {adminTeamLicense.licenseVersion}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Basic Info */}
                            <div className="border rounded-lg p-6 bg-white">
                                <h3 className="text-lg font-medium mb-4 text-gray-800">Basic Info</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-md bg-blue-50 text-blue-600">
                                            <Info className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Licensed To</p>
                                            <p className="font-medium text-gray-900">{adminTeamLicense.licenseIssuedTo}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-md bg-green-50 text-green-600">
                                            <Calendar className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Issued Time</p>
                                            <p className="font-medium text-gray-900">{new Date(adminTeamLicense.licenseIssuedTime * 1000).toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-md bg-amber-50 text-amber-600">
                                            <Clock className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Expiration Time</p>
                                            <p className="font-medium text-gray-900">{new Date(adminTeamLicense.licenseExpirationTime * 1000).toLocaleString()}</p>
                                            <p className="text-xs text-amber-600 font-medium">
                                                {remainingDays > 0 ? `Remaining ${remainingDays} days` : "Expired"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Usage Limits */}
                            <div className="border rounded-lg p-6 bg-white">
                                <h3 className="text-lg font-medium mb-4 text-gray-800">Usage Limits</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-md bg-rose-50 text-rose-600">
                                            <Users className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">User Limit</p>
                                            <p className="font-medium text-gray-900">{adminTeamLicense.licenseMaxUsers}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-md bg-cyan-50 text-cyan-600">
                                            <Server className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Maximum Instances</p>
                                            <p className="font-medium text-gray-900">{adminTeamLicense.licenseMaxInstances}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-md bg-teal-50 text-teal-600">
                                            <Users className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Maximum Active Users</p>
                                            <p className="font-medium text-gray-900">{adminTeamLicense.licenseMaxUsers}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-md bg-sky-50 text-sky-600">
                                            <Globe className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Allowed Domains</p>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {adminTeamLicense.licenseAllowedDomains.map((domain, index) => (
                                                    <Badge key={index} variant="outline" className="bg-sky-50 text-sky-700 border-sky-200">
                                                        {domain}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Included Features */}
                        <div className="border rounded-lg p-6 bg-linear-to-br from-gray-50 to-gray-100">
                            <h3 className="text-lg font-medium mb-4 text-gray-800">Included Features</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {licenseInfo.features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2 bg-white p-3 rounded-lg border border-gray-100">
                                        <div className="p-1.5 rounded-md bg-emerald-50 text-emerald-500">
                                            <Zap className="h-4 w-4" />
                                        </div>
                                        <span className="text-gray-700">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="bg-linear-to-br from-gray-50 to-blue-50 border-t px-6 py-4">
                        <div className="flex justify-between items-center w-full text-sm text-gray-500">
                            <div>
                                <p>
                                    For assistance, please contact{" "}
                                    <a href="mailto:support@chatanyai.com" className="text-blue-600 hover:underline">
                                        support@chatanyai.com
                                    </a>
                                </p>
                            </div>
                            <div>
                                <p>© 2025 ChatAnyAI</p>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    )
}

