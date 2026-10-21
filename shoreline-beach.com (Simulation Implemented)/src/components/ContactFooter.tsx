import { Link } from 'react-router'
import { Mail, ArrowUpRight } from 'lucide-react'
import { Brand } from '@/components/Brand'
import { CONTACT_EMAIL } from '@/components/SiteHeader'
import { PhotoCredits } from '@/components/PhotoCredits'
import { cn } from '@/lib/utils'

/* The only footer the site has, and the only call to action it repeats. No
   copyright line, no social row: the two routes it points at and one address. */
export function ContactFooter({ className }: { className?: string }) {
  return (
    <footer className={cn('border-t border-border bg-card', className)}>
      <div className="mx-auto w-full max-w-content px-gutter py-12">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div className="max-w-[42ch]">
            <p className="font-label text-step--2 font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              Get in touch
            </p>
            <h2 className="mt-3 text-step-2">Tell us about your shoreline.</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Send the beach, the prevailing wind and roughly how much litter is left on it each
              summer. Every site is surveyed before a unit is quoted, so that is the useful first
              step.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-md font-display text-step-3 text-primary underline decoration-border decoration-1 underline-offset-4 transition-colors duration-[var(--motion-fast)] hover:decoration-primary"
            >
              <Mail aria-hidden="true" strokeWidth={1.5} className="size-5" />
              {CONTACT_EMAIL}
            </a>
          </div>

          <nav aria-label="Pages" className="flex flex-col gap-2 md:items-end">
            <Link
              to="/"
              className="inline-flex min-h-11 items-center gap-1.5 text-sm text-muted-foreground transition-colors duration-[var(--motion-fast)] hover:text-foreground"
            >
              The mission
              <ArrowUpRight aria-hidden="true" strokeWidth={1.5} className="size-4" />
            </Link>
            <Link
              to="/design"
              className="inline-flex min-h-11 items-center gap-1.5 text-sm text-muted-foreground transition-colors duration-[var(--motion-fast)] hover:text-foreground"
            >
              Design, engineering &amp; cost
              <ArrowUpRight aria-hidden="true" strokeWidth={1.5} className="size-4" />
            </Link>
            <Link
              to="/rover-simulator"
              className="inline-flex min-h-11 items-center gap-1.5 text-sm text-muted-foreground transition-colors duration-[var(--motion-fast)] hover:text-foreground"
            >
              Rover simulator
              <ArrowUpRight aria-hidden="true" strokeWidth={1.5} className="size-4" />
            </Link>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Brand size="footer" />
          <PhotoCredits className="text-step--2 text-muted-foreground [&_a]:underline [&_a]:underline-offset-2" />
        </div>
      </div>
    </footer>
  )
}
