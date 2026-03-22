import React, { useState } from 'react';
import { Download, Loader2, CheckCircle2 } from 'lucide-react';

/**
 * PDF generator component designed to handle heavy PDF generation
 * separately from the main Reports UI to ensure smooth performance.
 * Links logic from pdfService with a specialized UI handler.
 */
export default function PDFAction({ records, insights, sku = 'all', variant = 'primary' }) {
    const [generating, setGenerating] = useState(false);
    const [done, setDone] = useState(false);

    const handleDownload = async () => {
        if (!records || records.length === 0) return;

        setGenerating(true);
        setDone(false);

        try {
            // Lazy load the heavy PDF libraries via the service
            const { generatePDF } = await import('../services/pdfService');

            // Execute generation (non-blocking simulation or actual worker can be added here)
            // For now, we use the optimized service logic
            await generatePDF(records, insights);

            setDone(true);
            // Reset "done" state after a delay
            setTimeout(() => setDone(false), 3000);
        } catch (error) {
            console.error('PDF Generation failed:', error);
        } finally {
            setGenerating(false);
        }
    };

    if (variant === 'icon') {
        return (
            <button
                onClick={(e) => { e.stopPropagation(); handleDownload(); }}
                disabled={generating}
                className={`p-2 rounded-lg transition-all ${done ? 'bg-green-100 text-green-700' : 'bg-green-100 text-green-700 hover:bg-green-700 hover:text-white'
                    } disabled:opacity-50`}
                title={done ? "Report Downloaded!" : "Download PDF Audit"}
            >
                {generating ? <Loader2 className="w-4 h-4 animate-spin" /> :
                    done ? <CheckCircle2 className="w-4 h-4" /> :
                        <Download className="w-4 h-4" />}
            </button>
        );
    }

    return (
        <button
            onClick={handleDownload}
            disabled={generating}
            className={`flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all shadow-2xl ${done
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-hover)] transform hover:-translate-y-1'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
            {generating ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing Report...</span>
                </>
            ) : done ? (
                <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Report Ready!</span>
                </>
            ) : (
                <>
                    <Download className="w-5 h-5" />
                    <span>Download PDF Now</span>
                </>
            )}
        </button>
    );
}
