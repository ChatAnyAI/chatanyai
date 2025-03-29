"use client"

import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocumentProxy } from 'pdfjs-dist';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';

pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

interface PDFPreviewProps {
    pdfUrl: string;
}

export default function PDFPreview({ pdfUrl }: PDFPreviewProps) {
    const { t } = useTranslation();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
    const [pageNum, setPageNum] = useState(1);
    const [scale, setScale] = useState(1.5);
    const [numPages, setNumPages] = useState(0);

    useEffect(() => {
        const loadPDF = async () => {
            try {
                const loadingTask = pdfjsLib.getDocument(window.location.origin + '/' + pdfUrl);
                const pdf = await loadingTask.promise;
                setPdfDoc(pdf);
                setNumPages(pdf.numPages);
                renderPage(1, pdf);
            } catch (error) {
                console.error('Error loading PDF:', error);
            }
        };

        if (pdfUrl) {
            loadPDF();
        }
    }, [pdfUrl]);

    const renderPage = async (pageNumber: number, doc: PDFDocumentProxy = pdfDoc!) => {
        if (!doc || !canvasRef.current) return;

        const page = await doc.getPage(pageNumber);
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) return;

        const viewport = page.getViewport({ scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: context,
            viewport: viewport,
        };

        await page.render(renderContext).promise;
    };

    const changePage = (offset: number) => {
        const newPageNum = pageNum + offset;
        if (newPageNum >= 1 && newPageNum <= numPages) {
            setPageNum(newPageNum);
            renderPage(newPageNum);
        }
    };

    const changeZoom = (delta: number) => {
        const newScale = scale + delta;
        if (newScale >= 0.5 && newScale <= 3) {
            setScale(newScale);
            renderPage(pageNum);
        }
    };

    return (
        <div className="flex flex-1 flex-col items-center w-full max-w-3xl mx-auto bg-background rounded-xl shadow-lg py-4 h-[100%]">
            <div className="w-full overflow-auto h-[100%]">
                <canvas ref={canvasRef} className="mx-auto" />
            </div>
            
            <div className="flex items-center justify-center gap-4 mt-4">
                <Button
                    variant="outline"
                    onClick={() => changePage(-1)}
                    disabled={pageNum <= 1}
                >
                    <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <span className="text-sm">
                    {t('pdf-preview.Page')} {pageNum} {t('pdf-preview.of')} {numPages}
                </span>
                
                <Button
                    variant="outline"
                    onClick={() => changePage(1)}
                    disabled={pageNum >= numPages}
                >
                    <ChevronRight className="w-4 h-4" />
                </Button>

                <div className="border-l mx-2 h-6" />

                <Button
                    variant="outline"
                    onClick={() => changeZoom(-0.2)}
                    disabled={scale <= 0.5}
                >
                    <ZoomOut className="w-4 h-4" />
                </Button>
                
                <span className="text-sm">
                    {Math.round(scale * 100)}%
                </span>
                
                <Button
                    variant="outline"
                    onClick={() => changeZoom(0.2)}
                    disabled={scale >= 3}
                >
                    <ZoomIn className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}