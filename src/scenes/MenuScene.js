// src/scenes/MenuScene.js
import Phaser from 'phaser';
import { W, H, txt, fondo, boton } from '../ui/ui.js';
import { AREAS } from '../data/areas.js';
import { cargar, reiniciar } from '../systems/progreso.js';

export default class MenuScene extends Phaser.Scene {
  constructor() { super('Menu'); }

  preload() {
    // Asegúrate de que esta imagen exista en public/assets/ui/fondo1.jpg 
    // o ajusta la ruta según donde la tengas guardada.
    this.load.image('fondo1', 'assets/ui/fondo1.jpg');
  }

  create() {
    // Fondo con imagen y capa oscura superpuesta
    const bg = this.add.image(W / 2, H / 2, 'fondo1')
      .setDisplaySize(W, H)
      .setDepth(-10);

    this.add.rectangle(W / 2, H / 2, W, H, 0x071525, 0.42).setDepth(-9);

    // Títulos con animación
    const t = txt(this, W / 2, 250, 'MAQUILOCO', 170, '#ffffff', { fontStyle: 'bold' });
    txt(this, W / 2, 370, 'S.A. DE C.V.', 60, '#cfe28a', { fontStyle: 'bold' });
    txt(this, W / 2, 440, 'De operador a gerente general', 32, '#3df325', { fontStyle: 'bold' });
    
    this.tweens.add({ 
      targets: t, 
      scale: 1.03, 
      yoyo: true, 
      repeat: -1, 
      duration: 1800, 
      ease: 'Sine.inOut' 
    });

    // Botones del menú
    boton(this, W / 2, 620, 'INICIAR', () => { 
      reiniciar(); 
      this.scene.start('Personaje'); 
    });
    
    boton(this, W / 2, 730, 'VER PROGRESO', () => this.verProgreso());
    
    // BOTÓN SALIR CON LISTA DE CRÉDITOS CENTRADA
    const creditos = [
      ['Desarrollado por:', '', '#00d2ff'],
      ['• Miguel Ribera Madrid', '', '#ffffff'],
      ['• Eduardo Garcia Mendoza', '', '#ffffff'],
      ['• David Wallmach', '', '#ffffff'],
      ['• Kevin Sanchez Sequeda', '', '#ffffff']
    ];
    
    boton(this, W / 2, 840, 'SALIR', () => this.panel('¡GRACIAS POR JUGAR!', creditos), 460, 0xff5c5c);
  }

  verProgreso() {
    const p = cargar();
    const lineasProgreso = AREAS.map(a => {
      const sup = p.superadas.includes(a.id);
      const des = p.desbloqueadas.includes(a.id);
      const textoDer = sup ? `${p.puntajes[a.id]}/10` : (des ? 'Disponible' : 'Bloqueada');
      const color = sup ? '#5cff9d' : (des ? '#ffd400' : '#7f8c99');
      return [a.nombre, textoDer, color];
    });
    this.panel('TU PROGRESO', lineasProgreso);
  }

  // Función panel mejorada para soportar listas centradas
  panel(titulo, lineas) {
    const c = this.add.container(0, 0).setDepth(10);
    
    // Velo oscuro de fondo
    const velo = this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.78).setInteractive();
    
    // Caja del panel
    const caja = this.add.graphics()
      .fillStyle(0x0b1a2b)
      .fillRoundedRect(W / 2 - 460, 130, 920, 820, 30)
      .lineStyle(3, 0x00d2ff, 0.8)
      .strokeRoundedRect(W / 2 - 460, 130, 920, 820, 30);
      
    c.add([velo, caja, txt(this, W / 2, 210, titulo, 56, '#00d2ff', { fontStyle: 'bold' })]);
    
    // Renderizado inteligente de las líneas
    lineas.forEach(([izq, der, color], i) => {
      const y = 320 + i * 62;
      
      // Si NO hay columna derecha (der está vacío), centramos el texto como lista
      if (!der) {
        c.add(txt(this, W / 2, y, izq, 36, color || '#ffffff').setOrigin(0.5, 0.5));
      } 
      // Si SÍ hay columna derecha, usamos el formato de dos columnas (para Ver Progreso)
      else {
        c.add(txt(this, W / 2 - 380, y, izq, 34, '#ffffff').setOrigin(0, 0.5));
        c.add(txt(this, W / 2 + 380, y, der, 32, color).setOrigin(1, 0.5));
      }
    });
    
    // Botón de cerrar
    c.add(boton(this, W / 2, 880, 'CERRAR', () => c.destroy(), 320));
  }
}