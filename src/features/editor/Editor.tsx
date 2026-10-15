import { useState, type KeyboardEvent, type ReactNode } from 'react';
import {
  LANGUAGE_LEVELS,
  SUMMARY_MAX,
  getChecklist,
  getCompleteness,
  useResumeStore,
  type Resume,
} from './resumeStore';
import styles from './Editor.module.scss';

function Section({ title, children, defaultOpen = true }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  return (
    <details className={styles.section} open={defaultOpen}>
      <summary className={styles.sectionTitle}>{title}</summary>
      <div className={styles.sectionBody}>{children}</div>
    </details>
  );
}

function Progress() {
  const resume = useResumeStore((s) => s.resume);
  const value = getCompleteness(resume);
  const missing = getChecklist(resume).filter((c) => !c.done);

  return (
    <div className={styles.progress}>
      <div className={styles.progressHead}>
        <span>Seu currículo está {value}% completo</span>
        <span className={styles.progressValue}>{value}%</span>
      </div>
      <div
        className={styles.bar}
        role="progressbar"
        aria-label="Completude do currículo"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
      >
        <span style={{ width: `${value}%` }} />
      </div>
      {missing.length > 0 && (
        <p className={styles.hint}>Falta: {missing.map((m) => m.label.toLowerCase()).join(', ')}.</p>
      )}
    </div>
  );
}

function SkillsInput() {
  const { skills } = useResumeStore((s) => s.resume);
  const update = useResumeStore((s) => s.update);
  const [draft, setDraft] = useState('');

  const commit = () => {
    const value = draft.trim();
    if (!value) return;
    if (!skills.some((s) => s.toLowerCase() === value.toLowerCase())) {
      update({ skills: [...skills, value] });
    }
    setDraft('');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commit();
    } else if (e.key === 'Backspace' && !draft && skills.length > 0) {
      update({ skills: skills.slice(0, -1) });
    }
  };

  return (
    <div className={styles.field}>
      <span>Habilidades</span>
      <div className={styles.chips}>
        {skills.map((skill) => (
          <span key={skill} className={styles.chip}>
            {skill}
            <button
              type="button"
              aria-label={`Remover ${skill}`}
              onClick={() => update({ skills: skills.filter((s) => s !== skill) })}
            >
              ×
            </button>
          </span>
        ))}
        <input
          aria-label="Nova habilidade"
          placeholder={skills.length ? 'Adicionar' : 'Ex.: Excel, Comunicação, Power BI'}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={commit}
        />
      </div>
      <small className={styles.hint}>Pressione Enter ou vírgula para adicionar.</small>
    </div>
  );
}

export function Editor() {
  const { resume, update, addExperience, updateExperience, removeExperience, moveExperience, reset } =
    useResumeStore();

  const updateList = <K extends keyof Resume>(key: K, list: Resume[K]) =>
    update({ [key]: list } as Partial<Resume>);

  const updateCertification = (id: string, patch: Partial<{ name: string; issuer: string; year: string }>) =>
    updateList(
      'certifications',
      resume.certifications.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    );

  const addCertification = () =>
    updateList('certifications', [
      ...resume.certifications,
      { id: crypto.randomUUID(), name: '', issuer: '', year: '' },
    ]);

  const removeCertification = (id: string) =>
    updateList('certifications', resume.certifications.filter((c) => c.id !== id));

  const updateEducation = (id: string, patch: Partial<{ course: string; institution: string; period: string }>) =>
    updateList(
      'education',
      resume.education.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    );

  const addEducation = () =>
    updateList('education', [
      ...resume.education,
      { id: crypto.randomUUID(), course: '', institution: '', period: '' },
    ]);

  const removeEducation = (id: string) =>
    updateList('education', resume.education.filter((e) => e.id !== id));

  const updateLanguage = (id: string, patch: Partial<{ name: string; level: string }>) =>
    updateList(
      'languages',
      resume.languages.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    );

  const addLanguage = () =>
    updateList('languages', [
      ...resume.languages,
      { id: crypto.randomUUID(), name: '', level: LANGUAGE_LEVELS[1] },
    ]);

  const removeLanguage = (id: string) =>
    updateList('languages', resume.languages.filter((l) => l.id !== id));

  const updateLink = (id: string, patch: Partial<{ label: string; url: string }>) =>
    updateList('links', resume.links.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  const removeLink = (id: string) => updateList('links', resume.links.filter((l) => l.id !== id));

  const addLink = () =>
    updateList('links', [...resume.links, { id: crypto.randomUUID(), label: '', url: '' }]);

  const handleReset = () => {
    if (window.confirm('Apagar todos os dados do currículo? Essa ação não pode ser desfeita.')) {
      reset();
    }
  };

  return (
    <section className={styles.panel} aria-label="Editor do currículo">
      <div className={styles.header}>
        <h2 className={styles.title}>Seus dados</h2>
        <button type="button" className={styles.ghost} onClick={handleReset}>
          Limpar tudo
        </button>
      </div>

      <Progress />

      <Section title="Dados pessoais">
        <div className={styles.grid2}>
          <label className={styles.field}>
            Nome
            <input value={resume.name} onChange={(e) => update({ name: e.target.value })} />
          </label>
          <label className={styles.field}>
            E-mail
            <input
              type="email"
              value={resume.email}
              onChange={(e) => update({ email: e.target.value })}
            />
          </label>
        </div>
        <label className={styles.field}>
          Cargo
          <input
            placeholder="Ex.: Analista de Dados, Professora, Designer, Engenheiro"
            value={resume.title}
            onChange={(e) => update({ title: e.target.value })}
          />
        </label>
      </Section>

      <Section title="Resumo">
        <label className={styles.field}>
          <span className={styles.labelRow}>
            Sobre você
            <small className={styles.counter}>
              {resume.summary.length}/{SUMMARY_MAX}
            </small>
          </span>
          <textarea
            rows={4}
            maxLength={SUMMARY_MAX}
            placeholder="Em 2 a 3 frases: quem você é, o que faz bem e o que busca."
            value={resume.summary}
            onChange={(e) => update({ summary: e.target.value })}
          />
          <small className={styles.hint}>Um bom resumo tem entre 150 e 400 caracteres.</small>
        </label>
        <SkillsInput />
      </Section>

      <Section title="Experiências">
        {resume.experiences.length === 0 && (
          <p className={styles.empty}>Nenhuma experiência ainda. Estágios e trabalhos voluntários também contam.</p>
        )}
        {resume.experiences.map((exp, index) => (
          <fieldset key={exp.id} className={styles.card}>
            <legend className={styles.cardLegend}>Experiência {index + 1}</legend>
            <div className={styles.grid2}>
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
            </div>
            <input
              aria-label="Período"
              placeholder="Período (ex.: 2022 – atual)"
              value={exp.period}
              onChange={(e) => updateExperience(exp.id, { period: e.target.value })}
            />
            <textarea
              aria-label="Descrição"
              placeholder="O que você fez e qual foi o impacto (use números quando possível)"
              rows={3}
              value={exp.description}
              onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
            />
            <div className={styles.cardActions}>
              <button
                type="button"
                className={styles.ghost}
                onClick={() => moveExperience(index, -1)}
                disabled={index === 0}
                aria-label="Mover para cima"
              >
                ↑
              </button>
              <button
                type="button"
                className={styles.ghost}
                onClick={() => moveExperience(index, 1)}
                disabled={index === resume.experiences.length - 1}
                aria-label="Mover para baixo"
              >
                ↓
              </button>
              <button type="button" className={styles.danger} onClick={() => removeExperience(exp.id)}>
                Remover
              </button>
            </div>
          </fieldset>
        ))}
        <button type="button" className={styles.add} onClick={addExperience}>
          + Adicionar experiência
        </button>
      </Section>

      <Section title="Formação" defaultOpen={resume.education.length > 0}>
        {resume.education.map((edu, index) => (
          <fieldset key={edu.id} className={styles.card}>
            <legend className={styles.cardLegend}>Formação {index + 1}</legend>
            <input
              aria-label="Curso"
              placeholder="Curso (ex.: Análise e Desenvolvimento de Sistemas)"
              value={edu.course}
              onChange={(e) => updateEducation(edu.id, { course: e.target.value })}
            />
            <div className={styles.grid2}>
              <input
                aria-label="Instituição"
                placeholder="Instituição"
                value={edu.institution}
                onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
              />
              <input
                aria-label="Período da formação"
                placeholder="Período (ex.: 2021 – 2023)"
                value={edu.period}
                onChange={(e) => updateEducation(edu.id, { period: e.target.value })}
              />
            </div>
            <button type="button" className={styles.danger} onClick={() => removeEducation(edu.id)}>
              Remover
            </button>
          </fieldset>
        ))}
        <button type="button" className={styles.add} onClick={addEducation}>
          + Adicionar formação
        </button>
      </Section>

      <Section title="Certificações" defaultOpen={false}>
        {resume.certifications.map((c) => (
          <fieldset key={c.id} className={styles.card}>
            <input
              aria-label="Nome da certificação"
              placeholder="Nome (ex.: Microsoft Power BI Data Analyst)"
              value={c.name}
              onChange={(e) => updateCertification(c.id, { name: e.target.value })}
            />
            <div className={styles.grid2}>
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
            </div>
            <button type="button" className={styles.danger} onClick={() => removeCertification(c.id)}>
              Remover
            </button>
          </fieldset>
        ))}
        <button type="button" className={styles.add} onClick={addCertification}>
          + Adicionar certificação
        </button>
      </Section>

      <Section title="Idiomas" defaultOpen={false}>
        {resume.languages.map((lang) => (
          <div key={lang.id} className={styles.row}>
            <input
              aria-label="Idioma"
              placeholder="Idioma (ex.: Inglês)"
              value={lang.name}
              onChange={(e) => updateLanguage(lang.id, { name: e.target.value })}
            />
            <select
              aria-label="Nível do idioma"
              value={lang.level}
              onChange={(e) => updateLanguage(lang.id, { level: e.target.value })}
            >
              {LANGUAGE_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            <button
              type="button"
              className={styles.iconDanger}
              aria-label="Remover idioma"
              onClick={() => removeLanguage(lang.id)}
            >
              ×
            </button>
          </div>
        ))}
        <button type="button" className={styles.add} onClick={addLanguage}>
          + Adicionar idioma
        </button>
      </Section>

      <Section title="Portfólio e links" defaultOpen={false}>
        {resume.links.map((l) => (
          <fieldset key={l.id} className={styles.card}>
            <div className={styles.grid2}>
              <input
                aria-label="Nome do link"
                placeholder="Nome (ex.: Portfólio, LinkedIn)"
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
            </div>
            <button type="button" className={styles.danger} onClick={() => removeLink(l.id)}>
              Remover
            </button>
          </fieldset>
        ))}
        <button type="button" className={styles.add} onClick={addLink}>
          + Adicionar link
        </button>
      </Section>
    </section>
  );
}
