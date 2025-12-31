import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Problems from './components/Problems';
import Solution from './components/Solution';
import Features from './components/Features';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import FAQ from './components/FAQ';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BouwLanding from './components/BouwLanding';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsConditions from './components/TermsConditions';
import Bedankt from './components/Bedankt';
import IntakeForm from './components/IntakeForm';
import CreatiefLanding from './components/CreatiefLanding';
import PersoonlijkLanding from './components/PersoonlijkLanding';
import TechLanding from './components/TechLanding';
import EcommerceLanding from './components/EcommerceLanding';
import NettoCheck from './components/NettoCheck';
import WhatsAppPopup from './components/WhatsAppPopup';
import SlimChatbot from './components/SlimChatbot';
import SlimChatbotInstellingen from './components/SlimChatbotInstellingen';
import BranchesOverview from './components/BranchesOverview';
import GratisToolsOverview from './components/GratisToolsOverview';
import OverOnsOverview from './components/OverOnsOverview';
import Nieuws from './components/Nieuws';
import TaxForm2024 from './components/TaxForm2024';

function HomePage() {
  return (
    <>
      <Hero />
      <Problems />
      <Solution />
      <Features />
      <Pricing />
      <Testimonials />
      <CTA />
      <About />
      <Contact />
      <FAQ />
    </>
  );
}

function SectionPage({ section }: { section: string }) {
  React.useEffect(() => {
    // Scroll to top first
    window.scrollTo(0, 0);
    
    // Then scroll to the specific section after a short delay
    const timer = setTimeout(() => {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [section]);

  return <HomePage />;
}

function BranchSectionPage({ branch, section }: { branch: string; section: string }) {
  React.useEffect(() => {
    // Scroll to top first
    window.scrollTo(0, 0);
    
    // Then scroll to the specific section after a short delay
    const timer = setTimeout(() => {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [section]);

  // Render the appropriate branch component
  switch (branch) {
    case 'bouw':
      return <BouwLanding />;
    case 'creatief':
      return <CreatiefLanding />;
    case 'persoonlijk':
      return <PersoonlijkLanding />;
    case 'tech':
      return <TechLanding />;
    case 'ecommerce':
      return <EcommerceLanding />;
    default:
      return <HomePage />;
  }
}

function ScrollToTop() {
  const location = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/uniek" element={<SectionPage section="features" />} />
          <Route path="/pakketten" element={<SectionPage section="pakketten" />} />
          <Route path="/reviews" element={<SectionPage section="reviews" />} />
          <Route path="/over-kyle" element={<SectionPage section="over-kyle" />} />
          <Route path="/contact" element={<SectionPage section="contact-form" />} />
          <Route path="/veelgestelde-vragen" element={<SectionPage section="faq" />} />
          
          {/* Overview pages */}
          <Route path="/branches" element={<BranchesOverview />} />
          <Route path="/gratis-tools" element={<GratisToolsOverview />} />
          <Route path="/over-ons" element={<OverOnsOverview />} />
          <Route path="/nieuws" element={<Nieuws />} />

          {/* Branch landing pages */}
          <Route path="/bouw" element={<BouwLanding />} />
          <Route path="/creatief" element={<CreatiefLanding />} />
          <Route path="/persoonlijk" element={<PersoonlijkLanding />} />
          <Route path="/tech" element={<TechLanding />} />
          <Route path="/ecommerce" element={<EcommerceLanding />} />
          
          {/* Branch-specific section routes */}
          <Route path="/bouw/pakketten" element={<BranchSectionPage branch="bouw" section="pakketten" />} />
          <Route path="/bouw/reviews" element={<BranchSectionPage branch="bouw" section="reviews" />} />
          <Route path="/bouw/contact" element={<BranchSectionPage branch="bouw" section="contact-form" />} />
          <Route path="/bouw/faq" element={<BranchSectionPage branch="bouw" section="faq" />} />
          
          <Route path="/creatief/pakketten" element={<BranchSectionPage branch="creatief" section="pakketten" />} />
          <Route path="/creatief/reviews" element={<BranchSectionPage branch="creatief" section="reviews" />} />
          <Route path="/creatief/contact" element={<BranchSectionPage branch="creatief" section="contact-form" />} />
          <Route path="/creatief/faq" element={<BranchSectionPage branch="creatief" section="faq" />} />
          
          <Route path="/persoonlijk/pakketten" element={<BranchSectionPage branch="persoonlijk" section="pakketten" />} />
          <Route path="/persoonlijk/reviews" element={<BranchSectionPage branch="persoonlijk" section="reviews" />} />
          <Route path="/persoonlijk/contact" element={<BranchSectionPage branch="persoonlijk" section="contact-form" />} />
          <Route path="/persoonlijk/faq" element={<BranchSectionPage branch="persoonlijk" section="faq" />} />
          
          <Route path="/tech/pakketten" element={<BranchSectionPage branch="tech" section="pakketten" />} />
          <Route path="/tech/reviews" element={<BranchSectionPage branch="tech" section="reviews" />} />
          <Route path="/tech/contact" element={<BranchSectionPage branch="tech" section="contact-form" />} />
          <Route path="/tech/faq" element={<BranchSectionPage branch="tech" section="faq" />} />
          
          <Route path="/ecommerce/pakketten" element={<BranchSectionPage branch="ecommerce" section="pakketten" />} />
          <Route path="/ecommerce/reviews" element={<BranchSectionPage branch="ecommerce" section="reviews" />} />
          <Route path="/ecommerce/contact" element={<BranchSectionPage branch="ecommerce" section="contact-form" />} />
          <Route path="/ecommerce/faq" element={<BranchSectionPage branch="ecommerce" section="faq" />} />
          
          {/* Legal pages */}
          <Route path="/privacybeleid" element={<PrivacyPolicy />} />
          <Route path="/algemene-voorwaarden" element={<TermsConditions />} />
          <Route path="/bedankt" element={<Bedankt />} />
          <Route path="/intake" element={<IntakeForm />} />
          <Route path="/intake/:section" element={<IntakeForm />} />
          <Route path="/nettocheck" element={<NettoCheck />} />
          <Route path="/slim-chatbot" element={<SlimChatbot />} />
          <Route path="/slim-chatbot-instellingen" element={<SlimChatbotInstellingen />} />
          <Route path="/belastingformulier-2024" element={<TaxForm2024 />} />

          {/* Catch-all route - redirect to homepage */}
          <Route path="*" element={<HomePage />} />
        </Routes>
        <Footer />
        <WhatsAppPopup />
      </div>
    </Router>
  );
}

export default App;