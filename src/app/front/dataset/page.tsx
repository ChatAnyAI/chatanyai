import { Search, Plus, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { ApiAppList } from '@/service/api'
import useSWR from "swr"
import NavMore from "@/components/nav-more"
// import { AppType } from "@/lib/constants/constants"
import { useState } from "react"
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
// import { FavoriteToggle } from "@/components/favorite-toggle"

export default function Page() {
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();
    const navigator = useNavigate();
    const { t } = useTranslation();

    const { data: projects, error } = useSWR(['ApiAppList', location, searchQuery],
        () => ApiAppList());

    const filteredProjects = projects;

    return (
        <div className="min-h-screen flex-1">
            <header className="flex h-16 shrink-0 items-center gap-2">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink >Dataset</BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className="container max-w-9xl mx-auto py-6">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-semibold">Dataset</h1>
                    <Button className="bg-[#6C5CE7] hover:bg-[#6C5CE7]/90" onClick={() => navigator('/dataset/create')}>
                        <Plus className="mr-2 h-4 w-4" /> {t('common.create')}
                    </Button>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder={t('common.search')}
                                    className="pl-8"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            setSearchQuery(e.currentTarget.value)
                                            e.preventDefault();
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    {error ? <div>{t('error.loadFailed')}</div> : null}
                    {!projects ? <div>{t('common.loading')}</div> : null}

                    {!error && projects ? <>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {filteredProjects?.map((project) => (
                                <Card key={project.id} className="p-4" onClick={() => navigator(`/dataset/${project.id}/docList`)}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex gap-3">
                                            <div
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                                className="rounded bg-blue-200"
                                            >{project.icon}</div>
                                            <div>
                                                <h3 className="font-medium">{project.name}</h3>
                                                {project.description && <p className="text-sm text-muted-foreground">{project.description}</p>}
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            {/* <FavoriteToggle key={project.id} initialState={project.favorite} appId={project.id}>
                                            </FavoriteToggle> */}
                                            <NavMore appInfo={project} hiddenFavorite>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </NavMore>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2">
                                        <span className="rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">Dataset</span>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <span>{t('dataset.lastUpdated', { time: new Date(project.createdAt * 1000).toLocaleString() })}</span>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <div className="text-sm text-muted-foreground">
                                {t('common.total', { total: projects?.length || 0 })}
                            </div>
                        </div>
                    </> : null}
                </div>
            </div>
        </div>
    );
}

