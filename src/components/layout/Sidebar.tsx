import { Layers, PanelLeftClose, PanelLeftOpen, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { navigationItems, type NavigationId } from '@/constants/navigation'

interface SidebarProps {
  activeId: NavigationId
  collapsed?: boolean
  onToggle?: () => void
  onNavigate?: () => void
  user?: { name: string; description: string }
}

export function Sidebar({ activeId, collapsed = false, onToggle, onNavigate, user = { name: 'Your profile', description: 'Personal workspace' } }: SidebarProps) {
  return (
    <div className="flex h-full flex-col gap-8 overflow-y-auto p-4">
      <a href="#dashboard" onClick={onNavigate} aria-label="icollect home" className="flex min-h-12 items-center gap-3 rounded-lg px-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white"><Layers size={22} aria-hidden="true" /></span>
        {!collapsed && <span className="text-xl font-semibold tracking-tight">icollect<span className="text-primary">.</span></span>}
      </a>
      <nav aria-label="Main navigation" className="flex-1">
        {!collapsed && <p className="mb-3 px-3 text-[11px] font-semibold tracking-widest text-slate-500 uppercase">Workspace</p>}
        <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
          {navigationItems.map(({ id, label, icon: Icon }) => (
            <li key={id}>
              <a href={`#${id}`} onClick={onNavigate} aria-current={activeId === id ? 'page' : undefined} aria-label={collapsed ? label : undefined} title={collapsed ? label : undefined}
                className={cn('flex min-h-11 items-center gap-3 rounded-lg border-l-[3px] px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary', collapsed && 'justify-center px-0', activeId === id ? 'border-primary bg-sidebar-accent text-primary' : 'border-transparent text-slate-600 hover:bg-sidebar-accent hover:text-sidebar-foreground')}>
                <Icon size={20} className="shrink-0" aria-hidden="true" />
                {!collapsed && <span>{label}</span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="space-y-4 border-t border-sidebar-border pt-4">
        {onToggle && <Button variant="ghost" className="w-full justify-start text-slate-500" onClick={onToggle} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-expanded={!collapsed} title={collapsed ? 'Expand sidebar' : undefined}>
          {collapsed ? <PanelLeftOpen aria-hidden="true" /> : <><PanelLeftClose aria-hidden="true" /><span>Collapse sidebar</span></>}
        </Button>}
        <div className={cn('flex items-center gap-3 px-2 pb-2', collapsed && 'justify-center px-0')} title={collapsed ? user.name : undefined}>
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-primary"><UserRound size={18} aria-hidden="true" /></span>
          <div className={collapsed ? 'sr-only' : 'min-w-0'}><p className="truncate text-sm font-semibold">{user.name}</p><p className="truncate text-xs text-slate-500">{user.description}</p></div>
        </div>
      </div>
    </div>
  )
}
