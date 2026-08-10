import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { ExplorePage } from './pages/ExplorePage'
import { FormulaInspectorPlaceholder } from './pages/FormulaInspectorPlaceholder'
import { FormulaLibraryPage } from './pages/FormulaLibraryPage'
import { HomePage } from './pages/HomePage'
import { WorkspacePlaceholder } from './pages/WorkspacePlaceholder'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="formulas" element={<FormulaLibraryPage />} />
        <Route path="formulas/:formulaId" element={<FormulaInspectorPlaceholder />} />
        <Route path="simulations" element={<WorkspacePlaceholder section="Simulations" />} />
        <Route path="practice" element={<WorkspacePlaceholder section="Practice" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
