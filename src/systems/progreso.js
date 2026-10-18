const KEY = 'maquiloco_progreso';
const base = () => ({ personaje: null, desbloqueadas: ['produccion'], superadas: [], puntajes: {} });

export function cargar() {
  try { return { ...base(), ...JSON.parse(localStorage.getItem(KEY)) }; } catch { return base(); }
}
export function guardar(p) { localStorage.setItem(KEY, JSON.stringify(p)); }
export function reiniciar() { const p = base(); guardar(p); return p; }
