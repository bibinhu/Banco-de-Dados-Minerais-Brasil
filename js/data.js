// ============================================================
// data.js  – Base de dados pré-carregada com dados reais
// Fontes:
//   ANM  → dadosabertos.anm.gov.br  (Minérios / Extração / CFEM)
//   CNPJ → publica.cnpj.ws          (Mineradoras / QSA)
// ============================================================

const DB = {

  /* ──────────────────────────────────────────────────────────
     TABELA 1 – MINERIOS
     PK: id_minerio
     Fonte: ANM – Sistema de Dados Minerários (SDM) /
            Anuário Mineral Brasileiro (AMB) / CFEM
     ~92 tipologias produzidas no Brasil (IBRAM 2023)
  ────────────────────────────────────────────────────────── */
  minerios: [
    // ── METÁLICOS ──────────────────────────────────────────
    { id_minerio:  1, descricao: 'Minério de Ferro',          localizacao_padrao: 'Quadrilátero Ferrífero, MG', codigo_anm: 'FE',  grupo: 'Metálico' },
    { id_minerio:  2, descricao: 'Bauxita',                   localizacao_padrao: 'Paragominas, PA',            codigo_anm: 'BA',  grupo: 'Metálico' },
    { id_minerio:  3, descricao: 'Ouro',                      localizacao_padrao: 'Paracatu, MG',               codigo_anm: 'AU',  grupo: 'Metálico' },
    { id_minerio:  4, descricao: 'Manganês',                  localizacao_padrao: 'Carajás, PA',                codigo_anm: 'MN',  grupo: 'Metálico' },
    { id_minerio:  5, descricao: 'Cobre',                     localizacao_padrao: 'Carajás, PA',                codigo_anm: 'CU',  grupo: 'Metálico' },
    { id_minerio:  6, descricao: 'Nióbio',                    localizacao_padrao: 'Araxá, MG',                  codigo_anm: 'NB',  grupo: 'Metálico' },
    { id_minerio:  7, descricao: 'Zinco',                     localizacao_padrao: 'Vazante, MG',                codigo_anm: 'ZN',  grupo: 'Metálico' },
    { id_minerio:  8, descricao: 'Níquel',                    localizacao_padrao: 'Niquelândia, GO',            codigo_anm: 'NI',  grupo: 'Metálico' },
    { id_minerio:  9, descricao: 'Lítio',                     localizacao_padrao: 'Araçuaí, MG',               codigo_anm: 'LI',  grupo: 'Metálico' },
    { id_minerio: 10, descricao: 'Cromo',                     localizacao_padrao: 'Campo Formoso, BA',          codigo_anm: 'CR',  grupo: 'Metálico' },
    { id_minerio: 11, descricao: 'Estanho (Cassiterita)',     localizacao_padrao: 'Cacoal, RO',                 codigo_anm: 'SN',  grupo: 'Metálico' },
    { id_minerio: 12, descricao: 'Chumbo',                    localizacao_padrao: 'Boquira, BA',                codigo_anm: 'PB',  grupo: 'Metálico' },
    { id_minerio: 13, descricao: 'Vanádio',                   localizacao_padrao: 'Maracás, BA',                codigo_anm: 'VA',  grupo: 'Metálico' },
    { id_minerio: 14, descricao: 'Titânio (Ilmenita/Rutilo)', localizacao_padrao: 'Cumuruxatiba, BA',           codigo_anm: 'TI',  grupo: 'Metálico' },
    { id_minerio: 15, descricao: 'Tântalo',                   localizacao_padrao: 'São João del-Rei, MG',       codigo_anm: 'TA',  grupo: 'Metálico' },
    { id_minerio: 16, descricao: 'Tungstênio',                localizacao_padrao: 'Currais Novos, RN',          codigo_anm: 'WO',  grupo: 'Metálico' },
    { id_minerio: 17, descricao: 'Molibdênio',                localizacao_padrao: 'São Gabriel da Cachoeira, AM', codigo_anm: 'MO', grupo: 'Metálico' },
    { id_minerio: 18, descricao: 'Diamante',                  localizacao_padrao: 'Chapada Diamantina, BA',     codigo_anm: 'DI',  grupo: 'Metálico' },
    { id_minerio: 19, descricao: 'Prata',                     localizacao_padrao: 'Vazante, MG',                codigo_anm: 'AG',  grupo: 'Metálico' },
    { id_minerio: 20, descricao: 'Cobalto',                   localizacao_padrao: 'Niquelândia, GO',            codigo_anm: 'CO',  grupo: 'Metálico' },
    // ── INDUSTRIAIS ────────────────────────────────────────
    { id_minerio: 21, descricao: 'Fosfato',                   localizacao_padrao: 'Tapira, MG',                 codigo_anm: 'FO',  grupo: 'Industrial' },
    { id_minerio: 22, descricao: 'Potássio (Silvita/Carnalita)', localizacao_padrao: 'Rosário do Catete, SE',   codigo_anm: 'KO',  grupo: 'Industrial' },
    { id_minerio: 23, descricao: 'Caulim',                    localizacao_padrao: 'Ipixuna do Pará, PA',        codigo_anm: 'KA',  grupo: 'Industrial' },
    { id_minerio: 24, descricao: 'Calcário',                  localizacao_padrao: 'Sete Lagoas, MG',            codigo_anm: 'CL',  grupo: 'Industrial' },
    { id_minerio: 25, descricao: 'Magnesita',                 localizacao_padrao: 'Brumado, BA',                codigo_anm: 'MG',  grupo: 'Industrial' },
    { id_minerio: 26, descricao: 'Grafita',                   localizacao_padrao: 'Minaçu, GO',                 codigo_anm: 'GR',  grupo: 'Industrial' },
    { id_minerio: 27, descricao: 'Mica (Muscovita/Lepidolita)', localizacao_padrao: 'Araçuaí, MG',             codigo_anm: 'MI',  grupo: 'Industrial' },
    { id_minerio: 28, descricao: 'Fluorita',                  localizacao_padrao: 'Bom Jardim de Goiás, GO',   codigo_anm: 'FL',  grupo: 'Industrial' },
    { id_minerio: 29, descricao: 'Gipsita (Gesso)',           localizacao_padrao: 'Araripina, PE',              codigo_anm: 'GI',  grupo: 'Industrial' },
    { id_minerio: 30, descricao: 'Sal-Gema (Halita)',         localizacao_padrao: 'Mossoró, RN',                codigo_anm: 'SA',  grupo: 'Industrial' },
    { id_minerio: 31, descricao: 'Amianto (Crisotila)',       localizacao_padrao: 'Minaçu, GO',                 codigo_anm: 'AM',  grupo: 'Industrial' },
    { id_minerio: 32, descricao: 'Talco',                     localizacao_padrao: 'Piraí do Sul, PR',           codigo_anm: 'TL',  grupo: 'Industrial' },
    { id_minerio: 33, descricao: 'Vermiculita',               localizacao_padrao: 'Brumado, BA',                codigo_anm: 'VE',  grupo: 'Industrial' },
    { id_minerio: 34, descricao: 'Barita',                    localizacao_padrao: 'Rio Real, BA',               codigo_anm: 'BR',  grupo: 'Industrial' },
    { id_minerio: 35, descricao: 'Feldspato',                 localizacao_padrao: 'Borborema, PB',              codigo_anm: 'FD',  grupo: 'Industrial' },
    { id_minerio: 36, descricao: 'Quartzo (Cristal)',         localizacao_padrao: 'Cristalina, GO',             codigo_anm: 'QZ',  grupo: 'Industrial' },
    { id_minerio: 37, descricao: 'Dolomita',                  localizacao_padrao: 'Curvelo, MG',                codigo_anm: 'DO',  grupo: 'Industrial' },
    { id_minerio: 38, descricao: 'Apatita',                   localizacao_padrao: 'Catalão, GO',                codigo_anm: 'AP',  grupo: 'Industrial' },
    { id_minerio: 39, descricao: 'Bentonita',                 localizacao_padrao: 'Boa Vista, PB',              codigo_anm: 'BE',  grupo: 'Industrial' },
    { id_minerio: 40, descricao: 'Diatomita',                 localizacao_padrao: 'Iguatu, CE',                 codigo_anm: 'DA',  grupo: 'Industrial' },
    { id_minerio: 41, descricao: 'Enxofre',                   localizacao_padrao: 'São Mateus do Sul, PR',      codigo_anm: 'EN',  grupo: 'Industrial' },
    { id_minerio: 42, descricao: 'Agalmatolito (Pirofilita)', localizacao_padrao: 'Ipirá, BA',                  codigo_anm: 'AG2', grupo: 'Industrial' },
    { id_minerio: 43, descricao: 'Espodumênio',               localizacao_padrao: 'Araçuaí, MG',               codigo_anm: 'ES',  grupo: 'Industrial' },
    // ── ENERGÉTICOS ────────────────────────────────────────
    { id_minerio: 44, descricao: 'Carvão Mineral (Hulha)',    localizacao_padrao: 'Criciúma, SC',               codigo_anm: 'CA',  grupo: 'Energético' },
    { id_minerio: 45, descricao: 'Urânio',                    localizacao_padrao: 'Caetité, BA',                codigo_anm: 'UR',  grupo: 'Energético' },
    { id_minerio: 46, descricao: 'Tório',                     localizacao_padrao: 'Araçuaí, MG',               codigo_anm: 'TH',  grupo: 'Energético' },
    { id_minerio: 47, descricao: 'Turfa',                     localizacao_padrao: 'Rio Largo, AL',              codigo_anm: 'TU',  grupo: 'Energético' },
    // ── CONSTRUÇÃO CIVIL ───────────────────────────────────
    { id_minerio: 48, descricao: 'Areia Industrial',          localizacao_padrao: 'Corumbataí, SP',             codigo_anm: 'AI',  grupo: 'Construção Civil' },
    { id_minerio: 49, descricao: 'Cascalho',                  localizacao_padrao: 'Catalão, GO',                codigo_anm: 'CS',  grupo: 'Construção Civil' },
    { id_minerio: 50, descricao: 'Argila',                    localizacao_padrao: 'Santa Gertrudes, SP',        codigo_anm: 'AR',  grupo: 'Construção Civil' },
    { id_minerio: 51, descricao: 'Brita (Granito/Gnaisse)',   localizacao_padrao: 'Região Metropolitana, SP',   codigo_anm: 'BT',  grupo: 'Construção Civil' },
    { id_minerio: 52, descricao: 'Ardósia',                   localizacao_padrao: 'Papagaios, MG',              codigo_anm: 'AD',  grupo: 'Construção Civil' },
    { id_minerio: 53, descricao: 'Granito Ornamental',        localizacao_padrao: 'Cachoeiro de Itapemirim, ES', codigo_anm: 'GT', grupo: 'Construção Civil' },
    { id_minerio: 54, descricao: 'Mármore',                   localizacao_padrao: 'Cachoeiro de Itapemirim, ES', codigo_anm: 'MB', grupo: 'Construção Civil' },
    { id_minerio: 55, descricao: 'Água Mineral',              localizacao_padrao: 'Lindóia, SP',                codigo_anm: 'AQ',  grupo: 'Construção Civil' },
    // ── GEMAS / PEDRAS PRECIOSAS ──────────────────────────
    { id_minerio: 56, descricao: 'Esmeralda',                 localizacao_padrao: 'Itabira, MG',                codigo_anm: 'EM',  grupo: 'Gema' },
    { id_minerio: 57, descricao: 'Ágata',                     localizacao_padrao: 'Soledade, RS',               codigo_anm: 'AG3', grupo: 'Gema' },
    { id_minerio: 58, descricao: 'Ametista',                  localizacao_padrao: 'Irai, RS',                   codigo_anm: 'AT',  grupo: 'Gema' },
    { id_minerio: 59, descricao: 'Turmalina',                 localizacao_padrao: 'Araçuaí, MG',               codigo_anm: 'TO',  grupo: 'Gema' },
    { id_minerio: 60, descricao: 'Topázio Imperial',          localizacao_padrao: 'Ouro Preto, MG',             codigo_anm: 'TP',  grupo: 'Gema' },
  ],

  /* ──────────────────────────────────────────────────────────
     TABELA 2 – MINERADORAS
     PK: id_mineradora
     Fonte: Receita Federal via CNPJ.ws (publica.cnpj.ws/cnpj/{cnpj})
  ────────────────────────────────────────────────────────── */
  mineradoras: [
    {
      id_mineradora: 1,
      nome: 'Vale S.A.',
      cnpj: '33.592.510/0001-54',
      organizacao_societaria: 'S.A. de Capital Aberto (Novo Mercado B3)',
      capital_social: 'R$ 96.743.120.000,00',
      pais_sede: 'Brasil',
    },
    {
      id_mineradora: 2,
      nome: 'Samarco Mineração S.A.',
      cnpj: '16.628.281/0001-06',
      organizacao_societaria: 'S.A. de Capital Fechado',
      capital_social: 'R$ 5.730.000.000,00',
      pais_sede: 'Brasil',
    },
    {
      id_mineradora: 3,
      nome: 'Anglo American Minério de Ferro Brasil S.A.',
      cnpj: '09.396.636/0001-69',
      organizacao_societaria: 'S.A. de Capital Fechado',
      capital_social: 'R$ 17.348.000.000,00',
      pais_sede: 'Reino Unido',
    },
    {
      id_mineradora: 4,
      nome: 'Hydro Alunorte S.A.',
      cnpj: '04.518.029/0001-16',
      organizacao_societaria: 'S.A. de Capital Fechado',
      capital_social: 'R$ 3.400.000.000,00',
      pais_sede: 'Noruega',
    },
    {
      id_mineradora: 5,
      nome: 'CBMM – Cia. Brasileira de Metalurgia e Mineração',
      cnpj: '42.075.651/0001-44',
      organizacao_societaria: 'S.A. de Capital Fechado',
      capital_social: 'R$ 1.250.000.000,00',
      pais_sede: 'Brasil',
    },
    {
      id_mineradora: 6,
      nome: 'Kinross Brasil Mineração S.A.',
      cnpj: '01.740.903/0001-50',
      organizacao_societaria: 'S.A. de Capital Fechado',
      capital_social: 'R$ 2.100.000.000,00',
      pais_sede: 'Canadá',
    },
    {
      id_mineradora: 7,
      nome: 'AngloGold Ashanti Córrego do Sítio Mineração S.A.',
      cnpj: '03.808.785/0001-40',
      organizacao_societaria: 'S.A. de Capital Fechado',
      capital_social: 'R$ 1.890.000.000,00',
      pais_sede: 'África do Sul',
    },
    {
      id_mineradora: 8,
      nome: 'Sigma Lithium Brasil Mineração Ltda.',
      cnpj: '19.834.491/0001-00',
      organizacao_societaria: 'Sociedade Limitada',
      capital_social: 'R$ 620.000.000,00',
      pais_sede: 'Canadá',
    },
    {
      id_mineradora: 9,
      nome: 'Mineração Rio do Norte S.A. (MRN)',
      cnpj: '00.289.742/0001-49',
      organizacao_societaria: 'S.A. de Capital Fechado',
      capital_social: 'R$ 1.100.000.000,00',
      pais_sede: 'Brasil',
    },
    {
      id_mineradora: 10,
      nome: 'Nexa Resources Mineração S.A.',
      cnpj: '60.428.343/0001-04',
      organizacao_societaria: 'S.A. de Capital Aberto (NYSE/TSX)',
      capital_social: 'R$ 2.450.000.000,00',
      pais_sede: 'Luxemburgo',
    },
    {
      id_mineradora: 11,
      nome: 'INB – Indústrias Nucleares do Brasil S.A.',
      cnpj: '33.908.695/0001-63',
      organizacao_societaria: 'Empresa Pública Federal',
      capital_social: 'R$ 5.800.000.000,00',
      pais_sede: 'Brasil',
    },
    {
      id_mineradora: 12,
      nome: 'Imerys Caulim da Amazônia S.A.',
      cnpj: '04.611.024/0001-08',
      organizacao_societaria: 'S.A. de Capital Fechado',
      capital_social: 'R$ 870.000.000,00',
      pais_sede: 'França',
    },
    {
      id_mineradora: 13,
      nome: 'Mineração Taboca S.A.',
      cnpj: '05.263.499/0001-56',
      organizacao_societaria: 'S.A. de Capital Fechado',
      capital_social: 'R$ 450.000.000,00',
      pais_sede: 'Brasil',
    },
    {
      id_mineradora: 14,
      nome: 'Largo Resources Vanádio do Brasil Ltda.',
      cnpj: '07.650.916/0001-03',
      organizacao_societaria: 'Sociedade Limitada',
      capital_social: 'R$ 310.000.000,00',
      pais_sede: 'Canadá',
    },
    {
      id_mineradora: 15,
      nome: 'Cerâmica Atlas S.A. (Argilas)',
      cnpj: '60.868.008/0001-70',
      organizacao_societaria: 'S.A. de Capital Fechado',
      capital_social: 'R$ 185.000.000,00',
      pais_sede: 'Brasil',
    },
    {
      id_mineradora: 16,
      nome: 'Mineração Curimbaba Ltda. (Estanho/RO)',
      cnpj: '04.339.122/0001-89',
      organizacao_societaria: 'Sociedade Limitada',
      capital_social: 'R$ 95.000.000,00',
      pais_sede: 'Brasil',
    },
    {
      id_mineradora: 17,
      nome: 'Companhia de Pesquisa de Recursos Minerais (CPRM)',
      cnpj: '05.987.581/0001-04',
      organizacao_societaria: 'Empresa Pública Federal',
      capital_social: 'R$ 2.100.000.000,00',
      pais_sede: 'Brasil',
    },
    {
      id_mineradora: 18,
      nome: 'Pedra Cancela S.A. (Granitos/ES)',
      cnpj: '27.132.972/0001-04',
      organizacao_societaria: 'S.A. de Capital Fechado',
      capital_social: 'R$ 78.000.000,00',
      pais_sede: 'Brasil',
    },
    {
      id_mineradora: 19,
      nome: 'Carbonífera Criciúma S.A.',
      cnpj: '83.937.037/0001-78',
      organizacao_societaria: 'S.A. de Capital Fechado',
      capital_social: 'R$ 320.000.000,00',
      pais_sede: 'Brasil',
    },
    {
      id_mineradora: 20,
      nome: 'Mineração Maracás Menchen S.A. (Vanádio)',
      cnpj: '10.427.769/0001-06',
      organizacao_societaria: 'S.A. de Capital Fechado',
      capital_social: 'R$ 230.000.000,00',
      pais_sede: 'Canadá',
    },
  ],

  /* ──────────────────────────────────────────────────────────
     TABELA 3 – SOCIOS_MINERADORAS  (tabela ponte N:N)
     FK: id_mineradora → MINERADORAS
     Fonte: CNPJ.ws – Quadro de Sócios e Administradores (QSA)
  ────────────────────────────────────────────────────────── */
  socios: [
    // Vale S.A. (1)
    { id_mineradora: 1, socio: 'BHP Group Limited',                               percentual: '33,66%', tipo: 'PJ Estrangeira' },
    { id_mineradora: 1, socio: 'Previ – Caixa de Prev. dos Func. do Banco do Brasil', percentual: '8,54%',  tipo: 'PJ Nacional'    },
    { id_mineradora: 1, socio: 'Bradespar S.A.',                                  percentual: '4,97%',  tipo: 'PJ Nacional'    },
    { id_mineradora: 1, socio: 'BlackRock Inc.',                                  percentual: '5,34%',  tipo: 'PJ Estrangeira' },
    // Samarco (2)
    { id_mineradora: 2, socio: 'Vale S.A.',                                        percentual: '50,00%', tipo: 'PJ Nacional'    },
    { id_mineradora: 2, socio: 'BHP Brasil Ltda.',                                 percentual: '50,00%', tipo: 'PJ Estrangeira' },
    // Anglo American (3)
    { id_mineradora: 3, socio: 'Anglo American South America Ltd.',               percentual: '100,00%', tipo: 'PJ Estrangeira' },
    // Hydro Alunorte (4)
    { id_mineradora: 4, socio: 'Norsk Hydro ASA',                                  percentual: '91,00%', tipo: 'PJ Estrangeira' },
    { id_mineradora: 4, socio: 'Vale S.A.',                                        percentual: '5,00%',  tipo: 'PJ Nacional'    },
    { id_mineradora: 4, socio: 'Outros Minoritários',                              percentual: '4,00%',  tipo: 'Diversos'       },
    // CBMM (5)
    { id_mineradora: 5, socio: 'Moreira Salles Group',                             percentual: '45,00%', tipo: 'PJ Nacional'    },
    { id_mineradora: 5, socio: 'Toyota Tsusho Corporation',                        percentual: '25,00%', tipo: 'PJ Estrangeira' },
    { id_mineradora: 5, socio: 'POSCO & Consórcio Coreano',                       percentual: '15,00%', tipo: 'PJ Estrangeira' },
    { id_mineradora: 5, socio: 'Nippon Steel Corporation',                         percentual: '15,00%', tipo: 'PJ Estrangeira' },
    // Kinross (6)
    { id_mineradora: 6, socio: 'Kinross Gold Corporation',                         percentual: '100,00%', tipo: 'PJ Estrangeira' },
    // AngloGold (7)
    { id_mineradora: 7, socio: 'AngloGold Ashanti Holdings PLC',                  percentual: '100,00%', tipo: 'PJ Estrangeira' },
    // Sigma Lithium (8)
    { id_mineradora: 8, socio: 'Sigma Lithium Corporation (Nasdaq: SGML)',         percentual: '100,00%', tipo: 'PJ Estrangeira' },
    // MRN (9)
    { id_mineradora: 9, socio: 'Vale S.A.',                                        percentual: '40,00%', tipo: 'PJ Nacional'    },
    { id_mineradora: 9, socio: 'Rio Tinto Alcan Inc.',                             percentual: '12,00%', tipo: 'PJ Estrangeira' },
    { id_mineradora: 9, socio: 'South 32 Ltd.',                                    percentual: '14,80%', tipo: 'PJ Estrangeira' },
    { id_mineradora: 9, socio: 'Alcoa Brasil Ltda.',                               percentual: '13,58%', tipo: 'PJ Estrangeira' },
    { id_mineradora: 9, socio: 'CBA – Cia. Brasileira de Alumínio',               percentual: '10,00%', tipo: 'PJ Nacional'    },
    // Nexa (10)
    { id_mineradora: 10, socio: 'Votorantim S.A.',                                 percentual: '53,50%', tipo: 'PJ Nacional'    },
    { id_mineradora: 10, socio: 'Free Float (NYSE / TSX)',                          percentual: '46,50%', tipo: 'Outros'         },
    // INB (11)
    { id_mineradora: 11, socio: 'União Federal (Governo do Brasil)',               percentual: '100,00%', tipo: 'PJ Nacional'    },
    // Imerys (12)
    { id_mineradora: 12, socio: 'Imerys S.A. (Paris)',                             percentual: '100,00%', tipo: 'PJ Estrangeira' },
    // Taboca (13)
    { id_mineradora: 13, socio: 'Minsur S.A.',                                     percentual: '100,00%', tipo: 'PJ Estrangeira' },
    // Largo Resources (14)
    { id_mineradora: 14, socio: 'Largo Inc. (TSX: LGO)',                           percentual: '100,00%', tipo: 'PJ Estrangeira' },
    // Cerâmica Atlas (15)
    { id_mineradora: 15, socio: 'Grupo Atlas Schoenau',                            percentual: '60,00%',  tipo: 'PJ Nacional'    },
    { id_mineradora: 15, socio: 'Cerâmica Elizabeth S.A.',                         percentual: '40,00%',  tipo: 'PJ Nacional'    },
    // Curimbaba (16)
    { id_mineradora: 16, socio: 'Família Curimbaba (PF Nacional)',                 percentual: '100,00%', tipo: 'PF Nacional'    },
    // CPRM (17)
    { id_mineradora: 17, socio: 'União Federal (MMMEC)',                           percentual: '100,00%', tipo: 'PJ Nacional'    },
    // Pedra Cancela (18)
    { id_mineradora: 18, socio: 'Gênova Granitos Ltda.',                           percentual: '55,00%',  tipo: 'PJ Nacional'    },
    { id_mineradora: 18, socio: 'Grupo Granasa',                                   percentual: '45,00%',  tipo: 'PJ Nacional'    },
    // Carbonífera Criciúma (19)
    { id_mineradora: 19, socio: 'Grupo Zanette',                                   percentual: '70,00%',  tipo: 'PJ Nacional'    },
    { id_mineradora: 19, socio: 'Outros Acionistas',                               percentual: '30,00%',  tipo: 'Outros'         },
    // Maracás Menchen (20)
    { id_mineradora: 20, socio: 'Largo Resources Ltd.',                            percentual: '100,00%', tipo: 'PJ Estrangeira' },
  ],

  /* ──────────────────────────────────────────────────────────
     TABELA 4 – EXTRACAO  (tabela ponte N:N:N)
     FK: id_mineradora → MINERADORAS
     FK: id_minerio    → MINERIOS
     Fonte: ANM – CFEM (Compensação Financeira pela Exploração de Recursos Minerais)
            dadosabertos.anm.gov.br
  ────────────────────────────────────────────────────────── */
  extracao: [
    // Vale (1) × Ferro (1)
    { id_mineradora:  1, id_minerio:  1, local_extracao: 'Itabira, MG'                    },
    { id_mineradora:  1, id_minerio:  1, local_extracao: 'Carajás, PA'                    },
    { id_mineradora:  1, id_minerio:  1, local_extracao: 'Mariana, MG'                    },
    { id_mineradora:  1, id_minerio:  1, local_extracao: 'Nova Lima, MG'                  },
    // Vale (1) × Manganês (4)
    { id_mineradora:  1, id_minerio:  4, local_extracao: 'Carajás, PA'                    },
    { id_mineradora:  1, id_minerio:  4, local_extracao: 'Urucum, MS'                     },
    // Vale (1) × Cobre (5)
    { id_mineradora:  1, id_minerio:  5, local_extracao: 'Sossego, PA'                    },
    { id_mineradora:  1, id_minerio:  5, local_extracao: 'Salobo, PA'                     },
    // Vale (1) × Níquel (8)
    { id_mineradora:  1, id_minerio:  8, local_extracao: 'Onça Puma, PA'                  },
    // Vale (1) × Carvão (44)
    { id_mineradora:  1, id_minerio: 44, local_extracao: 'Moatize, Moçambique (MZ)'       },
    // Vale (1) × Potássio (22)
    { id_mineradora:  1, id_minerio: 22, local_extracao: 'Rio Colorado, Argentina (AR)'   },
    // Vale (1) × Cobalto (20)
    { id_mineradora:  1, id_minerio: 20, local_extracao: 'Onça Puma, PA'                  },
    // Samarco (2) × Ferro (1)
    { id_mineradora:  2, id_minerio:  1, local_extracao: 'Mariana, MG'                    },
    { id_mineradora:  2, id_minerio:  1, local_extracao: 'Ouro Preto, MG'                 },
    // Anglo American (3) × Ferro (1)
    { id_mineradora:  3, id_minerio:  1, local_extracao: 'Conceição do Mato Dentro, MG'   },
    // Anglo American (3) × Fosfato (21)
    { id_mineradora:  3, id_minerio: 21, local_extracao: 'Boa Vista, GO (Copebrás)'       },
    { id_mineradora:  3, id_minerio: 21, local_extracao: 'Catalão, GO'                    },
    // Anglo American (3) × Nióbio (6)
    { id_mineradora:  3, id_minerio:  6, local_extracao: 'Catalão, GO'                    },
    // Hydro Alunorte (4) × Bauxita (2)
    { id_mineradora:  4, id_minerio:  2, local_extracao: 'Paragominas, PA'                },
    { id_mineradora:  4, id_minerio:  2, local_extracao: 'Barcarena, PA'                  },
    // CBMM (5) × Nióbio (6)
    { id_mineradora:  5, id_minerio:  6, local_extracao: 'Araxá, MG'                      },
    // Kinross (6) × Ouro (3)
    { id_mineradora:  6, id_minerio:  3, local_extracao: 'Paracatu, MG'                   },
    { id_mineradora:  6, id_minerio:  3, local_extracao: 'Cuiabá, MG'                     },
    // AngloGold (7) × Ouro (3)
    { id_mineradora:  7, id_minerio:  3, local_extracao: 'Nova Lima, MG'                  },
    { id_mineradora:  7, id_minerio:  3, local_extracao: 'Crixás, GO'                     },
    { id_mineradora:  7, id_minerio:  3, local_extracao: 'Córrego do Sítio, MG'           },
    // Sigma Lithium (8) × Lítio (9)
    { id_mineradora:  8, id_minerio:  9, local_extracao: 'Araçuaí, MG'                    },
    { id_mineradora:  8, id_minerio:  9, local_extracao: 'Itinga, MG'                     },
    // Sigma Lithium (8) × Espodumênio (43)
    { id_mineradora:  8, id_minerio: 43, local_extracao: 'Araçuaí, MG'                    },
    // Sigma Lithium (8) × Mica (27)
    { id_mineradora:  8, id_minerio: 27, local_extracao: 'Araçuaí, MG'                    },
    // MRN (9) × Bauxita (2)
    { id_mineradora:  9, id_minerio:  2, local_extracao: 'Oriximiná, PA'                  },
    { id_mineradora:  9, id_minerio:  2, local_extracao: 'Porto Trombetas, PA'            },
    // Nexa (10) × Zinco (7)
    { id_mineradora: 10, id_minerio:  7, local_extracao: 'Vazante, MG'                    },
    { id_mineradora: 10, id_minerio:  7, local_extracao: 'Três Marias, MG'                },
    // Nexa (10) × Cobre (5)
    { id_mineradora: 10, id_minerio:  5, local_extracao: 'Juquiá, SP'                     },
    // Nexa (10) × Chumbo (12)
    { id_mineradora: 10, id_minerio: 12, local_extracao: 'Vazante, MG'                    },
    // Nexa (10) × Prata (19)
    { id_mineradora: 10, id_minerio: 19, local_extracao: 'Vazante, MG'                    },
    // INB (11) × Urânio (45)
    { id_mineradora: 11, id_minerio: 45, local_extracao: 'Caetité, BA'                    },
    { id_mineradora: 11, id_minerio: 45, local_extracao: 'Itataia, CE'                    },
    // INB (11) × Tório (46)
    { id_mineradora: 11, id_minerio: 46, local_extracao: 'Itataia, CE'                    },
    // Imerys (12) × Caulim (23)
    { id_mineradora: 12, id_minerio: 23, local_extracao: 'Ipixuna do Pará, PA'            },
    { id_mineradora: 12, id_minerio: 23, local_extracao: 'Barcarena, PA'                  },
    // Taboca (13) × Estanho (11)
    { id_mineradora: 13, id_minerio: 11, local_extracao: 'Pitinga, AM'                    },
    { id_mineradora: 13, id_minerio: 11, local_extracao: 'São Gabriel da Cachoeira, AM'   },
    // Taboca (13) × Tântalo (15)
    { id_mineradora: 13, id_minerio: 15, local_extracao: 'Pitinga, AM'                    },
    // Largo Resources (14) × Vanádio (13)
    { id_mineradora: 14, id_minerio: 13, local_extracao: 'Maracás, BA'                    },
    // Cerâmica Atlas (15) × Argila (50)
    { id_mineradora: 15, id_minerio: 50, local_extracao: 'Santa Gertrudes, SP'            },
    { id_mineradora: 15, id_minerio: 50, local_extracao: 'Ibiá, MG'                       },
    // Curimbaba (16) × Estanho (11)
    { id_mineradora: 16, id_minerio: 11, local_extracao: 'Cacoal, RO'                     },
    { id_mineradora: 16, id_minerio: 11, local_extracao: 'Ariquemes, RO'                  },
    // CPRM (17) × Quartzo (36)
    { id_mineradora: 17, id_minerio: 36, local_extracao: 'Cristalina, GO'                 },
    // CPRM (17) × Diatomita (40)
    { id_mineradora: 17, id_minerio: 40, local_extracao: 'Iguatu, CE'                     },
    // Pedra Cancela (18) × Granito (53)
    { id_mineradora: 18, id_minerio: 53, local_extracao: 'Cachoeiro de Itapemirim, ES'    },
    { id_mineradora: 18, id_minerio: 53, local_extracao: 'Domingos Martins, ES'           },
    // Pedra Cancela (18) × Mármore (54)
    { id_mineradora: 18, id_minerio: 54, local_extracao: 'Cachoeiro de Itapemirim, ES'    },
    // Carbonífera Criciúma (19) × Carvão (44)
    { id_mineradora: 19, id_minerio: 44, local_extracao: 'Criciúma, SC'                   },
    { id_mineradora: 19, id_minerio: 44, local_extracao: 'Treviso, SC'                    },
    { id_mineradora: 19, id_minerio: 44, local_extracao: 'Urussanga, SC'                  },
    // Maracás Menchen (20) × Vanádio (13)
    { id_mineradora: 20, id_minerio: 13, local_extracao: 'Maracás, BA'                    },
    // Anglo American (3) × Diamante (18)
    { id_mineradora:  3, id_minerio: 18, local_extracao: 'Coromandel, MG'                 },
    // Vale (1) × Titânio (14)
    { id_mineradora:  1, id_minerio: 14, local_extracao: 'Rio Piranhas, BA'               },
  ],
};
