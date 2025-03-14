import { Link } from "react-router-dom"
import { CircleHelp, ChevronRight, Check, Power } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import useSWR from "swr";
import {
    ApiAdminStatisticsTotal,
    RespApiAdminStatisticsTotal
} from "@/service/admin";

export default function InstanceOverview() {
    const { data: statisticsTotal, error } = useSWR<RespApiAdminStatisticsTotal>('ApiAdminStatisticsTotal', ApiAdminStatisticsTotal);
    if (error) return <div>Failed to load providerList</div>;
    if (!statisticsTotal) return <div>Loading...</div>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-6">Instance overview</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
                {/* Projects Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-sm font-medium">APPLICATIONS</CardTitle>
                            <span className="text-2xl font-semibold">{statisticsTotal.applicationCount}</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center pt-4">
                            <div className="space-y-2">
                                    <Link to="/admin/application" className="text-blue-600 hover:underline flex items-center">
                                        View latest applications <ChevronRight className="h-4 w-4" />
                                    </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Users Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-sm font-medium">USERS</CardTitle>
                            <span className="text-2xl font-semibold">{statisticsTotal.userCount}</span>
                            {/*<Link to="#" className="text-blue-600 hover:underline text-sm">*/}
                            {/*    Users Statistics*/}
                            {/*</Link>*/}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center pt-4">
                            <div className="space-y-2">
                                <Link to="/admin/teamMember" className="text-blue-600 hover:underline flex items-center">
                                    View latest users <ChevronRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Groups Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-sm font-medium">CHATS</CardTitle>
                            <span className="text-2xl font-semibold">{statisticsTotal.chatCount}</span>
                        </div>
                    </CardHeader>
                    {/*<CardContent>*/}
                    {/*    <div className="flex items-center pt-4">*/}
                    {/*        <div className="space-y-2">*/}
                    {/*            <Link to="#" className="text-blue-600 hover:underline flex items-center">*/}
                    {/*                View latest chats <ChevronRight className="h-4 w-4" />*/}
                    {/*            </Link>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</CardContent>*/}
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Statistics Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableBody>
                                {[
                                    { name: "Copilots", value: statisticsTotal.copilotCount },
                                    { name: "Datasets", value: statisticsTotal.datasetCount },
                                    { name: "Tools", value: statisticsTotal.toolCount },
                                    { name: "ModelProviders", value: statisticsTotal.modelProviderCount },
                                    { name: "Messages", value: statisticsTotal.messageCount },
                                    { name: "Files", value: statisticsTotal.fileCount },
                                    { name: "Active Users", value: statisticsTotal.activeUserCount },
                                ].map((item) => (
                                    <TableRow key={item.name}>
                                        <TableCell className="py-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm">{item.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {item.value}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Features Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableBody>
                                {[
                                    { name: "Sign up", status: "enabled" },
                                    { name: "LDAP", status: "disabled", hasHelp: true },
                                    { name: "Oauth2", status: "disabled" },
                                    { name: "Saml", status: "disabled", hasHelp: true },
                                ].map((feature) => (
                                    <TableRow key={feature.name}>
                                        <TableCell className="py-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm">{feature.name}</span>
                                                {feature.hasHelp && <CircleHelp className="h-4 w-4 text-muted-foreground" />}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {feature.status === "enabled" ? (
                                                <Check className="h-4 w-4 text-green-500 ml-auto" />
                                            ) : (
                                                <Power className="h-4 w-4 text-muted-foreground ml-auto" />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Components Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle>Components</CardTitle>
                        <span className="bg-red-600 text-white text-xs px-3 py-1 rounded">update</span>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableBody>
                                {[
                                    { name: "ChatAnyAI", version: "1.0.0", isLink: true },
                                    { name: "PostgreSQL", version: "12.6" },
                                    { name: "Ollama", version: "v1.2.0" },
                                ].map((component) => (
                                    <TableRow key={component.name}>
                                        <TableCell className="py-2">
                                            {component.isLink ? (
                                                <Link to="#" className="text-blue-600 hover:underline text-sm">
                                                    {component.name}
                                                </Link>
                                            ) : (
                                                <span className="text-sm">{component.name}</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right text-sm">{component.version}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

