import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import OrganizationObjectives from './components/OrganizationObjectives';
import OrganizationAwards from './components/OrganizationAwards';
import SuccessStories from './components/SuccessStories';
import HowToHelp from './components/HowToHelp';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={
            <>
              <Header />
              <Hero />
              <About />
              <Services />
              <OrganizationObjectives />
              <OrganizationAwards />
              <SuccessStories />
              <HowToHelp />
              <Contact />
            </>
          } />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
        <Routes>
          <Route path="/" element={
            <>
              <Footer />
              <WhatsAppButton />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;