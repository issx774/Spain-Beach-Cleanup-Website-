import { Link } from 'react-router'
import { ArrowRight, Footprints, Wind, Recycle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ContactFooter } from '@/components/ContactFooter'
import { CrossSectionDiagram } from '@/components/TechnicalDrawings'

const pathways = [
  {
    icon: Wind,
    title: 'It blows inland',
    body: 'A sunny afternoon empties a beach. Thermos, wrappers, bottle caps, a lost flip-flop — anything left on the sand is light and dry, and the first onshore breeze pushes it up across the beach, over the dune line and into the marram, the car park and the road behind it.',
  },
  {
    icon: Footprints,
    title: 'It disappears into the sand',
    body: 'A crisp packet pressed into dry sand underfoot is buried by the next few days of wind, and once it is a centimetre down it is invisible. It sits there until a storm strips the beach back and returns it, by then in fragments that are far harder to gather than the whole object was.',
  },
  {
    icon: Recycle,
    title: 'It reaches the tideline and the water takes it',
    body: 'What does make it down the beach meets the tide. Anything that floats is drawn along the shoreline and out, where it arrives at the tideline of some other coast, joins a harbour wall or joins the sea. The sand was the last place it was still cheap to collect.',
  },
]

const steps = [
  {
    n: '01',
    title: 'It stands on the sand, not in the water',
    body: 'The unit is a low mesh fence, installed across the open beach between the dunes and the tideline, set perpendicular to the prevailing onshore wind so it stands across the path litter already takes. The foot is bedded half a metre into the sand and the mesh stands 900 mm clear of it, high enough to walk a length of it without stooping and low enough that a beach wheelchair or a nurdle of dry sand passes under nothing.',
  },
  {
    n: '02',
    title: 'The wind does the collecting',
    body: 'Wind-blown litter and fragments test the aperture the same way the tide tests a boom. The mesh is sized below a bottle cap, which is the smallest common object worth catching, so a cap, a straw or a cigarette filter arriving on the wind with any dimension above the aperture cannot pass the face. It banks along the windward side instead of scattering up to the dunes, and the sand in front of the line stays swept clean by the same wind that is filling it.',
  },
  {
    n: '03',
    title: 'A person empties it, and the count is the point',
    body: 'Anyone who already walks that beach — volunteers, the harbour or a contractor — walks the 1.2 m passage along the leeward side at a fixed height, emptying a known twelve metres of line rather than raking an unknown acre of sand, and records the weight and the dominant categories. Clearing is a few minutes of walking, the tally is a real count rather than an estimate, and the state of the bank tells a town whether the beach is being used more, or littered more, than last year.',
  },
]

export default function Home() {
  return (
    <>
      <main id="main">
        {/* First screen: the structure standing on the sand, with the claim
            beside it. The photograph is the deployed unit on an open beach. */}
        <section className="relative overflow-hidden border-b border-border">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 top-[-6rem] h-[34rem] w-[34rem] rounded-full opacity-60 blur-2xl"
            style={{
              background:
                'radial-gradient(closest-side, color-mix(in oklch, var(--primary-soft) 30%, transparent), transparent)',
            }}
          />
          <div className="relative mx-auto grid w-full max-w-content items-center gap-12 px-gutter py-section lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-layout">
            <div className="max-w-[34rem]">
              <h1 className="text-hero font-semibold">Catch the litter on the sand, not out at sea.</h1>
              <p className="mt-4 max-w-[38ch] text-step-3 text-muted-foreground">
                Visitors leave bottles, wrappers and fragments on the beach. Shoreline builds fixed
                structures that stand on the sand and hold that litter in one place, so it is
                collected on the beach instead of blowing inland or washing out.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild size="lg">
                  <Link to="/design">
                    Read the design &amp; cost
                    <ArrowRight aria-hidden="true" strokeWidth={1.5} className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="#how-it-works">How collection works</a>
                </Button>
              </div>
              <p className="mt-6 max-w-[38ch] text-step--1 text-muted-foreground">
                Standard unit: 12 m of panel on five driven posts, standing 900 mm above the sand and
                bedded 500 mm below it.
              </p>
            </div>

            <figure className="relative lg:-mr-[max(0px,calc((100vw-1200px)/2+3rem))]">
              <img
                src="/images/beach-fence-line.webp"
                width={1536}
                height={1024}
                alt="A fence line standing on open beach sand with plastic bottles, wrappers and dry fragments banked along its base and clean sand in front of it."
                className="aspect-[3/2] w-full rounded-lg object-cover shadow-raised"
              />
              <figcaption className="mt-3 text-step--1 text-muted-foreground">
                A standing line on an open beach. The wind carries the material in, and the line
                holds it where it can be picked up.
              </figcaption>
            </figure>
          </div>
        </section>

        {/* The problem. Two real beach photographs, one argument each. */}
        <section className="bg-card">
          <div className="mx-auto w-full max-w-content px-gutter py-section">
            <div className="max-w-[46rem]">
              <h2 className="text-step-1">Litter left on a beach leaves one of three ways.</h2>
              <p className="mt-4 max-w-measure text-step-3 text-muted-foreground">
                Two of them put it out of reach before anyone picks it up, and the third returns it
                later, in pieces. All three start on the sand, in daylight, at arm's length from
                whoever dropped it.
              </p>
            </div>

            <div className="mt-12 grid gap-layout lg:grid-cols-[minmax(0,4fr)_minmax(0,5fr)] lg:items-start">
              <div className="relative">
                <img
                  src="/images/strandline-litter.webp"
                  width={1536}
                  height={1024}
                  loading="lazy"
                  alt="Bottles, food packaging and fragments caught along the sand at a beach's high tideline beneath the dunes."
                  className="aspect-[3/2] w-full rounded-lg object-cover"
                />
                <img
                  src="/images/hand-gathering-litter.webp"
                  width={1536}
                  height={1024}
                  loading="lazy"
                  alt="A gloved hand lifting a plastic bottle out of wet sand at the edge of the surf."                  className="mt-5 aspect-[16/9] w-full rounded-lg object-cover lg:ml-10 lg:w-[calc(100%-2.5rem)]"
                />
              </div>
              <div className="grid gap-8 lg:gap-10">
                {pathways.map((p) => (
                  <article key={p.title} className="flex gap-4">
                    <p.icon
                      aria-hidden="true"
                      strokeWidth={1.5}
                      className="mt-1 size-5 shrink-0 text-primary-soft"
                    />
                    <div>
                      <h3 className="text-step-3">{p.title}</h3>
                      <p className="mt-1.5 text-sm text-muted-foreground">{p.body}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How the structure works, in three ordered steps. */}
        <section id="how-it-works" className="scroll-mt-24 border-y border-border">
          <div className="mx-auto w-full max-w-content px-gutter py-section">
            <div className="grid gap-layout lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <h2 className="text-step-1">How collection works</h2>
                <p className="mt-4 max-w-[34ch] text-muted-foreground">
                  Three things have to be true at once for a line of mesh to hold a beach's litter
                  instead of frustrating the people clearing it. Each is a design decision, not a
                  feature.
                </p>
                <Button asChild variant="outline" className="mt-6">
                  <Link to="/design">
                    The full specification
                    <ArrowRight aria-hidden="true" strokeWidth={1.5} className="size-4" />
                  </Link>
                </Button>
              </div>

              <ol className="grid gap-0">
                {steps.map((s, i) => (
                  <li
                    key={s.n}
                    className={
                      i === 0
                        ? 'grid gap-4 py-8 sm:grid-cols-[4rem_1fr]'
                        : 'grid gap-4 border-t border-border py-8 sm:grid-cols-[4rem_1fr]'
                    }
                  >
                    <span className="font-display text-step-2 text-primary-soft">{s.n}</span>
                    <div>
                      <h3 className="text-step-2">{s.title}</h3>
                      <p className="max-w-[62ch] text-muted-foreground">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* What a unit is made of, in section. The itemised specification lives on
            /design; this band carries the drawing and the materials, nothing more. */}
        <section className="bg-primary text-primary-foreground">
          <div className="mx-auto grid w-full max-w-content gap-layout px-gutter py-section lg:grid-cols-[minmax(0,3fr)_minmax(0,4fr)] lg:items-center">
            <div>
              <h2 className="text-step-1">What a unit is made of</h2>
              <p className="mt-4 max-w-[38ch] text-primary-foreground/85">
                Weathered coastal timber, hot-dip galvanised steel and a woven mesh, standing on a
                bedded foot. Every part is a stock item, because a beach needs to be able to repair a
                length of line on a Saturday, not wait on us.
              </p>
              <p className="mt-5 max-w-[38ch] text-step--1 text-primary-foreground/70">
                The itemised specification — every post, mesh and aperture — sits on the design page.
              </p>
              <Button asChild variant="secondary" className="mt-7">
                <Link to="/design">
                  See the specification
                  <ArrowRight aria-hidden="true" strokeWidth={1.5} className="size-4" />
                </Link>
              </Button>
            </div>

            <figure className="rounded-lg border border-primary-foreground/25 bg-[color-mix(in_oklch,var(--primary)_70%,black)] p-5 sm:p-6">
              <CrossSectionDiagram tone="dark" className="h-auto w-full" />
              <figcaption className="mt-4 text-step--1 text-primary-foreground/70">
                Section through one unit on the beach: the mesh face standing 900 mm above the sand
                on a foot bedded 500 mm below it, litter banked on the windward side and a clear
                passage on the leeward.
              </figcaption>
            </figure>
          </div>
        </section>

        {/* The objection: no published price and no promised capture rate. */}
        <section>
          <div className="mx-auto w-full max-w-content px-gutter py-section">
            <h2 className="text-step-1">What we will not tell you</h2>
            <p className="mt-4 max-w-[44ch] text-muted-foreground">
              A number quoted before the beach has been walked is a number chosen to sound good.
            </p>
            <div className="mt-10 max-w-measure">
              <p className="max-w-[62ch] font-display text-step-2 text-foreground">
                There is no published price and no headline capture figure, because both depend
                entirely on the site.
              </p>
              <p className="mt-5 text-muted-foreground">
                A twelve-metre line across a sheltered bay with one car park is a different structure
                and a different job from one set into an exposed beach that empties through three
                access points on a hot Sunday, and quoting one number for both would be a number
                designed to sound good rather than to be true.
              </p>
              <p className="mt-4 text-muted-foreground">
                So we survey first. Send us the beach, we walk it at low water, and what comes back is
                a written design, an installation method and a costed maintenance interval —
                itemised, with the assumptions shown, so a parish council or a harbour board can test
                them.
              </p>
              <p className="mt-4 text-muted-foreground">
                The design page carries the specification, the standing depth and every factor that
                moves the figure, with nothing rounded off to look simple.
              </p>
              <Button asChild className="mt-7">
                <Link to="/design">
                  See the design, engineering &amp; cost
                  <ArrowRight aria-hidden="true" strokeWidth={1.5} className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        {/* Separate concept demo: the existing fixed-mesh proposal stays unchanged. */}
        <section className="border-t border-border bg-secondary/60">
          <div className="mx-auto grid w-full max-w-content items-center gap-6 px-gutter py-section md:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] md:gap-layout">
            <div>
              <p className="font-label text-step--2 font-semibold uppercase tracking-[0.12em] text-primary-soft">Interactive prototype</p>
              <h2 className="mt-3 text-step-1">Explore the rover monitoring concept.</h2>
              <p className="mt-4 max-w-[65ch] text-muted-foreground">
                We have also built a separate, interactive concept for monitoring a mobile beach-cleanup rover.
                Drive the simulated vehicle, select litter and watch its battery, collection bin and map update.
                This is a browser demonstration, not a connected rover or a test of the fixed mesh structure.
              </p>
            </div>
            <div className="md:justify-self-end">
              <Button asChild size="lg">
                <Link to="/rover-simulator">
                  Open rover simulator
                  <ArrowRight aria-hidden="true" strokeWidth={1.5} className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <ContactFooter />
    </>
  )
}
