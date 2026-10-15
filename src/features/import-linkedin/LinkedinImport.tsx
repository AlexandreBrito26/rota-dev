import { useState } from 'react';
import { useResumeStore, type Experience } from '@/features/editor/resumeStore';
import { parseLinkedinText, type LinkedinDraft } from './linkedinParser';
import { extractPdfText } from '@/services/pdfText';
import styles from './LinkedinImport.module.scss';

export function LinkedinImport() {
  const update = useResumeStore((s) => s.update);
  const [text, setText] = useState('');
  const [draft, setDraft] = useState<LinkedinDraft | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function handleParse() {
    setError(null);
    setDraft(parseLinkedinText(text));
  }

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setError('Envie um arquivo PDF exportado do LinkedIn.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const extracted = await extractPdfText(file);
      setText(extracted);
      setDraft(parseLinkedinText(extracted));
    } catch {
      setError('Não foi possível ler o PDF. Tente colar o texto manualmente.');
    } finally {
      setBusy(false);
    }
  }

  function handleApply() {
    if (!draft) return;
    update({
      summary: draft.summary,
      skills: draft.skills,
      experiences: draft.experiences,
    });
    setDraft(null);
    setText('');
  }

  function editExperience(id: string, patch: Partial<Experience>) {
    setDraft((d) =>
      d && {
        ...d,
        experiences: d.experiences.map((e) => (e.id === id ? { ...e, ...patch } : e)),
      },
    );
  }

  return (
    <section className={styles.panel} aria-label="Importar do LinkedIn">
      <h2 className={styles.title}>Importar do LinkedIn</h2>
      <p className={styles.hint}>
        Cole o texto do seu perfil (Sobre, Experiência e Habilidades). A revisão vem antes de aplicar.
      </p>

      {!draft && (
        <>
          <label className={styles.upload}>
            <span>{busy ? 'Lendo PDF…' : 'Enviar PDF exportado'}</span>
            <input
              type="file"
              accept="application/pdf"
              disabled={busy}
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </label>
          {error && <p className={styles.error} role="alert">{error}</p>}
          <textarea
            rows={6}
            placeholder="Cole aqui o texto do perfil…"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="button" onClick={handleParse} disabled={!text.trim()}>
            Analisar texto
          </button>
        </>
      )}

      {draft && (
        <div className={styles.review}>
          <label className={styles.field}>
            Resumo
            <textarea
              rows={3}
              value={draft.summary}
              onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
            />
          </label>

          <label className={styles.field}>
            Habilidades (separadas por vírgula)
            <input
              value={draft.skills.join(', ')}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                })
              }
            />
          </label>

          <h3 className={styles.subtitle}>Experiências ({draft.experiences.length})</h3>
          {draft.experiences.map((exp) => (
            <fieldset key={exp.id} className={styles.exp}>
              <input
                aria-label="Cargo"
                value={exp.role}
                onChange={(e) => editExperience(exp.id, { role: e.target.value })}
              />
              <input
                aria-label="Empresa"
                value={exp.company}
                onChange={(e) => editExperience(exp.id, { company: e.target.value })}
              />
              <input
                aria-label="Período"
                value={exp.period}
                onChange={(e) => editExperience(exp.id, { period: e.target.value })}
              />
              <textarea
                aria-label="Descrição"
                rows={2}
                value={exp.description}
                onChange={(e) => editExperience(exp.id, { description: e.target.value })}
              />
            </fieldset>
          ))}

          <div className={styles.actions}>
            <button type="button" onClick={handleApply}>
              Aplicar ao currículo
            </button>
            <button type="button" className={styles.ghost} onClick={() => setDraft(null)}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
