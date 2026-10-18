// Ropa del personaje según el área. Colores en hexadecimal (0xRRGGBB).
// Opcionales: chaleco (+ chalecoBorde), casco, corbata, botas, reflejantes (franjas plateadas),
// lentes (lentes de seguridad), bata (bata larga) y formal (saco con corbata).
export const ATUENDOS = {
  // Operador de planta: igual al de la imagen de referencia (overol azul marino, chaleco reflejante, casco amarillo)
  produccion:    { camisa: 0x1f3f7a, pantalon: 0x1c376d, chaleco: 0xf5c400, chalecoBorde: 0xe8730c, casco: 0xf5c400, reflejantes: true,  lentes: true },
  calidad:       { camisa: 0xf4f7fa, pantalon: 0x4a5a73, bata: true, botas: 0x15171c, lentes: true },
  almacen:       { camisa: 0x2e7d32, pantalon: 0x2b3a55, chaleco: 0xff7a00, chalecoBorde: 0xb34a00, casco: 0xffffff, reflejantes: true, lentes: true },
  mantenimiento: { camisa: 0x1f4e79, pantalon: 0x1f4e79, casco: 0xe53935, reflejantes: true, lentes: true },
  formal:        { camisa: 0x1d2433, pantalon: 0x1d2433, corbata: 0xc0392b, botas: 0x0a0a0c, formal: true }
};
