import { useTheme } from '@/features/theme/useTheme';
import { RouteCanvas } from '@/features/canvas/RouteCanvas';
import { Editor } from '@/features/editor/Editor';
import { Preview } from '@/features/preview/Preview';
import { ThemeToggle } from '@/features/theme/ThemeToggle';
import { ImportGithub } from '@/features/import-github/ImportGithub';
import { LinkedinImport } from '@/features/import-linkedin/LinkedinImport';
import { TemplateSelect } from '@/features/preview/TemplateSelect';
import { ExportButtons } from '@/features/export/ExportButtons';
import styles from './App.module.scss';

export default function App() {
  useTheme();

  return (
    <>
      <RouteCanvas />
      <header className={styles.header}>
        <div>
          <h1 className={styles.logo}>Rota Dev</h1>
          <p className={styles.tagline}>Seu currículo como trajeto de carreira</p>
        </div>
        <ThemeToggle />
      </header>
      <main className={styles.main}>
        <div className={styles.column}>
          <ImportGithub />
          <LinkedinImport />
          <Editor />
        </div>
        <section className={styles.previewCol} aria-label="Pré-visualização">
          <div className={styles.toolbar}>
            <TemplateSelect />
            <ExportButtons />
          </div>
          <Preview />
        </section>
      </main>
    </>
  );
}
