import { useResumeStore } from './resumeStore';
import styles from './Editor.module.scss';

export function Editor() {
  const { resume, update, addExperience, updateExperience, removeExperience } = useResumeStore();

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

      <h3 className={styles.subtitle}>Experiências</h3>
      {resume.experiences.map((exp) => (
        <fieldset key={exp.id} className={styles.exp}>
          <input
            aria-label="Cargo"
            placeholder="Cargo"
            value={exp.role}
            onChange={(e) => updateExperience(exp.id, { role: e.target.value })}
          />
          <input
            aria-label="Empresa"
            placeholder="Empresa"
            value={exp.company}
            onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
          />
          <input
            aria-label="Período"
            placeholder="Período (ex.: 2022 – atual)"
            value={exp.period}
            onChange={(e) => updateExperience(exp.id, { period: e.target.value })}
          />
          <textarea
            aria-label="Descrição"
            placeholder="O que você fez e o impacto"
            rows={2}
            value={exp.description}
            onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
          />
          <button type="button" className={styles.remove} onClick={() => removeExperience(exp.id)}>
            Remover
          </button>
        </fieldset>
      ))}
      <button type="button" className={styles.add} onClick={addExperience}>
        + Adicionar experiência
      </button>
    </section>
  );
}
