import { ChartNoAxesCombined, CircleGauge, LayoutDashboard, Settings2, Split, Wallet, type LucideIcon } from 'lucide-react'

interface NavigationItem {
  id: string
  label: string
  icon: LucideIcon
}

export const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'accounts', label: 'Accounts', icon: Wallet },
  { id: 'account-monitoring', label: 'Account Monitoring', icon: CircleGauge },
  { id: 'distribution', label: 'Distribution', icon: Split },
  { id: 'reports', label: 'Reports', icon: ChartNoAxesCombined },
  { id: 'settings', label: 'Settings', icon: Settings2 },
] as const satisfies readonly NavigationItem[]

export type NavigationId = (typeof navigationItems)[number]['id']

export function getNavigationId(hash: string): NavigationId {
  return navigationItems.find((item) => `#${item.id}` === hash)?.id ?? 'dashboard'
}
