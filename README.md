# EnxadaHost Scan

Aplicacao web para varredura de portas de servidores Minecraft, feita em HTML, CSS e JavaScript modular. O projeto roda direto no navegador e pode ser publicado como site estatico no GitHub Pages.

**Demo publicada:** [https://0utlunar.github.io/enxadahost-scan/](https://0utlunar.github.io/enxadahost-scan/)

## Visao geral

O app consulta o endpoint do `mcstatus.io` para verificar se um servidor Minecraft esta online em cada porta do intervalo informado. A interface mostra resultados em tempo real, permite filtrar e ordenar os servidores encontrados e abre um painel com detalhes de cada porta online ou offline.

## Recursos

- Varredura de um host em um intervalo de portas configuravel.
- Controle de concorrencia e timeout por consulta.
- Indicadores em tempo real de online, offline, jogadores e total varrido.
- Filtros por versao, status e quantidade de jogadores.
- Ordenacao por porta, jogadores ou versao.
- Paginação dos resultados para intervalos maiores.
- Painel de detalhes com copia do IP:porta e lista de jogadores visiveis.
- Interface responsiva para desktop e mobile.

## Como usar

1. Abra a versao publicada no GitHub Pages ou o arquivo `index.html` localmente.
2. Informe o host e o intervalo de portas que deseja verificar.
3. Ajuste a concorrencia e o timeout, se necessario.
4. Clique em `Iniciar Varredura`.
5. Use os filtros para refinar os resultados e clique em um card para ver os detalhes do servidor.

## Requisitos

- Um navegador moderno com suporte a ES Modules.
- Acesso a internet para consultar a API de status dos servidores.

## Limites e comportamento

- O intervalo de portas aceita no maximo 2000 portas por varredura.
- O host precisa estar em um formato valido, sem espacos.
- O resultado depende da resposta da API externa usada para consulta.

## Estrutura do projeto

- `index.html` - pagina principal.
- `assets/css/styles.css` - estilos da interface.
- `assets/js/script.js` - ponto de entrada e exposicao das funcoes globais usadas pelo HTML.
- `assets/js/config.js` - constantes de configuracao.
- `assets/js/state.js` - estado global da aplicacao.
- `assets/js/dom.js` - referencias dos elementos do DOM.
- `assets/js/ui.js` - renderizacao, filtros, paginação e overlay.
- `assets/js/scanner.js` - fluxo de varredura e chamadas para a API.
- `assets/js/utils.js` - funcoes auxiliares.

## Como funciona por dentro

1. O usuario define host, porta inicial, porta final, concorrencia e timeout.
2. O app monta a lista de portas e executa varias verificacoes em paralelo.
3. Cada porta consulta `https://api.mcstatus.io/v2/status/java/<host>:<porta>`.
4. Os resultados sao armazenados em memoria e renderizados na grade de servidores.
5. Os filtros e a paginação atuam sobre os dados ja coletados, sem recarregar a pagina.

## Desenvolvimento local

Como o projeto e estatico, nao ha dependencias para instalar.

1. Abra o arquivo `index.html` no navegador, ou
2. Sirva a pasta com qualquer servidor local simples, por exemplo `python -m http.server`.

## Publicacao no GitHub Pages

O repositório ja esta publicado em:

- [https://0utlunar.github.io/enxadahost-scan/](https://0utlunar.github.io/enxadahost-scan/)

Se fizer novas alteracoes, basta atualizar o branch configurado no Pages e aguardar o deploy.
