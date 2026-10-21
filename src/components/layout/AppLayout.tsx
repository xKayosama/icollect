import { useEffect, useState, type ReactNode } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sidebar } from '@/components/layout/Sidebar'
import { getNavigationId, navigationItems } from '@/constants/navigation'

import { useTheme } from '@/hooks/use-theme'

export function AppLayout({ children }: { children: ReactNode }) {
  const { theme, toggleTheme } = useTheme()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeId, setActiveId] = useState(() => getNavigationId(window.location.hash))

  useEffect(() => {
    const update = () => {
      if (window.location.hash !== '#main-content') {
        setActiveId(getNavigationId(window.location.hash))
      }
    }
    window.addEventListener('hashchange', update)
    const desktop = window.matchMedia('(min-width: 1024px)')
    const closeOnDesktop = () => { if (desktop.matches) setMobileOpen(false) }
    desktop.addEventListener('change', closeOnDesktop)
    return () => {
      window.removeEventListener('hashchange', update)
      desktop.removeEventListener('change', closeOnDesktop)
    }
  }, [])

  return (
    <div className="app-shell flex min-h-svh bg-background text-sidebar-foreground">
      <a href="#main-content" className="sr-only z-50 rounded-lg bg-sidebar p-3 focus:not-sr-only focus:fixed focus:top-3 focus:left-3">Skip to content</a>
      <aside aria-label="Sidebar" style={{ width: collapsed ? 88 : 264 }} className="sticky top-0 hidden h-svh shrink-0 border-r border-sidebar-border bg-sidebar lg:block">
        <Sidebar activeId={activeId} collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />
      </aside>
      <div className="min-w-0 flex-1">
        <header className="flex h-20 items-center gap-4 border-b border-sidebar-border bg-sidebar px-5 sm:px-8">
          <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
            <Dialog.Trigger render={<Button variant="outline" size="icon" className="lg:hidden" aria-label="Open navigation" />}><Menu aria-hidden="true" /></Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Backdrop className="fixed inset-0 z-40 bg-slate-950/40" />
              <Dialog.Popup className="app-shell fixed inset-y-0 left-0 z-50 w-72 max-w-[90vw] bg-sidebar text-sidebar-foreground shadow-xl outline-none">
                <Dialog.Title className="sr-only">Navigation</Dialog.Title>
                <Dialog.Description className="sr-only">Navigate your icollect workspace.</Dialog.Description>
                <Dialog.Close render={<Button variant="ghost" size="icon" className="absolute top-2 right-2" aria-label="Close navigation" />}><X aria-hidden="true" /></Dialog.Close>
                <Sidebar activeId={activeId} onNavigate={() => setMobileOpen(false)} />
              </Dialog.Popup>
            </Dialog.Portal>
          </Dialog.Root>
          <div><p className="text-xs text-muted-foreground">Your shared expenses, organized</p><p className="text-lg font-semibold">{navigationItems.find((item) => item.id === activeId)?.label}</p></div>
          <Button variant="outline" size="icon" className="ml-auto" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
            {theme === 'dark' ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
          </Button>
        </header>
        <main id="main-content" tabIndex={-1} className="min-w-0 p-4 outline-none sm:p-8">{children}</main>
      </div>
    </div>
  )
}
