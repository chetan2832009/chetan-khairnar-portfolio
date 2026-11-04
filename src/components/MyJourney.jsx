import React, { useState, useEffect, useRef, useCallback } from "react";
import "./MyJourney.css";

const MILESTONES = [
  {
    id: "01",
    tag: "COMMUNITY & LEARNING",
    title: "AWS Community Day",
    subtitle: "Cloud Insights & Networking",
    desc: "Exploring the world of cloud computing, connecting with the tech community, and gaining insights into AWS technologies and real-world applications.",
    image: "/journey/aws-community-day.jpg.jpeg",
    // 3D positioning coordinates in Unified vs Expanded state
    // gridCol: 0, gridRow: 0
    uX: -100, uY: -50,
    eX: -320, eY: -160, eZ: 60,
    rotX: 6, rotY: 14, rotZ: -3
  },
  {
    id: "02",
    tag: "HANDS-ON LEARNING",
    title: "AWS Bootcamp",
    subtitle: "Parul University",
    desc: "A three-day hands-on learning experience at Parul University, exploring AWS services, cloud infrastructure, and practical cloud deployment.",
    image: "/journey/aws-bootcamp.jpg.jpeg",
    // gridCol: 1, gridRow: 0
    uX: 0, uY: -50,
    eX: 0, eY: -210, eZ: 110,
    rotX: 10, rotY: -2, rotZ: 1
  },
  {
    id: "03",
    tag: "CREATIVE PASSION",
    title: "Singing & PIT's Got Talent",
    subtitle: "Creative Side of Campus",
    desc: "Beyond technology, music has always been a part of my journey. Participating in PIT's Got Talent gave me an opportunity to express my passion for singing and experience the creative side of college life.",
    image: "/journey/pit-got-talent.jpg.jpeg",
    // gridCol: 2, gridRow: 0
    uX: 100, uY: -50,
    eX: 320, eY: -160, eZ: 40,
    rotX: 5, rotY: -15, rotZ: 3
  },
  {
    id: "04",
    tag: "WEB DEVELOPMENT",
    title: "DiwaliVerse",
    subtitle: "Interactive Celebration",
    desc: "My creative web development project, bringing the festive spirit of Diwali to life through interactive experiences, thoughtful design, and technology.",
    image: "/journey/diwaliverse.jpg.jpeg",
    // gridCol: 0, gridRow: 1
    uX: -100, uY: 50,
    eX: -300, eY: 170, eZ: 80,
    rotX: -8, rotY: 12, rotZ: 2
  },
  {
    id: "05",
    tag: "SKILLS & RECOGNITION",
    title: "Certificates & Achievements",
    subtitle: "Learning Steps",
    desc: "Every certificate represents a step forward in my learning journey, from exploring new technologies to developing skills and gaining knowledge through different learning opportunities.",
    image: "/journey/achievements.jpg.jpeg",
    // gridCol: 1, gridRow: 1
    uX: 0, uY: 50,
    eX: 0, eY: 220, eZ: 130,
    rotX: -11, rotY: -1, rotZ: -2
  },
  {
    id: "06",
    tag: "CLOUD COMMUNITY",
    title: "AWS Builder Connect, Ahmedabad",
    subtitle: "Industry Perspectives",
    desc: "An opportunity to connect with the cloud community, explore AWS technologies, learn from industry experiences, and discover new perspectives in the world of cloud computing.",
    image: "/journey/aws-builder-connect.jpg.jpeg",
    // gridCol: 2, gridRow: 1
    uX: 100, uY: 50,
    eX: 300, eY: 170, eZ: 50,
    rotX: -6, rotY: -14, rotZ: -3
  }
];

export default function MyJourney() {
  const containerRef = useRef(null);
  const stageRef = useRef(null);

  // Scroll progression state: 0 (Unified) -> 0.5 (Expand) -> 1.0 (Flip)
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeStage, setActiveStage] = useState(1); // 1: Unified, 2: Expand, 3: Flip

  // Interactive user drag rotation
  const [dragRotX, setDragRotX] = useState(0);
  const [dragRotY, setDragRotY] = useState(0);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, startRotX: 0, startRotY: 0 });

  // Selected milestone index (clicked card)
  const [selectedIdx, setSelectedIdx] = useState(null);

  // Manual flip state overrides per card
  const [flippedCards, setFlippedCards] = useState({});

  // Responsive scale factor based on viewport width
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Track scroll position inside sticky section
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const container = containerRef.current;
          if (!container) return;

          const rect = container.getBoundingClientRect();
          const totalScrollDistance = container.offsetHeight - window.innerHeight;

          if (totalScrollDistance <= 0) return;

          // How far into the container we have scrolled (0 to 1)
          const scrolled = -rect.top;
          const progress = Math.min(Math.max(scrolled / totalScrollDistance, 0), 1);
          setScrollProgress(progress);

          if (progress < 0.28) {
            setActiveStage(1); // Unified
          } else if (progress < 0.72) {
            setActiveStage(2); // Expand
          } else {
            setActiveStage(3); // Flip
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Pointer drag for rotating 3D stage
  const onPointerDown = (e) => {
    // Only drag on stage background or panels
    isDragging.current = true;
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      startRotX: dragRotX,
      startRotY: dragRotY
    };
  };

  const onPointerMove = (e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    // Rotate horizontally & subtle tilt vertically
    setDragRotY(dragStart.current.startRotY + dx * 0.18);
    setDragRotX(
      Math.max(
        Math.min(dragStart.current.startRotX - dy * 0.12, 25),
        -25
      )
    );
  };

  const onPointerUp = () => {
    isDragging.current = false;
  };

  const resetRotation = () => {
    setDragRotX(0);
    setDragRotY(0);
  };

  const handleCardClick = (idx, e) => {
    e.stopPropagation();
    setSelectedIdx(selectedIdx === idx ? null : idx);
    setFlippedCards((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  // Jump to specific animation stage
  const jumpToStage = (stageNum) => {
    const container = containerRef.current;
    if (!container) return;
    const totalScroll = container.offsetHeight - window.innerHeight;
    const targetProgress = stageNum === 1 ? 0.05 : stageNum === 2 ? 0.48 : 0.95;
    const targetY = container.offsetTop + targetProgress * totalScroll;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  // Compute card transforms based on scrollProgress
  // Stage 1 (0 to 0.3): Unified composition
  // Transition 1 -> 2 (0.25 to 0.55): Expanding apart
  // Stage 2 (0.50 to 0.70): Floating with full depth
  // Transition 2 -> 3 (0.65 to 0.95): Rotating 180deg to back
  // Stage 3 (0.90 to 1.0): Flipped cards revealing back details

  // Scale down translation for smaller mobile screens
  const scale = windowWidth < 640 ? 0.48 : windowWidth < 900 ? 0.72 : 1.0;

  return (
    <section
      ref={containerRef}
      id="journey"
      className="journey-scroll-section"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <div className="journey-sticky-viewport">
        {/* Ambient decorative elements */}
        <div className="journey-ambient-glow" />
        <div className="journey-grid-pattern" />

        {/* Section Header */}
        <header className="journey-header">
          <div className="journey-eyebrow">
            <span className="journey-eyebrow-dot" />
            <span>MY JOURNEY</span>
          </div>
          <h2 className="journey-title">
            Glimpses of Journey
          </h2>
          <p className="journey-subtitle">
            Scroll to decompose the canvas into floating panels and reveal the stories behind each milestone.
          </p>

          {/* Stage Switcher / Indicators */}
          <div className="journey-stage-bar">
            <button
              type="button"
              className={`journey-stage-btn ${activeStage === 1 ? "is-active" : ""}`}
              onClick={() => jumpToStage(1)}
              title="Stage 1: Unified Canvas"
            >
              <span className="stage-num">01</span>
              <span className="stage-label">UNIFIED</span>
            </button>
            <div className="journey-stage-line" />
            <button
              type="button"
              className={`journey-stage-btn ${activeStage === 2 ? "is-active" : ""}`}
              onClick={() => jumpToStage(2)}
              title="Stage 2: Expand & Parallax"
            >
              <span className="stage-num">02</span>
              <span className="stage-label">EXPAND</span>
            </button>
            <div className="journey-stage-line" />
            <button
              type="button"
              className={`journey-stage-btn ${activeStage === 3 ? "is-active" : ""}`}
              onClick={() => jumpToStage(3)}
              title="Stage 3: 3D Flip"
            >
              <span className="stage-num">03</span>
              <span className="stage-label">FLIP</span>
            </button>
          </div>
        </header>

        {/* 3D Stage Container */}
        <div className="journey-stage-wrapper">
          <div
            ref={stageRef}
            className="journey-3d-stage"
            style={{
              transform: `perspective(1400px) rotateX(${dragRotX}deg) rotateY(${dragRotY}deg)`
            }}
          >
            {MILESTONES.map((item, idx) => {
              // Expansion factor: 0 in stage 1, smoothly goes to 1 in stage 2
              // Expand starts at 0.18, completes at 0.58
              const expandRaw = (scrollProgress - 0.18) / (0.58 - 0.18);
              const expandT = Math.min(Math.max(expandRaw, 0), 1);
              // Ease function for silky physical expansion
              const easeExpand =
                expandT < 0.5
                  ? 2 * expandT * expandT
                  : -1 + (4 - 2 * expandT) * expandT;

              // Flip factor: 0 in stage 1 & 2, smoothly flips 180deg in stage 3
              // Flip starts at 0.64, completes at 0.94
              // Staggered slightly by index for a cascading wave
              const stagger = idx * 0.025;
              const flipRaw = (scrollProgress - (0.64 + stagger)) / (0.28);
              const flipT = Math.min(Math.max(flipRaw, 0), 1);
              const easeFlip =
                flipT < 0.5
                  ? 2 * flipT * flipT
                  : -1 + (4 - 2 * flipT) * flipT;

              // Card positions interpolating from Unified to Expanded
              const curX = (item.uX + (item.eX - item.uX) * easeExpand) * scale;
              const curY = (item.uY + (item.eY - item.uY) * easeExpand) * scale;
              const curZ = (item.eZ * easeExpand) * scale;

              // Angles
              const curRotX = item.rotX * easeExpand;
              const baseRotY = item.rotY * easeExpand;
              // Flip rotation (around Y axis)
              const manualFlipped = !!flippedCards[idx];
              const scrollFlipAngle = easeFlip * 180;
              const finalFlipAngle = manualFlipped
                ? (scrollFlipAngle >= 90 ? 0 : 180)
                : scrollFlipAngle;

              const isSelected = selectedIdx === idx;

              return (
                <div
                  key={item.id}
                  className={`journey-panel-card ${isSelected ? "is-selected" : ""}`}
                  style={{
                    transform: `translate3d(${curX}px, ${curY}px, ${curZ}px) rotateX(${curRotX}deg) rotateY(${baseRotY + finalFlipAngle}deg)`
                  }}
                  onClick={(e) => handleCardClick(idx, e)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleCardClick(idx, e);
                    }
                  }}
                  aria-label={`${item.title} - Milestone ${item.id}. Click to flip or select.`}
                >
                  <div className="journey-card-inner">
                    {/* Front Face (Original SVG Artwork) */}
                    <div className="journey-card-face journey-card-front">
                      <div className="journey-card-image-wrap">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="journey-card-image"
                          loading="lazy"
                          draggable={false}
                        />
                        <div className="journey-card-glare" />
                      </div>
                      <div className="journey-card-front-bar">
                        <span className="journey-card-badge">{item.id}</span>
                        <span className="journey-card-front-title">{item.title}</span>
                        <span className="journey-card-flip-hint">FLIP ↻</span>
                      </div>
                    </div>

                    {/* Back Face (Milestone Details) */}
                    <div className="journey-card-face journey-card-back">
                      <div className="journey-back-header">
                        <span className="journey-back-pill">MILESTONE · {item.id}</span>
                        <span className="journey-back-dot" />
                      </div>
                      <div className="journey-back-content">
                        <span className="journey-back-tag">{item.tag}</span>
                        <h3 className="journey-back-title">{item.title}</h3>
                        <div className="journey-back-subtitle">{item.subtitle}</div>
                        <p className="journey-back-desc">{item.desc}</p>
                      </div>
                      <div className="journey-back-footer">
                        <span className="journey-back-hint">CLICK TO FLIP BACK</span>
                        <span className="journey-back-arrow">↗</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Floating Bottom Navigation & Controls */}
        <footer className="journey-footer-controls">
          <div className="journey-drag-indicator">
            <span className="journey-drag-icon">⟷</span>
            <span>DRAG HORIZONTALLY TO ROTATE 3D PERSPECTIVE</span>
            {(dragRotX !== 0 || dragRotY !== 0) && (
              <button
                type="button"
                className="journey-reset-btn"
                onClick={resetRotation}
              >
                Reset view
              </button>
            )}
          </div>

          <div className="journey-quick-select">
            {MILESTONES.map((m, i) => (
              <button
                key={m.id}
                type="button"
                className={`journey-dot-btn ${selectedIdx === i ? "is-active" : ""}`}
                onClick={(e) => handleCardClick(i, e)}
                title={m.title}
              >
                {m.id}
              </button>
            ))}
          </div>
        </footer>
      </div>
    </section>
  );
}

