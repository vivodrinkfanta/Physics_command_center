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
const CurriculumMapPage = lazy(() =>
  import('./pages/CurriculumMapPage').then((module) => ({ default: module.CurriculumMapPage })),
)
const CurriculumTopicPage = lazy(() =>
  import('./pages/CurriculumTopicPage').then((module) => ({ default: module.CurriculumTopicPage })),
)
const IbPracticePage = lazy(() =>
  import('./pages/IbPracticePage').then((module) => ({ default: module.IbPracticePage })),
)
const IbPracticeQuestionPage = lazy(() =>
  import('./pages/IbPracticeQuestionPage').then((module) => ({ default: module.IbPracticeQuestionPage })),
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
        <Route path="curriculum" element={<Suspense fallback={<RouteFallback />}><CurriculumMapPage /></Suspense>} />
        <Route path="curriculum/:topicCode" element={<Suspense fallback={<RouteFallback />}><CurriculumTopicPage /></Suspense>} />
        <Route path="formulas" element={<Suspense fallback={<RouteFallback />}><FormulaLibraryPage /></Suspense>} />
        <Route path="formulas/:formulaId" element={<Suspense fallback={<RouteFallback />}><FormulaInspectorPage /></Suspense>} />
        <Route path="simulations" element={<Suspense fallback={<RouteFallback />}><ModuleIndexPage mode="simulations" /></Suspense>} />
        <Route path="practice" element={<Suspense fallback={<RouteFallback />}><IbPracticePage /></Suspense>} />
        <Route path="practice/:questionId" element={<Suspense fallback={<RouteFallback />}><IbPracticeQuestionPage /></Suspense>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
