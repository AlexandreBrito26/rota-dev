import { FONTS, PALETTES, TEMPLATES } from './styleConfig';
import { useTemplateStore } from './templateStore';
import styles from './TemplateSelect.module.scss';

export function TemplateSelect() {
  const { template, palette, font, setTemplate, setPalette, setFont } = useTemplateStore();
  const neutral = template === 'ats';

  return (
    <div className={styles.panel}>
      <div className={styles.group} role="radiogroup" aria-label="Modelo do currículo">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            type="button"
            role="radio"
            aria-checked={template === t.id}
            className={template === t.id ? styles.active : undefined}
            onClick={() => setTemplate(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {!neutral && (
        <div className={styles.swatches} role="radiogroup" aria-label="Paleta de cores">
          {PALETTES.map((p) => (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={palette === p.id}
              aria-label={p.label}
              title={p.label}
              className={`${styles.swatch} ${palette === p.id ? styles.swatchActive : ''}`}
              style={{ background: `linear-gradient(135deg, ${p.accent} 50%, ${p.accent2} 50%)` }}
              onClick={() => setPalette(p.id)}
            />
          ))}
        </div>
      )}

      <div className={styles.group} role="radiogroup" aria-label="Fonte">
        {FONTS.map((f) => (
          <button
            key={f.id}
            type="button"
            role="radio"
            aria-checked={font === f.id}
            className={font === f.id ? styles.active : undefined}
            onClick={() => setFont(f.id)}
            disabled={neutral}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p className={styles.hint}>{TEMPLATES.find((t) => t.id === template)?.desc}</p>
    </div>
  );
}
