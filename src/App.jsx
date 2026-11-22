import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Benefits from './components/Benefits.jsx';
import ContentSection from './components/catalog/ContentSection.jsx';
import FeatureSection from './components/features/FeatureSection.jsx';
import ContentVariety from './components/ContentVariety.jsx';
import SportsSection from './components/SportsSection.jsx';
import Compatibility from './components/Compatibility.jsx';
import PlatformSection from './components/PlatformSection.jsx';
import Comparison from './components/Comparison.jsx';
import Pricing from './components/Pricing.jsx';
import Guarantee from './components/Guarantee.jsx';
import Testimonials from './components/Testimonials.jsx';
import FAQ from './components/FAQ.jsx';
import FinalCTA from './components/FinalCTA.jsx';
import Footer from './components/Footer.jsx';
import { NoticeProvider } from './components/ui/Notice.jsx';
import useReveal from './hooks/useReveal.js';
import Intro from './components/Intro.jsx';
import CookieConsent from './components/CookieConsent.jsx';

export default function App() {
  useReveal();
  return (
    <NoticeProvider>
      <Intro />
      <a href="#conteudo-principal" className="skip-link">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo-principal">
        <Hero />
        <Benefits />
        <ContentSection />
        <FeatureSection />
        <ContentVariety />
        <SportsSection />
        <Compatibility />
        <PlatformSection />
        <Testimonials />
        <Comparison />
        <Pricing />
        <Guarantee />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      {/* Consentimento de cookies + Meta Pixel / Conversions API */}
      <CookieConsent />
    </NoticeProvider>
  );
}
