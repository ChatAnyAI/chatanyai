import React, { useEffect, memo, useRef } from 'react';
import {useMermaid} from "@/hooks/use-mermaid";

let i = 0;
function MyMermaidChart({ chart }: { chart: string }) {
    const mermaidPromise = useMermaid();
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        mermaidPromise.then(async (mermaid) => { 
            try {
                if (chartRef.current) {
                    // @ts-ignore
                    const { svg } = await mermaid.render('mermaid' + i++, chart);
                    chartRef.current.innerHTML = svg;
                }
            } catch (error) {
                console.error('Mermaid rendering error:', error);
            }
        })
    }, [chart])
    
    return (
        < div ref = { chartRef } style={{cursor: 'pointer'}}>
        </div>
    );
}

export default memo(MyMermaidChart);


