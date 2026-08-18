# Banco de Dados de Minerais do Brasil

![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34C26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

Plataforma web de auditoria social que consolida dados publicos de mineracao brasileira em um banco de dados relacional interativo. Todos os dados sao servidos localmente, sem necessidade de APIs externas.

---

## Visao Geral

O projeto integra informacoes oficiais da Agencia Nacional de Mineracao (ANM) e Receita Federal em uma interface unica que permite:

- Consultar minerais estrategicos explorados no Brasil
- Rastrear empresas exploradoras por CNPJ, titular e socios
- Visualizar processos minerarios por municipio, UF e fase de exploracao
- Cruzar dados entre mineradoras, minerais e locais de extracao

## Como Funciona

### Stack

- Frontend: HTML5, CSS3, JavaScript vanilla
- Processamento de CSV: PapaParse
- Banco de dados: Relacional em memoria (JavaScript)
- Hospedagem: GitHub Pages

### Modelo de Dados

```
Minerais
  id_mineral     (PK)
  descricao
  grupo

Mineradoras
  cpf_cnpj       (PK)
  titular
  total_processos

Extracao (N:N)
  cpf_cnpj       (FK -> Mineradoras)
  mineral_id     (FK -> Minerais)
  municipio
  uf
  fase_atual
```

### Fluxo de Dados

```
Fontes publicas (CSV)
        |
        v
  Consolidacao com IA
  (padronizacao de campos, remocao de duplicatas)
        |
        v
  Filtragem
  (remove minerais nao-estrategicos: areia, agua, cascalho)
        |
        v
  Indexacao em memoria
  (Maps e Sets para relacoes N:N)
        |
        v
  Interface web interativa
```

## Fontes de Dados

Todos os dados sao publicos e provenientes de fontes oficiais:

| Fonte | Dados |
|-------|-------|
| ANM - Registro de Extracao | Processos ativos por mineral e municipio |
| ANM - Concessoes de Direitos | Titulares e fases de concessao |
| ANM - Requerimentos de Licenciamento | Pedidos em andamento |
| Receita Federal (RFB) | CNPJ, razao social, regime tributario |
| RFB - Quadro Societario (QSA) | Socios e representantes legais |

Dados atualizados em: junho/2025

## Performance

- Carregamento inicial: 2-3 segundos (parse de ~40MB de dados)
- Busca: instantanea (indexacao em memoria)
- Sem requisicoes externas apos carregamento
- Funciona offline apos primeiro acesso

## Estrutura do Projeto

```
.
+-- index.html                   # Interface principal
+-- exportar_dados.html          # Pagina de exportacao
+-- css/
|   +-- style.css                # Estilos
+-- js/
|   +-- app.js                   # Logica principal e renderizacao
|   +-- data.js                  # Processamento e indexacao dos dados
|   +-- csv_data.js              # Dados ANM (19MB)
|   +-- rfb_dados.js             # Dados Receita Federal (2MB)
|   +-- rfb_socios.js            # Dados societarios (1.8MB)
+-- Icons/
    +-- LocationIcon.png
```

## Como Usar Localmente

```bash
git clone https://github.com/bibinhu/Banco-de-Dados-Minerais-Brasil.git
cd Banco-de-Dados-Minerais-Brasil

# Abrir servidor local (recomendado para arquivos grandes)
python3 -m http.server 8000
# Acesse http://localhost:8000
```

Ou abra `index.html` diretamente no navegador.

## Atualizar Dados

Os scripts PowerShell processam e atualizam os arquivos de dados:

```powershell
# 1. Processar dados da Receita Federal
.\process_rfb.ps1

# 2. Consolidar dados societarios
.\process_socios.ps1

# 3. Reconstruir CSVs
.\build_csv.ps1
```

Apos rodar os scripts, os arquivos `csv_data.js`, `rfb_dados.js` e `rfb_socios.js` serao regenerados.

## Casos de Uso

- Pesquisa academica sobre mineracao no Brasil
- Auditoria social de operacoes minerarias
- Analise de estrutura societaria de empresas exploradoras
- Jornalismo investigativo sobre concessoes minerarias
- Monitoramento de impacto ambiental por regiao

## Licenca

MIT License. Uso livre para fins educacionais e de pesquisa.

---

Dados provenientes de fontes publicas oficiais. Nao oferece garantia de completude ou atualizacao em tempo real. Consulte as autoridades competentes para informacoes criticas.
