import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { Menu, X } from 'lucide-react'
import { Brand } from '@/components/Brand'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

export const CONTACT_EMAIL = 'hello@shoreline-beach.com'

const links = [
  { to: '/', label: 'Mission' },
  { to: '/design', label: 'Design & cost' },
  { to: '/rover-simulator', label: 'Rover simulator' },
]

/* One sticky bar on both routes: the mark left, the two pages, and the one
   action the whole site repeats. Below 768 the links become a single menu
   button opening a sheet with a visible close. */
export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-card/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-content items-center justify-between gap-4 px-gutter">
        <Link to="/" aria-label="Shoreline, home" className="rounded-md">
          <Brand />
        </Link>

        <nav aria-label="Pages" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      'inline-flex min-h-11 items-center rounded-md px-3 text-sm transition-colors duration-[var(--motion-fast)]',
                      isActive
                        ? 'font-medium text-foreground'
                        : 'text-muted-foreground hover:text-foreground',
                    )
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <a href={`mailto:${CONTACT_EMAIL}`}>Email the team</a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Menu strokeWidth={1.5} />
          </Button>
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-[min(20rem,88vw)] gap-0 p-0">
          <SheetTitle className="sr-only">Pages</SheetTitle>
          <div className="flex h-16 items-center justify-between border-b border-border px-gutter">
            <Brand size="footer" />
            <Button variant="ghost" size="icon" aria-label="Close menu" onClick={() => setOpen(false)}>
              <X strokeWidth={1.5} />
            </Button>
          </div>
          <nav aria-label="Pages" className="p-gutter">
            <ul className="flex flex-col gap-1">
              {links.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex min-h-12 items-center rounded-md px-3 text-step-3',
                      pathname === link.to
                        ? 'bg-secondary font-medium text-foreground'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                    )}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <Button asChild className="mt-6 w-full">
              <a href={`mailto:${CONTACT_EMAIL}`}>Email the team</a>
            </Button>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}
