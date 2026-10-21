import { cn } from '@/lib/utils'

// The mark: three wave lines in a rounded pebble, standing on their own beside
// the wordmark. The pebble is --radius-panel, the same corner every panel takes,
// so it belongs to the system rather than floating beside it.
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground',
        className,
      )}
    >
      <svg viewBox="0 0 32 32" className="size-6" fill="none" aria-hidden="true">
        <g stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
          <path d="M6 11q5-4 10 0t10 0" />
          <path d="M6 16.5q5-4 10 0t10 0" />
          <path d="M6 22q5-4 10 0t10 0" />
        </g>
      </svg>
    </span>
  )
}

export function Brand({
  className,
  tone = 'default',
  size = 'header',
}: {
  className?: string
  tone?: 'default' | 'inverse'
  size?: 'header' | 'footer'
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <BrandMark className={size === 'footer' ? 'size-8' : undefined} />
      <span
        className={cn(
          'font-display lowercase leading-none tracking-[-0.03em]',
          size === 'footer' ? 'text-xl' : 'text-2xl',
          tone === 'inverse' ? 'text-ink-foreground' : 'text-foreground',
        )}
      >
        shoreline
      </span>
    </span>
  )
}
