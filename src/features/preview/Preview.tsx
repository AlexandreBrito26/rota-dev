import { useResumeStore } from '@/features/editor/resumeStore';
import { useTemplateStore } from './templateStore';
import { TemplateSelect } from './TemplateSelect';
import styles from './Preview.module.scss';

export function Preview() {
  const resume = useResumeStore((s) => s.resume);
  const template = useTemplateStore((s) => s.template);

  return (
    <>
    <TemplateSelect />
    <article className={`${styles.page} ${styles[template]}`} id="resume-print">
      <header>
        <h2 className={styles.name}>{resume.name || 'Seu nome'}</h2>
        <p className={styles.role}>{resume.title}</p>
        {resume.email && <p className={styles.meta}>{resume.email}</p>}
      </header>

      {resume.summary && (
        <section>
          <h3 className={styles.section}>Sobre</h3>
          <p>{resume.summary}</p>
        </section>
      )}

      {resume.skills.length > 0 && (
        <section>
          <h3 className={styles.section}>Habilidades</h3>
          <ul className={styles.skills}>
            {resume.skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </section>
      )}
      {resume.projects.length > 0 && (
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
      )}
    </article>
    </>
  );
}
