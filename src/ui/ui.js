import Phaser from 'phaser';

export const W = 1920, H = 1080;
export const FUENTE = 'Segoe UI, Arial, sans-serif';
export const AZUL = 0x00d2ff, NARANJA = 0xff9f1c;

// Texto centrado y nítido (resolución 2x)
export function txt(s, x, y, t, tam = 32, color = '#ffffff', extra = {}) {
  return s.add.text(x, y, t, { fontFamily: FUENTE, fontSize: tam + 'px', color, ...extra }).setOrigin(0.5).setResolution(2);
}

// Fondo futurista: degradado, rejilla y luces flotantes
export function fondo(s) {
  const g = s.add.graphics();
  g.fillGradientStyle(0x050914, 0x050914, 0x0e2036, 0x0e2036, 1).fillRect(0, 0, W, H);
  g.lineStyle(1, 0x00d2ff, 0.07);
  for (let x = 0; x <= W; x += 80) g.lineBetween(x, 0, x, H);
  for (let y = 0; y <= H; y += 80) g.lineBetween(0, y, W, y);
  for (let i = 0; i < 14; i++) {
    const c = s.add.circle(Phaser.Math.Between(0, W), Phaser.Math.Between(0, H), Phaser.Math.Between(3, 9), 0x00d2ff, 0.25);
    s.tweens.add({ targets: c, y: c.y - 160, alpha: 0, duration: Phaser.Math.Between(3500, 7000), repeat: -1, delay: Phaser.Math.Between(0, 3000) });
  }
}

// Botón redondeado con efecto al pasar el mouse
export function boton(s, x, y, texto, cb, ancho = 460, color = AZUL) {
  const c = s.add.container(x, y);
  const g = s.add.graphics();
  const dibujar = (a) => g.clear().fillStyle(0x0b1a2b, 0.95).fillRoundedRect(-ancho / 2, -40, ancho, 80, 40)
    .lineStyle(3, color, a).strokeRoundedRect(-ancho / 2, -40, ancho, 80, 40);
  dibujar(0.8);
  const t = s.add.text(0, 0, texto, { fontFamily: FUENTE, fontSize: '34px', color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5).setResolution(2);
  c.add([g, t]).setSize(ancho, 80).setInteractive({ useHandCursor: true });
  c.on('pointerover', () => { dibujar(1); s.tweens.add({ targets: c, scale: 1.05, duration: 120 }); });
  c.on('pointerout', () => { dibujar(0.8); s.tweens.add({ targets: c, scale: 1, duration: 120 }); });
  c.on('pointerup', cb);
  c.etiqueta = t;
  return c;
}
