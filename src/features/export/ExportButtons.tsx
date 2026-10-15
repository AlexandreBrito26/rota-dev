import { useState } from 'react';
import { exportPdf, exportPng } from './exportResume';
import styles from './ExportButtons.module.scss';

export function ExportButtons() {
  const [busy, setBusy] = useState(false);

  async function handlePng() {
    setBusy(true);
    try {
      await exportPng();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.actions}>
      <button type="button" onClick={exportPdf}>
        Exportar PDF
      </button>
      <button type="button" onClick={handlePng} disabled={busy}>
        {busy ? 'Gerando PNG…' : 'Exportar PNG'}
      </button>
    </div>
  );
}
