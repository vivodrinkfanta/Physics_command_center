import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { HomePage } from './pages/HomePage'

const ExplorePage = lazy(() =>
  import('./pages/ExplorePage').then((module) => ({ default: module.ExplorePage })),
)
const FormulaInspectorPage = lazy(() =>
  import('./pages/FormulaInspectorPage').then((module) => ({ default: module.FormulaInspectorPage })),
)
const FormulaLibraryPage = lazy(() =>
  import('./pages/FormulaLibraryPage').then((module) => ({ default: module.FormulaLibraryPage })),
)
const ModuleIndexPage = lazy(() =>
  import('./pages/ModuleIndexPage').then((module) => ({ default: module.ModuleIndexPage })),
)

function RouteFallback() {
  return <div aria-live="polite" className="route-fallback">Calibrating instrument…</div>
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="explore" element={<Suspense fallback={<RouteFallback />}><ExplorePage /></Suspense>} />
        <Route path="formulas" element={<Suspense fallback={<RouteFallback />}><FormulaLibraryPage /></Suspense>} />
        <Route path="formulas/:formulaId" element={<Suspense fallback={<RouteFallback />}><FormulaInspectorPage /></Suspense>} />
        <Route path="simulations" element={<Suspense fallback={<RouteFallback />}><ModuleIndexPage mode="simulations" /></Suspense>} />
        <Route path="practice" element={<Suspense fallback={<RouteFallback />}><ModuleIndexPage mode="practice" /></Suspense>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
