import { Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UserSettingsPage() {
    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <section>
                <h2 className="text-xl font-semibold mb-6">User Settings</h2>

                <div className="space-y-6 divide-y">
                    <div className="flex items-center justify-between py-4">
                        <div>
                            <h3 className="font-medium">Profile Picture</h3>
                            <p className="text-gray-500 text-sm">You look good today!</p>
                        </div>
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-green-400 to-blue-500"></div>
                    </div>

                    <div className="flex items-center justify-between py-4">
                        <div>
                            <h3 className="font-medium">Username</h3>
                            <p className="text-gray-500 text-sm">
                                Your username can be edited on{" "}
                                <a href="#" className="text-blue-500">
                                    vercel.com
                                </a>
                            </p>
                        </div>
                        <Input value="allentatakai" className="max-w-[250px] bg-gray-50" readOnly />
                    </div>

                    <div className="flex items-center justify-between py-4">
                        <div>
                            <h3 className="font-medium">Default Team</h3>
                            <p className="text-gray-500 text-sm">
                                New projects and deployments from your personal scope will be created in this Vercel team.
                            </p>
                        </div>
                        <Select defaultValue="personal">
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
                        <Select defaultValue="light">
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

                    <div className="flex items-center justify-between py-4">
                        <div>
                            <h3 className="font-medium">Transfer Data</h3>
                            <p className="text-gray-500 text-sm">
                                Transfer your chats and projects to another Team account or your personal scope.
                            </p>
                        </div>
                        <Button variant="outline">Start Transfer</Button>
                    </div>
                </div>
            </section>

            <section className="mt-8">
                <h2 className="text-xl font-semibold mb-6">Integrations</h2>
                <div className="border rounded-lg p-4 bg-white">
                    <div className="flex items-start">
                        <div className="h-12 w-12 rounded border flex items-center justify-center mr-4">
                            <div className="h-6 w-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center">
                                <h3 className="font-medium">Figma</h3>
                                <span className="ml-2 text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">New</span>
                            </div>
                            <p className="text-gray-500 text-sm mt-1">
                                Paste links to sections or frames from Figma when prompting v0 to turn them into code.
                            </p>
                        </div>
                        <Button variant="outline" className="ml-4">
                            Upgrade to Connect
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}

