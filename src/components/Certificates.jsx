
import React, { useRef, useEffect, useState, useCallback } from 'react';
import './Certificates.css';

const CERTS = [
  {
    id: 1,
    name: "Gemini Certified University Student",
    tag: "CERTIFICATE",
    issuer: "Google",
    image: "/certificates/gemini-certificate.jpg",
    desc: "Recognized as a certified university student by Google Gemini, demonstrating foundational understanding of AI-powered tools and their applications in academic settings.",
  },
  {
    id: 2,
    name: "AWS Cloud Practitioner",
    tag: "CERTIFICATE",
    issuer: "Amazon Web Services",
    image: "/certificates/aws-cloud-practitioner.jpeg",
    desc: "Completed the AWS Cloud Practitioner Essentials course, gaining foundational knowledge of AWS cloud services, core infrastructure, and cloud computing concepts.",
  },
  {
    id: 3,
    name: "Cisco Digital Awareness",
    tag: "CERTIFICATE",
    issuer: "Cisco",
    image: "/certificates/cisco-digital-awareness.jpg",
    desc: "Earned Cisco's Digital Awareness certification, covering essential topics in digital literacy, cybersecurity fundamentals, and responsible online practices.",
  },
  {
    id: 4,
    name: "Monday Funday With Gemini",
    tag: "CERTIFICATE",
    issuer: "Google",
    image: "/certificates/monday-funday-gemini.jpg",
    desc: "Completed the Monday Funday With Gemini challenge, exploring creative and practical use cases of Google's Gemini AI in everyday workflows.",
  },
  {
    id: 5,
    name: "Gemini Certified University Student",
    tag: "BADGE",
    issuer: "Google",
    image: "/certificates/gemini-badge.png",
    desc: "A digital badge awarded by Google recognizing achievement in Gemini AI literacy and practical exploration of AI tools in a university learning context.",
  },
  {
    id: 6,
    name: "AWS Academy Graduate – Cloud Foundations",
    tag: "BADGE",
    issuer: "Amazon Web Services",
    image: "/certificates/aws-cloud-foundations-badge.png",
    desc: "Awarded the AWS Academy Cloud Foundations graduate badge upon completing structured cloud training, validating readiness for entry-level cloud roles.",
  },
  {
    id: 7,
    name: "Digital Awareness – Cisco",
    tag: "BADGE",
    issuer: "Cisco",
    image: "/certificates/cisco-badge.png",
    desc: "A Cisco-issued digital badge confirming completion of the Digital Awareness program, recognizing skills in digital safety, privacy, and online literacy.",
  },
  {
    id: 8,
    name: "Introduction to Gemini",
    tag: "BADGE",
    issuer: "Credly",
    image: "/certificates/credly-badge.png",
    desc: "A digital achievement badge representing continued learning and participation in certification programs, issued via Credly's open badge platform.",
  },
];

const TOTAL = CERTS.length;
const TOTAL_HEIGHT_VH = TOTAL * 100 + 100;

export default function Certificates() {
  const containerRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [flipAngles, setFlipAngles] = useState(Array(TOTAL).fill(0));
  const [bgTextOffset, setBgTextOffset] = useState(0);
  const [entryProgress, setEntryProgress] = useState(0);
  const rafRef = useRef(null);

  const compute = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const scrollable = el.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return;

    const raw = Math.max(0, Math.min(1, -rect.top / scrollable));

    const entry = Math.min(1, raw / 0.05);
    setEntryProgress(entry);

    const flipProgress = Math.max(0, Math.min(1, (raw - 0.03) / 0.94));

    const cardProgress = flipProgress * TOTAL;
    const idx = Math.min(TOTAL - 1, Math.floor(cardProgress));
    setActiveIdx(idx);

    const localP = cardProgress - Math.floor(cardProgress);

    const angles = CERTS.map((_, i) => {
      if (i < idx) return 180;
      if (i === idx) return localP * 180;
      return 0;
    });

    setFlipAngles(angles);
    setBgTextOffset(flipProgress * TOTAL * 600);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(compute);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    compute();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [compute]);

  const activeItem = CERTS[activeIdx];

  return (
    <section
      ref={containerRef}
      id="certificates"
      className="cert-scroll-section"
      style={{ height: `${TOTAL_HEIGHT_VH}vh` }}
    >
      <div className="cert-sticky-viewport">

        {/* Background scrolling description text */}
        <div className="cert-bg-text-track" aria-hidden="true">
          <span
            className="cert-bg-text"
            style={{ transform: `translateX(${-bgTextOffset}px)` }}
          >
            {activeItem.desc}&nbsp;&nbsp;·&nbsp;&nbsp;
            {activeItem.desc}&nbsp;&nbsp;·&nbsp;&nbsp;
            {activeItem.desc}&nbsp;&nbsp;·&nbsp;&nbsp;
            {activeItem.desc}
          </span>
        </div>

        {/* Section header */}
        <header
          className="cert-header"
          style={{
            opacity: entryProgress,
            transform: `translateY(${(1 - entryProgress) * 24}px)`,
          }}
        >
          <p className="cert-eyebrow">
            <span className="cert-eyebrow-dot" />
            CERTIFICATES &amp; BADGES
          </p>

          <h2 className="cert-heading">Earned &amp; Recognised</h2>

          <p className="cert-subheading">
            Scroll to reveal each credential
          </p>
        </header>

        {/* Card stage */}
        <div
          className="cert-stage"
          style={{
            opacity: entryProgress,
            transform: `scale(${0.88 + entryProgress * 0.12})`,
          }}
        >
          {CERTS.map((item, idx) => {
            const angle = flipAngles[idx];
            const isActive = idx === activeIdx;
            const isPast = idx < activeIdx;

            const stackOffset = (idx - activeIdx) * 6;
            const stackScale = 1 - Math.max(0, idx - activeIdx) * 0.025;
            const zIndex = TOTAL - Math.abs(idx - activeIdx);

            return (
              <div
                key={item.id}
                className="cert-card-scene"
                style={{
                  zIndex,
                  transform: `
                    translateY(${isPast ? -8 : stackOffset}px)
                    scale(${isPast ? 0.96 : stackScale})
                  `,
                  opacity: isPast
                    ? 0.35
                    : idx > activeIdx + 1
                      ? Math.max(0.15, 1 - (idx - activeIdx) * 0.25)
                      : 1,
                  transition: 'opacity 0.3s ease, transform 0.3s ease',
                }}
              >
                <div
                  className="cert-card-flipper"
                  style={{ transform: `rotateY(${angle}deg)` }}
                >

                  {/* Front face */}
                  <div className="cert-card cert-card--front">
                    <div className="cert-image-placeholder">
                      <img
                        src={item.image}
                        alt={`${item.name} - ${item.tag}`}
                        className="cert-actual-image"
                      />
                    </div>

                    <div className="cert-card-body">
                      <span className={`cert-tag cert-tag--${item.tag.toLowerCase()}`}>
                        {item.tag}
                      </span>

                      <h3 className="cert-name">{item.name}</h3>

                      <p className="cert-issuer-label">{item.issuer}</p>
                    </div>
                  </div>

                  {/* Back face */}
                  <div className="cert-card cert-card--back">
                    <div className="cert-back-number">
                      {String(item.id).padStart(2, '0')}
                    </div>

                    <div className="cert-back-content">
                      <span className={`cert-tag cert-tag--${item.tag.toLowerCase()}`}>
                        {item.tag}
                      </span>

                      <h3 className="cert-back-name">{item.name}</h3>

                      <p className="cert-back-desc">{item.desc}</p>
                    </div>

                    <div className="cert-back-issuer">{item.issuer}</div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Footer: counter + dots */}
        <footer
          className="cert-footer"
          style={{
            opacity: entryProgress,
            transform: `translateY(${(1 - entryProgress) * 16}px)`,
          }}
        >
          <div className="cert-counter">
            <span className="cert-counter-current">
              {String(activeIdx + 1).padStart(2, '0')}
            </span>

            <span className="cert-counter-sep">/</span>

            <span className="cert-counter-total">
              {String(TOTAL).padStart(2, '0')}
            </span>
          </div>

          <div className="cert-dots">
            {CERTS.map((_, i) => (
              <span
                key={i}
                className={`cert-dot${
                  i === activeIdx
                    ? ' cert-dot--active'
                    : i < activeIdx
                      ? ' cert-dot--done'
                      : ''
                }`}
              />
            ))}
          </div>

          <div className="cert-active-label">
            <span className="cert-active-name">{activeItem.name}</span>
          </div>
        </footer>

      </div>
    </section>
  );
}
