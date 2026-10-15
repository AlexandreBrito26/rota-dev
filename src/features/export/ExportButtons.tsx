import { useState } from 'react';
import { exportPdf, exportPng } from './exportResume';
import styles from './ExportButtons.module.scss';

export function ExportButtons() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePng() {
    setBusy(true);
    setError(null);
    try {
      await exportPng();
    } catch {
      setError('Não foi possível gerar o PNG. Tente exportar em PDF.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.actions}>
        <button
          type="button"
          onClick={exportPdf}
          title="Abre a impressão. Escolha 'Salvar como PDF' como destino."
        >
          Exportar PDF
        </button>
        <button type="button" onClick={handlePng} disabled={busy}>
          {busy ? 'Gerando PNG…' : 'Exportar PNG'}
        </button>
      </div>
      {error && <p className={styles.error} role="alert">{error}</p>}
    </div>
  );
}
