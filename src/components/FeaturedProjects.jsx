import { useState } from "react";
import "./FeaturedProjects.css";

const projects = [
  {
    id: "diwali",
    number: "01",
    name: "DiwaliVerse",
    category: "CREATIVE WEB EXPERIENCE",
    status: "LIVE PROJECT",
    tagline: "A little light, a lot of happiness.",
    description:
      "An interactive Diwali greeting experience where people can create personalized festive wishes and share them with others.",
    image: "/projects/diwaliverse-cover.png",
    features: [
      "Interactive 3D diya experience",
      "Personalized festive blessings",
      "WhatsApp sharing",
      "Short-link sharing",
    ],
    technologies: ["React", "Vite", "Tailwind CSS"],
    link: "https://diwaliverse.netlify.app",
    linkLabel: "LIVE PREVIEW ↗",
  },
  {
    id: "expense",
    number: "02",
    name: "ExpensePro",
    category: "PERSONAL FINANCE APPLICATION",
    status: "WORKING PROTOTYPE",
    tagline: "Take control of your finances.",
    description:
      "A personal expense tracker designed to help users monitor income, expenses and monthly budgets through a simple dashboard.",
    image: "/projects/expense-pro/expense-dashboard.png",
    gallery: [
      "/projects/expense-pro/expense-login.png",
      "/projects/expense-pro/expense-dashboard.png",
      "/projects/expense-pro/expense-transactions.png",
      "/projects/expense-pro/expense-budget.png",
    ],
    features: [
      "Private name and PIN browser lock",
      "Income and expense dashboard",
      "Transaction management",
      "Monthly budget management",
      "Search and category filtering",
      "Visual financial analytics",
    ],
    technologies: ["HTML", "CSS", "JavaScript"],
    link: null,
    linkLabel: null,
  },
];

function ProjectCard({ project }) {
  const [coverFailed, setCoverFailed] = useState(false);

  return (
    <article className={`case-study case-study-${project.id}`}>
      <div className="case-study-scene">
        <div className="case-study-stack">
          <div className="case-study-back" aria-hidden="true">
            <span>{project.number}</span>
            <span>SELECTED WORK</span>
          </div>

          <div className="case-study-inner">
            <div className="case-study-inner-content">
              <span className="case-study-eyebrow">{project.category}</span>
              <h3>{project.name}</h3>
              <p className="case-study-tagline">{project.tagline}</p>
              <p className="case-study-description">{project.description}</p>

              <div className="case-study-features">
                <span className="case-study-small-label">PROJECT FEATURES</span>
                {project.features.map((feature) => (
                  <div className="case-study-feature" key={feature}>
                    <span aria-hidden="true">✳</span>
                    {feature}
                  </div>
                ))}
              </div>

              <div className="case-study-tech" aria-label="Technologies">
                {project.technologies.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>

              {project.gallery && (
                <div className="case-study-gallery">
                  {project.gallery.map((image, index) => (
                    <img
                      src={image}
                      alt={`${project.name} interface screenshot ${index + 1}`}
                      key={image}
                      loading="lazy"
                    />
                  ))}
                </div>
              )}

              <div className="case-study-bottom">
                <span className="case-study-status">{project.status}</span>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="case-study-link"
                  >
                    {project.linkLabel}
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="case-study-front">
            <div className="case-study-front-top">
              <span>PROJECT {project.number}</span>
              <span>{project.status}</span>
            </div>

            <div className={`case-study-cover-image ${coverFailed ? "cover-image-missing" : ""}`}>
              {!coverFailed ? (
                <img
                  src={project.image}
                  alt={`${project.name} project preview`}
                  onError={() => setCoverFailed(true)}
                />
              ) : (
                <div className="case-study-cover-fallback">
                  <span>{project.name}</span>
                  <small>ADD PROJECT COVER IMAGE</small>
                </div>
              )}
            </div>

            <div className="case-study-front-bottom">
              <div>
                <span className="case-study-eyebrow">{project.category}</span>
                <h2>{project.name}</h2>
                <p>{project.tagline}</p>
              </div>
              <span className="case-study-open">OPEN ↗</span>
            </div>

            <div className="case-study-hover-hint">HOVER TO EXPLORE</div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function FeaturedProjects() {
  return (
    <section className="featured-projects" id="projects">
      <div className="featured-projects-heading">
        <span className="featured-projects-label">SELECTED WORK</span>
        <h2>
          Things I've <span>Built.</span>
        </h2>
        <p>Ideas, experiments and experiences brought to life.</p>
      </div>

      <div className="featured-projects-grid">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <div className="featured-projects-footer">
        <span>02 PROJECTS</span>
        <span>DESIGNED &amp; BUILT WITH CURIOSITY.</span>
      </div>
    </section>
  );
}
