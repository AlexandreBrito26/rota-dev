import { TEMPLATES, useTemplateStore } from './templateStore';
import styles from './TemplateSelect.module.scss';

export function TemplateSelect() {
  const { template, setTemplate } = useTemplateStore();

  return (
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
  );
}
