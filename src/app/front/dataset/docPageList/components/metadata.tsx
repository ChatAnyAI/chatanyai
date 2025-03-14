
export function Metadata() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold mb-2">Metadata</h2>
                <p className="text-sm text-muted-foreground">
                    Labeling metadata for documents allows AI to access them in a timely manner and exposes the source of
                    references for users.
                </p>
            </div>

            {/* <div>
                <h3 className="text-sm font-medium mb-2">Please select a document type</h3>
                <div className="grid grid-cols-4 gap-2">
                    {[
                        { icon: FileText, label: "Text" },
                        { icon: HelpCircle, label: "Q&A" },
                        { icon: Settings, label: "Settings" },
                        { icon: Mail, label: "Email" },
                        { icon: FileCode, label: "Code" },
                        { icon: BarChart, label: "Chart" },
                        { icon: Clock, label: "Time" },
                    ].map(({ icon: Icon, label }) => (
                        <Button key={label} variant="outline" className="h-16 flex-col gap-1" size="sm">
                            <Icon className="h-4 w-4" />
                            <span className="text-xs">{label}</span>
                        </Button>
                    ))}
                </div>
            </div> */}

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="text-muted-foreground">Original filename</div>
                    <div>dataset.md</div>
                    <div className="text-muted-foreground">Original file size</div>
                    <div>6.48KB</div>
                    <div className="text-muted-foreground">Upload date</div>
                    <div>February 2, 2025</div>
                    <div className="text-muted-foreground">Last update date</div>
                    <div>February 2, 2025</div>
                    <div className="text-muted-foreground">Source</div>
                    <div>Upload File</div>
                </div>
            </div>

            <div>
                <h3 className="text-sm font-medium mb-2">Technical Parameters</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="text-muted-foreground">Chunks specification</div>
                    <div>Custom</div>
                    <div className="text-muted-foreground">Chunks length</div>
                    <div>500</div>
                    <div className="text-muted-foreground">Avg. paragraph length</div>
                    <div>282 characters</div>
                    <div className="text-muted-foreground">Paragraphs</div>
                    <div>10 paragraphs</div>
                    <div className="text-muted-foreground">Retrieval count</div>
                    <div>0.00% (0/10)</div>
                    <div className="text-muted-foreground">Embedding time</div>
                    <div>1.15 sec</div>
                    <div className="text-muted-foreground">Embedded spend</div>
                    <div>0 tokens</div>
                </div>
            </div>
        </div>
    )
}

