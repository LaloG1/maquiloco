// src/systems/progreso.js

export function cargar() {
  // Estado base seguro: Producción (ID 0) SIEMPRE desbloqueada
  let prog = { 
    desbloqueadas: [0], 
    superadas: [],
    info: {},
    personaje: 'hombre',
    ropa: 'produccion'
  };
  
  const guardado = localStorage.getItem('maquiloco_progreso');
  
  if (guardado) {
    try {
      const parsed = JSON.parse(guardado);
      // Fusionamos con el base para asegurar que no falten propiedades
      prog = { ...prog, ...parsed };
      
      // REPARADOR AUTOMÁTICO: Si por alguna razón el 0 no está, lo agrega y lo guarda
      if (!Array.isArray(prog.desbloqueadas) || !prog.desbloqueadas.includes(0)) {
        if (!Array.isArray(prog.desbloqueadas)) prog.desbloqueadas = [];
        prog.desbloqueadas.push(0);
        localStorage.setItem('maquiloco_progreso', JSON.stringify(prog));
        console.log("⚠️ Progreso antiguo detectado y reparado: Producción desbloqueada.");
      }
    } catch (e) {
      console.error("Error al leer el progreso. Reiniciando...", e);
      localStorage.removeItem('maquiloco_progreso');
    }
  } else {
    console.log("✅ Nuevo juego iniciado. Producción desbloqueada por defecto.");
  }
  
  return prog;
}

export function obtenerProgreso() { return cargar(); }

export function guardarProgreso(progreso) {
  localStorage.setItem('maquiloco_progreso', JSON.stringify(progreso));
}

export function reiniciarProgreso() { 
  localStorage.removeItem('maquiloco_progreso'); 
}

// Alias para compatibilidad
export const guardar = guardarProgreso;
export const reiniciar = reiniciarProgreso;