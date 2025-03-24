import { Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ApiDriveUpload } from '@/service/api'
import { useState, FormEvent, useRef } from "react"
import { toast } from "@/hooks/use-toast" // Assuming you have a toast component

export default function UserSettingsPage() {
    const [username, setUsername] = useState("allentatakai")
    const [team, setTeam] = useState("personal")
    const [theme, setTheme] = useState("light")
    const [profilePicture, setProfilePicture] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        
        try {
            setIsUploading(true)
            // Call the ApiDriveUpload function to upload the image
            const response = await ApiDriveUpload(file)
            if (response?.url) {
                setProfilePicture(response.url)
            }
        } catch (error) {
            console.error("Error uploading profile picture:", error)
            toast({
                title: "Upload Failed",
                description: "Failed to upload profile picture. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsUploading(false)
        }
    }
    
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        try {
            // Here you would typically send the data to your API
            // await updateUserSettings({ username, team, theme, profilePicture })
            toast({
                title: "Settings Saved",
                description: "Your settings have been updated successfully.",
            })
        } catch (error) {
            console.error("Error saving settings:", error)
            toast({
                title: "Save Failed",
                description: "Failed to save settings. Please try again.",
                variant: "destructive"
            })
        }
    }
    
    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <form onSubmit={handleSubmit}>
                <section>
                    <h2 className="text-xl font-semibold mb-6">User Settings</h2>

                    <div className="space-y-6 divide-y">
                        <div className="flex items-center justify-between py-4">
                            <div>
                                <h3 className="font-medium">Profile Picture</h3>
                                <p className="text-gray-500 text-sm">You look good today!</p>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div 
                                    className="h-16 w-16 rounded-full bg-gradient-to-br from-green-400 to-blue-500 relative cursor-pointer"
                                    style={profilePicture ? { backgroundImage: `url(${profilePicture})`, backgroundSize: 'cover' } : {}}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {isUploading && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                            <span className="text-white text-xs">Uploading...</span>
                                        </div>
                                    )}
                                </div>
                                <input 
                                    type="file" 
                                    ref={fileInputRef}
                                    onChange={handleFileChange} 
                                    accept="image/*" 
                                    className="hidden" 
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between py-4">
                            <div>
                                <h3 className="font-medium">Username</h3>
                                <p className="text-gray-500 text-sm">
                                    You can change your username here.
                                </p>
                            </div>
                            <Input 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)}
                                className="max-w-[250px] bg-gray-50" 
                            />
                        </div>

                        <div className="flex items-center justify-between py-4">
                            <div>
                                <h3 className="font-medium">Default Team</h3>
                                <p className="text-gray-500 text-sm">
                                    New projects and deployments from your personal scope will be created in this team.
                                </p>
                            </div>
                            <Select value={team} onValueChange={setTeam}>
                                <SelectTrigger className="w-[250px]">
                                    <SelectValue>
                                        <div className="flex items-center">
                                            <div className="h-5 w-5 rounded-full bg-gradient-to-br from-green-400 to-blue-500 mr-2" />
                                            allentatakai's project
                                        </div>
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="personal">
                                        <div className="flex items-center">
                                            <div className="h-5 w-5 rounded-full bg-gradient-to-br from-green-400 to-blue-500 mr-2" />
                                            allentatakai's project
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center justify-between py-4">
                            <div>
                                <h3 className="font-medium">Interface theme</h3>
                                <p className="text-gray-500 text-sm">Select your interface color scheme.</p>
                            </div>
                            <Select value={theme} onValueChange={setTheme}>
                                <SelectTrigger className="w-[250px]">
                                    <SelectValue>
                                        <div className="flex items-center">
                                            <Sun className="h-4 w-4 mr-2" />
                                            Light
                                        </div>
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="light">
                                        <div className="flex items-center">
                                            <Sun className="h-4 w-4 mr-2" />
                                            Light
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </section>

                <div className="mt-8 flex justify-end">
                    <Button type="submit" className="px-6">
                        Save Changes
                    </Button>
                </div>
            </form>
        </div>
    )
}

