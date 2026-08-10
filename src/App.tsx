import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { ExplorePage } from './pages/ExplorePage'
import { FormulaInspectorPage } from './pages/FormulaInspectorPage'
import { FormulaLibraryPage } from './pages/FormulaLibraryPage'
import { HomePage } from './pages/HomePage'
import { ModuleIndexPage } from './pages/ModuleIndexPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="formulas" element={<FormulaLibraryPage />} />
        <Route path="formulas/:formulaId" element={<FormulaInspectorPage />} />
        <Route path="simulations" element={<ModuleIndexPage mode="simulations" />} />
        <Route path="practice" element={<ModuleIndexPage mode="practice" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
