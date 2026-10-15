import { useResumeStore } from '@/features/editor/resumeStore';
import { buildResumeStyle } from './styleConfig';
import { useTemplateStore } from './templateStore';
import styles from './Preview.module.scss';

export function Preview() {
  const resume = useResumeStore((s) => s.resume);
  const { template, palette, font } = useTemplateStore();
  const isEmpty =
    !resume.name &&
    !resume.summary &&
    resume.experiences.length === 0 &&
    resume.skills.length === 0 &&
    resume.projects.length === 0;

  const summaryBlock = resume.summary ? (
    <section>
      <h3 className={styles.section}>Sobre</h3>
      <p>{resume.summary}</p>
    </section>
  ) : null;

  const expBlock = resume.experiences.length > 0 ? (
    <section>
      <h3 className={styles.section}>Experiência</h3>
      <ul className={styles.projects}>
        {resume.experiences.map((exp) => (
          <li key={exp.id}>
            <strong>{exp.role}</strong>
            {exp.company && <span> · {exp.company}</span>}
            {exp.period && <p className={styles.projectMeta}>{exp.period}</p>}
            {exp.description && <p>{exp.description}</p>}
          </li>
        ))}
      </ul>
    </section>
  ) : null;

  const skillsBlock = resume.skills.length > 0 ? (
    <section>
      <h3 className={styles.section}>Habilidades</h3>
      <ul className={styles.skills}>
        {resume.skills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
    </section>
  ) : null;

  const projectsBlock = resume.projects.length > 0 ? (
    <section>
      <h3 className={styles.section}>Projetos em destaque</h3>
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
    </section>
  ) : null;

  return (
    <article
      className={`${styles.page} ${styles[template] ?? ''}`}
      id="resume-print"
      style={buildResumeStyle(template, palette, font)}
    >
      {isEmpty && (
        <p className={styles.empty}>
          Seu currículo aparece aqui conforme você preenche os dados ou importa do GitHub e do LinkedIn.
        </p>
      )}

      <header>
        <h2 className={styles.name}>{resume.name || 'Seu nome'}</h2>
        <p className={styles.role}>{resume.title || 'Seu cargo'}</p>
        {resume.email && <p className={styles.meta}>{resume.email}</p>}
      </header>

      {template === 'executive' ? (
        <div className={styles.body}>
          <aside className={styles.side}>
            {skillsBlock}
            {projectsBlock}
          </aside>
          <div>
            {summaryBlock}
            {expBlock}
          </div>
        </div>
      ) : (
        <>
          {summaryBlock}
          {expBlock}
          {skillsBlock}
          {projectsBlock}
        </>
      )}
    </article>
  );
}
