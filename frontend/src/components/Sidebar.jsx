import {
    LayoutDashboard,
    PackagePlus,
    FileBarChart2,
    Recycle,
    Settings,
    HelpCircle,
} from 'lucide-react'

const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sku', label: 'SKU Workflow', icon: PackagePlus },
    { id: 'reports', label: 'Reports', icon: FileBarChart2 },
]

const bottomItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help', icon: HelpCircle },
]

export default function Sidebar({ activePage, setActivePage }) {
    return (
        <aside className="w-[260px] bg-white border-r border-[var(--color-border)] flex flex-col h-full shrink-0">
            {/* Logo */}
            <div className="px-6 py-6 border-b border-[var(--color-border)]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand-dark)] flex items-center justify-center shadow-lg shadow-orange-200">
                        <Recycle className="w-5 h-5 text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-[var(--color-text-primary)] tracking-tight">
                            Trashilizer
                        </h1>
                        <p className="text-[10px] font-medium text-[var(--color-text-muted)] uppercase tracking-[0.15em]">
                            Waste Management
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4">
                <p className="px-3 mb-2 text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-[0.15em]">
                    Main Menu
                </p>
                <ul className="space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = activePage === item.id
                        return (
                            <li key={item.id}>
                                <button
                                    id={`nav-${item.id}`}
                                    onClick={() => setActivePage(item.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer
                    ${isActive
                                            ? 'bg-[var(--color-brand)] text-white shadow-lg shadow-orange-200'
                                            : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]'
                                        }`}
                                >
                                    <Icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2.5 : 2} />
                                    {item.label}
                                    {isActive && (
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />
                                    )}
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </nav>

            {/* Bottom items */}
            <div className="px-3 pb-4 border-t border-[var(--color-border)] pt-3">
                <ul className="space-y-1">
                    {bottomItems.map((item) => {
                        const Icon = item.icon
                        return (
                            <li key={item.id}>
                                <button
                                    id={`nav-${item.id}`}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-secondary)] transition-all duration-200 cursor-pointer"
                                >
                                    <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
                                    {item.label}
                                </button>
                            </li>
                        )
                    })}
                </ul>

                {/* User card */}
                <div className="mt-3 px-3 py-3 bg-[var(--color-surface-alt)] rounded-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand-light)] flex items-center justify-center text-white text-xs font-bold">
                            OP
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-[var(--color-text-primary)] truncate">
                                Operator
                            </p>
                            <p className="text-[10px] text-[var(--color-text-muted)]">
                                Plant Floor
                            </p>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-[var(--color-success)]" />
                    </div>
                </div>
            </div>
        </aside>
    )
}
