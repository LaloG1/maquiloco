const KEY = 'maquiloco_progreso';
// info = áreas cuya información ya vio el jugador (requisito para entrar a la dinámica)
const base = () => ({ personaje: null, desbloqueadas: ['produccion'], superadas: [], puntajes: {}, info: {} });

export function cargar() {
  try { return { ...base(), ...JSON.parse(localStorage.getItem(KEY)) }; } catch { return base(); }
}
export function guardar(p) { localStorage.setItem(KEY, JSON.stringify(p)); }
export function reiniciar() { const p = base(); guardar(p); return p; }
