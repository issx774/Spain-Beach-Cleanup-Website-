# Shoreline

Shoreline designs, builds and maintains fixed structures that stand on the
beach itself and collect the litter visitors leave on the sand — the bottles,
wrappers and fragments that scatter across the dry beach and blow inland before
anyone picks them up.

## The two routes

- `/` — the mission. Where litter on a beach actually ends up, why hand pickup
  misses most of it, and how a fixed structure holds it in one place.
- `/design` — what the structure is made of, how it stands on the sand, and what
  drives its cost. The specification table and the deployment plan live here.

There is no About page and no Contact page: the mission page is the about, and
each page ends in the same one-line email footer.

## Palette

Roles, not a list. Every value is in `src/theme.css`.

| Role | Token | What it does |
| --- | --- | --- |
| Ground | `--background` `#f3f0e6` | Dry sand. The default page surface. |
| Raised surface | `--card` `#faf8f2` | Light surf. Cells, the spec sheet, the nav bar. |
| Ink | `--foreground` `#16232b` | Tide silt. All body text. |
| Muted ink | `--muted-foreground` `#55625a` | Captions, table notes, credits. 4.9:1 on sand. |
| Brand / primary | `--primary` `#0e3f3c` | Kelp teal. Button grounds and the mission band. |
| Measured accent | `--primary-soft` `#1c7a6d` | Kelp green. Only where something is measured or live: mesh apertures, collection counts, standing width. Never for decoration. |
| Dark band | `--ink-background` `#0c1f24` | The grading band on `/design` — dark, so the drawing it carries reads as ink on slate. |
| Dark band ink | `--ink-foreground` `#e9efe8` / `--ink-muted` `#9dbbbb` | The band's own ink, so it never borrows a light-scheme value. |
| Dark band accent | `--ink-accent` `#63c3ab` | The one accent that survives on the dark ground. |

The dark section is not a second colour scheme — it is a ground, used once, for
the section where the page's subject changes. There is no `prefers-color-scheme`
override.

Depth comes from two places, both built from tokens: a soft radial glow of
`color-mix(in oklch, var(--primary-soft) 30%, transparent)` behind the hero
photograph — a grain of quartz on a dry beach, not light on water — and a fine
dotted texture of
`color-mix(in oklch, var(--foreground) 8%, transparent)` on the specification
band. No literal colour exists outside `public/favicon.svg`.

## Type

- `--font-heading` **Fraunces** 600 at `-0.022em` — display only.
- `--font-body` **Inter** 400 — body copy, 1.65 leading, 68ch measure.
- `--font-label` **Inter** 600, `0.1em` tracking, uppercase — table headers,
  captions and small category labels. Used sparingly; there is no eyebrow over
  every section.

One 1.333 ramp, fluid via `clamp()`: `--hero-size`, `--step-1`…`--step-3`,
`--step--1`, `--step--2`. Hierarchy comes from weight and colour before size.

## Brand mark

`src/components/Brand.tsx`. A rounded-pebble container in `--primary` holding
three stacked wave lines — the structure's own cross-section, reduced. The
wordmark is `shoreline` lowercase in Fraunces, tightened.

**Icons are Lucide at `stroke-width: 1.5`** everywhere, without exception.
`public/favicon.svg` carries the same three waves in flat colour, since it has
no stylesheet behind it.

## Imagery

Photographs of the beach itself, plus code-drawn technical drawings — nothing
else. Nothing in the imagery shows the structure standing in water: this site is
about the sand.

- The first screen carries a real photograph of a fence line standing on open
  beach sand at low golden light, litter banked along its base while the sand in
  front of it is swept clean. It is the deployed structure's own geometry, and
  the closest thing the libraries hold to the subject.
- The problem section carries two further real photographs: plastic and litter
  stranded along a sandy strandline, and a hand gathering litter off wet sand.
- The sorting section carries three code-drawn diagrams of the same panel —
  seen along the beach, from the side, and from above the run — because the
  standing width of the line is the drawing that explains the whole device.
  Drawings are line art on the deep ink ground, in `--ink-foreground` for the
  frame and `--ink-accent` where something is measured.

No illustration set, no icon-font art, no grey placeholder.

## Voice

Specific, unhurried, engineering-literate, and plain about the fact that the
problem is people leaving things on the sand. Real numbers only where the
structure genuinely has one — mesh aperture, unit length, standing width. No
invented capture statistics, no invented costs: the cost analysis is written as
factors that move a figure, because Shoreline has not published a price.

A label over a heading names a category the visitor navigates by (`Get in touch`,
`Materials`). It is not used as garnish.

## Shell

A single sticky bar on both routes: the mark left, two links (`Mission`,
`Design & cost`), and one `Email the team` button right. At 360 the links
collapse into one menu button opening a sheet with a visible close. Each page
owns its own `main` and its own short contact footer — the footer is on the page,
not wrapped around the router, so a page carries only what it declares.
