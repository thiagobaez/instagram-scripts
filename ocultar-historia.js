// OCULTAR HISTORIA A TODOS MENOS A LOS EXCLUIDOS
// Usar en: https://www.instagram.com/accounts/hide_story_and_live_from/
// Pegar en la consola (F12 > Console) y apretar Enter. Para frenar: pararScript = true

(async () => {
  // ===== CONFIGURACIÓN =====
  const EXCLUIR = [            // los que SÍ ven la historia (sin @)
    'usuario1',
    'usuario2',
  ];
  const PAUSA_MIN = 2500;          // espera mínima entre clics (2,5 s)
  const PAUSA_MAX = 5000;          // espera máxima entre clics (5 s)
  const CADA_CUANTOS = 60;         // cada cuántos clics descansa
  const DESCANSO_MIN = 45000;      // descanso mínimo (45 s)
  const DESCANSO_MAX = 75000;      // descanso máximo (75 s)
  const MAX_POR_SESION = 600;      // tope por ejecución
  const ESPERA_SCROLL = 2500;      // espera después de bajar la lista
  // =========================

  const excluir = new Set(EXCLUIR.map(u => u.trim().replace(/^@/, '').toLowerCase()));
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const azar = (a, b) => a + Math.random() * (b - a);

  const filas = () => [...document.querySelectorAll('[role="button"][aria-label="Activar o desactivar casilla"]')]
    .map(btn => btn.closest('[style*="cursor: pointer"]'))
    .filter(Boolean);
  const usuario = f => (f.querySelector('span')?.textContent || '').trim().toLowerCase();
  const marcado = f => !!f.querySelector('[style*="circle-check"]');

  // --- Vigila las respuestas del servidor (429 / bloqueos) ---
  let alerta = null;
  const revisar = (status, cuerpo = '') => {
    if (status === 429) alerta = 'Error 429: demasiadas peticiones';
    else if (status >= 400 && /feedback_required|spam|checkpoint|try again later/i.test(cuerpo))
      alerta = `Instagram marcó actividad sospechosa (${status})`;
  };
  const fetchOriginal = window.fetch;
  window.fetch = async (...args) => {
    const r = await fetchOriginal(...args);
    if (r.status >= 400) r.clone().text().then(t => revisar(r.status, t)).catch(() => revisar(r.status));
    return r;
  };
  const sendOriginal = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function (...args) {
    this.addEventListener('load', () => {
      let t = ''; try { t = this.responseText; } catch {}
      revisar(this.status, t);
    });
    return sendOriginal.apply(this, args);
  };
  const restaurar = () => { window.fetch = fetchOriginal; XMLHttpRequest.prototype.send = sendOriginal; };
  const hayCartel = () => /intenta(lo)? de nuevo más tarde|try again later|acción bloqueada|action blocked/i
    .test(document.body.innerText);

  window.pararScript = false;
  let clics = 0, sinCambios = 0, fallos = 0;
  const inicio = Date.now();
  console.log(`▶ Arrancando (${filas().length} seguidores visibles). Para frenar: pararScript = true`);

  try {
    while (sinCambios < 5 && clics < MAX_POR_SESION && !window.pararScript) {
      const lista = filas();
      const tareas = lista.filter(f => excluir.has(usuario(f)) ? marcado(f) : !marcado(f));
      sinCambios = tareas.length ? 0 : sinCambios + 1;

      for (const f of tareas) {
        if (window.pararScript || clics >= MAX_POR_SESION) break;
        const u = usuario(f);
        const antes = marcado(f);
        f.scrollIntoView({ block: 'center' });
        await sleep(azar(300, 800));
        f.click();
        clics++;
        await sleep(azar(PAUSA_MIN, PAUSA_MAX));

        if (alerta || hayCartel()) {
          console.warn(`⛔ ${alerta || 'Instagram mostró un aviso'}. Frenado. Esperá al menos 24 h antes de seguir.`);
          window.pararScript = true; break;
        }
        const actual = filas().find(x => usuario(x) === u);
        if (actual && marcado(actual) === antes) {
          if (++fallos >= 3) {
            console.warn('⛔ Los clics no tienen efecto. Frenado por seguridad.');
            window.pararScript = true; break;
          }
        } else fallos = 0;

        console.log(`✔ ${clics}/${MAX_POR_SESION} ${excluir.has(u) ? 'mostrando a' : 'ocultando a'} ${u}`);
        if (clics % CADA_CUANTOS === 0) {
          const p = azar(DESCANSO_MIN, DESCANSO_MAX);
          console.log(`⏸ Descanso de ${Math.round(p / 1000)} s`);
          await sleep(p);
        }
      }
      filas().at(-1)?.scrollIntoView({ block: 'end' });
      await sleep(ESPERA_SCROLL);
    }
  } finally {
    restaurar();
    const min = Math.round((Date.now() - inicio) / 60000);
    console.log(`✅ Fin: ${clics} cambios en ${min} min.` +
      (clics >= MAX_POR_SESION ? ' Llegaste al tope: volvé a correrlo en un par de horas y sigue donde quedó.' : ''));
  }
})();
