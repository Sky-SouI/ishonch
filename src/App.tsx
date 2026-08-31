import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { DemoRibbon } from './components/Demo'
import { CatalogScreen } from './screens/CatalogScreen'
import { CampaignScreen } from './screens/CampaignScreen'
import { DonateScreen } from './screens/DonateScreen'
import { DonateSuccessScreen } from './screens/DonateSuccessScreen'
import { CreateScreen } from './screens/CreateScreen'
import { DashboardScreen } from './screens/DashboardScreen'

/** Прокрутка наверх при смене экрана — иначе длинная страница сбора «липнет». */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export function App() {
  return (
    <>
      <DemoRibbon />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<CatalogScreen />} />
        <Route path="/c/:slug" element={<CampaignScreen />} />
        <Route path="/c/:slug/donate" element={<DonateScreen />} />
        <Route path="/c/:slug/donate/success" element={<DonateSuccessScreen />} />
        <Route path="/create" element={<CreateScreen />} />
        <Route path="/dashboard" element={<DashboardScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
