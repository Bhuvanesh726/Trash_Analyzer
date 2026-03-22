import React, { useState, useMemo, Suspense, lazy } from 'react'
import {
    FileBarChart2, Download, Sparkles, Loader2, CheckCircle2,
    Leaf, Recycle, TrendingUp, AlertTriangle, Table,
    List as ListIcon, Play, Package
} from 'lucide-react'
import { getIndustrialInsights } from '../services/pdfService'

const ActionPDF = lazy(() => import('./pdf'))

const ACTION_MESSAGES = [
    'Aggregating waste metrics...',
    'Analyzing manufacturing efficiency...',
    'Performing rule-based heuristic check...',
    'Applying industrial best practices...',
    'Finalizing plant-floor recommendations...',
]



export default function Reports({ records, loading }) {
    const [generating, setGenerating] = useState(false)
    const [generationStep, setGenerationStep] = useState(0)
    const [done, setDone] = useState(false)
    const [aiInsight, setAiInsight] = useState('')
    const [selectedSku, setSelectedSku] = useState('all')
    const [generatingSku, setGeneratingSku] = useState(null)
    const [readySkus, setReadySkus] = useState({}) // { skuId: aiResult }

    const skuList = useMemo(() => {
        const skus = [...new Set(records.map(r => r.skuId))].filter(Boolean).sort()
        return skus
    }, [records])

    const filteredRecords = useMemo(() => {
        if (selectedSku === 'all') return records
        return records.filter(r => r.skuId === selectedSku)
    }, [records, selectedSku])

    const stats = useMemo(() => {
        let total = 0, recyclable = 0
        filteredRecords.forEach(r => {
            const sum = (r.paper || 0) + (r.plastic || 0) + (r.wet || 0) + (r.organic || 0) + (r.defective || 0)
            total += sum
            recyclable += (r.paper || 0) + (r.plastic || 0)
        })
        const co2 = filteredRecords.reduce((s, r) => s + (r.paper || 0) * 0.91 + (r.plastic || 0) * 1.5, 0)
        return { total, recyclable, co2, count: filteredRecords.length }
    }, [filteredRecords])

    const handleGenerate = async (skuToAnalyze = selectedSku) => {
        if (skuToAnalyze !== selectedSku) setSelectedSku(skuToAnalyze)

        // If already categorized, the ActionPDF component handles the download
        if (readySkus[skuToAnalyze]) {
            return
        }

        setGeneratingSku(skuToAnalyze)
        setGenerating(true)
        setDone(false)
        setAiInsight('')
        setGenerationStep(0)

        const targetRecords = skuToAnalyze === 'all' ? records : records.filter(r => r.skuId === skuToAnalyze)
        const finalInsight = getIndustrialInsights(targetRecords)

        let step = 0
        const iv = setInterval(() => {
            step++
            setGenerationStep(step)
            if (step >= ACTION_MESSAGES.length) {
                clearInterval(iv)
                setAiInsight(finalInsight)
                setReadySkus(prev => ({ ...prev, [skuToAnalyze]: finalInsight }))
                // The actual auto-download can still happen via service if needed,
                // but the UI is now driven by the ActionPDF component for reuse.
                setGenerating(false)
                setGeneratingSku(null)
                setDone(true)
                setTimeout(() => setDone(false), 3000)
            }
        }, 600)
    }

    // triggerImmediateDownload is no longer used directly as it's handled by ActionPDF component

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <Loader2 className="w-10 h-10 text-[var(--color-brand)] animate-spin mb-4" />
                <p className="text-sm text-[var(--color-text-secondary)]">Loading records...</p>
            </div>
        )
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">
                        Report Generation
                    </h2>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                        AI-powered waste analysis and sustainability reporting
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <label htmlFor="sku-filter" className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                        Filter by SKU:
                    </label>
                    <select
                        id="sku-filter"
                        value={selectedSku}
                        onChange={(e) => setSelectedSku(e.target.value)}
                        className="px-4 py-2 rounded-xl border border-[var(--color-border)] bg-white text-sm font-medium text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand)] transition-all duration-200"
                    >
                        <option value="all">Global (All SKUs)</option>
                        {skuList.map(sku => (
                            <option key={sku} value={sku}>{sku}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {[
                    { icon: FileBarChart2, label: 'Records', value: stats.count, color: '#FF6B00' },
                    { icon: TrendingUp, label: 'Total Weight', value: `${stats.total.toFixed(1)} kg`, color: '#3B82F6' },
                    { icon: Recycle, label: 'Recyclable', value: `${stats.recyclable.toFixed(1)} kg`, color: '#10B981' },
                    { icon: Leaf, label: 'CO₂ Saved', value: `${stats.co2.toFixed(1)} kg`, color: '#8B5CF6' },
                ].map((s, i) => (
                    <div key={i} className="bg-white rounded-2xl p-5 border border-[var(--color-border)]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.color}15` }}>
                                <s.icon className="w-5 h-5" style={{ color: s.color }} />
                            </div>
                            <div>
                                <p className="text-xs text-[var(--color-text-muted)]">{s.label}</p>
                                <p className="text-lg font-bold text-[var(--color-text-primary)]">{s.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Generate Report Card */}
            <div className="bg-white rounded-2xl p-8 border border-[var(--color-border)]">
                <div className="text-center max-w-lg mx-auto">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand-dark)] flex items-center justify-center mb-4 shadow-lg shadow-orange-200">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
                        Industrial Insight Report
                    </h3>
                    <p className="text-sm text-[var(--color-text-secondary)] mb-6">
                        Generate a comprehensive PDF report with waste analysis summary,
                        sustainability goals assessment, and CO₂-based recycling recommendations.
                    </p>

                    {/* System analysis progress */}
                    {generating && (
                        <div className="mb-6 bg-[var(--color-surface-alt)] rounded-xl p-4 text-left">
                            {ACTION_MESSAGES.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`flex items-center gap-2 py-1.5 text-xs transition-all duration-300 ${i < generationStep
                                        ? 'text-[var(--color-success)]'
                                        : i === generationStep
                                            ? 'text-[var(--color-brand)] font-medium'
                                            : 'text-[var(--color-text-muted)]'
                                        }`}
                                >
                                    {i < generationStep ? (
                                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                    ) : i === generationStep ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                                    ) : (
                                        <div className="w-3.5 h-3.5 rounded-full border border-[var(--color-border)] shrink-0" />
                                    )}
                                    {msg}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Success message */}
                    {done && (
                        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in-up">
                            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                            <p className="text-sm text-green-700 font-medium">
                                Report generated and downloaded successfully!
                            </p>
                        </div>
                    )}

                    <Suspense fallback={
                        <div className="h-14 w-full flex items-center justify-center bg-gray-50 rounded-2xl animate-pulse text-xs text-gray-400">
                            Loading PDF Engine...
                        </div>
                    }>
                        {readySkus[selectedSku] ? (
                            <ActionPDF
                                records={filteredRecords}
                                insights={readySkus[selectedSku]}
                                sku={selectedSku}
                            />
                        ) : (
                            <button
                                id="btn-generate-report"
                                onClick={() => handleGenerate()}
                                disabled={generating || records.length === 0}
                                className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-white text-sm font-semibold transition-all duration-200 shadow-lg cursor-pointer bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {generating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        Generate Analysis & Report
                                    </>
                                )}
                            </button>
                        )}
                    </Suspense>

                    {records.length === 0 && (
                        <div className="mt-6 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-4 flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-[var(--color-brand)] shrink-0" />
                            <p className="text-xs text-[var(--color-text-secondary)] text-left">
                                No waste records found. Go to the <strong>SKU Workflow</strong> to add your first record, then come back here to generate your report.
                            </p>
                        </div>
                    )}

                    {/* SKU Selection List */}
                    <div className="mt-8 border-t border-[var(--color-border)] pt-8">
                        <div className="flex items-center gap-2 mb-6">
                            <ListIcon className="w-4 h-4 text-[var(--color-brand)]" />
                            <h4 className="text-sm font-bold text-[var(--color-text-primary)] uppercase tracking-wider">
                                SKU Inventory Analysis
                            </h4>
                        </div>

                        <div className="grid gap-3">
                            {/* Global Row */}
                            <div
                                onClick={() => setSelectedSku('all')}
                                className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${selectedSku === 'all'
                                    ? 'bg-orange-50 border-orange-200 shadow-sm'
                                    : 'bg-white border-[var(--color-border)] hover:border-orange-200'
                                    }`}
                            >
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-[var(--color-text-primary)]">Global (All SKUs)</span>
                                    <span className="text-[10px] text-[var(--color-text-secondary)] font-mono">
                                        Total Data: {records.reduce((acc, r) => acc + (r.paper || 0) + (r.plastic || 0) + (r.wet || 0) + (r.organic || 0) + (r.defective || 0), 0).toFixed(1)}kg
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Suspense fallback={<div className="w-10 h-10 bg-gray-50 animate-pulse rounded-lg" />}>
                                        <ActionPDF
                                            variant="icon"
                                            records={records}
                                            insights={readySkus['all'] || getIndustrialInsights(records)}
                                            sku="all"
                                        />
                                    </Suspense>
                                    {!readySkus['all'] && (
                                        <button
                                            disabled={generating && generatingSku === 'all'}
                                            onClick={(e) => { e.stopPropagation(); handleGenerate('all') }}
                                            className="px-4 py-1.5 rounded-lg bg-[var(--color-brand)] text-white text-xs font-bold hover:bg-[var(--color-brand-dark)] transition-all disabled:opacity-50"
                                        >
                                            {generating && generatingSku === 'all' ? 'Analyzing...' : 'Analyze'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {skuList.map(sku => (
                                <div
                                    key={sku}
                                    onClick={() => setSelectedSku(sku)}
                                    className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${selectedSku === sku
                                        ? 'bg-orange-50 border-orange-200 shadow-sm'
                                        : 'bg-white border-[var(--color-border)] hover:border-orange-200'
                                        }`}
                                >
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-[var(--color-text-primary)]">{sku}</span>
                                        <span className="text-[10px] text-[var(--color-text-secondary)] font-mono">
                                            Recorded Weight: {records.filter(r => r.skuId === sku).reduce((acc, r) => acc + (r.paper || 0) + (r.plastic || 0) + (r.wet || 0) + (r.organic || 0) + (r.defective || 0), 0).toFixed(1)}kg
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Suspense fallback={<div className="w-10 h-10 bg-gray-50 animate-pulse rounded-lg" />}>
                                            <ActionPDF
                                                variant="icon"
                                                records={records.filter(r => r.skuId === sku)}
                                                insights={readySkus[sku] || getIndustrialInsights(records.filter(r => r.skuId === sku))}
                                                sku={sku}
                                            />
                                        </Suspense>
                                        {!readySkus[sku] && (
                                            <button
                                                disabled={generating && generatingSku === sku}
                                                onClick={(e) => { e.stopPropagation(); handleGenerate(sku) }}
                                                className="px-4 py-1.5 rounded-lg border border-[var(--color-brand)] text-[var(--color-brand)] text-xs font-bold hover:bg-[var(--color-brand)] hover:text-white transition-all disabled:opacity-50"
                                            >
                                                {generating && generatingSku === sku ? 'Analyzing...' : 'Analyze'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Insight Panel */}
                    {(aiInsight || generating) && (
                        <div className="mt-8 text-left border-t border-[var(--color-border)] pt-8 animate-fade-in">
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp className="w-4 h-4 text-[var(--color-brand)]" />
                                <h4 className="text-sm font-bold text-[var(--color-text-primary)] uppercase tracking-wider">
                                    Instant Industrial Insights
                                </h4>
                            </div>
                            <div className="bg-[var(--color-surface-alt)] p-6 rounded-2xl border border-dashed border-[var(--color-border)]">
                                {aiInsight ? (
                                    <div className="prose prose-sm max-w-none text-[var(--color-text-secondary)] whitespace-pre-wrap leading-relaxed">
                                        {aiInsight}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center py-6">
                                        <Loader2 className="w-6 h-6 text-[var(--color-brand)] animate-spin mb-3" />
                                        <p className="text-xs text-[var(--color-text-muted)] italic">
                                            Generating real-time analysis summary...
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
