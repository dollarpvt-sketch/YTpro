
import React from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import ToolsShowcase from './components/ToolsShowcase';
import PricingSection from './components/PricingSection';
import AffiliateSection from './components/AffiliateSection';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="bg-background text-text-main font-sans">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <ToolsShowcase />
        <PricingSection />
        <AffiliateSection />
      </main>
      <Footer />
    </div>
  );
};

export default App;
