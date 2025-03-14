import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

interface DocumentChunkProps {
    id: string
    characters: number
    retrievalCount: number
    enabled: boolean
    content: string
    tags: string[]
}

export default function DocumentChunk({ id, characters, retrievalCount, enabled, content, tags }: DocumentChunkProps) {
    return (
        <div className="rounded-lg border p-4 space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm font-medium">{id}</span>
                    <span className="text-sm text-muted-foreground">{characters} characters</span>
                    <span className="text-sm text-muted-foreground">{retrievalCount} Retrieval count</span>
                    <Badge variant="secondary">EDITED</Badge>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm">Enabled</span>
                    <Switch checked={enabled} />
                </div>
            </div>
            <p className="text-sm text-muted-foreground">{content}</p>
            <div className="flex flex-wrap gap-1">
                {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                    </Badge>
                ))}
            </div>
        </div>
    )
}

