import { FileText, Droplets, Recycle, Leaf, AlertTriangle } from 'lucide-react'

const iconMap = {
    paper: {
        icon: FileText,
        bg: '#FFF3E6',
        fg: '#FF6B00',
    },
    plastic: {
        icon: Recycle,
        bg: '#EFF6FF',
        fg: '#3B82F6',
    },
    wet: {
        icon: Droplets,
        bg: '#ECFEFF',
        fg: '#06B6D4',
    },
    organic: {
        icon: Leaf,
        bg: '#ECFDF5',
        fg: '#10B981',
    },
    defective: {
        icon: AlertTriangle,
        bg: '#FEF2F2',
        fg: '#EF4444',
    },
}

export default function WasteIcon({ type, size = 24 }) {
    const config = iconMap[type]
    if (!config) return null
    const Icon = config.icon
    const containerSize = size + 12

    return (
        <div
            className="rounded-xl flex items-center justify-center shrink-0"
            style={{
                width: containerSize,
                height: containerSize,
                backgroundColor: config.bg,
            }}
        >
            <Icon
                style={{ color: config.fg, width: size * 0.55, height: size * 0.55 }}
                strokeWidth={2}
            />
        </div>
    )
}
