# Projeto EnxadaHost Scan

Scanner web de portas para servidores Minecraft, com interface em HTML/CSS e JavaScript modular.

## Estrutura do Projeto
- assets/
  - css/
    - styles.css
  - js/
    - script.js (entrypoint)
    - config.js (constantes)
    - state.js (estado global da aplicacao)
    - dom.js (referencias de elementos)
    - ui.js (renderizacao, filtros, overlay, paginacao)
    - scanner.js (fluxo de varredura e chamadas API)
    - utils.js (funcoes auxiliares)
- index.html
- README.md

## Como usar
1. Abra index.html no navegador.
2. Defina intervalo de portas, concorrencia e timeout.
3. Clique em Iniciar Varredura.

## Notas tecnicas
- O HTML carrega os scripts via ES Modules (type="module").
- Funcoes acionadas pelo HTML (ex.: botoes e paginacao) sao expostas no objeto window pelo entrypoint.
