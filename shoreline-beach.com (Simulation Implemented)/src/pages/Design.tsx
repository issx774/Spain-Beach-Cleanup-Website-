import { ArrowRight, Mail, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ContactFooter } from '@/components/ContactFooter'
import { CONTACT_EMAIL } from '@/components/SiteHeader'
import { AlongBeachDrawing, CrossSectionDiagram, PlanDiagram } from '@/components/TechnicalDrawings'

const stages = [
  {
    n: '01',
    title: 'Survey the beach and the wind',
    body: 'A walk of the beach with the town or the site owner, to establish which way litter actually moves: the prevailing onshore wind direction, the busiest access points, the dune line, and where material already accumulates. We note what the beach is made of — sand, shingle or a mix — and where the foot will hold, which decides the anchorage rather than the panel. Roughly half a day per site on foot.',
  },
  {
    n: '02',
    title: 'Set the run and the standing height',
    body: 'We fix the direction and length of the run perpendicular to the prevailing wind and along the line the litter already travels, then set how deep the foot is bedded and how high the mesh stands above the sand. The standing height has to clear a person walking and clearing it, and sit low enough that litter does not simply blow over the top. These two decisions decide most of a unit’s effectiveness, and neither of them is the mesh.',
  },
  {
    n: '03',
    title: 'Install in field-spliceable sections',
    body: 'Posts are driven, or set into pre-drilled holes in shingle, at the surveyed centres along the beach, and the mesh is tensioned between them on site rather than arriving as a fabricated frame. A unit goes in with a tracked machine or a post driver and a crew of three, on the dry beach between tides, without a crane or a beach closure.',
  },
  {
    n: '04',
    title: 'Clear, monitor and hand over',
    body: 'Whoever already walks the beach empties the windward face along the 1.2 m passage and records the weight and the dominant categories. The mesh, top rail and any damaged post are replaceable in the field, and the survey gives a maintenance interval in weeks or months. Shoreline supplies the log format and reviews the tallies.',
  },
]

const costFactors = [
  {
    title: 'Run length, derived from the beach and the wind',
    body: 'Cost follows the metres of panel, not a whole-unit multiple. A wide beach with several access points may need several units set across it; a short cove may need one. Unit count is set at survey, not sold up front.',
  },
  {
    title: 'Wind exposure and sand movement',
    body: 'A beach facing the prevailing wind receives more material and moves more sand than a sheltered one, which means a deeper bedded foot, heavier posts and a more frequent clearing interval. Exposure does more to the number than length does.',
  },
  {
    title: 'The beach material and the footing',
    body: 'Driven posts in sand are one line of cost. Shingle, a hard rocky beach or a dune with a buried soil layer are another, and may need a different machine on the day. All of it is surveyed before anything is quoted.',
  },
  {
    title: 'Timber, steel and mesh specification',
    body: 'Marine-grade timber, hot-dip galvanising and stainless fixings all move with supply, and the mesh is a woven stock fabric rather than a moulded panel. We spec the durable grade rather than the cheap one, and we show the line item so the choice between the two is yours and not ours.',
  },
  {
    title: 'Access to the beach',
    body: 'A beach a tracked machine can reach from a slipway costs less to install than one reached only by a footpath, a boat or a vehicle permit window, and the two installation methods are not interchangeable. Access is the difference between a one-day job and a longer one.',
  },
  {
    title: 'Installation method',
    body: 'Driven on the sand, pre-drilled into shingle, or hand-driven on a small job. The method is chosen at survey and costed as its own line, not absorbed into a unit price.',
  },
  {
    title: 'Clearing labour',
    body: 'Clearing a fixed line is a few minutes of walking where the town already walks. Cost is volunteer time where a group is in place, and a contracted interval where it is not.',
  },
  {
    title: 'Monitoring and replacement',
    body: 'Periodic tallies, plus a maintenance allowance for mesh, top rail and bedding. Reasonable to budget as an annual percentage of installation, with the percentage set once the site’s exposure is known.',
  },
]

const risks = [
  {
    title: 'The site might not suit a fixed line',
    body: 'Where litter arrives from a creek mouth or a road rather than across the beach, or the sand is too deep for the foot to hold, a fixed structure is the wrong answer. The survey will say so, and it will say so before the build rather than after.',
  },
  {
    title: 'A line left uncleared becomes part of the problem',
    body: 'A unit nobody empties loses its bank to the next gale and holds nothing. That is why the clearing interval and the named clearing party are prepared at survey, agreed in writing, and reviewed at the first annual check alongside the tallies.',
  },
]

export default function Design() {
  return (
    <>
      <main id="main">
        {/* Opening: the dimensioned run is the visual centrepiece here — the
            same drawing language the sorting section continues. */}
        <section className="border-b border-border bg-card">
          <div className="mx-auto w-full max-w-content px-gutter py-16 lg:py-20">
            <div className="grid items-center gap-layout lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
              <div>
                <h1 className="text-step-1">The structure, its engineering and its cost</h1>
                <p className="mt-4 max-w-measure text-step-3 text-muted-foreground">
                  One standard unit is 12 m of mesh standing 900 mm clear of the sand on five posts at
                  2.4 m centres, with the foot bedded 500 mm below the surface and two of the five
                  posts anchor-rigged.
                </p>
                <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 sm:max-w-[30rem]">
                  {[
                    ['Panel length', '12 m'],
                    ['Mesh above sand', '900 mm'],
                    ['Posts', 'Five, 2.4 m centres'],
                    ['Footing depth', '500 mm below sand'],
                  ].map(([term, value]) => (
                    <div key={term} className="border-t border-border pt-3">
                      <dt className="font-label text-step--2 font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                        {term}
                      </dt>
                      <dd className="mt-1 font-display text-step-3">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="rounded-lg border border-border bg-background p-5 sm:p-8">
                <AlongBeachDrawing className="h-auto w-full" />
              </div>
            </div>
          </div>
        </section>

        {/* The specification sheet: genuine tabular content, so a table. */}
        <section className="border-b border-border">
          <div className="mx-auto w-full max-w-content px-gutter py-section">
            <h2 className="text-step-1">Specification sheet</h2>
            <p className="mt-4 max-w-measure text-muted-foreground">
              One standard unit. The last four rows are set per site at survey rather than fixed.
            </p>

            <div
              role="group"
              aria-label="Specification sheet, scrollable"
              tabIndex={0}
              className="mt-8 overflow-x-auto rounded-lg border border-border bg-card"
            >
              <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
                <caption className="sr-only">
                  Fabrication and footing specification for one standard Shoreline unit
                </caption>
                <thead>
                  <tr className="border-b border-border">
                    {['Element', 'Specification', 'Why it is that size'].map((h) => (
                      <th
                        key={h}
                        scope="col"
                        className="px-5 py-4 font-label text-step--2 font-semibold uppercase tracking-[0.1em] text-muted-foreground"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      'Panel length',
                      '12 m per standard unit',
                      'Long enough to span a beach’s litter path in one run; short enough to handle without a crane.',
                    ],
                    [
                      'Mesh height above sand',
                      '900 mm',
                      'High enough to catch what the wind carries and low enough to see over, walk round and clear without stooping.',
                    ],
                    [
                      'Mesh aperture',
                      'Below a standard bottle cap',
                      'The cap is the smallest common object worth catching; anything coarser lets caps, straws and fragments through.',
                    ],
                    [
                      'Mesh construction',
                      'Woven galvanised wire, tensioned between posts',
                      'A woven fabric is a stock item that can be re-tensioned and patched in place, which a moulded panel cannot.',
                    ],
                    [
                      'Posts',
                      'Five per unit, 2.4 m centres, with a top rail',
                      'Holds the mesh against a gale off the sea without a post so close that it fouls the clearing.',
                    ],
                    [
                      'Post material',
                      'Marine-grade timber on a hot-dip galvanised foot',
                      'Salt and wind take the timber surface; the galvanised foot takes the ground contact and the abrasion.',
                    ],
                    [
                      'Footing depth',
                      '500 mm below the sand surface, set per site',
                      'Below the depth the beach scours in a storm. The exact figure comes from the survey.',
                    ],
                    [
                      'Anchorage',
                      'Two of five posts tie-back rigged: helical anchors on stainless wire, through a sand anchor line',
                      'Dry sand will not hold a straight driven post against a winter gale; the tie-back is what does.',
                    ],
                    [
                      'Clearing passage',
                      '1.2 m clear along the leeward side',
                      'Wide enough for a person with a sack to walk the whole run at a fixed height, no raking required.',
                    ],
                    [
                      'Unit spacing',
                      'Per site, along the litter path',
                      'Units go where the wind carries material. A fixed gap would leave unguarded stretches of beach.',
                    ],
                    [
                      'Clearing',
                      'On foot, dry sand, no machinery',
                      'The clearing has to be possible on any dry morning by whoever already walks the beach.',
                    ],
                    [
                      'Maintenance interval',
                      'Set per site at survey',
                      'Exposure and visitor load decide it, so it is written into the survey report in weeks or months.',
                    ],
                  ].map(([element, spec, why]) => (
                    <tr key={element} className="border-b border-border/70 last:border-0">
                      <th scope="row" className="px-5 py-4 align-top font-medium text-foreground">
                        {element}
                      </th>
                      <td className="px-5 py-4 align-top text-foreground">{spec}</td>
                      <td className="px-5 py-4 align-top text-muted-foreground">{why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Sorting: the whole section on the dark ground, the unit drawn three
            ways, four build stages. The page's change of key. */}
        <section className="bg-ink text-ink-foreground">
          <div className="mx-auto w-full max-w-content px-gutter py-section">
            <div className="max-w-[46rem]">
              <p className="font-label text-step--2 font-semibold uppercase tracking-[0.1em] text-ink-muted">
                Engineering
              </p>
              <h2 className="mt-3 text-step-1 text-ink-foreground">
                Four stages from survey to handover
              </h2>
              <p className="mt-4 max-w-measure text-ink-muted">
                The mesh is the visible part and the least interesting engineering decision. The run
                direction, the bedded depth and the standing height are what decide whether a line
                collects a beach’s litter or merely stands on it.
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              <figure className="rounded-lg border border-ink-border bg-[color-mix(in_oklch,var(--ink-background)_70%,black)] p-5 sm:p-6">
                <CrossSectionDiagram tone="dark" className="h-auto w-full" />
                <figcaption className="mt-5 text-step--1 text-ink-muted">
                  Section. The foot is bedded 500 mm below the sand; the mesh stands 900 mm clear of
                  it. Litter banks on the windward face and the leeward side stays clear to walk.
                </figcaption>
              </figure>
              <figure className="rounded-lg border border-ink-border bg-[color-mix(in_oklch,var(--ink-background)_70%,black)] p-5 sm:p-6">
                <PlanDiagram tone="dark" className="h-auto w-full" />
                <figcaption className="mt-5 text-step--1 text-ink-muted">
                  Plan. The run sits across the direction the wind already carries material, with a
                  1.2 m passage downwind of the line — the whole reason a unit takes minutes to empty
                  rather than hours.
                </figcaption>
              </figure>
            </div>

            <ol className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
              {stages.map((s) => (
                <li key={s.n} className="border-t border-ink-border pt-5">
                  <span className="font-display text-step-3 text-ink-accent">{s.n}</span>
                  <h3 className="mt-2 text-step-3 text-ink-foreground">{s.title}</h3>
                  <p className="mt-2 text-sm text-ink-muted">{s.body}</p>
                </li>
              ))}
            </ol>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {risks.map((r) => (
                <div key={r.title} className="rounded-lg border border-ink-border p-6">
                  <AlertTriangle aria-hidden="true" strokeWidth={1.5} className="size-5 text-ink-accent" />
                  <h3 className="mt-3 text-step-3 text-ink-foreground">{r.title}</h3>
                  <p className="mt-2 text-sm text-ink-muted">{r.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cost, qualitatively: what moves the figure, in a single bordered list. */}
        <section className="border-b border-border">
          <div className="mx-auto w-full max-w-content px-gutter py-section">
            <div className="max-w-[46rem]">
              <h2 className="text-step-1">What moves the cost</h2>
              <p className="mt-4 max-w-measure text-muted-foreground">
                We do not publish a price, because two beaches either side of the same headland are
                not the same job. What we do publish is what changes the figure — eight factors, so a
                parish council or a harbour board can see what it is actually buying and argue with
                any of them.
              </p>
              <p className="mt-4 max-w-measure text-muted-foreground">
                A quote is itemised along exactly these lines, with the survey assumptions shown next
                to the numbers rather than hidden inside them.
              </p>
            </div>

            <dl className="mt-10 grid gap-x-10 gap-y-0 md:grid-cols-2">
              {costFactors.map((f) => (
                <div key={f.title} className="border-t border-border py-6">
                  <dt className="font-display text-step-3">{f.title}</dt>
                  <dd className="mt-2 max-w-measure text-sm text-muted-foreground">{f.body}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10 flex flex-wrap items-center gap-4 rounded-lg bg-secondary p-6 sm:p-8">
              <div className="max-w-[46ch]">
                <h3 className="text-step-3">Every project starts with a beach survey.</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  No list price, no package. The survey report comes back with the specification, the
                  installation method and the clearing interval, and the quote is built from it.
                </p>
              </div>
              <Button asChild size="lg" className="ml-auto">
                <a href={`mailto:${CONTACT_EMAIL}?subject=Shoreline%20beach%20survey%20request`}>
                  <Mail aria-hidden="true" strokeWidth={1.5} className="size-4" />
                  Request a survey
                  <ArrowRight aria-hidden="true" strokeWidth={1.5} className="size-4" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Deployment considerations. */}
        <section>
          <div className="mx-auto w-full max-w-content px-gutter py-section">
            <h2 className="text-step-1">Before you install</h2>
            <div className="mt-8 grid gap-layout md:grid-cols-3">
              {[
                {
                  t: 'Access, consent and sand',
                  b: 'Most beaches need consent or a licence from the landowner or the local authority before anything is fixed in place, and a beach that is a site of special scientific interest needs more than that. Shoreline prepares the drawings and site plan the application asks for. Start the application at survey, not at installation.',
                },
                {
                  t: 'Lifecycle and end of life',
                  b: 'Mesh, rail, fixings and posts come back out in the reverse order they went in, and come apart for reuse and recycling. We design for removal, not only for installation, and we say so in the survey report.',
                },
                {
                  t: 'Who empties it',
                  b: 'Agreed before installation and named in writing: a volunteer group, the local authority or a contracted interval. An unemptied line is a line that eventually fails. The tallies the clearer keeps feed the annual review, which sets the next interval.',
                },
              ].map((c, i) => (
                <div key={c.t} className={i === 0 ? 'border-t-2 border-primary-soft pt-5' : 'border-t border-border pt-5'}>
                  <h3 className="text-step-3">{c.t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{c.b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <ContactFooter />
    </>
  )
}
