import { useState, useEffect, useRef } from 'react'
import {
    PackagePlus, Play, AlertCircle, CheckCircle2, Loader2,
    Radio, Wifi, WifiOff, Server, ArrowRight, RotateCw,
} from 'lucide-react'
import ManualEntryForm from './ManualEntryForm'
import { createWasteRecord, fetchAllRecords, deleteWasteRecord, updateWasteRecord } from '../services/api'
import { Edit2, Trash2, Save, X } from 'lucide-react'

const LOADING_MESSAGES = [
    'Establishing ROS 2 Humble bridge connection...',
    'Authenticating with UR5e/UR10e control unit...',
    'Syncing conveyor belt telemetry data...',
    'Reading segregation bin weight sensors...',
    'Validating checksum from PLC registers...',
    'Querying machine vision classification model...',
]

function LoadingAnimation({ progress, currentMessage }) {
    return (
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 overflow-hidden">
            {/* Scan line effect */}
            <div
                className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-brand)] to-transparent opacity-70 animate-scan-line"
            />

            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 rounded-full bg-[var(--color-brand)] opacity-30 animate-float-particle"
                        style={{
                            left: `${15 + i * 15}%`,
                            top: `${20 + (i % 3) * 25}%`,
                            animationDelay: `${i * 0.5}s`,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="relative">
                        <Server className="w-8 h-8 text-[var(--color-brand)]" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[var(--color-brand)] animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg">Machine Data Syncing</h3>
                        <p className="text-gray-400 text-xs">Industrial Protocol · ROS 2 Bridge</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <Radio className="w-4 h-4 text-[var(--color-brand)] animate-pulse" />
                        <span className="text-[var(--color-brand)] text-xs font-mono font-bold">
                            {progress}%
                        </span>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 bg-gray-700 rounded-full mb-4 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-[var(--color-brand-dark)] to-[var(--color-brand)] rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Status message */}
                <div className="flex items-center gap-2 bg-gray-800/60 rounded-xl px-4 py-3 border border-gray-700/50">
                    <Loader2 className="w-4 h-4 text-[var(--color-brand)] animate-spin" />
                    <span className="text-sm text-gray-300 font-mono">{currentMessage}</span>
                </div>

                {/* Connection indicators */}
                <div className="mt-4 grid grid-cols-3 gap-2">
                    {['PLC Link', 'Vision AI', 'Bin Sensors'].map((label, i) => (
                        <div key={label} className="flex items-center gap-1.5 text-xs text-gray-500">
                            <div
                                className={`w-1.5 h-1.5 rounded-full ${progress > (i + 1) * 25 ? 'bg-[var(--color-brand)]' : 'bg-gray-600'
                                    }`}
                            />
                            {label}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function ErrorMessage({ onRetry, onManualEntry }) {
    return (
        <div className="bg-white rounded-2xl border-2 border-red-100 p-8 animate-fade-in-up">
            <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 flex items-center justify-center mb-4">
                    <WifiOff className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
                    Connection Failed
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] max-w-md mx-auto">
                    Could not fetch data from <span className="font-mono text-red-500 bg-red-50 px-1.5 py-0.5 rounded">ROS2 Bridge</span>.
                    The UR5e/UR10e robotic arm may be offline or the network bridge is unreachable.
                </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-sm font-semibold text-amber-800">Fail-Safe Protocol Activated</p>
                        <p className="text-xs text-amber-600 mt-1">
                            As per Pharma Supply Chain SOP, when the ROS 2 Humble bridge loses connectivity,
                            manual audit entry is mandated to ensure zero data loss.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 justify-center">
                <button
                    id="btn-retry-connection"
                    onClick={onRetry}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--color-border)] text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-alt)] transition-all duration-200 cursor-pointer"
                >
                    <RotateCw className="w-4 h-4" />
                    Retry Connection
                </button>
                <button
                    id="btn-manual-entry"
                    onClick={onManualEntry}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-brand)] text-white text-sm font-semibold hover:bg-[var(--color-brand-dark)] transition-all duration-200 shadow-lg shadow-orange-200 cursor-pointer"
                >
                    <ArrowRight className="w-4 h-4" />
                    Manual Audit Entry
                </button>
            </div>
        </div>
    )
}

export default function SKUWorkflow({ onRecordAdded }) {
    const [skuId, setSkuId] = useState('')
    const [phase, setPhase] = useState('input') // input | loading | error | manual | saving | success
    const [progress, setProgress] = useState(0)
    const [messageIndex, setMessageIndex] = useState(0)
    const [saveError, setSaveError] = useState(null)
    const [records, setRecords] = useState([])
    const [editingId, setEditingId] = useState(null)
    const [editValues, setEditValues] = useState({})
    const intervalRef = useRef(null)

    useEffect(() => {
        loadRecords()
    }, [])

    const loadRecords = async () => {
        try {
            const data = await fetchAllRecords()
            setRecords(data)
        } catch (err) {
            console.error('Failed to load records:', err)
        }
    }

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [])

    const startCollection = () => {
        if (!skuId.trim()) return
        setPhase('loading')
        setProgress(0)
        setMessageIndex(0)

        const duration = 6000
        const intervalMs = 100
        const steps = duration / intervalMs
        let currentStep = 0

        intervalRef.current = setInterval(() => {
            currentStep++
            const newProgress = Math.min(99, Math.round((currentStep / steps) * 100))
            setProgress(newProgress)
            setMessageIndex(Math.min(LOADING_MESSAGES.length - 1, Math.floor((currentStep / steps) * LOADING_MESSAGES.length)))

            if (currentStep >= steps) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
                setPhase('error')
            }
        }, intervalMs)
    }

    const handleRetry = () => {
        setPhase('loading')
        setProgress(0)
        setMessageIndex(0)

        const duration = 6000
        const intervalMs = 100
        const steps = duration / intervalMs
        let currentStep = 0

        intervalRef.current = setInterval(() => {
            currentStep++
            const newProgress = Math.min(99, Math.round((currentStep / steps) * 100))
            setProgress(newProgress)
            setMessageIndex(Math.min(LOADING_MESSAGES.length - 1, Math.floor((currentStep / steps) * LOADING_MESSAGES.length)))

            if (currentStep >= steps) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
                setPhase('error')
            }
        }, intervalMs)
    }

    const handleManualEntry = () => {
        setPhase('manual')
        setSaveError(null)
    }

    const handleFormSubmit = async (formData) => {
        setPhase('saving')
        setSaveError(null)

        try {
            await createWasteRecord({
                skuId,
                paper: formData.paper,
                plastic: formData.plastic,
                wet: formData.wet,
                organic: formData.organic,
                defective: formData.defective,
            })

            // Refresh local list
            loadRecords()

            // Notify parent to refresh data from backend
            onRecordAdded()

            setPhase('success')
            setTimeout(() => {
                setPhase('input')
                setSkuId('')
            }, 2500)
        } catch (err) {
            console.error('Failed to save record:', err)
            setSaveError('Failed to save record to the database. Please check your backend connection and try again.')
            setPhase('manual')
        }
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">
                    SKU Production Workflow
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                    Add current product to waste tracking pipeline
                </p>
            </div>

            {/* SKU Input */}
            {(phase === 'input' || phase === 'loading' || phase === 'error') && (
                <div className="bg-white rounded-2xl p-6 border border-[var(--color-border)] mb-6 animate-fade-in-up">
                    <div className="flex items-center gap-2 mb-4">
                        <PackagePlus className="w-5 h-5 text-[var(--color-brand)]" />
                        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                            Add Current Product
                        </h3>
                    </div>
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <input
                                id="input-sku-id"
                                type="text"
                                value={skuId}
                                onChange={(e) => setSkuId(e.target.value)}
                                placeholder="Enter SKU ID (e.g., PHARMA-2026-001)"
                                disabled={phase !== 'input'}
                                className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] text-sm font-medium placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)] focus:ring-2 focus:ring-orange-100 transition-all duration-200 disabled:opacity-50 disabled:bg-[var(--color-surface-alt)]"
                            />
                        </div>
                        <button
                            id="btn-start-collection"
                            onClick={startCollection}
                            disabled={phase !== 'input' || !skuId.trim()}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-brand)] text-white text-sm font-semibold hover:bg-[var(--color-brand-dark)] transition-all duration-200 shadow-lg shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            <Play className="w-4 h-4" />
                            Start Collection
                        </button>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {phase === 'loading' && (
                <LoadingAnimation progress={progress} currentMessage={LOADING_MESSAGES[messageIndex]} />
            )}

            {/* Error State */}
            {phase === 'error' && (
                <ErrorMessage onRetry={handleRetry} onManualEntry={handleManualEntry} />
            )}

            {/* Manual Entry */}
            {(phase === 'manual' || phase === 'saving') && (
                <div className="animate-fade-in-up">
                    <div className="flex items-center gap-3 mb-6 bg-white rounded-xl px-4 py-3 border border-[var(--color-border)]">
                        <CheckCircle2 className="w-5 h-5 text-[var(--color-brand)]" />
                        <div>
                            <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                                Manual Audit Entry for SKU: <span className="text-[var(--color-brand)] font-mono">{skuId}</span>
                            </p>
                            <p className="text-xs text-[var(--color-text-muted)]">
                                Enter the segregated waste weights from the bin scale readings
                            </p>
                        </div>
                    </div>

                    {/* Save error message */}
                    {saveError && (
                        <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in-up">
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                            <p className="text-sm text-red-700">{saveError}</p>
                        </div>
                    )}

                    <ManualEntryForm
                        onSubmit={handleFormSubmit}
                        skuId={skuId}
                        disabled={phase === 'saving'}
                    />
                </div>
            )}

            {/* Success State */}
            {phase === 'success' && (
                <div className="bg-white rounded-2xl p-8 border-2 border-green-200 text-center animate-fade-in-up">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-green-50 flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
                        Record Saved Successfully
                    </h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                        Waste data for SKU <span className="font-mono text-[var(--color-brand)] font-semibold">{skuId}</span> has been saved to the database.
                    </p>
                </div>
            )}

            {/* Saved Records Table */}
            <div className="mt-12">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                            <Server className="w-5 h-5 text-[var(--color-brand)]" />
                        </div>
                        <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
                            Saved Waste Audit Records
                        </h3>
                    </div>
                    <div className="text-xs font-mono text-[var(--color-text-muted)] bg-[var(--color-surface-alt)] px-3 py-1 rounded-full border border-[var(--color-border)]">
                        PERSISTENCE: MySQL @3306
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--color-surface-alt)] border-b border-[var(--color-border)]">
                                <th className="px-6 py-4 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">SKU ID</th>
                                <th className="px-4 py-4 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Paper</th>
                                <th className="px-4 py-4 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Plastic</th>
                                <th className="px-4 py-4 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Wet</th>
                                <th className="px-4 py-4 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Organic</th>
                                <th className="px-4 py-4 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Defective</th>
                                <th className="px-6 py-4 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border)]">
                            {records.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-sm text-[var(--color-text-muted)] italic">
                                        No records found in the database. Add a SKU above to begin.
                                    </td>
                                </tr>
                            ) : (
                                records.map((record) => (
                                    <tr key={record.id} className="hover:bg-orange-50/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-mono font-bold text-[var(--color-brand)]">
                                                {record.skuId}
                                            </span>
                                        </td>
                                        {['paper', 'plastic', 'wet', 'organic', 'defective'].map((field) => (
                                            <td key={field} className="px-4 py-4">
                                                {editingId === record.id ? (
                                                    <input
                                                        type="number"
                                                        value={editValues[field]}
                                                        onChange={(e) => setEditValues({ ...editValues, [field]: parseFloat(e.target.value) || 0 })}
                                                        className="w-16 px-2 py-1 rounded border border-[var(--color-border)] text-xs focus:border-[var(--color-brand)] outline-none"
                                                    />
                                                ) : (
                                                    <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                                                        {record[field]?.toFixed(1)} <span className="text-[10px] text-[var(--color-text-muted)]">kg</span>
                                                    </span>
                                                )}
                                            </td>
                                        ))}
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {editingId === record.id ? (
                                                    <>
                                                        <button
                                                            onClick={async () => {
                                                                await updateWasteRecord(record.id, { ...record, ...editValues })
                                                                setEditingId(null)
                                                                loadRecords()
                                                                onRecordAdded()
                                                            }}
                                                            className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all"
                                                            title="Save"
                                                        >
                                                            <Save className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingId(null)}
                                                            className="p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:bg-gray-200 transition-all"
                                                            title="Cancel"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                setEditingId(record.id)
                                                                setEditValues({
                                                                    paper: record.paper,
                                                                    plastic: record.plastic,
                                                                    wet: record.wet,
                                                                    organic: record.organic,
                                                                    defective: record.defective
                                                                })
                                                            }}
                                                            className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-brand)] hover:text-white transition-all"
                                                            title="Edit"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={async () => {
                                                                if (window.confirm('Delete this record permanently?')) {
                                                                    await deleteWasteRecord(record.id)
                                                                    loadRecords()
                                                                    onRecordAdded()
                                                                }
                                                            }}
                                                            className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-red-500 hover:text-white transition-all"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
