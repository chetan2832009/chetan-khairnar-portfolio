import React, { useEffect, useRef, useState } from "react";
import "./AboutMe.css";

// Custom lightweight effects inspired by Framer-style Card Reveal and LineMaskSplit.
export default function AboutMe() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.unobserve(node);
      }
    }, { threshold: 0.18 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="about" className={`about-section ${visible ? "is-visible" : ""}`}>
      <div className="about-inner">
        <div className="about-visual">
          <div className="about-photo-card">
            <img
              src="/assets/portfolio-removebg-preview-EVbdk_41.png"
              alt="Portrait of Chetan Khairnar"
              className="about-photo"
              loading="lazy"
            />
            <div className="about-photo-shade" />
            <span className="about-photo-caption">A LITTLE ABOUT ME</span>
            <span className="about-photo-index">01</span>
          </div>
          <span className="about-orbit about-orbit-one" />
          <span className="about-orbit about-orbit-two" />
        </div>

        <div className="about-copy">
          <p className="about-eyebrow"><span className="about-eyebrow-dot" />GET TO KNOW ME</p>
          <h2 className="about-heading" id="about-heading">
            <span className="about-heading-line"><span>A little</span></span>
            <span className="about-heading-line about-heading-accent"><span>about me.</span></span>
          </h2>

          <div className="about-body">
            <p className="about-intro">
              Hi, I’m <strong>Chetan Khairnar</strong> — a first-year B.Tech student
              specializing in Computer Science and Engineering (AI &amp; ML) at
              Parul Institute of Technology.
            </p>
            <p>
              I’m curious about technology and enjoy exploring how ideas can turn
              into real-world projects. My interest in coding grew after starting
              college, where I began learning programming, experimenting with web
              development, and exploring Artificial Intelligence and Machine Learning.
            </p>
            <p>
              I enjoy learning by building things, solving problems, and trying out
              new technologies. I’m still at the beginning of my journey, and every
              project and experience helps me grow as a developer.
            </p>
            <div className="about-personal-note">
              <span className="about-note-mark">✳</span>
              <p>Outside technology, I also enjoy <strong>classical singing</strong>.
              It gives me a creative balance alongside my technical interests.</p>
            </div>
          </div>

          <div className="about-bottom-line">
            <span>CURIOUS BY NATURE</span><span className="about-bottom-dash" />
            <span>ALWAYS LEARNING</span>
          </div>
        </div>
      </div>
    </section>
  );
}
