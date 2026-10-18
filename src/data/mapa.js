// Mapa de la planta (coordenadas en píxeles del mundo). Los pasillos forman un recorrido en serpiente:
// entrada → este (C1) → norte (C2) → este (C3) → sur (C4) → oeste (C5) → Gerencia.
export const MUNDO = { w: 5200, h: 3300 };
export const INICIO = { x: 300, y: 1500 };   // posición de los PIES del personaje al empezar

export const PASILLOS = [
  { x: 100,  y: 1380, w: 2720, h: 240 },    // C1 horizontal
  { x: 2580, y: 580,  w: 240,  h: 1040 },   // C2 vertical (sube)
  { x: 2580, y: 580,  w: 2140, h: 240 },    // C3 horizontal
  { x: 4480, y: 580,  w: 240,  h: 2240 },   // C4 vertical (baja)
  { x: 2700, y: 2580, w: 2020, h: 240 }     // C5 horizontal (regresa al oeste)
];

// puerta.lado = lado de la sala por donde se entra. color = piso, acento = color del área.
export const SALAS = [
  { id: 'produccion',    x: 300,  y: 800,  w: 800, h: 500, color: 0x302b27, acento: 0xff9f1c, puerta: { x: 620,  y: 1300, w: 160, h: 80,  lado: 'abajo' } },
  { id: 'calidad',       x: 300,  y: 1700, w: 800, h: 500, color: 0x232f3b, acento: 0x00d2ff, puerta: { x: 620,  y: 1620, w: 160, h: 80,  lado: 'arriba' } },
  { id: 'almacen',       x: 1500, y: 800,  w: 800, h: 500, color: 0x26302a, acento: 0x5cff9d, puerta: { x: 1820, y: 1300, w: 160, h: 80,  lado: 'abajo' } },
  { id: 'mantenimiento', x: 1500, y: 1700, w: 800, h: 500, color: 0x2f2828, acento: 0xff5c5c, puerta: { x: 1820, y: 1620, w: 160, h: 80,  lado: 'arriba' } },
  { id: 'ingenieria',    x: 2900, y: 900,  w: 800, h: 500, color: 0x1f3140, acento: 0x4dabff, puerta: { x: 2820, y: 1060, w: 80,  h: 180, lado: 'izq' } },
  { id: 'supervision',   x: 3000, y: 60,   w: 800, h: 420, color: 0x28263a, acento: 0xb48cff, puerta: { x: 3320, y: 480,  w: 160, h: 100, lado: 'abajo' } },
  { id: 'rrhh',          x: 3850, y: 900,  w: 550, h: 500, color: 0x30263a, acento: 0xff7ac8, puerta: { x: 4000, y: 820,  w: 160, h: 80,  lado: 'arriba' } },
  { id: 'gerencia',      x: 1700, y: 2450, w: 900, h: 650, color: 0x332f20, acento: 0xffd166, puerta: { x: 2600, y: 2610, w: 100, h: 180, lado: 'der' } }
];
