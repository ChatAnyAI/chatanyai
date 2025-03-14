'use client'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Database, MoreVertical } from "lucide-react"
import { useNavigate as useRouter } from "react-router-dom";
import { AppResp, RespDatasetInfo } from "@/service/api"
import dayjs from 'dayjs';
import NavMore from "@/components/nav-more"

interface DatasetCardProps {
    dataset: RespDatasetInfo
    // onEdit: (id: string) => void
    // onDelete: (id: string) => void
}


export function DatasetCard({ dataset }: DatasetCardProps) {
    const { id, name: title, description, updatedAt, fileCnt } = dataset;
    const router = useRouter();
    return (
        <Card className="hover:shadow-md transition-shadow" id={id}>
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3" onClick={
                        () => {
                            router(`/dataset/${id}/docList`)
                        }
                    }>
                        <Database className="text-blue-500" size={24} />
                        <div>
                            <h3 className="font-semibold text-lg">{title}</h3>
                            <p className="text-sm text-gray-500">{description}</p>
                        </div>
                    </div>
                    <NavMore appInfo={dataset as unknown as AppResp}>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </NavMore>
                </div>
            </CardContent>
            <CardFooter className="bg-gray-50 px-6 py-3 text-sm text-gray-500 flex justify-between items-center">
                <div className="flex space-x-4">
                    {/*<Badge variant="secondary">{source}</Badge>*/}
                    <span>{fileCnt} documents</span>
                </div>
                <span>Updated {dayjs.unix(updatedAt).format('MM-DD HH:mm')}</span>
            </CardFooter>
        </Card>
    )
}

