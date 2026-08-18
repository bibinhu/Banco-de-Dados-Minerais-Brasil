/* ============================================================
   app.js – Lógica principal do site
   Banco de Dados de Minérios do Brasil
   ============================================================ */
'use strict';

(function () {

  /* ── State ─────────────────────────────────────────────── */
  let DB = {
    minerios: [],
    mineradoras: [],
    extracao: []
  };
  let openDetailKey = null;

  /* ── Init ──────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    // Hide loader after a short timeout to let UI render first
    setTimeout(() => {
      processData();
      setupTabs();
      setupSearch();
      setupExtracaoFilters();
      renderAll();
      
      const loader = document.getElementById('loader');
      if (loader) loader.classList.add('hidden');
    }, 100);
  });

  /* ── Data Processing (PapaParse) ───────────────────────── */
  function processData() {
    
    let rawRecords = [];

    function ingest(csvString) {
      if (typeof csvString === 'undefined' || !csvString) return;
      const parsed = Papa.parse(csvString, { header: true, skipEmptyLines: true });
      rawRecords = rawRecords.concat(parsed.data);
    }

    // Load available data bundles
    if (typeof CSV_REGISTRO_DE_EXTRACAO_PUBLICADO !== 'undefined') ingest(CSV_REGISTRO_DE_EXTRACAO_PUBLICADO);
    if (typeof CSV_CESSOES_DE_DIREITOS !== 'undefined') ingest(CSV_CESSOES_DE_DIREITOS);
    if (typeof CSV_GUIA_DE_UTILIZACAO_AUTORIZADA !== 'undefined') ingest(CSV_GUIA_DE_UTILIZACAO_AUTORIZADA);
    if (typeof CSV_REQUERIMENTO_DE_LICENCIAMENTO !== 'undefined') ingest(CSV_REQUERIMENTO_DE_LICENCIAMENTO);
    if (typeof CSV_PRODUCAO_BRUTA !== 'undefined') ingest(CSV_PRODUCAO_BRUTA);

    const mineradorasMap = new Map();
    const mineriosMap = new Map();
    const extracaoMap = new Set(); // To avoid duplicate relations
    let minIdCounter = 1;

    // Filters requested by user
    const badWordsExact = ['AREIA', 'ÁGUA', 'AGUA', 'SAIBRO', 'BRITA', 'CASCALHO', 'ARGILA', 'GRANITO', 'BASALTO', 'QUARTZITO', 'GNAISSE', 'CALCÁRIO', 'CALCARIO', 'MARMORE', 'MÁRMORE', 'SEIXO', 'TERRA', 'PIÇARRA', 'PICARRA', 'ATERRO', 'CASCALHEIRA', 'PEDRA', 'GABRO', 'DIABÁSIO', 'DIABASIO', 'DIORITO', 'ARENOSO', 'FONOLITO', 'MIGMATITO', 'FILITO', 'TURFA', 'SIENO', 'CHARNOCKITO', 'MICAESQUISTO'];
    
    function isValidMineral(sub) {
      let up = sub.toUpperCase().trim();
      up = up.replace(/^MIN[EÉ]RIO DE\s+/g, '').replace(/^MIN[EÉ]RIOS DE\s+/g, '').replace(/^MIN[EÉ]RIO\s+/g, '').replace(/^MIN[EÉ]RIOS\s+/g, '').trim();
      if (!up) return false;
      
      if (badWordsExact.includes(up)) return false;
      if (up.startsWith('AREIA ') || up.startsWith('BRITA ') || up.startsWith('CASCALHO ') || up.startsWith('ARGILA ') || up.startsWith('TERRA ') || up.startsWith('ROCHA ')) return false;
      if (up.includes('ALUVIÃO') || up.includes('ALUVIAO')) return false;
      if ((up.includes('ÁGUA') || up.includes('AGUA')) && !up.includes('MARINHA')) return false;
      
      return true;
    }

    function normalizeMineralName(name) {
      let up = name.toUpperCase().trim();
      up = up.replace(/^MIN[EÉ]RIO DE\s+/g, '');
      up = up.replace(/^MIN[EÉ]RIOS DE\s+/g, '');
      up = up.replace(/^MIN[EÉ]RIO\s+/g, '');
      up = up.replace(/^MIN[EÉ]RIOS\s+/g, '');
      return up.trim();
    }

    function isActivePhase(phase) {
      const up = phase.toUpperCase();
      return up.includes('CONCESSÃO DE LAVRA') || up.includes('CONCESSAO DE LAVRA') || 
             up.includes('REGISTRO DE EXTRAÇÃO') || up.includes('REGISTRO DE EXTRACAO');
    }

    rawRecords.forEach(row => {
      const titular = (row['Titular'] || '').trim();
      const cpf_cnpj = (row['CPF/CNPJ do titular'] || row['CPF CNPJ do titular'] || '').trim();
      const subsRaw = (row['Substância(s)'] || row['Substância Mineral'] || '').trim();
      const municipio = (row['Municipio(s)'] || row['UF'] || '').trim();
      const fase_atual = (row['Fase Atual'] || 'N/A').trim();

      if (!cpf_cnpj || !titular || !isActivePhase(fase_atual)) return;

      // 1. Mineradoras
      if (!mineradorasMap.has(cpf_cnpj)) {
        mineradorasMap.set(cpf_cnpj, {
          cpf_cnpj,
          titular,
          processos: 0
        });
      }
      mineradorasMap.get(cpf_cnpj).processos++;

      // 2. Minérios
      if (subsRaw) {
        const subsArray = subsRaw.split(',').map(s => s.trim()).filter(isValidMineral);
        subsArray.forEach(sub => {
          const upperSub = normalizeMineralName(sub);
          if (!mineriosMap.has(upperSub)) {
            mineriosMap.set(upperSub, {
              id: minIdCounter++,
              descricao: upperSub,
              grupo: 'Metal/Estratégico'
            });
          }
          
          const minObj = mineriosMap.get(upperSub);
          
          // 3. Extração
          const relKey = `${cpf_cnpj}|${minObj.id}|${municipio}|${fase_atual}`;
          if (!extracaoMap.has(relKey)) {
            extracaoMap.add(relKey);
            
            let uf = '';
            const munParts = municipio.split('-');
            if (munParts.length > 1) {
                uf = munParts[munParts.length - 1].trim().toUpperCase();
            }

            DB.extracao.push({
              cpf_cnpj,
              minerio_id: minObj.id,
              minerio_nome: upperSub,
              municipio,
              uf,
              fase_atual
            });
          }
        });
      }
    });

    const activeCnpjs = new Set(DB.extracao.map(e => e.cpf_cnpj));
    DB.mineradoras = Array.from(mineradorasMap.values()).filter(m => activeCnpjs.has(m.cpf_cnpj));
    DB.minerios = Array.from(mineriosMap.values());
    
    // Sort logic
    DB.mineradoras.sort((a, b) => b.processos - a.processos);
    DB.mineradoras.forEach((m, idx) => m.id = idx + 1);
    DB.minerios.sort((a, b) => a.descricao.localeCompare(b.descricao));
    
  }

  function renderAll() {
    updateCounts();
    renderMinerios();
    renderMineradors();
    renderExtracao();
    renderRelacoes();
    setupAutocomplete();
    initMapDashboard();
  }

  /* ── Counts ─────────────────────────────────────────────── */
  function updateCounts() {
    setText('cnt-minerios',    DB.minerios.length);
    setText('cnt-mineradoras', DB.mineradoras.length);
    setText('cnt-extracoes',   DB.extracao.length);
  }

  function setText(id, v) {
    const el = document.getElementById(id);
    if (el) el.textContent = v;
  }

  /* ── Tabs ───────────────────────────────────────────────── */
  function setupTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        document.querySelectorAll('.tab-btn').forEach(b => {
          b.classList.toggle('active', b === btn);
          b.setAttribute('aria-selected', b === btn);
        });
        document.querySelectorAll('.tab-pane').forEach(p => {
          p.classList.toggle('active', p.id === `tab-${tab}`);
        });
        
        if (tab === 'extracao' && window.theGeoChart && window.currentMapData && window.currentMapOptions) {
            setTimeout(() => window.theGeoChart.draw(window.currentMapData, window.currentMapOptions), 100);
        }
        closeAllDetails();
      });
    });
  }

  /* ── Search ─────────────────────────────────────────────── */
  function setupSearch() {
    [
      ['srch-minerios',    renderMinerios],
      ['srch-mineradoras', renderMineradors],
      ['srch-rx',          renderRelacoes],
    ].forEach(([id, fn]) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', fn);
    });
  }

  /* ── Extração filters ────────────────────────────────────── */
  function setupExtracaoFilters() {
    // Retirado filtro de estado conforme solicitado
  }

  /* ══════════════════════════════════════════════════════════
     TABELA 1 – MINERIOS
  ══════════════════════════════════════════════════════════ */
  function renderMinerios() {
    const filter  = val('srch-minerios');
    const tbody   = document.getElementById('body-minerios');
    if (!tbody) return;
    tbody.innerHTML = '';

    const rows = DB.minerios.filter(m => {
      if (!filter) return true;
      const term = removeAccents(filter);
      return removeAccents(m.descricao).includes(term);
    });

    if (!rows.length) { emptyRow(tbody, 5, 'Nenhum minério encontrado.'); return; }

    // Render max 1000 items to avoid DOM freeze
    const renderRows = rows.slice(0, 1000);

    renderRows.forEach(m => {
      const exts = DB.extracao.filter(e => e.minerio_id === m.id);
      const tr   = mkTr();
      tr.dataset.key = `mi-${m.id}`;
      tr.title = 'Clique para ver as mineradoras que exploram este minério';
      
      tr.innerHTML = `
        <td style="text-align:left;"><span class="bdg pk" title="ID Único">#${String(m.id).padStart(3, '0')}</span></td>
        <td class="c-main" style="text-align:left;">${esc(m.descricao)}</td>
        <td style="text-align:center;"><span class="cnt${exts.length === 0 ? ' zero' : ''}">${exts.length}</span></td>
      `;
      tr.addEventListener('click', () =>
        toggleDetail(tr, tbody, `mi-${m.id}`, 3, buildMinerioDetail(m, exts)));
      tbody.appendChild(tr);
    });

    const lbl = document.getElementById('minerios-count-lbl');
    if (lbl) lbl.textContent = `${renderRows.length} de ${DB.minerios.length} (max 1000)`;
  }

  function buildMinerioDetail(m, exts) {
    const mids       = [...new Set(exts.map(e => e.cpf_cnpj))];
    const mineradors = DB.mineradoras.filter(x => mids.includes(x.cpf_cnpj)).slice(0, 100); // limit 100

    const colA = mineradors.length === 0
      ? `<p class="detail-empty">Nenhum processo minerário para este minério.</p>`
      : mineradors.map(min => {
          const locs = exts.filter(e => e.cpf_cnpj === min.cpf_cnpj).map(e => e.municipio);
          const uniqLocs = [...new Set(locs)].slice(0, 5); // show max 5 locs per card
          return `<div class="d-card">
            <div class="d-card-top">
              <span class="bdg fk">${min.cpf_cnpj}</span>
              <strong>${esc(min.titular)}</strong>
            </div>
            <div class="d-card-locs">
              ${uniqLocs.map(l => `<span class="loc-tag"><img src="Icons/LocationIcon.png" style="width:12px;vertical-align:middle;margin-right:2px;filter: invert(56%) sepia(91%) saturate(2323%) hue-rotate(345deg) brightness(98%) contrast(92%);"> ${esc(l)}</span>`).join('')}
              ${locs.length > 5 ? `<span class="loc-tag">... mais ${locs.length - 5}</span>` : ''}
            </div>
          </div>`;
        }).join('');

    const colB = exts.slice(0, 100).map(e => {
      const min = DB.mineradoras.find(x => x.cpf_cnpj === e.cpf_cnpj);
      return `<div class="loc-row">
        <span class="bdg fk sm">${e.cpf_cnpj}</span>
        <span class="loc-nm">${esc(min?.titular || '?')}</span>
        <span class="loc-arr">→</span>
        <span><img src="Icons/LocationIcon.png" style="width:12px;vertical-align:middle;margin-right:2px;filter: invert(56%) sepia(91%) saturate(2323%) hue-rotate(345deg) brightness(98%) contrast(92%);"> ${esc(e.municipio)}</span>
      </div>`;
    }).join('') || `<p class="detail-empty">—</p>`;

    return `<div class="detail-inner">
      <div class="detail-topbar">
        <span class="dpill">${esc(m.descricao)}</span>
        <span class="rel-note">via EXTRACAO (FK)</span>
      </div>
      <div class="detail-grid">
        <div>
          <div class="detail-col-head">Empresas (Top 100)</div>
          ${colA}
        </div>
        <div>
          <div class="detail-col-head">Locais (Top 100) <span class="fk-ref">← EXTRACAO</span></div>
          ${colB}
        </div>
      </div>
    </div>`;
  }

  /* ══════════════════════════════════════════════════════════
     TABELA 2 – MINERADORAS
  ══════════════════════════════════════════════════════════ */
  function renderMineradors() {
    const filter = val('srch-mineradoras');
    const tbody  = document.getElementById('body-mineradoras');
    if (!tbody) return;
    tbody.innerHTML = '';

    const rows = DB.mineradoras.filter(m =>
      !filter ||
      m.titular.toLowerCase().includes(filter) ||
      m.cpf_cnpj.includes(filter)
    );

    if (!rows.length) { emptyRow(tbody, 4, 'Nenhuma mineradora encontrada.'); return; }

    const renderRows = rows.slice(0, 1000);

    renderRows.forEach((m, index) => {
      const exts  = DB.extracao.filter(e => e.cpf_cnpj === m.cpf_cnpj);
      const minIds = [...new Set(exts.map(e => e.minerio_id))];
      const tr    = mkTr();
      tr.dataset.key = `mn-${m.cpf_cnpj}`;
      tr.title = 'Clique para ver detalhes desta empresa';
      
      let org = 'Não identificada';
      let capStr = 'Não informado';
      const cleanCnpj = m.cpf_cnpj.replace(/\D/g, '');
      const baseCnpj = cleanCnpj.substring(0, 8);
      
      if (typeof RFB_DATA !== 'undefined' && RFB_DATA[baseCnpj]) {
          org = RFB_DATA[baseCnpj].natureza;
          const capRaw = RFB_DATA[baseCnpj].capital;
          let cap = 0;
          if (typeof capRaw === 'string') cap = parseFloat(capRaw.replace(/\./g, '').replace(',', '.'));
          else if (typeof capRaw === 'number') cap = capRaw;
          
          if (!isNaN(cap) && cap > 0) {
              capStr = 'R$ ' + cap.toLocaleString('pt-BR', {minimumFractionDigits: 2});
          }
      } else {
          let nomeTitular = m.titular;
          if (nomeTitular.includes('S.A.') || nomeTitular.includes('S/A') || nomeTitular.includes(' S A') || nomeTitular.endsWith(' SA')) {
            org = 'Sociedade Anônima';
          } else if (nomeTitular.includes('COOPERATIVA')) {
            org = 'Cooperativa';
          } else if (nomeTitular.includes('LTDA')) {
            org = 'Sociedade Empresária Limitada';
          }
      }

      let countSocios = 0;
      if (typeof RFB_SOCIOS !== 'undefined' && RFB_SOCIOS[baseCnpj]) {
          countSocios = RFB_SOCIOS[baseCnpj].length;
      }

      tr.innerHTML = `
        <td style="text-align:left;"><span class="bdg pk" style="background:#2a1e16;color:#d07530">#${String(m.id)}</span></td>
        <td class="c-main" style="text-align:left; font-weight:bold; color:var(--text-1)">${esc(abbreviate(m.titular))}</td>
        <td style="text-align:left;"><span class="bdg fk">${m.cpf_cnpj}</span></td>
        <td style="text-align:left; color:var(--text-3); font-size:11px; white-space:normal; line-height:1.2;">${org}</td>
        <td style="text-align:right; color:var(--text-3); font-size:11px;">${capStr}</td>
        <td style="text-align:center; color:var(--text-3); font-size:12px;">Brasil</td>
        <td style="text-align:center;"><span class="cnt${countSocios === 0 ? ' zero' : ''}">${countSocios}</span></td>
        <td style="text-align:center;"><span class="cnt${exts.length === 0 ? ' zero' : ''}">${exts.length}</span></td>
      `;
      tr.addEventListener('click', () =>
        toggleDetail(tr, tbody, `mn-${m.cpf_cnpj}`, 8, buildMineradoraDetail(m, exts, minIds)));
      tbody.appendChild(tr);
    });

    const lbl = document.getElementById('mineradoras-count-lbl');
    if (lbl) lbl.textContent = `${renderRows.length} de ${DB.mineradoras.length} (max 1000)`;
  }

  function buildMineradoraDetail(m, exts, minIds) {
    const minerios = DB.minerios.filter(x => minIds.includes(x.id));

    const colA = exts.slice(0, 100).map(e => {
      return `<div class="loc-row">
        <span class="bdg fk sm">#${String(e.minerio_id).padStart(3, '0')}</span>
        <span class="loc-nm" style="font-weight:bold;color:var(--text-1)">${esc(e.minerio_nome)}</span>
        <span class="loc-arr">→</span>
        <span><img src="Icons/LocationIcon.png" style="width:12px;vertical-align:middle;margin-right:2px;filter: invert(56%) sepia(91%) saturate(2323%) hue-rotate(345deg) brightness(98%) contrast(92%);"> ${esc(e.municipio)} <small style="color:var(--text-3)">(${esc(e.fase_atual)})</small></span>
      </div>`;
    }).join('') || `<p class="detail-empty">Sem registro de processos localizados.</p>`;

    const colB = minerios.map(mi => {
      const locs = exts.filter(e => e.minerio_id === mi.id).map(e => e.municipio);
      const uniqLocs = [...new Set(locs)].slice(0, 5);
      return `<div class="d-card">
        <div class="d-card-top">
          <span class="bdg fk">#${String(mi.id).padStart(3, '0')}</span>
          <strong>${esc(mi.descricao)}</strong>
        </div>
        <div class="d-card-locs">
          ${uniqLocs.map(l => `<span class="loc-tag"><img src="Icons/LocationIcon.png" style="width:12px;vertical-align:middle;margin-right:2px;filter: invert(56%) sepia(91%) saturate(2323%) hue-rotate(345deg) brightness(98%) contrast(92%);"> ${esc(l)}</span>`).join('')}
        </div>
      </div>`;
    }).join('') || `<p class="detail-empty">Sem minérios associados.</p>`;

    return `<div class="detail-inner">
      <div class="detail-topbar">
        <span class="dpill">${m.cpf_cnpj}</span>
        <strong>${esc(m.titular)}</strong>
      </div>
      <div class="detail-grid">
        <div>
          <div class="detail-col-head">Municípios e Fases (Top 100) <span class="fk-ref">← EXTRACAO</span></div>
          ${colA}
        </div>
        <div>
          <div class="detail-col-head">Minérios explorados (${minerios.length}) <span class="fk-ref">← EXTRACAO</span></div>
          ${colB}
        </div>
      </div>
    </div>`;
  }

  /* ══════════════════════════════════════════════════════════
     TABELA 3 – EXTRACAO
  ══════════════════════════════════════════════════════════ */
  function renderExtracao() {
    const filter = val('srch-extracao');
    const fmId   = document.getElementById('flt-mineradora')?.value || '';
    const fiId   = document.getElementById('flt-minerio')?.value    || '';
    const tbody  = document.getElementById('body-extracao');
    if (!tbody) return;
    tbody.innerHTML = '';

    const ufNames = {'ac':1,'al':1,'ap':1,'am':1,'ba':1,'ce':1,'df':1,'es':1,'go':1,'ma':1,'mt':1,'ms':1,'mg':1,'pa':1,'pb':1,'pr':1,'pe':1,'pi':1,'rj':1,'rn':1,'rs':1,'ro':1,'rr':1,'sc':1,'sp':1,'se':1,'to':1};
    
    if (!window.titularMapForSearch) {
        window.titularMapForSearch = {};
        DB.mineradoras.forEach(m => window.titularMapForSearch[m.cpf_cnpj] = m.titular.toLowerCase());
    }

    const rows = DB.extracao.filter(e => {
      const isFilterState = filter.length === 2 && ufNames[filter];
      let ok = !filter;
      
      if (filter) {
          if (isFilterState) {
              ok = (e.uf && e.uf.toLowerCase() === filter);
          } else {
              const titular = window.titularMapForSearch[e.cpf_cnpj] || '';
              ok = e.cpf_cnpj.toLowerCase().includes(filter) ||
                   e.minerio_nome.toLowerCase().includes(filter) ||
                   e.municipio.toLowerCase().includes(filter) ||
                   titular.includes(filter);
          }
      }
      return ok &&
        (!fmId || e.cpf_cnpj === fmId) &&
        (!fiId || String(e.minerio_id) === String(fiId));
    });

    if (!rows.length) { emptyRow(tbody, 4, 'Nenhum registro encontrado.'); return; }

    const renderRows = rows.slice(0, 1000);

    renderRows.forEach(e => {
      const min = DB.mineradoras.find(m => m.cpf_cnpj === e.cpf_cnpj);
      const tr  = document.createElement('tr');
      tr.innerHTML = `
        <td><span class="bdg fk">${e.cpf_cnpj}</span></td>
        <td class="c-main">${esc(min?.titular || 'Desconhecido')}</td>
        <td>
          <span class="bdg fk">#${String(e.minerio_id).padStart(3, '0')}</span> 
          <span style="font-weight:600">${esc(e.minerio_nome)}</span>
        </td>
        <td class="c-dim"><img src="Icons/LocationIcon.png" style="width:12px;vertical-align:middle;margin-right:2px;filter: invert(56%) sepia(91%) saturate(2323%) hue-rotate(345deg) brightness(98%) contrast(92%);"> ${esc(e.municipio)} <br><small>${esc(e.fase_atual)}</small></td>
      `;
      tbody.appendChild(tr);
    });

    const lbl = document.getElementById('extracao-count-lbl');
    if (lbl) lbl.textContent = `${renderRows.length} de ${DB.extracao.length} (max 1000)`;
    
    if (typeof updateMapHeatmap === 'function') updateMapHeatmap(rows);
  }

  /* ── AUTOCOMPLETE & MAP DASHBOARD ──────────────────────── */
  let acData = [];
  function setupAutocomplete() {
    const input = document.getElementById('srch-extracao');
    const dropdown = document.getElementById('ac-dropdown-extracao');
    if (!input || !dropdown) return;

    const states = new Set();
    const cities = new Set();
    const minerios = new Set();
    const mineradoras = new Set();

    DB.extracao.forEach(e => {
        const p = e.municipio.split('-');
        if (p.length > 1) {
            states.add(p[p.length-1].trim().toUpperCase());
            cities.add(p.slice(0, p.length-1).join('-').trim());
        } else {
            cities.add(e.municipio.trim());
        }
        minerios.add(e.minerio_nome);
    });
    DB.mineradoras.forEach(m => mineradoras.add(m.titular));

    acData = [
        ...Array.from(states).map(x => ({ type: 'Estado', label: x, search: removeAccents(x).toLowerCase() })),
        ...Array.from(cities).map(x => ({ type: 'Município', label: x, search: removeAccents(x).toLowerCase() })),
        ...Array.from(minerios).map(x => ({ type: 'Minério', label: x, search: removeAccents(x).toLowerCase() })),
        ...Array.from(mineradoras).map(x => ({ type: 'Mineradora', label: x, search: removeAccents(x).toLowerCase() }))
    ];

    input.addEventListener('input', (e) => {
        const val = e.target.value;
        const term = removeAccents(val).toLowerCase();
        
        if (term.length < 2) {
            dropdown.style.display = 'none';
            renderExtracao(); 
            return;
        }

        const matches = acData.filter(x => x.search.includes(term)).slice(0, 40);
        
        if (matches.length === 0) {
            dropdown.style.display = 'none';
            renderExtracao();
            return;
        }

        const groups = {};
        matches.forEach(m => {
            if (!groups[m.type]) groups[m.type] = [];
            groups[m.type].push(m);
        });

        let html = '';
        const order = ['Estado', 'Minério', 'Município', 'Mineradora'];
        order.forEach(type => {
            if (groups[type] && groups[type].length > 0) {
                html += `<div class="ac-group-label">${type}</div>`;
                groups[type].slice(0, 10).forEach(m => {
                    html += `<div class="ac-item" data-val="${esc(m.label)}">${esc(m.label)}</div>`;
                });
            }
        });

        dropdown.innerHTML = html;
        dropdown.style.display = 'block';

        const items = dropdown.querySelectorAll('.ac-item');
        items.forEach(it => {
            it.addEventListener('click', () => {
                input.value = it.getAttribute('data-val');
                dropdown.style.display = 'none';
                renderExtracao();
            });
        });

        renderExtracao(); 
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('#ac-extracao')) {
            dropdown.style.display = 'none';
        }
    });
  }

  let theGeoChart = null;
  let globalUfStats = {};
  let currentMapOptions = null;
  let currentMapData = null;

  function initMapDashboard() {
    const c = document.getElementById('map-container');
    if (!c) return;
    
    if (typeof google === 'undefined' || !google.visualization) {
      if (!window.googleChartLoading) {
        window.googleChartLoading = true;
        google.charts.load('current', { 'packages':['geochart'] });
        google.charts.setOnLoadCallback(() => {
          window.googleChartLoaded = true;
          initMapDashboard();
        });
      }
      return;
    }
    if (!window.googleChartLoaded) return;

    DB.extracao.forEach(e => {
        const parts = e.municipio.split('-');
        let uf = parts.length > 1 ? parts[parts.length - 1].trim().toUpperCase() : '';
        if (uf.length === 2) {
            if (!globalUfStats[uf]) {
                globalUfStats[uf] = { processes: 0, mineradoras: new Set(), minerios: {}, municipios: {} };
            }
            const st = globalUfStats[uf];
            st.processes++;
            st.mineradoras.add(e.cpf_cnpj);
            st.minerios[e.minerio_nome] = (st.minerios[e.minerio_nome] || 0) + 1;
            st.municipios[e.municipio] = (st.municipios[e.municipio] || 0) + 1;
        }
    });

    window.currentMapOptions = {
        region: 'BR',
        resolution: 'provinces',
        backgroundColor: 'transparent',
        datalessRegionColor: '#1e1e1e',
        colorAxis: {colors: ['#2b3a4a', '#d07530']},
        legend: 'none',
        tooltip: { isHtml: true },
        keepAspectRatio: true
    };

    window.theGeoChart = new google.visualization.GeoChart(c);
    window.currentSelectedUf = null;

    window.isDrawingMap = false;

    google.visualization.events.addListener(window.theGeoChart, 'select', function() {
        if (window.isDrawingMap) return;

        const selection = window.theGeoChart.getSelection();
        if (selection.length > 0) {
            const stateCode = window.currentMapData.getValue(selection[0].row, 0);
            const uf = stateCode.split('-')[1];
            if (window.currentSelectedUf !== uf) {
                window.currentSelectedUf = uf;
                openStateSidePanel(uf, globalUfStats[uf]);
                setTimeout(() => updateMapHeatmap(), 50);
            } else {
                window.currentSelectedUf = null;
                window.closeMapSidepanel();
                setTimeout(() => updateMapHeatmap(), 50);
            }
        }
    });

    google.visualization.events.addListener(window.theGeoChart, 'ready', function() {
        window.isDrawingMap = false;
    });

    updateMapHeatmap(); 
  }

  window.closeMapSidepanel = function() {
      const pnl = document.getElementById('map-sidepanel');
      if (pnl) pnl.style.display = 'none';
      if (window.theGeoChart) window.theGeoChart.setSelection([]);
  };

  function updateMapHeatmap(filteredRows = null) {
      if (!window.theGeoChart || !window.googleChartLoaded) return;

      const ufCount = {};
      const targetRows = filteredRows ? filteredRows : DB.extracao;
      
      targetRows.forEach(e => {
          const parts = e.municipio.split('-');
          let uf = parts.length > 1 ? parts[parts.length - 1].trim().toUpperCase() : '';
          if (uf.length === 2) {
              ufCount[uf] = (ufCount[uf] || 0) + 1;
          }
      });

      const ufNames = {'AC': 'Acre', 'AL': 'Alagoas', 'AP': 'Amapá', 'AM': 'Amazonas', 'BA': 'Bahia', 'CE': 'Ceará', 'DF': 'Distrito Federal', 'ES': 'Espírito Santo', 'GO': 'Goiás', 'MA': 'Maranhão', 'MT': 'Mato Grosso', 'MS': 'Mato Grosso do Sul', 'MG': 'Minas Gerais', 'PA': 'Pará', 'PB': 'Paraíba', 'PR': 'Paraná', 'PE': 'Pernambuco', 'PI': 'Piauí', 'RJ': 'Rio de Janeiro', 'RN': 'Rio Grande do Norte', 'RS': 'Rio Grande do Sul', 'RO': 'Rondônia', 'RR': 'Roraima', 'SC': 'Santa Catarina', 'SP': 'São Paulo', 'SE': 'Sergipe', 'TO': 'Tocantins'};

      let maxCount = 1;
      for (const uf of Object.keys(globalUfStats)) {
          const c = ufCount[uf] || 0;
          if (c > maxCount) maxCount = c;
      }

      const dataArray = [['Estado', 'Processos', { role: 'tooltip', type: 'string', p: { html: true } }]];
      
      for (const [uf, st] of Object.entries(globalUfStats)) {
          const activeCount = ufCount[uf] || 0; 
          const stateName = ufNames[uf] || uf;
          let plotValue = activeCount;
          
          if (window.currentSelectedUf && uf === window.currentSelectedUf) {
              plotValue = maxCount + 1000;
          }
          
          const topMinerio = Object.entries(st.minerios).sort((a,b)=>b[1]-a[1])[0];
          const minName = topMinerio ? topMinerio[0] : 'Nenhum';
          
          const tooltip = `<div style="padding:16px; min-width:200px; font-family:var(--font-sans);">
              <strong style="font-size:16px; display:block; margin-bottom:12px; color:var(--text-1); border-bottom:1px solid var(--border); padding-bottom:8px;">${stateName}</strong>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; white-space:nowrap; gap:16px;"><span style="color:var(--text-3); font-size:11px; text-transform:uppercase; font-family:var(--font-mono);">Filtro Ativo:</span> <span style="font-weight:bold; color:var(--accent);">${activeCount}</span></div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; white-space:nowrap; gap:16px;"><span style="color:var(--text-3); font-size:11px; text-transform:uppercase; font-family:var(--font-mono);">Total Empresas:</span> <span style="color:var(--text-1);">${st.mineradoras.size}</span></div>
              <div style="display:flex; justify-content:space-between; align-items:center; white-space:nowrap; gap:16px;"><span style="color:var(--text-3); font-size:11px; text-transform:uppercase; font-family:var(--font-mono);">Principal Minério:</span> <span style="color:var(--text-2); font-size:12px;">${esc(minName)}</span></div>
          </div>`;
          
          if (filteredRows && activeCount === 0) {
              // Deixar sem registro para ficar escuro (dataless)
          } else {
              dataArray.push([{v: 'BR-' + uf, f: stateName}, plotValue, tooltip]);
          }
      }

      if (window.currentSelectedUf) {
          window.currentMapOptions.colorAxis = { values: [0, maxCount, maxCount + 1000], colors: ['#1e2a38', '#38506b', '#d07530'] };
      } else {
          window.currentMapOptions.colorAxis = { colors: ['#2b3a4a', '#d07530'] };
          delete window.currentMapOptions.colorAxis.values;
      }

      if (dataArray.length === 1) {
          window.currentMapData = google.visualization.arrayToDataTable([['Estado', 'Processos'], ['BR-XX', 0]]);
      } else {
          window.currentMapData = google.visualization.arrayToDataTable(dataArray);
      }
      
      window.isDrawingMap = true;
      window.theGeoChart.draw(window.currentMapData, window.currentMapOptions);
  }

  function openStateSidePanel(uf, st) {
      const pnl = document.getElementById('map-sidepanel');
      if (!pnl || !st) return;

      const topMinerios = Object.entries(st.minerios).sort((a,b)=>b[1]-a[1]).slice(0, 3);
      const topMuns = Object.entries(st.municipios).sort((a,b)=>b[1]-a[1]).slice(0, 3);
      const ufNames = {'AC': 'Acre', 'AL': 'Alagoas', 'AP': 'Amapá', 'AM': 'Amazonas', 'BA': 'Bahia', 'CE': 'Ceará', 'DF': 'Distrito Federal', 'ES': 'Espírito Santo', 'GO': 'Goiás', 'MA': 'Maranhão', 'MT': 'Mato Grosso', 'MS': 'Mato Grosso do Sul', 'MG': 'Minas Gerais', 'PA': 'Pará', 'PB': 'Paraíba', 'PR': 'Paraná', 'PE': 'Pernambuco', 'PI': 'Piauí', 'RJ': 'Rio de Janeiro', 'RN': 'Rio Grande do Norte', 'RS': 'Rio Grande do Sul', 'RO': 'Rondônia', 'RR': 'Roraima', 'SC': 'Santa Catarina', 'SP': 'São Paulo', 'SE': 'Sergipe', 'TO': 'Tocantins'};
      const stateName = ufNames[uf] || uf;

      let html = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
            <h3 style="margin:0; font-family:var(--font-serif); font-size:24px; color:var(--text-1);">${stateName}</h3>
            <button onclick="window.closeMapSidepanel()" style="background:none; border:none; color:var(--text-3); cursor:pointer; font-size:24px; padding:0 8px;">&times;</button>
        </div>
        <div class="map-stat-box">
            <div class="map-stat-num">${st.processes}</div>
            <div class="map-stat-lbl">Processos Totais</div>
        </div>
        <div class="map-stat-box">
            <div class="map-stat-num">${st.mineradoras.size}</div>
            <div class="map-stat-lbl">Mineradoras Operantes</div>
        </div>
        
        <h4 style="color:var(--text-2); font-size:12px; text-transform:uppercase; margin-top:20px; border-bottom:1px solid var(--border); padding-bottom:8px;">Principais Minérios</h4>
        <ul style="list-style:none; padding:0; margin:12px 0 0 0;">
            ${topMinerios.map(m => `<li style="font-size:13px; color:var(--text-1); margin-bottom:6px; display:flex; justify-content:space-between;"><span>${esc(m[0])}</span> <span style="color:var(--text-3)">${m[1]}</span></li>`).join('')}
        </ul>

        <h4 style="color:var(--text-2); font-size:12px; text-transform:uppercase; margin-top:20px; border-bottom:1px solid var(--border); padding-bottom:8px;">Principais Municípios</h4>
        <ul style="list-style:none; padding:0; margin:12px 0 0 0;">
            ${topMuns.map(m => `<li style="font-size:13px; color:var(--text-1); margin-bottom:6px; display:flex; justify-content:space-between;"><span>${esc(m[0].split('-')[0])}</span> <span style="color:var(--text-3)">${m[1]}</span></li>`).join('')}
        </ul>
        
        <button style="margin-top:24px; width:100%; padding:12px; background:var(--surface-3); color:var(--text-1); border:1px solid var(--border); border-radius:var(--r); cursor:pointer; font-family:var(--font-mono); font-size:11px; text-transform:uppercase;" onclick="document.getElementById('srch-extracao').value='${uf}'; document.getElementById('srch-extracao').dispatchEvent(new Event('input'));">
            Filtrar Tabela por ${uf}
        </button>
      `;
      pnl.innerHTML = html;
      pnl.style.display = 'flex';
  }

  /* ══════════════════════════════════════════════════════════
     RAIO-X FINAL (Substituindo ERD)
  ══════════════════════════════════════════════════════════ */
  function renderRelacoes() {
    const listContainer = document.getElementById('rx-list');
    if (!listContainer) return;

    listContainer.innerHTML = '';
    const filter = val('srch-rx');
    const term = removeAccents(filter);
    
    DB.mineradoras.forEach((m, index) => {
      if (term) {
        if (!removeAccents(m.titular).includes(term) && !m.cpf_cnpj.includes(term)) return;
      }
      
      const item = document.createElement('div');
      item.className = 'rx-item';
      
      const title = document.createElement('div');
      title.className = 'rx-item-title';
      title.textContent = abbreviate(m.titular);
      
      const sub = document.createElement('div');
      sub.className = 'rx-item-sub';
      sub.textContent = `#${m.id} · Brasil`;
      
      item.appendChild(title);
      item.appendChild(sub);
      
      item.addEventListener('click', () => {
        document.querySelectorAll('.rx-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        renderRaioXDetail(m, index + 1);
      });
      
      listContainer.appendChild(item);
    });
  }

  function renderRaioXDetail(m, index) {
    const card = document.getElementById('rx-card');
    if (!card) return;
    
    let org = 'Não identificada';
    let capStr = 'Não informado';
    let situacaoStr = '<span style="color:var(--text-3)">Desconhecida</span>';
    let tempoExistenciaStr = '<span style="color:var(--text-3)">N/A</span>';

    const cleanCnpj = m.cpf_cnpj.replace(/\D/g, '');
    const baseCnpj = cleanCnpj.substring(0, 8);
    
    if (typeof RFB_DATA !== 'undefined' && RFB_DATA[baseCnpj]) {
        const rfb = RFB_DATA[baseCnpj];
        org = rfb.natureza || org;
        
        const capRaw = rfb.capital;
        let cap = 0;
        if (typeof capRaw === 'string') cap = parseFloat(capRaw.replace(/\./g, '').replace(',', '.'));
        else if (typeof capRaw === 'number') cap = capRaw;
        
        if (!isNaN(cap) && cap > 0) {
            capStr = 'R$ ' + cap.toLocaleString('pt-BR', {minimumFractionDigits: 2});
        }
        
        if (rfb.situacao && rfb.situacao !== 'DESCONHECIDA') {
            const isOk = rfb.situacao === 'ATIVA';
            situacaoStr = `<span class="bdg ${isOk ? 'ok' : 'pk'}">${rfb.situacao}</span>`;
        }
        
        if (rfb.data_inicio && rfb.data_inicio.length === 8) {
            const year = parseInt(rfb.data_inicio.substring(0, 4));
            if (!isNaN(year)) {
                const age = new Date().getFullYear() - year;
                tempoExistenciaStr = `${age} anos`;
            }
        }
    } else {
        let nomeTitular = m.titular;
        if (nomeTitular.includes('S.A.') || nomeTitular.includes('S/A') || nomeTitular.includes(' S A') || nomeTitular.endsWith(' SA')) {
          org = 'Sociedade Anônima';
        } else if (nomeTitular.includes('COOPERATIVA')) {
          org = 'Cooperativa';
        } else if (nomeTitular.includes('LTDA')) {
          org = 'Sociedade Empresária Limitada';
        }
    }
    
    const exts = DB.extracao.filter(e => e.cpf_cnpj === m.cpf_cnpj);
    const fasesMap = new Map();
    exts.forEach(e => {
        const fase = e.fase_atual || 'Fase Desconhecida';
        if (!fasesMap.has(fase)) fasesMap.set(fase, new Map());
        const mineriosDaFase = fasesMap.get(fase);
        if (!mineriosDaFase.has(e.minerio_nome)) mineriosDaFase.set(e.minerio_nome, new Set());
        mineriosDaFase.get(e.minerio_nome).add(e.municipio);
    });
    
    let processosHtml = '';
    if (fasesMap.size > 0) {
        processosHtml = Array.from(fasesMap.entries()).map(([fase, mineriosDaFase]) => {
            let mineriosHtml = Array.from(mineriosDaFase.entries()).map(([nome, locais]) => {
                const uniqueLocais = Array.from(locais);
                return `<div style="margin-bottom:12px;">
                  <strong style="color:var(--text-1); font-size:14px; display:block; margin-bottom:4px;">${esc(nome)}</strong>
                  ${uniqueLocais.map(l => `<span class="loc-tag" style="display:inline-flex; align-items:center;"><img src="Icons/LocationIcon.png" style="width:12px;margin-right:2px;filter: invert(56%) sepia(91%) saturate(2323%) hue-rotate(345deg) brightness(98%) contrast(92%);"> ${esc(l)}</span>`).join('')}
                </div>`;
            }).join('');
            
            const countFase = exts.filter(e => (e.fase_atual || 'Fase Desconhecida') === fase).length;
            return `<div style="margin-top: 16px;">
              <h4 style="color:var(--accent); font-size:11px; text-transform:uppercase; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:8px; letter-spacing: 0.5px;">
                ${esc(fase)} (${countFase})
              </h4>
              ${mineriosHtml}
            </div>`;
        }).join('');
    } else {
        processosHtml = `<p style="color:var(--text-3); font-size:13px;">Nenhum processo vinculado.</p>`;
    }
    
    let sociosHtml = '';
    if (typeof RFB_SOCIOS !== 'undefined' && RFB_SOCIOS[baseCnpj]) {
        sociosHtml = RFB_SOCIOS[baseCnpj].map(s => {
            let descQual = "Sócio / Acionista";
            if (s.qual == "49") descQual = "Sócio-Administrador";
            else if (s.qual == "22") descQual = "Sócio";
            else if (s.qual == "16") descQual = "Presidente";
            else if (s.qual == "10") descQual = "Diretor";
            
            return `<div style="padding: 8px 12px; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: var(--r); margin-bottom: 8px;">
                <strong style="color:var(--text-1); font-size: 13px;">${esc(s.nome)}</strong>
                <span style="float:right; font-family:var(--font-mono); font-size: 10px; color:var(--text-3); padding-top:2px;">${descQual}</span>
            </div>`;
        }).join('');
    }

    card.innerHTML = `
      <div class="rx-sup-title">Mineradora #${index}</div>
      <h3 class="rx-main-title">${esc(m.titular)}</h3>
      
      <div class="rx-info-grid">
        <div class="rx-info-lbl">CNPJ</div>
        <div class="rx-info-val" style="font-family:var(--font-mono);">${m.cpf_cnpj}</div>
        
        <div class="rx-info-lbl">Organização</div>
        <div class="rx-info-val">${org}</div>
        
        <div class="rx-info-lbl">Capital Social</div>
        <div class="rx-info-val">${capStr}</div>
        
        <div class="rx-info-lbl">Situação Cadastral</div>
        <div class="rx-info-val">${situacaoStr}</div>
        
        <div class="rx-info-lbl">Tempo de Existência</div>
        <div class="rx-info-val">${tempoExistenciaStr}</div>
      </div>
      
      <div class="rx-divider"></div>
      
      <div class="rx-section-title">Sócios / Acionistas (${sociosHtml === '' ? '0' : typeof RFB_SOCIOS !== 'undefined' && RFB_SOCIOS[baseCnpj] ? RFB_SOCIOS[baseCnpj].length : '0'})</div>
      <div style="margin-bottom: 32px;">
        ${sociosHtml || `<p style="color:var(--text-3); font-size:13px;">Sem dados de sociedade.</p>`}
      </div>
      
      <div class="rx-section-title">Processos Vinculados (${exts.length})</div>
      <div>
        ${processosHtml}
      </div>
    `;
  }

  /* ══════════════════════════════════════════════════════════
     DETAIL ROW TOGGLE
  ══════════════════════════════════════════════════════════ */
  function toggleDetail(row, tbody, key, cols, html) {
    if (openDetailKey === key) {
      closeAllDetails();
      return;
    }
    closeAllDetails();

    row.classList.add('active');
    openDetailKey = key;

    const dtr = document.createElement('tr');
    dtr.className = 'detail-tr';
    dtr.dataset.key = key;
    dtr.innerHTML = `<td colspan="${cols}" class="detail-td">${html}</td>`;
    row.after(dtr);

    setTimeout(() => dtr.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 60);
  }

  function closeAllDetails() {
    document.querySelectorAll('.detail-tr').forEach(el => el.remove());
    document.querySelectorAll('.data-row.active').forEach(el => el.classList.remove('active'));
    openDetailKey = null;
  }

  /* ── Helpers ─────────────────────────────────────────────── */
  function val(id) {
    return (document.getElementById(id)?.value || '').toLowerCase().trim();
  }

  function removeAccents(str) {
    if (!str) return '';
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  function mkTr() {
    const tr = document.createElement('tr');
    tr.className = 'data-row';
    return tr;
  }

  function emptyRow(tbody, cols, msg) {
    tbody.innerHTML = `<tr><td colspan="${cols}" class="empty-row">${msg}</td></tr>`;
  }

  function esc(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function abbreviate(nome) {
    if (!nome) return '';
    const stop = new Set(['S.A.','LTDA','MINERACAO','COMERCIO','INDUSTRIA','DE','DO','DA']);
    const parts = nome.split(/\s+/).filter(p => !stop.has(p) && p.length > 2);
    return parts.slice(0, 3).join(' ') || nome.split(' ')[0];
  }

})();
