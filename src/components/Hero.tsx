import React from 'react'
import PortraitReveal from './PortraitReveal'

export default function Hero() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--warm-white)', color: 'var(--charcoal)', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <header style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 48px', zIndex: 10 }}>
        <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: -0.5, color: 'var(--charcoal)' }}>CK</div>
        <nav style={{ display: 'flex', gap: 32, fontSize: 13, color: '#9a9a9a', fontWeight: 600, letterSpacing: 0.3 }}>
          <span style={{ cursor: 'default' }}>ABOUT</span>
          <span style={{ cursor: 'default' }}>SKILLS</span>
          <span style={{ cursor: 'default' }}>PROJECTS</span>
          <span style={{ cursor: 'default' }}>CONTACT</span>
        </nav>
      </header>

      <main className="hero-main" style={{ position: 'relative', minHeight: '100vh' }}>
        <div className="hero-image-wrap" style={{ position: 'absolute', inset: 0 }}>
          <PortraitReveal radius={300} />
        </div>
        <div className="hero-text" style={{ order: 0 }}>
          <div style={{ fontSize: 11, letterSpacing: 0.2, textTransform: 'uppercase', color: '#8a8a8a', marginBottom: 10, fontWeight: 600 }}>Future AI/ML Engineer</div>
          <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 'clamp(52px, 6vw, 96px)', lineHeight: 0.92, margin: 0, letterSpacing: -2, fontWeight: 500 }}>CHETAN<br/>KHAIRNAR</h1>
        </div>
      </main>
    </div>
  )
}
