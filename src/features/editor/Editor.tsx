import { useResumeStore } from './resumeStore';
import styles from './Editor.module.scss';

export function Editor() {
  const { resume, update } = useResumeStore();

  return (
    <section className={styles.panel} aria-label="Editor do currículo">
      <h2 className={styles.title}>Dados</h2>

      <label className={styles.field}>
        Nome
        <input value={resume.name} onChange={(e) => update({ name: e.target.value })} />
      </label>

      <label className={styles.field}>
        Cargo
        <input value={resume.title} onChange={(e) => update({ title: e.target.value })} />
      </label>

      <label className={styles.field}>
        E-mail
        <input
          type="email"
          value={resume.email}
          onChange={(e) => update({ email: e.target.value })}
        />
      </label>

      <label className={styles.field}>
        Resumo
        <textarea
          rows={4}
          value={resume.summary}
          onChange={(e) => update({ summary: e.target.value })}
        />
      </label>

      <label className={styles.field}>
        Habilidades (separadas por vírgula)
        <input
          value={resume.skills.join(', ')}
          onChange={(e) =>
            update({
              skills: e.target.value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
        />
      </label>
    </section>
  );
}
