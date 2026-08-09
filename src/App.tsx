import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { HomePage } from './pages/HomePage'
import { WorkspacePlaceholder } from './pages/WorkspacePlaceholder'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="explore" element={<WorkspacePlaceholder section="Explore" />} />
        <Route path="formulas" element={<WorkspacePlaceholder section="Formula Library" />} />
        <Route path="simulations" element={<WorkspacePlaceholder section="Simulations" />} />
        <Route path="practice" element={<WorkspacePlaceholder section="Practice" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
