import React, { useState, useEffect, useRef, useMemo } from "react";
import "./Skills.css";

// 12 technologies in 4 curated categories
// Initial spread positions (Stage 1), orbital trajectories (Stage 2 & 3), and constellation rest (Stage 4)
const SKILLS_DATA = [
  // 1. Programming (2)
  {
    id: "c",
    name: "C",
    category: "Programming",
    baseSize: 42,
    accent: false,
    orbitRadius: 260,
    orbitSpeed: 1.1,
    baseAngle: 30, // degrees
    // Stage 1 Editorial Typographic Placement around heading
    s1: { x: -380, y: -130, z: -40, rot: -4, sizeRatio: 1.05 },
    // Stage 4 Constellation Placement
    s4: { x: -320, y: -160, z: 20, rot: -2 }
  },
  {
    id: "python",
    name: "Python",
    category: "Programming",
    baseSize: 52,
    accent: true, // Pink accent
    orbitRadius: 360,
    orbitSpeed: 0.85,
    baseAngle: 120,
    s1: { x: -340, y: 140, z: 50, rot: 3, sizeRatio: 1.25 },
    s4: { x: -260, y: -80, z: 45, rot: 2 }
  },

  // 2. Web Development (4)
  {
    id: "html",
    name: "HTML",
    category: "Web Development",
    baseSize: 36,
    accent: false,
    orbitRadius: 210,
    orbitSpeed: 1.25,
    baseAngle: 210,
    s1: { x: -440, y: 20, z: -30, rot: -6, sizeRatio: 0.9 },
    s4: { x: -140, y: 190, z: 10, rot: -4 }
  },
  {
    id: "css",
    name: "CSS",
    category: "Web Development",
    baseSize: 36,
    accent: false,
    orbitRadius: 310,
    orbitSpeed: 0.95,
    baseAngle: 320,
    s1: { x: 380, y: -140, z: -20, rot: 5, sizeRatio: 0.9 },
    s4: { x: 20, y: 220, z: 30, rot: 3 }
  },
  {
    id: "javascript",
    name: "JavaScript",
    category: "Web Development",
    baseSize: 50,
    accent: false,
    orbitRadius: 420,
    orbitSpeed: 0.75,
    baseAngle: 75,
    s1: { x: 360, y: 120, z: 60, rot: -3, sizeRatio: 1.2 },
    s4: { x: 180, y: 180, z: 40, rot: -2 }
  },
  {
    id: "react",
    name: "React",
    category: "Web Development",
    baseSize: 62,
    accent: true, // Key focal transformation pillar
    orbitRadius: 280,
    orbitSpeed: 1.05,
    baseAngle: 280,
    s1: { x: 420, y: -30, z: 40, rot: 4, sizeRatio: 1.4 },
    s4: { x: 310, y: 130, z: 55, rot: 3 }
  },

  // 3. AI & Machine Learning (2) - The Focus Transformation core
  {
    id: "ai",
    name: "Artificial Intelligence",
    category: "AI & Machine Learning",
    baseSize: 68,
    accent: true, // PRIMARY FOCAL CENTER FOR STAGE 3
    isFocalLead: true,
    orbitRadius: 180,
    orbitSpeed: 0.65,
    baseAngle: 0,
    s1: { x: -120, y: -190, z: 80, rot: -2, sizeRatio: 1.35 },
    s4: { x: -60, y: -190, z: 70, rot: -1 }
  },
  {
    id: "ml",
    name: "Machine Learning",
    category: "AI & Machine Learning",
    baseSize: 58,
    accent: false,
    orbitRadius: 380,
    orbitSpeed: 0.8,
    baseAngle: 160,
    s1: { x: 180, y: -180, z: 30, rot: 2, sizeRatio: 1.2 },
    s4: { x: 160, y: -170, z: 60, rot: 2 }
  },

  // 4. Cloud & Tools (4)
  {
    id: "aws",
    name: "AWS",
    category: "Cloud & Tools",
    baseSize: 46,
    accent: true,
    orbitRadius: 340,
    orbitSpeed: 1.15,
    baseAngle: 240,
    s1: { x: -200, y: 190, z: 40, rot: -5, sizeRatio: 1.1 },
    s4: { x: -330, y: 70, z: 35, rot: -3 }
  },
  {
    id: "git",
    name: "Git",
    category: "Cloud & Tools",
    baseSize: 34,
    accent: false,
    orbitRadius: 240,
    orbitSpeed: 1.3,
    baseAngle: 45,
    s1: { x: -80, y: 220, z: -50, rot: 3, sizeRatio: 0.85 },
    s4: { x: -200, y: 90, z: 15, rot: 2 }
  },
  {
    id: "github",
    name: "GitHub",
    category: "Cloud & Tools",
    baseSize: 44,
    accent: false,
    orbitRadius: 330,
    orbitSpeed: 0.9,
    baseAngle: 195,
    s1: { x: 120, y: 220, z: 20, rot: -2, sizeRatio: 1.0 },
    s4: { x: 260, y: -60, z: 45, rot: -2 }
  },
  {
    id: "vscode",
    name: "VS Code",
    category: "Cloud & Tools",
    baseSize: 38,
    accent: false,
    orbitRadius: 400,
    orbitSpeed: 0.7,
    baseAngle: 305,
    s1: { x: 260, y: 180, z: -30, rot: 4, sizeRatio: 0.9 },
    s4: { x: 340, y: 30, z: 25, rot: 3 }
  }
];

const CATEGORIES = [
  "All",
  "Programming",
  "Web Development",
  "AI & Machine Learning",
  "Cloud & Tools"
];

// Smooth cubic ease for fluid natural motion
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function Skills() {
  const containerRef = useRef(null);

  // Scroll progression state: 0 to 1
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeStage, setActiveStage] = useState(1);

  // Active filter
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [focusedSkill, setFocusedSkill] = useState(null);

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
          const totalScroll = container.offsetHeight - window.innerHeight;
          if (totalScroll <= 0) return;

          const scrolled = -rect.top;
          const progress = Math.min(Math.max(scrolled / totalScroll, 0), 1);
          setScrollProgress(progress);

          // 4 distinct artistic phases
          if (progress < 0.24) {
            setActiveStage(1); // Typographic Intro
          } else if (progress < 0.56) {
            setActiveStage(2); // Orbital Motion
          } else if (progress < 0.82) {
            setActiveStage(3); // Focus Transformation
          } else {
            setActiveStage(4); // Skill Constellation
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

  const jumpToStage = (stg) => {
    const container = containerRef.current;
    if (!container) return;
    const totalScroll = container.offsetHeight - window.innerHeight;
    const targets = { 1: 0.05, 2: 0.38, 3: 0.68, 4: 0.95 };
    const targetY = container.offsetTop + (targets[stg] || 0.05) * totalScroll;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  // Responsive scaling
  const scale = windowWidth < 640 ? 0.48 : windowWidth < 960 ? 0.72 : 1.0;

  // --------------------------------------------------------------------------
  // SMOOTH STAGE TRANSITIONS
  // --------------------------------------------------------------------------
  // Stage 1 -> 2: Progress from 0.08 to 0.40 (Enters Orbital Motion)
  const tOrbitRaw = (scrollProgress - 0.08) / (0.40 - 0.08);
  const tOrbit = easeInOutCubic(Math.min(Math.max(tOrbitRaw, 0), 1));

  // Stage 2 -> 3: Progress from 0.46 to 0.74 (Focus Transformation)
  const tFocusRaw = (scrollProgress - 0.46) / (0.74 - 0.46);
  const tFocus = easeInOutCubic(Math.min(Math.max(tFocusRaw, 0), 1));

  // Stage 3 -> 4: Progress from 0.76 to 0.96 (Settle into Constellation)
  const tConstellRaw = (scrollProgress - 0.76) / (0.96 - 0.76);
  const tConstell = easeInOutCubic(Math.min(Math.max(tConstellRaw, 0), 1));

  // Central Heading dynamic motion & fading
  // At stage 1, heading is fully centered and prominent.
  // At stage 2, heading scales down slightly and recedes in Z.
  // At stage 3, focal skill takes stage center, heading stays as an anchor badge.
  // At stage 4, heading settles into the top center of the constellation.
  const headingScale = 1 - tOrbit * 0.18 + tConstell * 0.06;
  const headingOpacity = 1 - tFocus * 0.45 + tConstell * 0.35;

  return (
    <section
      ref={containerRef}
      id="skills"
      className="orbit-scroll-section"
      aria-label="Skills & Technologies — Interactive Skill Orbit"
    >
      <div className="orbit-sticky-viewport">
        {/* Subtle Architectural Orbit Lines & Geometry (Warm White / Editorial) */}
        <div className="orbit-geometry-layer" aria-hidden="true">
          <div
            className="orbit-ring ring-inner"
            style={{
              transform: `translate(-50%, -50%) rotateX(${64 - tOrbit * 12}deg) rotateZ(${scrollProgress * 45}deg) scale(${0.85 + tOrbit * 0.25})`
            }}
          />
          <div
            className="orbit-ring ring-middle"
            style={{
              transform: `translate(-50%, -50%) rotateX(${68 - tOrbit * 10}deg) rotateZ(${-scrollProgress * 35}deg) scale(${0.9 + tOrbit * 0.2})`
            }}
          />
          <div
            className="orbit-ring ring-outer"
            style={{
              transform: `translate(-50%, -50%) rotateX(${72 - tOrbit * 8}deg) rotateZ(${scrollProgress * 25}deg) scale(${0.95 + tOrbit * 0.15})`
            }}
          />

          {/* Focal Crosshairs & Subtle Coordinate Marks */}
          <span className="orbit-crosshair ch-tl" />
          <span className="orbit-crosshair ch-tr" />
          <span className="orbit-crosshair ch-bl" />
          <span className="orbit-crosshair ch-br" />
        </div>

        {/* Top Header / Eyebrow & Stage Indicators */}
        <header className="orbit-top-header">
          <div className="orbit-eyebrow">
            <span className="orbit-eyebrow-dot" />
            <span>TECHNICAL IDENTITY</span>
          </div>

          <div className="orbit-stage-pills" role="tablist" aria-label="Orbit animation phases">
            <button
              type="button"
              className={`orbit-stage-pill ${activeStage === 1 ? "is-active" : ""}`}
              onClick={() => jumpToStage(1)}
              title="Stage 1: Typographic Intro"
            >
              <span className="pill-num">01</span>
              <span className="pill-text">TYPOGRAPHY</span>
            </button>
            <span className="pill-sep" />
            <button
              type="button"
              className={`orbit-stage-pill ${activeStage === 2 ? "is-active" : ""}`}
              onClick={() => jumpToStage(2)}
              title="Stage 2: Orbital Motion"
            >
              <span className="pill-num">02</span>
              <span className="pill-text">ORBIT</span>
            </button>
            <span className="pill-sep" />
            <button
              type="button"
              className={`orbit-stage-pill ${activeStage === 3 ? "is-active" : ""}`}
              onClick={() => jumpToStage(3)}
              title="Stage 3: Focus Transformation"
            >
              <span className="pill-num">03</span>
              <span className="pill-text">FOCUS</span>
            </button>
            <span className="pill-sep" />
            <button
              type="button"
              className={`orbit-stage-pill ${activeStage === 4 ? "is-active" : ""}`}
              onClick={() => jumpToStage(4)}
              title="Stage 4: Skill Constellation"
            >
              <span className="pill-num">04</span>
              <span className="pill-text">CONSTELLATION</span>
            </button>
          </div>
        </header>

        {/* Main Interactive Typographic Stage Canvas */}
        <div className="orbit-stage-canvas">
          {/* Central Expressive Typography Heading */}
          <div
            className="orbit-central-heading-wrap"
            style={{
              transform: `translate(-50%, -50%) scale(${headingScale})`,
              opacity: headingOpacity
            }}
          >
            <h2 className="orbit-main-title">
              Things I'm Learning<br />
              <span className="orbit-title-accent">&amp; Building.</span>
            </h2>
            <p className="orbit-caption-text">
              An interactive universe of languages, architectures, and learning frontiers.
            </p>
          </div>

          {/* Focal Transformation Spotlight Card (appears in Stage 3) */}
          <div
            className="orbit-focal-spotlight"
            style={{
              opacity: tFocus * (1 - tConstell * 0.9),
              transform: `translate(-50%, -50%) scale(${0.7 + tFocus * 0.3})`,
              pointerEvents: tFocus > 0.4 && tConstell < 0.6 ? "auto" : "none"
            }}
          >
            <div className="focal-inner-glow" />
            <span className="focal-category-pill">AI &amp; MACHINE LEARNING</span>
            <div className="focal-headline">Artificial Intelligence</div>
            <p className="focal-annotation">
              Exploring neural models, computer vision, data analysis, and predictive architectures at Parul Institute of Technology.
            </p>
            <div className="focal-companions">
              <span className="companion-tag">Python</span>
              <span className="companion-tag">Machine Learning</span>
              <span className="companion-tag">C</span>
            </div>
          </div>

          {/* 3D Typographic Orbiting Skills */}
          <div className="orbit-typographic-system">
            {SKILLS_DATA.map((skill) => {
              // 1. Stage 1 coordinates (Static editorial spread)
              const p1X = skill.s1.x;
              const p1Y = skill.s1.y;
              const p1Z = skill.s1.z;
              const p1Rot = skill.s1.rot;

              // 2. Stage 2 Orbital Motion coordinates (Parametric elliptical 3D orbit)
              // Calculate dynamic angle linked directly to scrollProgress
              const angleDeg = skill.baseAngle + scrollProgress * 280 * skill.orbitSpeed;
              const rad = (angleDeg * Math.PI) / 180;
              // Elliptical planar coordinates with perspective tilt
              const p2X = Math.cos(rad) * skill.orbitRadius;
              const p2Y = Math.sin(rad) * (skill.orbitRadius * 0.42); // compressed Y gives 3D plane tilt
              const p2Z = Math.sin(rad) * 160; // Z oscillation closer and farther from viewer
              const p2Rot = Math.cos(rad) * 8; // subtle tilting as it travels

              // 3. Stage 3 Focus Transformation coordinates
              // If this is the focal lead ("Artificial Intelligence"), it moves to center-stage (0, -40, 180)
              // Others push outwards to clear space for the focal hero
              let p3X = p2X * 1.55;
              let p3Y = p2Y * 1.45;
              let p3Z = p2Z - 80;
              let p3Rot = p2Rot * 1.2;
              let p3Scale = 0.85;

              if (skill.isFocalLead) {
                p3X = 0;
                p3Y = -50;
                p3Z = 220;
                p3Rot = 0;
                p3Scale = 1.35;
              } else if (skill.category === "AI & Machine Learning" || skill.id === "python") {
                // Related skills hover closer around focal center
                p3X = p2X * 0.9;
                p3Y = p2Y * 0.9;
                p3Z = 90;
                p3Scale = 1.05;
              }

              // 4. Stage 4 Constellation coordinates (Stable harmonious arrangement)
              const p4X = skill.s4.x;
              const p4Y = skill.s4.y;
              const p4Z = skill.s4.z;
              const p4Rot = skill.s4.rot;

              // Smoothly blend across the 4 stages
              // Stage 1 -> 2
              let curX = p1X + (p2X - p1X) * tOrbit;
              let curY = p1Y + (p2Y - p1Y) * tOrbit;
              let curZ = p1Z + (p2Z - p1Z) * tOrbit;
              let curRot = p1Rot + (p2Rot - p1Rot) * tOrbit;
              let curScale = 1.0;

              // Stage 2 -> 3
              if (tFocus > 0) {
                curX = curX + (p3X - curX) * tFocus;
                curY = curY + (p3Y - curY) * tFocus;
                curZ = curZ + (p3Z - curZ) * tFocus;
                curRot = curRot + (p3Rot - curRot) * tFocus;
                curScale = 1.0 + (p3Scale - 1.0) * tFocus;
              }

              // Stage 3 -> 4
              if (tConstell > 0) {
                curX = curX + (p4X - curX) * tConstell;
                curY = curY + (p4Y - curY) * tConstell;
                curZ = curZ + (p4Z - curZ) * tConstell;
                curRot = curRot + (p4Rot - curRot) * tConstell;
                curScale = curScale + (1.0 - curScale) * tConstell;
              }

              // Depth opacity: objects farther back in Z are slightly softened
              const depthOpacity = Math.max(0.4, Math.min(1, 0.75 + curZ / 500));
              const isDimmed = activeCategory !== "All" && skill.category !== activeCategory;
              const isHovered = hoveredSkill === skill.id;
              const isFocused = focusedSkill?.id === skill.id;

              return (
                <div
                  key={skill.id}
                  className={`orbit-skill-node ${skill.accent ? "is-accent" : ""} ${isDimmed ? "is-dimmed" : ""} ${isHovered ? "is-hovered" : ""} ${isFocused ? "is-selected" : ""}`}
                  style={{
                    transform: `translate3d(${curX * scale}px, ${curY * scale}px, ${curZ * scale}px) rotateZ(${curRot}deg) scale(${curScale})`,
                    opacity: isDimmed ? 0.2 : depthOpacity,
                    zIndex: Math.round(100 + curZ)
                  }}
                  onMouseEnter={() => setHoveredSkill(skill.id)}
                  onMouseLeave={() => setHoveredSkill(null)}
                  onClick={() => setFocusedSkill(focusedSkill?.id === skill.id ? null : skill)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${skill.name} — ${skill.category}`}
                >
                  <div className="skill-typography-wrap">
                    {/* Subtle constellation orbit node point */}
                    <span className="skill-node-bullet" />
                    <span className="skill-typography-text">{skill.name}</span>
                    <span className="skill-category-label">{skill.category}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Interactive Filter & Editorial Detail Bar */}
        <footer className="orbit-bottom-bar">
          <div className="orbit-category-nav" role="toolbar" aria-label="Category filters">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`orbit-cat-btn ${activeCategory === cat ? "is-active" : ""}`}
                onClick={() => {
                  setActiveCategory(cat);
                  setFocusedSkill(null);
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="orbit-footer-status">
            {focusedSkill ? (
              <div className="orbit-focus-pill">
                <span className="focus-dot" />
                <span className="focus-cat">{focusedSkill.category}</span>
                <span className="focus-sep">·</span>
                <strong className="focus-title">{focusedSkill.name}</strong>
                <button
                  type="button"
                  className="focus-close-btn"
                  onClick={() => setFocusedSkill(null)}
                  title="Clear focus"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="orbit-scroll-hint">
                <span className="hint-glyph">✦</span>
                <span>Scroll to travel through the orbit · Click any technology to inspect</span>
              </div>
            )}
          </div>
        </footer>
      </div>
    </section>
  );
}
