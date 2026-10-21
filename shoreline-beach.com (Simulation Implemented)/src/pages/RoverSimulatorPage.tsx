import { ContactFooter } from '@/components/ContactFooter'
import { Link } from 'react-router'
import { ArrowLeft, Info } from 'lucide-react'
import RoverSimulator from '@/components/RoverSimulator'

export default function RoverSimulatorPage() {
  return (
    <>
      <main id="main">
        <section className="border-b border-border bg-card">
          <div className="mx-auto w-full max-w-content px-gutter py-12 lg:py-16">
            <Link to="/" className="mb-7 inline-flex items-center gap-2 text-sm text-primary hover:underline underline-offset-4">
              <ArrowLeft aria-hidden="true" className="size-4" strokeWidth={1.5} /> Back to the mission
            </Link>
            <p className="font-label text-step--2 font-semibold uppercase tracking-[0.12em] text-primary-soft">
              Interactive demonstration · Rover concept
            </p>
            <h1 className="mt-3 max-w-[21ch] text-step-1">See how a beach-cleanup rover could be monitored.</h1>
            <p className="mt-5 max-w-[75ch] text-step-3 text-muted-foreground">
              Explore a prototype monitoring dashboard for a future mobile beach-cleanup rover. Move the
              rover across the simulated beach, detect and collect litter, and watch its position,
              battery level, collection bin and activity log respond to what happens.
            </p>
            <div className="mt-6 flex max-w-[75ch] items-start gap-3 rounded-lg border border-border bg-background p-4">
              <Info aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary-soft" strokeWidth={1.7}/>
              <p className="text-sm leading-relaxed text-muted-foreground">
                <strong className="text-foreground">This is a simulation, not live rover data.</strong> The
                map coordinates, sensor detections, movement, trash collection and charging are generated
                in your browser to illustrate how a future operator dashboard might work. It is a
                separate experimental rover concept, not the fixed mesh installation shown on the mission
                and design pages.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span>01 / Click the beach or use WASD to drive manually</span>
              <span>02 / Select highlighted litter to collect it</span>
              <span>03 / Switch to AUTO for a simulated autonomous run</span>
              <span>04 / Use the test controls to trigger dashboard states</span>
            </div>
          </div>
        </section>
        <RoverSimulator />
      </main>
      <ContactFooter />
    </>
  )
}
