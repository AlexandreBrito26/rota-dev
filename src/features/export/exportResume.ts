import { useResumeStore } from '@/features/editor/resumeStore';

const TARGET_ID = 'resume-print';

/**
 * PDF: abre a impressão do navegador com o CSS @media print do preview.
 * O título do documento vira o nome sugerido do arquivo.
 */
export function exportPdf() {
  const name = useResumeStore.getState().resume.name.trim();
  const previous = document.title;
  document.title = name ? `Curriculo - ${name}` : 'Curriculo';
  try {
    window.print();
  } finally {
    document.title = previous;
  }
}

/** PNG: captura o preview com html2canvas (carregado só quando necessário). */
export async function exportPng(filename = 'curriculo-rota-dev.png') {
  const element = document.getElementById(TARGET_ID);
  if (!element) throw new Error('Preview não encontrado.');

  const { default: html2canvas } = await import('html2canvas');
  const canvas = await html2canvas(element, {
    scale: window.devicePixelRatio * 1.5,
    backgroundColor: getComputedStyle(document.body).backgroundColor,
    useCORS: true,
  });

  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
