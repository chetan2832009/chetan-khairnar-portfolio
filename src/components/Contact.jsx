import React, { useState } from "react";
import "./Contact.css";

const EMAIL = "chetankhairnar328@gmail.com";
const LINKEDIN = "https://linkedin.com/in/chetan-khairnar-";
const INSTAGRAM = "https://www.instagram.com/_chetan_khairnar_?obrf=MWlqNDR3eWtzem0yZg%3D%3D";

function SocialIcon({ type }) {
  const common = {
    width: 21,
    height: 21,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  if (type === "linkedin") {
    return (
      <svg {...common}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    );
  }

  if (type === "instagram") {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const update = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const subject = encodeURIComponent(`Portfolio message from ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
    );
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-inner">
        <div className="contact-heading contact-reveal">
          <span className="contact-eyebrow"><span /> HAVE SOMETHING IN MIND?</span>
          <h2>Let's make<br /><span>something meaningful.</span></h2>
          <p>
            Have an idea, an opportunity, or just want to talk about technology?
            Send me a message. I'd be happy to hear from you.
          </p>
          <a className="contact-email" href={`mailto:${EMAIL}`}>
            {EMAIL}<span aria-hidden="true"> ↗</span>
          </a>

          <div className="contact-socials" aria-label="Social links">
            <a href={LINKEDIN} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <SocialIcon type="linkedin" />
            </a>
            <a href={INSTAGRAM} target="_blank" rel="noreferrer" aria-label="Instagram">
              <SocialIcon type="instagram" />
            </a>
            <a href={`mailto:${EMAIL}`} aria-label="Email">
              <SocialIcon type="mail" />
            </a>
          </div>
        </div>

        <form className="contact-form contact-reveal" onSubmit={handleSubmit}>
          <div className="contact-form-top">
            <span>01 — DROP A MESSAGE</span>
            <span className="contact-form-dot" />
          </div>

          <label htmlFor="contact-name">Your name</label>
          <input
            id="contact-name"
            name="name"
            type="text"
            placeholder="What should I call you?"
            value={form.name}
            onChange={update}
            required
          />

          <label htmlFor="contact-email">Your email</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={update}
            required
          />

          <label htmlFor="contact-message">Your message</label>
          <textarea
            id="contact-message"
            name="message"
            placeholder="Tell me a little about it..."
            rows="4"
            value={form.message}
            onChange={update}
            required
          />

          <button className="contact-submit" type="submit">
            <span>Send message</span><span aria-hidden="true">↗</span>
          </button>
          <p className="contact-form-note">
            Your email app will open with the message ready to send.
          </p>
        </form>
      </div>

      <footer className="contact-footer">
        <div className="contact-footer-copy">
          <h3>Still curious. Always building.</h3>
          <p>
            Every idea starts somewhere. This is just one chapter of my journey
            into technology, creativity, and AI.
          </p>
        </div>
        <div className="contact-footer-bottom">
          <span>© 2026 Chetan Khairnar.</span>
          <span className="contact-footer-signature">
            A little creativity. <em>A lot of curiosity.</em>
          </span>
        </div>
      </footer>
    </section>
  );
}
