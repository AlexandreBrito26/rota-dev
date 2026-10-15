import type { ReactNode } from 'react';
import { useResumeStore } from '@/features/editor/resumeStore';
import { buildResumeStyle, type TemplateId } from './styleConfig';
import { useTemplateStore } from './templateStore';
import styles from './Preview.module.scss';

/** Iniciais para o monograma circular (ex.: "Ana Souza" → "AS"). */
function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

/** Modelos que mostram o monograma circular no cabeçalho. */
const MONOGRAM_TEMPLATES: TemplateId[] = ['bold', 'timeline'];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={styles.block}>
      <h3 className={styles.section}>{title}</h3>
      {children}
    </section>
  );
}

export function Preview() {
  const resume = useResumeStore((s) => s.resume);
  const { template, palette, font } = useTemplateStore();
  const links = resume.links.filter((l) => l.url.trim());
  const languages = resume.languages.filter((l) => l.name.trim());
  const isEmpty =
    !resume.name &&
    !resume.summary &&
    resume.experiences.length === 0 &&
    resume.education.length === 0 &&
    resume.skills.length === 0 &&
    resume.projects.length === 0 &&
    resume.certifications.length === 0 &&
    languages.length === 0 &&
    links.length === 0;

  const summaryBlock = resume.summary ? (
    <Section title="Sobre">
      <p>{resume.summary}</p>
    </Section>
  ) : null;

  const expBlock = resume.experiences.length > 0 ? (
    <Section title="Experiência">
      <ul className={`${styles.projects} ${styles.experience}`}>
        {resume.experiences.map((exp) => (
          <li key={exp.id}>
            <strong>{exp.role}</strong>
            {exp.company && <span> · {exp.company}</span>}
            {exp.period && <p className={styles.projectMeta}>{exp.period}</p>}
            {exp.description && <p>{exp.description}</p>}
          </li>
        ))}
      </ul>
    </Section>
  ) : null;

  const educationBlock = resume.education.length > 0 ? (
    <Section title="Formação">
      <ul className={styles.projects}>
        {resume.education.map((edu) => (
          <li key={edu.id}>
            <strong>{edu.course}</strong>
            {edu.institution && <span> · {edu.institution}</span>}
            {edu.period && <p className={styles.projectMeta}>{edu.period}</p>}
          </li>
        ))}
      </ul>
    </Section>
  ) : null;

  const skillsBlock = resume.skills.length > 0 ? (
    <Section title="Habilidades">
      <ul className={styles.skills}>
        {resume.skills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
    </Section>
  ) : null;

  const languagesBlock = languages.length > 0 ? (
    <Section title="Idiomas">
      <ul className={styles.projects}>
        {languages.map((lang) => (
          <li key={lang.id}>
            <strong>{lang.name}</strong>
            {lang.level && <span className={styles.projectMeta}> · {lang.level}</span>}
          </li>
        ))}
      </ul>
    </Section>
  ) : null;

  const certBlock = resume.certifications.length > 0 ? (
    <Section title="Certificações">
      <ul className={styles.projects}>
        {resume.certifications.map((c) => (
          <li key={c.id}>
            <strong>{c.name}</strong>
            {c.issuer && <span> · {c.issuer}</span>}
            {c.year && <p className={styles.projectMeta}>{c.year}</p>}
          </li>
        ))}
      </ul>
    </Section>
  ) : null;

  const projectsBlock = resume.projects.length > 0 ? (
    <Section title="Projetos em destaque">
      <ul className={styles.projects}>
        {resume.projects.map((project) => (
          <li key={project.url}>
            <a href={project.url} target="_blank" rel="noreferrer">
              {project.name}
            </a>
            {project.description && <p>{project.description}</p>}
            <span className={styles.projectMeta}>
              {project.language ?? 'Sem linguagem'} · ★ {project.stars}
            </span>
          </li>
        ))}
      </ul>
    </Section>
  ) : null;

  const linksBlock = links.length > 0 ? (
    <Section title="Portfólio e links">
      <ul className={styles.projects}>
        {links.map((l) => (
          <li key={l.id}>
            <a href={l.url} target="_blank" rel="noreferrer">
              {l.label || l.url}
            </a>
          </li>
        ))}
      </ul>
    </Section>
  ) : null;

  const showMonogram = MONOGRAM_TEMPLATES.includes(template);
  const monogram = (
    <div className={styles.monogram} aria-hidden="true">
      {initials(resume.name)}
    </div>
  );

  return (
    <article
      className={`${styles.page} ${styles[template] ?? ''}`}
      id="resume-print"
      style={buildResumeStyle(template, palette, font)}
    >
      {isEmpty && (
        <p className={styles.empty}>
          Seu currículo aparece aqui conforme você preenche os dados ou importa do GitHub.
        </p>
      )}

      <header className={styles.head}>
        {showMonogram && monogram}
        <div className={styles.headText}>
          <h2 className={styles.name}>{resume.name || 'Seu nome'}</h2>
          <p className={styles.role}>{resume.title || 'Seu cargo'}</p>
          {resume.email && <p className={styles.meta}>{resume.email}</p>}
        </div>
      </header>

      {template === 'executive' ? (
        <div className={styles.body}>
          <aside className={styles.side}>
            {monogram}
            {skillsBlock}
            {languagesBlock}
            {certBlock}
            {linksBlock}
            {projectsBlock}
          </aside>
          <div className={styles.main}>
            {summaryBlock}
            {expBlock}
            {educationBlock}
          </div>
        </div>
      ) : (
        <div className={styles.flow}>
          {summaryBlock}
          {expBlock}
          {educationBlock}
          {skillsBlock}
          {languagesBlock}
          {certBlock}
          {projectsBlock}
          {linksBlock}
        </div>
      )}
    </article>
  );
}
