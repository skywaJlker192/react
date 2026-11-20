import { Route, Routes } from 'react-router'
import Header from './components/Header'
import SitesPage from './pages/SitesPage'
import SitePage from './pages/SitePage'
import AboutPage from './pages/AboutPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<SitesPage />} />
        <Route path="/site/:id" element={<SitePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App
