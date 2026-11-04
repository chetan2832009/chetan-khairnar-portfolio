import React from 'react';
import Contact from "./components/Contact";
import FeaturedProjects from "./components/FeaturedProjects";
import Hero from './components/Hero';
import AboutMe from "./components/AboutMe";
import MyJourney from "./components/MyJourney";
import Skills from "./components/Skills";
import Certificates from "./components/Certificates";

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--warm-white)' }}>
      <Hero />
      <AboutMe />
      <MyJourney />
      <Skills />
      <Certificates />
      <FeaturedProjects />
      <Contact />
    </div>
  );
}
