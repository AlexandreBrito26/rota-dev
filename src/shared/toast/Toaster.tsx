import { useToastStore } from './toastStore';
import styles from './Toaster.module.scss';

export function Toaster() {
  const { toasts, dismiss } = useToastStore();

  return (
    <div className={styles.region} role="status" aria-live="polite">
      {toasts.map((t) => (
        <button
          key={t.id}
          type="button"
          className={`${styles.toast} ${styles[t.kind]}`}
          onClick={() => dismiss(t.id)}
          aria-label={`Fechar: ${t.message}`}
        >
          {t.message}
        </button>
      ))}
    </div>
  );
}
