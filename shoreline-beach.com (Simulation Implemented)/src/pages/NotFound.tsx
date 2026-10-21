import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BrandMark } from '@/components/Brand'

function NotFound() {
  return (
    <main className="grid min-h-[70vh] place-items-center px-gutter py-24 text-center">
      <div className="max-w-[46ch]">
        <BrandMark className="mx-auto size-12 rounded-xl" />
        <p className="mt-6 font-label text-step--2 font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          404
        </p>
        <h1 className="mt-3 text-step-1">This page does not exist</h1>
        <p className="mt-4 text-muted-foreground">
          The address may be mistyped, or the page may have moved. Both pages of the site are still
          here.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link to="/">
              The mission
              <ArrowRight aria-hidden="true" strokeWidth={1.5} className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/design">Design, engineering &amp; cost</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}

export default NotFound
