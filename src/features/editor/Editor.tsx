import { useResumeStore } from './resumeStore';
import styles from './Editor.module.scss';

export function Editor() {
  const { resume, update, addExperience, updateExperience, removeExperience } = useResumeStore();

  const updateCertification = (id: string, patch: Partial<{ name: string; issuer: string; year: string }>) =>
    update({
      certifications: resume.certifications.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    });

  const removeCertification = (id: string) =>
    update({ certifications: resume.certifications.filter((c) => c.id !== id) });

  const addCertification = () =>
    update({
      certifications: [
        ...resume.certifications,
        { id: crypto.randomUUID(), name: '', issuer: '', year: '' },
      ],
    });

  const updateLink = (id: string, patch: Partial<{ label: string; url: string }>) =>
    update({ links: resume.links.map((l) => (l.id === id ? { ...l, ...patch } : l)) });

  const removeLink = (id: string) => update({ links: resume.links.filter((l) => l.id !== id) });

  const addLink = () =>
    update({ links: [...resume.links, { id: crypto.randomUUID(), label: '', url: '' }] });

  return (
    <section className={styles.panel} aria-label="Editor do currículo">
      <h2 className={styles.title}>Dados</h2>

      <label className={styles.field}>
        Nome
        <input value={resume.name} onChange={(e) => update({ name: e.target.value })} />
      </label>

      <label className={styles.field}>
        Cargo
        <input
          placeholder="Ex.: Analista de Dados, Professora, Designer, Engenheiro"
          value={resume.title}
          onChange={(e) => update({ title: e.target.value })}
        />
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
          placeholder="Ex.: Excel, Comunicação, Power BI, Liderança"
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

      <h3 className={styles.subtitle}>Certificações</h3>
      {resume.certifications.map((c) => (
        <fieldset key={c.id} className={styles.exp}>
          <input
            aria-label="Nome da certificação"
            placeholder="Nome (ex.: Microsoft Power BI Data Analyst)"
            value={c.name}
            onChange={(e) => updateCertification(c.id, { name: e.target.value })}
          />
          <input
            aria-label="Emissor"
            placeholder="Emissor (ex.: Microsoft, Coursera)"
            value={c.issuer}
            onChange={(e) => updateCertification(c.id, { issuer: e.target.value })}
          />
          <input
            aria-label="Ano"
            placeholder="Ano"
            value={c.year}
            onChange={(e) => updateCertification(c.id, { year: e.target.value })}
          />
          <button type="button" className={styles.remove} onClick={() => removeCertification(c.id)}>
            Remover
          </button>
        </fieldset>
      ))}
      <button type="button" className={styles.add} onClick={addCertification}>
        + Adicionar certificação
      </button>

      <h3 className={styles.subtitle}>Portfólio e links</h3>
      {resume.links.map((l) => (
        <fieldset key={l.id} className={styles.exp}>
          <input
            aria-label="Nome do link"
            placeholder="Nome (ex.: Portfólio, LinkedIn, Dashboard)"
            value={l.label}
            onChange={(e) => updateLink(l.id, { label: e.target.value })}
          />
          <input
            aria-label="Endereço"
            type="url"
            placeholder="https://"
            value={l.url}
            onChange={(e) => updateLink(l.id, { url: e.target.value })}
          />
          <button type="button" className={styles.remove} onClick={() => removeLink(l.id)}>
            Remover
          </button>
        </fieldset>
      ))}
      <button type="button" className={styles.add} onClick={addLink}>
        + Adicionar link
      </button>
    </section>
  );
}
