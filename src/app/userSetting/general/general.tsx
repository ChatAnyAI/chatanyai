import { Monitor, Moon, Sun, Camera, User, Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ApiDriveUpload, ApiUserSetting } from '@/service/api'
import { useState, FormEvent, useRef } from "react"
import { toast } from "@/hooks/use-toast" // Assuming you have a toast component
import { useGlobalStore } from "@/store/globalStore"
import { useTheme } from "next-themes"
import {DefaultAvatar} from "@/components/user-avatar";
import * as React from "react";
import { useTranslation, Trans } from 'react-i18next';

export default function UserSettingsPage() {
    const { t, i18n } = useTranslation();
    const { theme, setTheme} = useTheme()
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const user = useGlobalStore(state => state.user);
    const setUser = useGlobalStore(state => state.setUser);
    const [imageError, setImageError] = useState(false)
    
    // Function to generate initials from user name
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }
    
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        
        try {
            setIsUploading(true)
            // Call the ApiDriveUpload function to upload the image
            const response = await ApiDriveUpload(file)
            console.log("response",response)
            if (response?.url) {
                // setProfilePicture(response.url)
                await ApiUserSetting(response.url as string);
                setUser({
                    ...user,
                    avatar: response.url
                });

                toast({
                    title: "Upload Successful",
                    description: "Profile picture uploaded successfully.",
                })
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
    console.log("user",user)
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

    // Function to handle language change
    const changeLanguage = (language: string) => {
      i18n.changeLanguage(language);
    };
    
    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <form onSubmit={handleSubmit}>
                <section>
                    <h2 className="text-xl font-semibold mb-6">{t('User Settings')}</h2>

                    <div className="space-y-6 divide-y">
                        <div className="flex items-center justify-between py-4">
                            <div>
                                <h3 className="font-medium">{t('Profile Picture')}</h3>
                                <p className="text-gray-500 text-sm">{t('You look good today!')}</p>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div 
                                    className="h-16 w-16 rounded-full bg-linear-to-br  relative cursor-pointer group"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {/* Display user avatar with error handling */}
                                    {user.avatar && !imageError ? (
                                        <img 
                                            src={user.avatar} 
                                            alt="Profile"
                                            className="h-full w-full object-cover rounded-full"
                                            onError={() => setImageError(true)}
                                        />
                                    ) : (
                                        <div className="h-full w-full rounded-full flex items-center justify-center text-white font-semibold text-xl">
                                            {/*{user.name ? getInitials(user.name) : <User className="h-8 w-8" />}*/}
                                            {user.avatar.includes("default://") ? <DefaultAvatar user={user} />:null}
                                        </div>
                                    )}
                                    
                                    {/* Edit overlay that appears on hover */}
                                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <Camera className="text-white h-6 w-6" />
                                    </div>
                                    
                                    {/* Uploading indicator */}
                                    {isUploading && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                            <span className="text-white text-xs">Uploading...</span>
                                        </div>
                                    )}
                                </div>
                                <span className="text-xs text-blue-500">{t('Click to change')}</span>
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
                                <h3 className="font-medium">{t('Username')}</h3>
                                <p className="text-gray-500 text-sm">
                                    {t('You can change your username here.')}
                                </p>
                            </div>
                            <Input 
                                value={user.name} 
                                className="max-w-[250px]" 
                                readOnly={true}
                            />
                        </div>

                        <div className="flex items-center justify-between py-4">
                            <div>
                                <h3 className="font-medium">{t('Default Team')}</h3>
                                <p className="text-gray-500 text-sm">
                                    {t('New projects and deployments from your personal scope will be created in this team.')}
                                </p>
                            </div>
                            <Select value={String(user.teams?.[0]?.teamId)} disabled={true}>
                                <SelectTrigger className="w-[250px]">
                                    <SelectValue>
                                        <div className="flex items-center">
                                            <div className="h-5 w-5 rounded-full bg-linear-to-br from-green-400 to-blue-500 mr-2" />
                                            {user.teams?.[0]?.name}
                                        </div>
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    { 
                                        // Assuming you have a list of teams
                                        user.teams?.map(team => (
                                            <SelectItem key={team.teamId} value={String(team.teamId)}>
                                                <div className="flex items-center">
                                                    <div className="h-5 w-5 rounded-full bg-linear-to-br from-green-400 to-blue-500 mr-2" />
                                                    {team.name}
                                                </div>
                                            </SelectItem>
                                        ))
                                    }
                                    <SelectItem value="personal">
                                        <div className="flex items-center">
                                            <div className="h-5 w-5 rounded-full bg-linear-to-br from-green-400 to-blue-500 mr-2" />
                                            allentatakai's project
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center justify-between py-4 ">
                            <div>
                                <h3 className="font-medium">{t('Interface theme')}</h3>
                                <p className="text-gray-500 text-sm">{t('Select your interface color scheme.')}</p>
                            </div>
                            <Select value={theme} onValueChange={setTheme}>
                                <SelectTrigger className="w-[250px] cursor-pointer">
                                    <SelectValue>
                                        <div className="flex items-center">
                                            <Sun className="h-4 w-4 mr-2" />
                                            {t('Light')}
                                        </div>
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="light">
                                        <div className="flex items-center cursor-pointer">
                                            <Sun className="h-4 w-4 mr-2" />
                                            {t('Light')}
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="dark">
                                        <div className="flex items-center cursor-pointer">
                                            <Moon className="h-4 w-4 mr-2" />
                                            {t('Dark')}
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="system">
                                        <div className="flex items-center cursor-pointer">
                                            <Monitor className="h-4 w-4 mr-2" />
                                            {t('System')}
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* New section for language settings */}
                        <div className="flex items-center justify-between py-4">
                            <div>
                                <h3 className="font-medium">{t('Language')}</h3>
                                <p className="text-gray-500 text-sm">{t('Select your preferred language.')}</p>
                            </div>
                            <Select value={i18n.language} onValueChange={changeLanguage}>
                                <SelectTrigger className="w-[250px]  cursor-pointer">
                                    <SelectValue>
                                        <div className="flex items-center">
                                            <Languages className="h-4 w-4 mr-2" />
                                            {i18n.language === 'en' ? 'English' : '中文'}
                                        </div>
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en">
                                        <div className="flex items-center cursor-pointer">
                                            <Languages className="h-4 w-4 mr-2" />
                                            English
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="zh">
                                        <div className="flex items-center cursor-pointer">
                                            <Languages className="h-4 w-4 mr-2" />
                                            中文
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </section>

                {/* <div className="mt-8 flex justify-end">
                    <Button type="submit" className="px-6">
                        Save Changes
                    </Button>
                </div> */}
            </form>
        </div>
    )
}

