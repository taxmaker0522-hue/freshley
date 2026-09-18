import MiniCartBar from './components/MiniCartBar'
import WhatsAppButton from './components/WhatsAppButton'
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

function App() {
  return (
    <>
      <Navbar />
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
      <Footer />
      <MiniCartBar />
      <WhatsAppButton />
    </>
  )
}

export default App
