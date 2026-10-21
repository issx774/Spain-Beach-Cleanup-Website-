import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import Home from '@/pages/Home'
import { Meta } from '@/components/Meta'
import { SiteHeader } from '@/components/SiteHeader'

// Routes are code-split so the first paint carries only the landing page.
const NotFound = lazy(() => import('@/pages/NotFound'))
const Design = lazy(() => import('@/pages/Design'))
const RoverSimulatorPage = lazy(() => import('@/pages/RoverSimulatorPage'))

// On navigation, show the new page from the top (including its explanation).
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

// Keep one shared Shoreline header; every route owns its own main content.
// The interactive simulator is lazy-loaded so map code stays off the home page.
export default function App() {
  return (
    <>
      <ScrollToTop />
      <SiteHeader />
      <Suspense fallback={<div className="px-gutter py-24 text-sm text-muted-foreground">Loading…</div>}>
      <Routes>
        <Route
          index
          element={
            <>
              <Meta
                title="Shoreline — collecting beach litter on the sand"
                description="Shoreline builds fixed mesh structures that stand on the beach and collect the litter visitors leave on the sand, before the wind blows it inland or the tide takes it out."
              />
              <Home />
            </>
          }
        />
        <Route
          path="design"
          element={
            <>
              <Meta
                title="Design, engineering & cost — Shoreline"
                description="One standard Shoreline unit: 12 m of mesh standing 900 mm above the sand on five posts, bedded 500 mm below it. The specification sheet, the four build stages and every factor that moves the cost."
              />
              <Design />
            </>
          }
        />
        <Route
          path="rover-simulator"
          element={
            <>
              <Meta
                title="Interactive Rover Simulator — Shoreline"
                description="Explore a simulated beach-cleanup rover dashboard with map, battery, litter detection, autonomous demonstration and activity log. Not connected to a real robot."
              />
              <RoverSimulatorPage />
            </>
          }
        />
        <Route
          path="*"
          element={
            <>
              <Meta
                title="Page not found — Shoreline"
                description="That address does not exist. The mission and the design, engineering and cost pages are still here."
              />
              <NotFound />
            </>
          }
        />
      </Routes>
      </Suspense>
    </>
  )
}
