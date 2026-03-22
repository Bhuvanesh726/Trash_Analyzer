import { useState } from 'react'
import { Save, RotateCcw } from 'lucide-react'
import WasteIcon from './WasteIcon'

const wasteFields = [
    { key: 'paper', label: 'Paper Waste', unit: 'kg', placeholder: '0.00' },
    { key: 'plastic', label: 'Plastic Waste', unit: 'kg', placeholder: '0.00' },
    { key: 'wet', label: 'Wet Waste', unit: 'kg', placeholder: '0.00' },
    { key: 'organic', label: 'Organic Waste', unit: 'kg', placeholder: '0.00' },
    { key: 'defective', label: 'Defective Waste', unit: 'kg', placeholder: '0.00' },
]

export default function ManualEntryForm({ onSubmit, skuId, disabled = false }) {
    const [values, setValues] = useState({
        paper: '',
        plastic: '',
        wet: '',
        organic: '',
        defective: '',
    })
    const [submitting, setSubmitting] = useState(false)

    const handleChange = (key, val) => {
        setValues((prev) => ({ ...prev, [key]: val }))
    }

    const handleReset = () => {
        setValues({ paper: '', plastic: '', wet: '', organic: '', defective: '' })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)

        const numericData = {}
        for (const field of wasteFields) {
            numericData[field.key] = parseFloat(values[field.key]) || 0
        }

        await onSubmit(numericData)
        setSubmitting(false)
        handleReset()
    }

    const totalWeight = wasteFields.reduce(
        (sum, f) => sum + (parseFloat(values[f.key]) || 0),
        0
    )

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-[var(--color-border)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                {wasteFields.map((field) => (
                    <div key={field.key} className="group">
                        <label
                            htmlFor={`input-${field.key}`}
                            className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-secondary)] mb-2 uppercase tracking-wider"
                        >
                            <WasteIcon type={field.key} size={20} />
                            {field.label}
                        </label>
                        <div className="relative">
                            <input
                                id={`input-${field.key}`}
                                type="number"
                                step="0.01"
                                min="0"
                                value={values[field.key]}
                                onChange={(e) => handleChange(field.key, e.target.value)}
                                placeholder={field.placeholder}
                                className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] text-sm font-medium text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand)] focus:ring-2 focus:ring-orange-100 transition-all duration-200"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--color-text-muted)] font-medium">
                                {field.unit}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Total + Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
                <div className="flex items-center gap-3">
                    <div className="text-sm text-[var(--color-text-secondary)]">
                        Total Weight:{' '}
                        <span className="text-xl font-bold text-[var(--color-brand)]">
                            {totalWeight.toFixed(2)}
                        </span>
                        <span className="text-xs text-[var(--color-text-muted)] ml-1">kg</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        id="btn-reset-form"
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-alt)] transition-all duration-200 cursor-pointer"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Reset
                    </button>
                    <button
                        type="submit"
                        id="btn-save-record"
                        disabled={submitting || disabled || totalWeight === 0}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--color-brand)] text-white text-sm font-semibold hover:bg-[var(--color-brand-dark)] transition-all duration-200 shadow-lg shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        <Save className="w-4 h-4" />
                        {disabled ? 'Saving to Database...' : submitting ? 'Saving...' : 'Save Record'}
                    </button>
                </div>
            </div>
        </form>
    )
}
