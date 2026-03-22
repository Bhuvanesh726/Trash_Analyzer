import { useMemo } from 'react'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
    AreaChart, Area,
} from 'recharts'
import {
    TrendingUp, Package, Leaf, Scale, Recycle, AlertTriangle,
    Loader2, WifiOff, BarChart3, PieChart as PieChartIcon,
} from 'lucide-react'
import WasteIcon from './WasteIcon'

const WASTE_COLORS = {
    paper: '#FF6B00',
    plastic: '#3B82F6',
    wet: '#06B6D4',
    organic: '#10B981',
    defective: '#EF4444',
}

const WASTE_LABELS = {
    paper: 'Paper',
    plastic: 'Plastic',
    wet: 'Wet',
    organic: 'Organic',
    defective: 'Defective',
}

function StatCard({ icon: Icon, label, value, unit, color, delay }) {
    return (
        <div
            className="bg-white rounded-2xl p-5 border border-[var(--color-border)] hover:shadow-lg hover:shadow-orange-50 transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex items-start justify-between mb-3">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${color}15` }}
                >
                    <Icon className="w-5 h-5" style={{ color }} strokeWidth={2} />
                </div>
                <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-green-50 text-green-600 uppercase tracking-wider">
                    Live
                </span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                {value}
                <span className="text-sm font-medium text-[var(--color-text-muted)] ml-1">{unit}</span>
            </p>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">{label}</p>
        </div>
    )
}

function ChartCard({ title, children, className = '' }) {
    return (
        <div className={`bg-white rounded-2xl p-6 border border-[var(--color-border)] ${className}`}>
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                <div className="w-1 h-4 rounded-full bg-[var(--color-brand)]" />
                {title}
            </h3>
            {children}
        </div>
    )
}

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload) return null
    return (
        <div className="bg-white/95 backdrop-blur-md p-3 rounded-xl border border-[var(--color-border)] shadow-xl">
            <p className="text-xs font-semibold text-[var(--color-text-primary)] mb-1">{label}</p>
            {payload.map((entry, index) => (
                <p key={index} className="text-xs text-[var(--color-text-secondary)]">
                    <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: entry.color }} />
                    {entry.name}: <span className="font-semibold">{entry.value} kg</span>
                </p>
            ))}
        </div>
    )
}

function EmptyChartState({ icon: Icon, message }) {
    return (
        <div className="flex flex-col items-center justify-center h-[280px] text-center">
            <div className="w-14 h-14 rounded-2xl bg-[var(--color-surface-alt)] flex items-center justify-center mb-3">
                <Icon className="w-7 h-7 text-[var(--color-text-muted)]" strokeWidth={1.5} />
            </div>
            <p className="text-sm text-[var(--color-text-muted)] max-w-[200px]">
                {message}
            </p>
        </div>
    )
}

export default function Dashboard({ records, loading, error, onRetry }) {
    const stats = useMemo(() => {
        const totals = { paper: 0, plastic: 0, wet: 0, organic: 0, defective: 0 }
        records.forEach((r) => {
            totals.paper += r.paper || 0
            totals.plastic += r.plastic || 0
            totals.wet += r.wet || 0
            totals.organic += r.organic || 0
            totals.defective += r.defective || 0
        })
        const totalWeight = Object.values(totals).reduce((a, b) => a + b, 0)
        const recyclable = totals.paper + totals.plastic
        const sustainabilityScore = totalWeight > 0
            ? Math.min(100, Math.round((recyclable / totalWeight) * 100 * 1.2))
            : 0
        return { totals, totalWeight, recyclable, sustainabilityScore }
    }, [records])

    const barData = useMemo(() => {
        if (records.length === 0) return []
        return records.slice(-7).map((r, i) => ({
            day: r.skuId || `Entry ${i + 1}`,
            Paper: r.paper || 0,
            Plastic: r.plastic || 0,
            Wet: r.wet || 0,
            Organic: r.organic || 0,
            Defective: r.defective || 0,
        }))
    }, [records])

    const pieData = useMemo(() => {
        if (stats.totalWeight === 0) return []
        return Object.entries(stats.totals).map(([key, val]) => ({
            name: WASTE_LABELS[key],
            value: parseFloat(val.toFixed(1)),
        }))
    }, [stats])

    const trendData = useMemo(() => {
        if (records.length === 0) return []
        let cumulative = 0
        return records.map((r, i) => {
            const total = (r.paper || 0) + (r.plastic || 0) + (r.wet || 0) + (r.organic || 0) + (r.defective || 0)
            cumulative += total
            return { time: `#${i + 1}`, weight: parseFloat(cumulative.toFixed(1)) }
        })
    }, [records])

    // Loading state
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <Loader2 className="w-10 h-10 text-[var(--color-brand)] animate-spin mb-4" />
                <p className="text-sm text-[var(--color-text-secondary)]">Loading dashboard data...</p>
            </div>
        )
    }

    // Error state
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
                    <WifiOff className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">Connection Error</h3>
                <p className="text-sm text-[var(--color-text-secondary)] mb-4 text-center max-w-md">{error}</p>
                <button
                    onClick={onRetry}
                    className="px-5 py-2.5 rounded-xl bg-[var(--color-brand)] text-white text-sm font-semibold hover:bg-[var(--color-brand-dark)] transition-all duration-200 shadow-lg shadow-orange-200 cursor-pointer"
                >
                    Retry Connection
                </button>
            </div>
        )
    }

    const hasData = records.length > 0

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">
                            Operations Dashboard
                        </h2>
                        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                            Real-time waste segregation monitoring · Plant Floor Analytics
                        </p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-[var(--color-border)]">
                        <div className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
                        <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                            System Online
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    icon={Scale}
                    label="Total Weight Collected"
                    value={hasData ? stats.totalWeight.toFixed(1) : '0.0'}
                    unit="kg"
                    color="#FF6B00"
                    delay={0}
                />
                <StatCard
                    icon={Package}
                    label="Total Items Processed"
                    value={records.length}
                    unit="SKUs"
                    color="#3B82F6"
                    delay={100}
                />
                <StatCard
                    icon={Recycle}
                    label="Recyclable Waste"
                    value={hasData ? stats.recyclable.toFixed(1) : '0.0'}
                    unit="kg"
                    color="#10B981"
                    delay={200}
                />
                <StatCard
                    icon={Leaf}
                    label="Sustainability Score"
                    value={stats.sustainabilityScore}
                    unit="/100"
                    color="#8B5CF6"
                    delay={300}
                />
            </div>

            {/* Waste Category Breakdown */}
            <div className="grid grid-cols-5 gap-3 mb-6">
                {Object.entries(WASTE_LABELS).map(([key, label]) => {
                    const val = hasData ? stats.totals[key].toFixed(1) : '0.0'
                    return (
                        <div
                            key={key}
                            className="bg-white rounded-xl p-4 border border-[var(--color-border)] flex items-center gap-3 hover:shadow-md hover:shadow-orange-50 transition-all duration-200"
                        >
                            <WasteIcon type={key} size={32} />
                            <div>
                                <p className="text-xs text-[var(--color-text-muted)] font-medium">{label}</p>
                                <p className="text-lg font-bold" style={{ color: WASTE_COLORS[key] }}>
                                    {val} <span className="text-[10px] font-medium text-[var(--color-text-muted)]">kg</span>
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Empty state banner */}
            {!hasData && (
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-6 mb-6 text-center animate-fade-in-up">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-white flex items-center justify-center mb-3 shadow-sm">
                        <AlertTriangle className="w-7 h-7 text-[var(--color-brand)]" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-1">No Data Yet</h3>
                    <p className="text-sm text-[var(--color-text-secondary)] max-w-md mx-auto">
                        Start tracking waste by going to the <strong>SKU Workflow</strong> page and adding your first production record.
                        All charts and metrics will populate automatically.
                    </p>
                </div>
            )}

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <ChartCard title="Daily Collection (Bar)" className="lg:col-span-2">
                    {barData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={barData} barCategoryGap="20%">
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} unit=" kg" />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="Paper" fill={WASTE_COLORS.paper} radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Plastic" fill={WASTE_COLORS.plastic} radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Wet" fill={WASTE_COLORS.wet} radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Organic" fill={WASTE_COLORS.organic} radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Defective" fill={WASTE_COLORS.defective} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <EmptyChartState icon={BarChart3} message="Add waste records to see daily collection data visualized here." />
                    )}
                </ChartCard>

                <ChartCard title="Waste Distribution (Pie)">
                    {pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="45%"
                                    innerRadius={55}
                                    outerRadius={85}
                                    paddingAngle={3}
                                    dataKey="value"
                                    strokeWidth={2}
                                    stroke="#fff"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell
                                            key={index}
                                            fill={Object.values(WASTE_COLORS)[index]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    verticalAlign="bottom"
                                    iconType="circle"
                                    iconSize={8}
                                    wrapperStyle={{ fontSize: '11px', color: '#6B7280' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <EmptyChartState icon={PieChartIcon} message="Waste distribution will appear once records are added." />
                    )}
                </ChartCard>
            </div>

            {/* Trend Chart */}
            <ChartCard title="Cumulative Weight Trend">
                {trendData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#FF6B00" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} unit=" kg" />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="weight"
                                stroke="#FF6B00"
                                strokeWidth={2.5}
                                fill="url(#colorWeight)"
                                name="Cumulative"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-[200px]">
                        <p className="text-sm text-[var(--color-text-muted)]">
                            Trend data will appear after adding waste records.
                        </p>
                    </div>
                )}
            </ChartCard>
        </div>
    )
}
