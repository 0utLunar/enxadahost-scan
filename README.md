# 🎮 EnxadaHost Scan

Aplicação web para varredura de portas de servidores Minecraft, com resultados em tempo real, filtros por versão e jogadores, paginação e painel de detalhes. HTML, CSS e JavaScript modular puros — sem build, sem dependências.

_Web application for scanning Minecraft server ports, with real-time results, filters by version and player count, pagination and a detail panel. Plain HTML, CSS and modular JavaScript — no build step, no dependencies._

**🌐 Demo — _Live_:** [https://0utlunar.github.io/enxadahost-scan/](https://0utlunar.github.io/enxadahost-scan/)

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/docs/Web/JavaScript)
[![ES Modules](https://img.shields.io/badge/ES%20Modules-puro-informational?style=for-the-badge)](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules)
![Build](https://img.shields.io/badge/build-none%20%2F%20no%20deps-success?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-brightgreen?style=for-the-badge)

---

## 📖 Visão Geral — _Overview_

O app consulta o endpoint do [`mcstatus.io`](https://mcstatus.io/) para verificar se um servidor
Minecraft está online em cada porta do intervalo informado. A interface mostra resultados em
tempo real, permite filtrar e ordenar os servidores encontrados e abre um painel com detalhes de
cada porta online ou offline.

_The app queries the [`mcstatus.io`](https://mcstatus.io/) endpoint to check whether a Minecraft
server is online on each port of the given range. The interface shows results in real time, lets
you filter and sort the servers found, and opens a detail panel for each online or offline port._

## ✨ Recursos — _Features_

- Varredura de um host em um intervalo de portas configurável. _Scan a host over a configurable port range._
- Controle de concorrência e timeout por consulta. _Per-request concurrency and timeout control._
- Indicadores em tempo real de online, offline, jogadores e total varrido. _Real-time counters for online, offline, players and total scanned._
- Filtros por versão, status e quantidade de jogadores. _Filters by version, status and player count._
- Ordenação por porta, jogadores ou versão. _Sorting by port, players or version._
- Paginação dos resultados para intervalos maiores. _Pagination for larger ranges._
- Painel de detalhes com cópia do `IP:porta` e lista de jogadores visíveis. _Detail panel with `IP:port` copy and the visible player list._
- Interface responsiva para desktop e mobile. _Responsive interface for desktop and mobile._

## 🚀 Como Usar — _How to Use_

1. Abra a versão publicada no GitHub Pages ou o arquivo `index.html` localmente. _Open the GitHub Pages version or the local `index.html` file._
2. Informe o host e o intervalo de portas que deseja verificar. _Enter the host and the port range you want to check._
3. Ajuste a concorrência e o timeout, se necessário. _Adjust concurrency and timeout if needed._
4. Clique em **Iniciar Varredura**. _Click **Iniciar Varredura**._
5. Use os filtros para refinar os resultados e clique em um card para ver os detalhes. _Use the filters to refine results and click a card to see the details._

## 📋 Requisitos — _Requirements_

- Um navegador moderno com suporte a **ES Modules**. _A modern browser with **ES Modules** support._
- Acesso à internet para consultar a API de status dos servidores. _Internet access to query the server status API._

## 📁 Estrutura do Projeto — _Project Structure_

| Arquivo | Responsabilidade |
|---|---|
| `index.html` | Página principal. _Main page._ |
| `assets/css/styles.css` | Estilos da interface. _Interface styles._ |
| `assets/js/script.js` | Ponto de entrada; expõe as funções globais usadas pelo HTML. _Entry point; exposes the global functions used by the HTML._ |
| `assets/js/config.js` | Constantes de configuração. _Configuration constants._ |
| `assets/js/state.js` | Estado global da aplicação. _Global application state._ |
| `assets/js/dom.js` | Referências dos elementos do DOM. _DOM element references._ |
| `assets/js/ui.js` | Renderização, filtros, paginação e overlay. _Rendering, filters, pagination and overlay._ |
| `assets/js/scanner.js` | Fluxo de varredura e chamadas para a API. _Scan flow and API calls._ |
| `assets/js/utils.js` | Funções auxiliares. _Helper functions._ |

## 🧠 Como Funciona Por Dentro — _How It Works_

1. O usuário define host, porta inicial, porta final, concorrência e timeout. _The user sets the host, start port, end port, concurrency and timeout._
2. O app monta a lista de portas e executa várias verificações em paralelo. _The app builds the port list and runs several checks in parallel._
3. Cada porta consulta `https://api.mcstatus.io/v2/status/java/<host>:<porta>`. _Each port queries `https://api.mcstatus.io/v2/status/java/<host>:<port>`._
4. Os resultados são armazenados em memória e renderizados na grade de servidores. _Results are kept in memory and rendered in the server grid._
5. Os filtros e a paginação atuam sobre os dados já coletados, sem recarregar a página. _Filters and pagination act on the already-collected data, without reloading the page._

## ⚠️ Limites e Comportamento — _Limits and Behaviour_

- O intervalo de portas aceita no máximo **2000 portas** por varredura. _The port range accepts a maximum of **2000 ports** per scan._
- O host precisa estar em um formato válido, sem espaços. _The host must be in a valid format, with no spaces._
- O resultado depende da resposta da API externa usada para consulta. _Results depend on the external status API response._
- A API é de terceiros e pode aplicar rate limit ou ficar indisponível. _The API is third-party and may rate-limit or become unavailable._

## 💻 Desenvolvimento Local — _Local Development_

Como o projeto é estático, não há dependências para instalar.

_Since the project is static, there are no dependencies to install._

1. Abra o arquivo `index.html` no navegador. _Open the `index.html` file in your browser._ ou _or_
2. Sirva a pasta com qualquer servidor local simples, por exemplo `python -m http.server`. _Serve the folder with any simple local server, e.g. `python -m http.server`._

## ☁️ Publicação no GitHub Pages — _Publishing to GitHub Pages_

O repositório já está publicado em
[_0utlunar.github.io/enxadahost-scan_](https://0utlunar.github.io/enxadahost-scan/).

_The repository is already published at
[_0utlunar.github.io/enxadahost-scan_](https://0utlunar.github.io/enxadahost-scan/)._

Se fizer novas alterações, basta atualizar o branch configurado no Pages e aguardar o deploy.

_If you make new changes, just update the branch configured in Pages and wait for the deploy._

## 📄 Licença — _License_

[MIT](./LICENSE) — Copyright (c) 2026 0utLunar

_MIT — Copyright (c) 2026 0utLunar_
