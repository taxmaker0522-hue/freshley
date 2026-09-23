import { useEffect, useRef } from 'react'
import AuthSheet from './components/AuthSheet'
import MiniCartBar from './components/MiniCartBar'
import WhatsAppButton from './components/WhatsAppButton'
import { useRoute } from './hooks/useRoute'
import Navbar from './sections/Navbar'
import Hero from './sections/Hero'
import TrustStrip from './sections/TrustStrip'
import ComboBuilder from './sections/ComboBuilder'
import Plans from './sections/Plans'
import HowItWorks from './sections/HowItWorks'
import FarmStory from './sections/FarmStory'
import DeliveryCheck from './sections/DeliveryCheck'
import Testimonials from './sections/Testimonials'
import FAQ from './sections/FAQ'
import Footer from './sections/Footer'
import Dashboard from './sections/Dashboard'

function App() {
  const route = useRoute()
  const previousRoute = useRef(route)

  // Switching views: open the dashboard at the top, and when coming back to the
  // home page from it, scroll to the section the link pointed at (e.g. #plans).
  useEffect(() => {
    if (previousRoute.current === route) return
    previousRoute.current = route
    const target = route === 'home' ? document.getElementById(window.location.hash.slice(1)) : null
    if (target) target.scrollIntoView()
    else window.scrollTo({ top: 0 })
  }, [route])

  return (
    <>
      <Navbar />
      {route === 'dashboard' ? (
        <main>
          <Dashboard />
        </main>
      ) : (
        <main>
          <Hero />
          <TrustStrip />
          <ComboBuilder />
          <Plans />
          <HowItWorks />
          <FarmStory />
          <DeliveryCheck />
          <Testimonials />
          <FAQ />
        </main>
      )}
      <Footer />
      {route === 'home' && <MiniCartBar />}
      <WhatsAppButton />
      <AuthSheet />
    </>
  )
}

export default App
