# Rota Dev

Gerador de currículo para desenvolvedores, com identidade visual própria, tema dia e noite e animações em canvas 2D.

## Stack

- Vite + React + TypeScript
- SCSS com design tokens (`src/styles/_tokens.scss`)
- Zustand para estado
- React Router (rotas a configurar)
- Vitest + Testing Library (testes)

## Como rodar

```bash
npm install
npm run dev
```

## Estrutura

```
src/
  app/          # componente raiz e layout
  features/
    canvas/     # rota animada em canvas 2D
    editor/     # formulário e store do currículo
    preview/    # visualização em tempo real
    theme/      # alternância dia e noite
    import-linkedin/  # (planejado) parser de PDF/texto do LinkedIn
    import-github/    # (planejado) repositórios via API pública
    export/           # (planejado) impressão CSS e PNG
  shared/       # hooks e utilitários (useCanvas, cssVars)
  services/     # clientes externos
  styles/       # tokens, temas e reset
```

## Funcionalidades

- [x] Tema dia e noite com preferência do sistema e toggle manual
- [x] Canvas 2D com rota animada
- [x] Editor com preview em tempo real
- [x] Importação do GitHub (repositórios em destaque e linguagens)
- [x] Importação do LinkedIn (PDF ou texto colado, com revisão)
- [x] Exportação em PDF (impressão) e PNG
- [x] Três modelos de currículo (Clássico, Destaque e Minimalista)
- [x] Testes do parser do LinkedIn e da resolução de tema

## Próximos passos

- [ ] Editor de experiências no formulário principal (hoje só na importação)
- [ ] Testes de integração do fluxo principal
- [ ] Suporte a i18n (PT-BR e EN)
