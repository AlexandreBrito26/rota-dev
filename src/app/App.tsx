import { useTheme } from '@/features/theme/useTheme';
import { RouteCanvas } from '@/features/canvas/RouteCanvas';
import { Editor } from '@/features/editor/Editor';
import { Preview } from '@/features/preview/Preview';
import { ThemeToggle } from '@/features/theme/ThemeToggle';
import { ImportGithub } from '@/features/import-github/ImportGithub';
import { LinkedinImport } from '@/features/import-linkedin/LinkedinImport';
import { ExportButtons } from '@/features/export/ExportButtons';
import styles from './App.module.scss';

export default function App() {
  useTheme();

  return (
    <>
      <RouteCanvas />
      <header className={styles.header}>
        <h1 className={styles.logo}>Rota Dev</h1>
        <ThemeToggle />
      </header>
      <main className={styles.main}>
        <div className={styles.column}>
          <ImportGithub />
          <LinkedinImport />
          <Editor />
        </div>
        <div className={styles.column}>
          <ExportButtons />
          <Preview />
        </div>
      </main>
    </>
  );
}
