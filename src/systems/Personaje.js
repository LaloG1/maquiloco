// src/systems/Personaje.js
const ATUENDOS = {
  produccion: { camisa: 0x3498db, pantalon: 0x2c3e50, chaleco: 0xf39c12, casco: 0xf1c40f, corbata: null },
  calidad:    { camisa: 0xffffff, pantalon: 0x2c3e50, chaleco: null, casco: null, corbata: null },
  almacen:    { camisa: 0x3498db, pantalon: 0x2c3e50, chaleco: 0xe67e22, casco: 0xf1c40f, corbata: null },
  formal:     { camisa: 0xffffff, pantalon: 0x1a2b4c, chaleco: 0x1a2b4c, casco: null, corbata: 0xc0392b }
};

export default class Personaje extends Phaser.GameObjects.Container {
  constructor(scene, x, y, genero, atuendo) {
    super(scene, x, y);
    scene.add.existing(this);
    this.genero = genero;
    this.atuendo = atuendo;
    this.caminando = false;
    this.pI = null; this.pD = null;
    this.bI = null; this.bD = null;
    this.vestir(this.atuendo);
  }

  vestir(nombre) {
    this.caminar(false); // Esto ahora es seguro, porque caminar(false) ya NO llama a vestir()
    this.removeAll(true);
    
    const a = ATUENDOS[nombre] || ATUENDOS.produccion;
    const mujer = this.genero === 'mujer';
    const piel = 0xf1c7a0;
    const pelo = mujer ? 0x4a2c17 : 0x1f1a17;
    
    const mk = (x, y, fn) => { 
      const g = this.scene.add.graphics(); 
      g.setPosition(x, y); 
      fn(g); 
      this.add(g); 
      return g; 
    };
    
    const pierna = g => {
      g.fillStyle(a.pantalon).fillRoundedRect(-7, 0, 14, 48, 6);
      g.fillStyle(0x1b1f27).fillRoundedRect(-8, 42, 16, 9, 4);
    };
    const brazo = g => {
      g.fillStyle(a.camisa).fillRoundedRect(-5, 0, 10, 36, 5);
      g.fillStyle(piel).fillCircle(0, 38, 5.5);
    };

    // 1. Sombra
    mk(0, 0, g => g.fillStyle(0x000000, 0.22).fillEllipse(0, 66, 64, 14));
    
    // 2. Piernas
    this.pI = mk(-9, 16, pierna); 
    this.pD = mk(9, 16, pierna);
    
    // 3. Cabello largo (mujer)
    if (mujer) mk(0, -52, g => g.fillStyle(pelo).fillCircle(0, 2, 19).fillRoundedRect(-17, 2, 34, 40, 14));
    
    // 4. Torso
    mk(0, -4, g => {
      g.fillStyle(a.camisa).fillRoundedRect(-20, -24, 40, 44, 10);
      if (a.corbata) {
        g.fillStyle(0xffffff).fillTriangle(-9, -24, 9, -24, 0, -6);
        g.fillStyle(a.corbata).fillRect(-2.5, -18, 5, 20);
      }
      if (a.chaleco) {
        g.fillStyle(a.chaleco).fillRoundedRect(-20, -24, 40, 44, 10);
        g.fillStyle(0xe8e8e8).fillRect(-20, -6, 40, 5);
        g.fillStyle(0xe8e8e8).fillRect(-20, 8, 40, 5);
      }
    });
    
    // 5. Brazos
    this.bI = mk(-25, -26, brazo); 
    this.bD = mk(25, -26, brazo);
    
    // 6. Cabeza
    mk(0, -52, g => {
      g.fillStyle(piel).fillCircle(0, 0, 17);
      g.fillStyle(0x222222).fillCircle(-6, -1, 2.2).fillCircle(6, -1, 2.2);
      g.lineStyle(2, 0x9a5b45).beginPath().arc(0, 3, 6, 0.3, Math.PI - 0.3).strokePath();
    });
    
    // 7. Cabello (frente)
    mk(0, -57, g => g.fillStyle(pelo).slice(0, 0, 18, Math.PI, Math.PI * 2).fillPath());
    
    // 8. Casco
    if (a.casco) {
      mk(0, -58, g => {
        g.fillStyle(a.casco).slice(0, 0, 21, Math.PI, Math.PI * 2).fillPath();
        g.fillRoundedRect(-24, -2, 48, 5, 2);
      });
    }
  }

  caminar(estado) {
    this.caminando = estado;
    if (this.caminando) {
      if (!this.tweenCaminar) {
        // Animación de piernas
        this.tweenCaminar = this.scene.tweens.add({
          targets: [this.pI, this.pD],
          y: '+=6',
          duration: 200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
          delay: (i) => i * 100
        });
        // Animación de brazos (balanceo)
        this.tweenBrazos = this.scene.tweens.add({
          targets: [this.bI, this.bD],
          angle: 15, 
          duration: 200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
          delay: (i) => i === 0 ? 100 : 0 
        });
      }
    } else {
      // Detener animaciones
      if (this.tweenCaminar) { this.tweenCaminar.stop(); this.tweenCaminar = null; }
      if (this.tweenBrazos) { this.tweenBrazos.stop(); this.tweenBrazos = null; }
      
      // Resetear posiciones manualmente para que el personaje no quede "torcido" al detenerse
      if (this.pI) this.pI.y = 16;
      if (this.pD) this.pD.y = 16;
      if (this.bI) this.bI.angle = 0;
      if (this.bD) this.bD.angle = 0;
    }
  }
}