/* Drawings, not photographs: the structure body-on, in section, and in plan,
   all drawn with the same tokens the rest of the page obeys. Every drawing
   takes `tone` so the same geometry can sit on sand or on the dark ink ground
   without a second set of values.

   Nothing here stands in water. The panel is bedded a shank below the sand
   surface and stands 900 mm clear of it; that footing is the whole reason the
   section drawing exists. */

const T = {
  light: {
    frame: 'var(--foreground)',
    measure: 'var(--primary-soft)',
    mesh: 'var(--card)',
    rule: 'var(--border)',
    text: 'var(--muted-foreground)',
  },
  dark: {
    frame: 'var(--ink-foreground)',
    measure: 'var(--ink-accent)',
    mesh: 'var(--ink-background)',
    rule: 'var(--ink-border)',
    text: 'var(--ink-muted)',
  },
}

const LABEL = { fontFamily: 'var(--font-label)', letterSpacing: '0.06em' } as const

/* The panel from the side: sand line, bedded post, clear height, the litter
   banked against the windward face, and the passage that clears it. */
export function CrossSectionDiagram({
  tone = 'light',
  className,
}: {
  tone?: 'light' | 'dark'
  className?: string
}) {
  const c = T[tone]
  return (
    <svg
      viewBox="0 0 520 340"
      className={className}
      role="img"
      aria-label="Section through a Shoreline unit standing on the beach: the post foot is bedded 500 millimetres below the sand surface, the mesh face stands 900 millimetres clear of it, litter is banked along the windward face, and a 1.2 metre passage runs along the leeward side."
    >
      {/* sand body, below the surface line */}
      <rect x="0" y="196" width="520" height="144" fill={c.frame} opacity="0.06" />
      {/* sand surface */}
      <path d="M0 196h520" stroke={c.rule} strokeWidth="1.5" />
      <path
        d="M0 196h520"
        stroke={c.frame}
        strokeWidth="1.5"
        strokeDasharray="16 4 6 4"
        opacity="0.45"
      />

      {/* the post: bedded foot below sand, standing height above */}
      <rect x="196" y="96" width="10" height="160" rx="4" fill={c.frame} />
      <rect x="186" y="244" width="30" height="8" rx="4" fill={c.frame} />
      {/* mesh face on the windward side of the post */}
      <g stroke={c.frame} strokeWidth="1" opacity="0.7">
        {Array.from({ length: 14 }).map((_, i) => (
          <path key={i} d={`M164 ${100 + i * 7}h32`} />
        ))}
        <path d="M164 98V198M196 98V198" strokeWidth="2.5" opacity="1" />
      </g>

      {/* litter banked against the windward face */}
      <g fill={c.frame} opacity="0.7">
        <rect x="120" y="176" width="18" height="22" rx="6" />
        <rect x="142" y="182" width="14" height="14" rx="4" />
        <circle cx="114" cy="188" r="8" />
        <rect x="132" y="166" width="24" height="10" rx="5" />
      </g>
      {/* swept sand in front of the line — the ground stays clear */}
      <g stroke={c.measure} strokeWidth="1.5" strokeLinecap="round" opacity="0.85">
        <path d="M40 186h46" />
        <path d="M40 168h28" />
      </g>

      {/* the passage along the leeward side */}
      <g stroke={c.measure} strokeWidth="1">
        <path d="M226 314h108" />
        <path d="M226 306v16" />
        <path d="M334 306v16" />
      </g>

      {/* dimension line: standing height */}
      <g stroke={c.rule} strokeWidth="1">
        <path d="M462 96v100" />
        <path d="M454 96h16" />
        <path d="M454 196h16" />
        <path d="M206 96h256M206 196h256" strokeDasharray="4 4" opacity="0.7" />
      </g>
      {/* dimension line: bedded depth */}
      <g stroke={c.rule} strokeWidth="1">
        <path d="M452 196v56" />
        <path d="M444 196h16" />
        <path d="M444 252h16" />
        <path d="M206 252h246" strokeDasharray="4 4" opacity="0.7" />
      </g>

      {/* labels */}
      <g fill={c.text} {...LABEL} fontSize="11">
        <text x="6" y="80">
          WINTER ALONG-THE-WIND
        </text>
        <text x="6" y="94">
          A SUN-HOT BOTTLE
        </text>
        <text x="234" y="150">
          MESH APERTURE BELOW
        </text>
        <text x="234" y="164">
          A BOTTLE CAP
        </text>
        <text x="472" y="140">
          900 mm
        </text>
        <text x="472" y="228">
          500 mm
        </text>
        <text x="226" y="332">
          PASSAGE 1.2 m
        </text>
      </g>
      <g fill={c.frame} {...LABEL} fontSize="11">
        <text x="150" y="126">
          LITTER BANK
        </text>
        <text x="30" y="228">
          SAND
        </text>
        <text x="206" y="272">
          BEDDED FOOT
        </text>
      </g>

      {/* leader lines */}
      <g stroke={c.rule} strokeWidth="1">
        <path d="M150 136l14 22" />
        <path d="M120 232l34-28" />
        <path d="M212 276l-6-20" />
      </g>
    </svg>
  )
}

/* The same unit along the beach: the run of panels a visitor walks past, on the
   sand, nothing floating. */
export function AlongBeachDrawing({
  tone = 'light',
  className,
}: {
  tone?: 'light' | 'dark'
  className?: string
}) {
  const c = T[tone]
  return (
    <svg
      viewBox="0 0 640 260"
      className={className}
      role="img"
      aria-label="Elevation of one standard twelve-metre unit standing on the beach: five posts at 2.4 metre centres, 900 millimetres of mesh above the sand line, and the run following the beach at a constant height."
    >
      {/* dimension line: length */}
      <g stroke={c.rule} strokeWidth="1">
        <path d="M60 34h520" />
        <path d="M60 26v16" />
        <path d="M580 26v16" />
      </g>
      <text x="320" y="26" textAnchor="middle" fill={c.text} {...LABEL} fontSize="12">
        12 m
      </text>

      {/* the panel run, standing on the sand line */}
      <path d="M60 196h520" stroke={c.frame} strokeWidth="3" />
      <path d="M60 120h520" stroke={c.frame} strokeWidth="3" />
      <path d="M60 196V120M580 196V120" stroke={c.frame} strokeWidth="3" />
      {Array.from({ length: 13 }).map((_, i) => (
        <path key={i} d={`M${60 + i * 43.33} 120v76`} stroke={c.frame} strokeWidth="1" opacity="0.55" />
      ))}

      {/* the top rail, not a float line */}
      <g fill={c.frame} opacity="0.9">
        <rect x="60" y="112" width="520" height="8" rx="4" />
      </g>

      {/* sand line */}
      <path d="M30 196h580" stroke={c.frame} strokeWidth="1.5" strokeDasharray="16 4 6 4" opacity="0.5" />

      {/* dimension line: height */}
      <g stroke={c.rule} strokeWidth="1">
        <path d="M620 120v76" />
        <path d="M612 120h16" />
        <path d="M612 196h16" />
      </g>
      <text x="644" y="162" fill={c.text} {...LABEL} fontSize="12" transform="rotate(90 644 162)" textAnchor="middle">
        900 mm
      </text>

      {/* posts */}
      {[60, 190, 320, 450, 580].map((x) => (
        <rect key={x} x={x - 3} y={112} width="6" height="96" rx="3" fill={c.frame} />
      ))}
      {/* two of the five posts are anchor-rigged; the tie-backs are marked */}
      {[190, 450].map((x) => (
        <g key={x} stroke={c.measure} strokeWidth="1.5">
          <path d={`M${x} 196l-24 28M${x} 196l24 28`} />
        </g>
      ))}

      <text x="60" y="240" fill={c.text} {...LABEL} fontSize="11">
        ONE STANDARD UNIT — 12 m, TWO ANCHOR-RIGGED POSTS
      </text>
    </svg>
  )
}

/* Plan view: what the passage along the leeward side actually gives you when
   the clearer walks the length of it. */
export function PlanDiagram({
  tone = 'light',
  className,
}: {
  tone?: 'light' | 'dark'
  className?: string
}) {
  const c = T[tone]
  return (
    <svg
      viewBox="0 0 560 300"
      className={className}
      role="img"
      aria-label="Plan view of one unit: a twelve-metre mesh line across the beach with a 1.2 metre clear passage along its downwind side, so a clearer walks the length of the line at a fixed height."
    >
      {/* the panel, seen from above */}
      <path d="M60 140h440" stroke={c.frame} strokeWidth="4" />
      {Array.from({ length: 22 }).map((_, i) => (
        <path key={i} d={`M${62 + i * 20} 140v10`} stroke={c.frame} strokeWidth="1" opacity="0.6" />
      ))}
      {/* posts in plan */}
      {[60, 170, 280, 390, 500].map((x) => (
        <circle key={x} cx={x} cy="140" r="7" fill={c.frame} />
      ))}

      {/* the passage, downwind of the line */}
      <rect x="60" y="158" width="440" height="52" fill={c.measure} opacity="0.12" />
      <g stroke={c.measure} strokeWidth="1">
        <path d="M60 158h440M60 210h440" />
      </g>
      <text x="280" y="190" textAnchor="middle" fill={c.measure} {...LABEL} fontSize="11">
        CLEAR PASSAGE — 1.2 m
      </text>
      {/* a figure walking the run */}
      <g stroke={c.measure} strokeWidth="1.5" strokeLinecap="round" fill="none">
        <circle cx="86" cy="184" r="6" />
        <path d="M86 190v10M86 195l-9 8M86 195l9 8" />
      </g>

      {/* littoral drift arriving from the west */}
      <g stroke={c.frame} strokeWidth="1.5" strokeLinecap="round" opacity="0.7">
        <path d="M8 96h64" />
        <path d="M60 88l10 8-10 8" fill="none" />
      </g>
      <text x="8" y="80" fill={c.text} {...LABEL} fontSize="11">
        LITTER DRAWN ALONG
      </text>
      <text x="8" y="66" fill={c.text} {...LABEL} fontSize="11">
        THE BEACH BY WIND
      </text>

      {/* banked material on the windward face */}
      <g fill={c.frame} opacity="0.7">
        <rect x="150" y="126" width="16" height="12" rx="4" />
        <rect x="352" y="128" width="13" height="10" rx="3" />
        <circle cx="250" cy="132" r="6" />
      </g>

      <text x="60" y="252" fill={c.text} {...LABEL} fontSize="11">
        PLAN — ONE UNIT, 12 m
      </text>
    </svg>
  )
}
