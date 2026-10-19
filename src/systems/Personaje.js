import Phaser from 'phaser';
import { ATUENDOS } from '../data/atuendos.js';

const PIEL = 0xf0c29b;
// Aclara (f > 1) u oscurece (f < 1) un color 0xRRGGBB
const tono = (c, f) => { const ch = s => Math.min(255, Math.round(((c >> s) & 255) * f)); return (ch(16) << 16) | (ch(8) << 8) | ch(0); };

// Contorno suave (spline Catmull-Rom) que pasa por todos los puntos
function curva(p, n = 7) {
  const N = p.length, o = [], g = i => p[Math.max(0, Math.min(N - 1, i))];
  for (let i = 0; i < N - 1; i++) {
    const [a, b, c, d] = [g(i - 1), g(i), g(i + 1), g(i + 2)];
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t;
      const f = j => 0.5 * (2 * b[j] + (c[j] - a[j]) * t + (2 * a[j] - 5 * b[j] + 4 * c[j] - d[j]) * t2 + (3 * b[j] - a[j] - 3 * c[j] + d[j]) * t3);
      o.push({ x: f(0), y: f(1) });
    }
  }
  o.push({ x: p[N - 1][0], y: p[N - 1][1] });
  return o;
}
// Polígono relleno (convexo), suavizado o con esquinas rectas
const poli = (g, color, pts, suave = true, a = 1) => g.fillStyle(color, a).fillPoints(suave ? curva(pts) : pts.map(([x, y]) => ({ x, y })), true);
// Atajos para crear gráficos y contenedores en la escena
const util = s => ({ gr: () => s.add.graphics(), cont: (x, y, ...h) => { const c = s.add.container(x, y); c.add(h); return c; } });

// Operador de planta con tres vistas articuladas: 'lado' (perfil), 'frente' y 'espalda'.
//  - vista = 'perfil'  (mapa del juego): cambia sola de vista según la dirección en que se mueve:
//        izquierda/derecha -> perfil (se voltea), arriba -> espalda, abajo -> frente.
//  - vista = 'frente'  (selección de personaje): solo la vista frontal.
// Todo es vectorial: piezas articuladas que se animan con un ciclo de marcha.
export default class Personaje extends Phaser.GameObjects.Container {
  constructor(scene, x, y, genero = 'hombre', atuendo = 'produccion', vista = 'perfil') {
    super(scene, x, y);
    this.genero = genero;
    this.vista = vista;
    this.xAnt = x;
    this.yAnt = y;
    this.cara = 1;            // 1 = mira a la derecha, -1 = a la izquierda (vista de perfil)
    this.vestir(atuendo);
    scene.add.existing(this);
    scene.events.on('update', this.seguir, this);
    this.once('destroy', () => scene.events.off('update', this.seguir, this));
  }

  // Hacia dónde mira: 'izquierda' | 'derecha' | 'arriba' | 'abajo'
  get mirando() {
    return this.orient === 'espalda' ? 'arriba' : this.orient === 'frente' ? 'abajo' : (this.cara < 0 ? 'izquierda' : 'derecha');
  }

  // Elige la vista según el movimiento real del personaje (sirve con física, tweens o posición directa)
  seguir() {
    const dx = this.x - this.xAnt, dy = this.y - this.yAnt;
    this.xAnt = this.x; this.yAnt = this.y;
    if (this.vista !== 'perfil') return;
    const ax = Math.abs(dx), ay = Math.abs(dy);
    if (ax < 0.01 && ay < 0.01) return;                       // quieto: conserva la vista actual
    // Histéresis: evita parpadeos al caminar en diagonal (en diagonal se prefiere el perfil)
    const vertical = this.orient === 'lado' ? ay > ax * 1.3 : !(ax > ay * 1.3);
    if (vertical) this.orientar(dy < 0 ? 'espalda' : 'frente');
    else { this.orientar('lado'); if (ax > 0.01) this.mirar(dx); }
  }

  // Voltea el perfil izquierda/derecha (solo la vista de lado; frente y espalda no se voltean)
  mirar(dir) {
    this.cara = dir < 0 ? -1 : 1;
    if (this.vistas?.lado) this.vistas.lado.raiz.scaleX = this.cara;
  }

  // Cambia la vista visible: 'lado' | 'frente' | 'espalda'
  orientar(o) {
    const v = this.vistas?.[o];
    if (!v || this.orient === o) return;
    this.orient = o;
    Object.entries(this.vistas).forEach(([k, w]) => w.raiz.setVisible(k === o));
    this.cuerpo = v.cuerpo; this.pm = v.pm; this.bm = v.bm;
    this.pose(this.tw ? (this.fase ?? 0) : null);             // mantiene la marcha al girar
  }

  datos(nombre) {
    const mujer = this.genero === 'mujer';
    const a = { chaleco: null, casco: null, corbata: null, botas: 0x0c0c0e, reflejantes: false, lentes: false, bata: false, formal: false, ...(ATUENDOS[nombre] || ATUENDOS.produccion) };
    return { s: this.scene, mujer, a, pelo: mujer ? 0x4a2c17 : 0x1e1a18, plata: 0xd3d7dd };
  }

  vestir(nombre) {
    this.caminar(false);
    const previa = this.orient;
    this.removeAll(true);
    this.vistas = {}; this.cuerpo = this.pm = this.bm = null; this.orient = null;

    const d = this.datos(nombre);
    this.add(d.s.add.graphics().fillStyle(0x000000, 0.22).fillEllipse(0, 66, 62, 12));   // sombra
    if (this.vista === 'frente') this.vistas.frente = this.construirFrontal(d, false);
    else {
      this.vistas.lado = this.construirLado(d);
      this.vistas.frente = this.construirFrontal(d, false);
      this.vistas.espalda = this.construirFrontal(d, true);
    }
    Object.values(this.vistas).forEach(v => { this.add(v.raiz); v.raiz.setVisible(false); });
    this.orientar(this.vistas[previa] ? previa : (this.vista === 'frente' ? 'frente' : 'lado'));
    this.mirar(this.cara);
  }

  // ----- Vista de perfil (mira a la derecha) -----
  construirLado(d) {
    const { s, mujer, a, pelo, plata } = d, { gr, cont } = util(s);

    // Pierna: muslo + pantorrilla con bota (articuladas en la rodilla)
    const pierna = lejos => {
      const pant = tono(a.pantalon, lejos ? 0.7 : 1), bota = tono(a.botas, lejos ? 1.7 : 1), g1 = gr(), g2 = gr();
      poli(g1, pant, [[-7, -3], [-6.8, 12], [-5.6, 27], [5.6, 27], [6.8, 12], [7, -3]]);
      g1.fillStyle(pant).fillCircle(0, 26, 5.8);
      if (!lejos) g1.fillStyle(tono(a.pantalon, 0.8)).fillRoundedRect(-3.5, 8, 8, 9, 1.5);                  // bolsillo
      poli(g2, pant, [[-5.6, -1], [-5.4, 12], [-4.6, 26], [4.6, 26], [5.4, 12], [5.6, -1]]);
      if (a.reflejantes) g2.fillStyle(plata, 0.9).fillRect(-5.2, 12.5, 10.4, 2.3).fillRect(-4.9, 17, 9.8, 2.3);
      g2.fillStyle(bota).fillRoundedRect(-6.2, 20, 12.4, 10, 3);                                              // caña de la bota
      poli(g2, bota, [[-6.5, 24.5], [-7, 31], [16, 31], [19, 29], [17.5, 26.5], [9, 25]]);                    // pie
      g2.fillStyle(0x070708).fillRoundedRect(-7.4, 30.5, 27, 4.5, 2.2);                                       // suela gruesa
      const rod = cont(0, 26, g2), mus = cont(0, 0, g1, rod);
      mus.rod = rod;
      return mus;
    };

    // Brazo: brazo + antebrazo con mano (articulados en el codo)
    const brazo = lejos => {
      const k = lejos ? 0.72 : 1, man = tono(a.camisa, k), mano = tono(PIEL, lejos ? 0.88 : 1), g1 = gr(), g2 = gr();
      g1.fillStyle(man).fillRoundedRect(-4.8, -4, 9.6, 26, 4.8);
      if (a.reflejantes) g1.fillStyle(plata, 0.9).fillRect(-4.8, 8, 9.6, 2.2).fillRect(-4.8, 12.5, 9.6, 2.2);
      g2.fillStyle(man).fillRoundedRect(-4.2, -3, 8.4, 22, 4.2);
      g2.fillStyle(tono(a.camisa, k * 0.8)).fillRoundedRect(-4.4, 14, 8.8, 4.5, 2);                          // puño
      g2.fillStyle(mano).fillEllipse(0.5, 23.5, 7.5, 10.5).fillEllipse(3.2, 21.5, 3.2, 6.5);                // mano y pulgar
      const cod = cont(0, 21, g2), br = cont(0, 0, g1, cod);
      br.cod = cod;
      return br;
    };

    // Torso
    const gT = gr();
    if (a.bata) poli(gT, a.camisa, [[-11, 0], [-13, 14], [-14, 26], [15, 26], [14, 14], [12.5, 0]], false);   // bata larga
    if (a.formal) poli(gT, a.camisa, [[-11, 0], [-12.5, 12], [13.5, 12], [12.5, 0]], false);                  // saco largo
    poli(gT, a.camisa, [[-11, 7], [-13, -10], [-12.5, -30], [-8, -44], [0, -48.5], [8, -45.5], [12.5, -34], [13.5, -16], [12.5, 7]]);
    poli(gT, 0x000000, [[-11, 7], [-13, -10], [-12.5, -30], [-8, -44], [-5, -45], [-5, 7]], true, 0.14);       // sombra de la espalda
    if (a.bata) gT.lineStyle(1.2, 0x9aa5b1, 0.7).lineBetween(2.5, -4, 3.5, 26);
    else gT.fillStyle(tono(a.camisa, 0.78)).fillRoundedRect(4.5, -34, 7, 6.5, 1.2);                          // bolsillo del pecho
    if (a.formal) {
      gT.lineStyle(1.3, tono(a.camisa, 1.5), 0.8).lineBetween(8, -44, 10.5, -14);                              // solapa
      gT.fillStyle(0xffffff).fillRoundedRect(-5.5, -52, 12, 7, 2.5);                                           // cuello de la camisa
      poli(gT, a.corbata, [[6.5, -46], [10, -43], [10.6, -24], [8.4, -20.5]], false);                         // corbata
    } else gT.fillStyle(tono(a.camisa, 1.25)).fillRoundedRect(-6, -52, 12, 7, 3);                               // cuello

    // Chaleco reflejante (tirantes + cinturón con franja plateada)
    let gV = null;
    if (a.chaleco) {
      gV = gr();
      const am = a.chaleco, bo = a.chalecoBorde ?? tono(am, 0.66);
      const tira = (ext, int) => { poli(gV, bo, ext, false); poli(gV, am, int, false); };
      tira([[1.5, -49], [9, -46], [12.5, -10], [5, -10]], [[3.2, -47], [8, -44.8], [10.6, -11.5], [6.7, -11.5]]);
      tira([[-9, -46], [-2.5, -49], [-5.5, -10], [-13, -10]], [[-7.5, -44.8], [-3.6, -47], [-6.8, -11.5], [-11.2, -11.5]]);
      gV.fillStyle(bo).fillRoundedRect(-13.8, -14.5, 27.6, 11, 2).fillStyle(am).fillRoundedRect(-12.6, -13.3, 25.2, 8.6, 1.5)
        .fillStyle(plata).fillRect(-12.6, -10.6, 25.2, 2.6);
    }

    // Cabeza
    const gH = gr(), piel2 = tono(PIEL, 0.9);
    gH.fillStyle(piel2).fillRoundedRect(-4.2, -8, 9, 11, 3);                                                   // cuello
    gH.fillStyle(pelo).fillEllipse(-5.5, -13, 13, 21);                                                         // cabello trasero
    if (mujer) poli(gH, pelo, [[-8, -18], [-14, -10], [-18, 4], [-15, 14], [-9, 8], [-6, -6]]);                // coleta
    gH.fillStyle(PIEL).fillEllipse(2, -15, 24.5, 29).fillEllipse(5.5, -6.5, 17, 15);                          // cráneo y mandíbula
    poli(gH, PIEL, [[11.5, -17], [17.8, -9.5], [17.2, -7.2], [11.5, -8]], false);                              // nariz
    gH.fillStyle(tono(PIEL, 0.85)).fillEllipse(-2.5, -14.5, 4.8, 7.5).fillStyle(tono(PIEL, 0.68)).fillEllipse(-2.3, -14.5, 2, 4);   // oreja
    gH.fillStyle(0x2b1f1a).fillEllipse(9.6, -17, 3.2, 2.2);                                                    // ojo
    gH.lineStyle(1.3, tono(pelo, 1.5)).lineBetween(7, -20.5, 12.4, -20.2);                                     // ceja
    gH.lineStyle(1.3, 0x9a5b45).lineBetween(11.8, -3.6, 14.8, -3.9);                                           // boca
    if (mujer) gH.fillStyle(0xc0605a).fillEllipse(13.3, -3.6, 3.4, 1.8);
    if (a.lentes) gH.fillStyle(0xcfe6ff, 0.32).fillEllipse(10.5, -17, 9, 6.5).lineStyle(1.1, 0xe8f4ff, 0.9).strokeEllipse(10.5, -17, 9, 6.5).lineBetween(6, -17, -1.5, -16.2);
    if (!a.casco) gH.fillStyle(pelo).fillEllipse(-1, -24.5, 26, 15).fillEllipse(-6, -17, 12, 20);              // cabello
    else {                                                                                                     // casco con visera y barbiquejo
      const c = a.casco;
      poli(gH, c, [[-14.5, -17.5], [-15.5, -26], [-10, -35], [0, -39.5], [9, -36.5], [14.5, -28], [16, -21.5]]);
      poli(gH, tono(c, 0.88), [[11, -22.5], [20.5, -21], [23, -19.2], [11.5, -18.6]], false);
      gH.fillStyle(tono(c, 0.88)).fillRoundedRect(-18.5, -20, 6.5, 3, 1.5);
      gH.lineStyle(1.8, tono(c, 1.25), 0.9).lineBetween(-3, -38.4, 10, -33.6);
      gH.fillStyle(0xffffff, 0.22).fillEllipse(-4, -33, 12, 6);
      gH.lineStyle(1.8, 0x0f5a63).lineBetween(0, -21, 6.5, -1).lineBetween(6.5, -1, -1, 1.5);
      gH.fillStyle(0xb9c0c8).fillCircle(6.5, -1, 1.8);
    }

    // Armado: lo más lejano primero
    const brL = brazo(true), pL = pierna(true), pC = pierna(false), brC = brazo(false), cab = cont(0, -52, gH);
    cab.setScale(0.93);
    brL.setPosition(0, -41); brC.setPosition(0, -41);
    const cuerpo = cont(0, 5, brL, pL, pC, gT);
    if (gV) cuerpo.add(gV);
    cuerpo.add([brC, cab]);
    // 'raiz' es lo que se muestra/oculta y se voltea (así la inclinación del cuerpo no se invierte)
    return { raiz: cont(0, 0, cuerpo), cuerpo, pm: [pC, pL], bm: [brC, brL] };
  }

  // ----- Vista frontal (atras = false) o de espalda (atras = true) -----
  construirFrontal(d, atras) {
    const { s, mujer, a, pelo, plata } = d, { gr, cont } = util(s);

    const pierna = lado => {   // lado: -1 izquierda, 1 derecha
      const pant = a.pantalon, g1 = gr(), g2 = gr();
      poli(g1, pant, [[-6.8, -3], [-6.6, 12], [-5.6, 27], [5.6, 27], [6.6, 12], [6.8, -3]]);
      if (atras) g1.fillStyle(tono(pant, 0.8)).fillRoundedRect(-3.6, 10, 7.2, 7, 1.2);                        // bolsillo trasero
      else g1.fillStyle(tono(pant, 0.8)).fillRoundedRect(lado < 0 ? -6.2 : 1.4, 8, 4.8, 8, 1.2);             // bolsillo exterior
      poli(g2, pant, [[-5.6, -1], [-5.4, 12], [-4.8, 26], [4.8, 26], [5.4, 12], [5.6, -1]]);
      if (a.reflejantes) g2.fillStyle(plata, 0.9).fillRect(-5.3, 12.5, 10.6, 2.3).fillRect(-4.9, 17, 9.8, 2.3);
      g2.fillStyle(a.botas).fillRoundedRect(-6, 20, 12, 10, 3).fillEllipse(0, 29.5, atras ? 13 : 15.5, atras ? 8 : 9);   // bota
      if (!atras) g2.fillStyle(tono(a.botas, 1.9), 0.5).fillEllipse(-1.5, 27, 5, 2.5);
      else g2.fillStyle(tono(a.botas, 1.6), 0.35).fillRoundedRect(-3.5, 22, 7, 4, 1.5);                       // talón
      g2.fillStyle(0x070708).fillRoundedRect(-7.8, 31, 15.6, 4, 2);                                           // suela
      const rod = cont(0, 26, g2), mus = cont(lado * 7.2, 0, g1, rod);
      mus.rod = rod;
      return mus;
    };

    const brazo = lado => {
      const man = a.camisa, g1 = gr(), g2 = gr();
      g1.fillStyle(man).fillRoundedRect(-5, -4, 10, 26, 5);
      if (a.reflejantes) g1.fillStyle(plata, 0.9).fillRect(-5, 8, 10, 2.2).fillRect(-5, 12.5, 10, 2.2);
      g2.fillStyle(man).fillRoundedRect(-4.4, -3, 8.8, 22, 4.4);
      g2.fillStyle(tono(a.camisa, 0.8)).fillRoundedRect(-4.6, 14, 9.2, 4.5, 2);                               // puño
      g2.fillStyle(PIEL).fillEllipse(0, 24, 8.5, 11);                                                          // mano
      if (!atras) g2.fillEllipse(-lado * 3.8, 22, 3.2, 6.5);                                                   // pulgar
      const cod = cont(0, 21, g2), br = cont(lado * 21.5, -41, g1, cod);
      br.cod = cod; br.rotation = -lado * 0.06;
      return br;
    };

    // Torso
    const gT = gr();
    if (a.bata) poli(gT, a.camisa, [[-15, 0], [-17, 14], [-18, 26], [18, 26], [17, 14], [15, 0]], false);
    if (a.formal) poli(gT, a.camisa, [[-15, 0], [-16.5, 12], [16.5, 12], [15, 0]], false);
    poli(gT, a.camisa, [[-15, 7], [-17, -10], [-19, -34], [-15, -45], [-7, -48], [7, -48], [15, -45], [19, -34], [17, -10], [15, 7]]);
    poli(gT, 0x000000, [[-15, 7], [-17, -10], [-19, -34], [-15, -45], [-11, -46.5], [-11, 7]], true, 0.12);     // sombra lateral
    gT.fillStyle(tono(PIEL, 0.9)).fillRoundedRect(-4.8, -54, 9.6, 9, 3);                                         // cuello
    if (!atras) {
      if (a.bata) {
        gT.lineStyle(1.2, 0x9aa5b1, 0.8).lineBetween(0, -44, 0, 26);
        [-30, -16, -2, 12].forEach(y => gT.fillStyle(0x9aa5b1).fillCircle(0.1, y, 1.2));
        gT.fillStyle(tono(a.camisa, 0.9)).fillRoundedRect(-14, 6, 8, 8, 1.2).fillRoundedRect(6, 6, 8, 8, 1.2);
        poli(gT, tono(a.camisa, 0.88), [[-7, -49], [0, -47], [-1, -36], [-8, -40]], false);                      // solapas
        poli(gT, tono(a.camisa, 0.88), [[7, -49], [0, -47], [1, -36], [8, -40]], false);
      } else if (a.formal) {
        poli(gT, 0xffffff, [[-6.5, -50], [6.5, -50], [0, -25]], false);                                          // camisa blanca
        poli(gT, a.corbata, [[-2.2, -47], [2.2, -47], [3.2, -27], [0, -21.5], [-3.2, -27]], false);             // corbata
        gT.fillStyle(tono(a.corbata, 0.75)).fillRoundedRect(-2.6, -48.5, 5.2, 4, 1.2);
        gT.lineStyle(1.4, tono(a.camisa, 1.8), 0.8).lineBetween(-6.5, -49, -0.5, -22).lineBetween(6.5, -49, 0.5, -22);
      } else {
        gT.lineStyle(1.2, tono(a.camisa, 1.6), 0.7).lineBetween(0, -43, 0, 6);                                   // cierre del overol
        gT.fillStyle(tono(a.camisa, 0.78)).fillRoundedRect(-12.5, -34, 8, 7, 1.2).fillRoundedRect(4.5, -34, 8, 7, 1.2);
        poli(gT, tono(a.camisa, 1.3), [[-7, -50], [7, -50], [4.5, -44], [0, -42], [-4.5, -44]], false);          // cuello
      }
    } else {
      if (a.bata) {
        gT.lineStyle(1.2, 0x9aa5b1, 0.7).lineBetween(0, -44, 0, 26);                                             // costura central
        gT.fillStyle(tono(a.camisa, 0.9)).fillRoundedRect(-14, 6, 8, 8, 1.2).fillRoundedRect(6, 6, 8, 8, 1.2).fillRoundedRect(-9, -6, 18, 4.5, 1.5);   // bolsillos y cinturón
        poli(gT, tono(a.camisa, 0.88), [[-7, -49], [7, -49], [5.5, -44.5], [-5.5, -44.5]], false);               // cuello
      } else if (a.formal) {
        poli(gT, 0xffffff, [[-6.5, -50], [6.5, -50], [5, -46], [-5, -46]], false);                               // cuello de la camisa
        gT.lineStyle(1.4, tono(a.camisa, 1.8), 0.6).lineBetween(0, -46, 0, 12);                                  // costura central
        gT.lineStyle(1.2, tono(a.camisa, 0.6), 0.8).lineBetween(0, 6, 0, 12);                                    // abertura trasera del saco
      } else {
        gT.lineStyle(1.2, tono(a.camisa, 1.6), 0.5).lineBetween(0, -43, 0, 6);                                   // costura central
        gT.lineStyle(1.1, tono(a.camisa, 0.7), 0.5).lineBetween(-15, -34, 15, -34);                              // canesú
        poli(gT, tono(a.camisa, 1.3), [[-7, -50], [7, -50], [6, -45], [-6, -45]], false);                        // cuello
      }
    }

    // Chaleco reflejante
    let gV = null;
    if (a.chaleco) {
      gV = gr();
      const am = a.chaleco, bo = a.chalecoBorde ?? tono(am, 0.66);
      const tira = (ext, int) => { poli(gV, bo, ext, false); poli(gV, am, int, false); };
      if (!atras) {
        tira([[-15.5, -47.5], [-6, -48.5], [-6.5, -10], [-15.5, -10]], [[-13.6, -46], [-8, -46.8], [-8.2, -11.5], [-13.6, -11.5]]);
        tira([[6, -48.5], [15.5, -47.5], [15.5, -10], [6.5, -10]], [[8, -46.8], [13.6, -46], [13.6, -11.5], [8.2, -11.5]]);
      } else {                                                                                                 // tirantes cruzados en X
        tira([[-15.5, -47.5], [-7, -48.5], [11.5, -10], [3, -10]], [[-13.4, -46.2], [-8.6, -47], [9.6, -11.5], [5, -11.5]]);
        tira([[7, -48.5], [15.5, -47.5], [-3, -10], [-11.5, -10]], [[8.6, -47], [13.4, -46.2], [-5, -11.5], [-9.6, -11.5]]);
        gV.lineStyle(2.2, plata, 0.9).lineBetween(-11.2, -47, 7.2, -11).lineBetween(11.2, -47, -7.2, -11);
      }
      gV.fillStyle(bo).fillRoundedRect(-16.8, -14.5, 33.6, 11, 2).fillStyle(am).fillRoundedRect(-15.6, -13.3, 31.2, 8.6, 1.5)
        .fillStyle(plata).fillRect(-15.6, -10.6, 31.2, 2.6);
    }

    // Cabeza
    const gH = gr();
    if (!atras) {
      if (mujer) {                                                                                             // cabello largo detrás
        poli(gH, pelo, [[-9, -26], [-14.5, -18], [-17, -2], [-17.5, 12], [-12.5, 13], [-10.5, 0], [-10, -12]]);
        poli(gH, pelo, [[9, -26], [14.5, -18], [17, -2], [17.5, 12], [12.5, 13], [10.5, 0], [10, -12]]);
      }
      gH.fillStyle(PIEL).fillEllipse(0, -15, 25, 29).fillEllipse(0, -5.5, 18, 13);                             // cráneo y mandíbula
      gH.fillStyle(tono(PIEL, 0.85)).fillEllipse(-12.6, -14.5, 4.6, 8).fillEllipse(12.6, -14.5, 4.6, 8);      // orejas
      gH.fillStyle(tono(PIEL, 0.92)).fillEllipse(0, -10.5, 4.4, 6.5);                                          // nariz
      gH.fillStyle(0x7a4a3a, 0.5).fillEllipse(-1.2, -8, 1.3, 1).fillEllipse(1.2, -8, 1.3, 1);
      [-5.4, 5.4].forEach(x => gH.fillStyle(0x2b1f1a).fillEllipse(x, -16, 3.4, 2.8).fillStyle(0xffffff, 0.9).fillCircle(x - 0.8, -16.8, 0.55));   // ojos
      gH.lineStyle(1.4, tono(pelo, 1.5)).lineBetween(-9.5, -20.3, -2.8, -20.8).lineBetween(2.8, -20.8, 9.5, -20.3);   // cejas
      if (mujer) gH.fillStyle(0xc0605a).fillEllipse(0, -3.8, 7, 2.4);
      else gH.lineStyle(1.4, 0x9a5b45).lineBetween(-3.5, -3.9, 3.5, -3.9);                                    // boca
      if (a.lentes) {
        gH.fillStyle(0xcfe6ff, 0.3).fillEllipse(-5.4, -16, 9.5, 7).fillEllipse(5.4, -16, 9.5, 7);
        gH.lineStyle(1.1, 0xe8f4ff, 0.9).strokeEllipse(-5.4, -16, 9.5, 7).strokeEllipse(5.4, -16, 9.5, 7)
          .lineBetween(-0.7, -16.5, 0.7, -16.5).lineBetween(-10.2, -16, -12.4, -15.5).lineBetween(10.2, -16, 12.4, -15.5);
      }
      if (!a.casco) gH.fillStyle(pelo).fillEllipse(0, -25, 26.5, 14.5).fillEllipse(-11.3, -19, 3.6, 9).fillEllipse(11.3, -19, 3.6, 9);
      else {
        const c = a.casco;
        gH.fillStyle(pelo).fillEllipse(-11.6, -19.5, 3.6, 8).fillEllipse(11.6, -19.5, 3.6, 8);                 // patillas
        poli(gH, c, [[-15.5, -19], [-16, -27], [-11, -35.5], [0, -40], [11, -35.5], [16, -27], [15.5, -19]]);
        gH.fillStyle(tono(c, 0.88)).fillRoundedRect(-17.5, -21.5, 35, 4.2, 2.1);                              // visera
        gH.fillStyle(tono(c, 1.2), 0.9).fillRoundedRect(-1.6, -39.4, 3.2, 17.5, 1.6);                        // cresta
        gH.fillStyle(0xffffff, 0.22).fillEllipse(-6.5, -33, 10, 6);
        gH.lineStyle(1.8, 0x0f5a63).lineBetween(-13.5, -17.5, -9, -1).lineBetween(13.5, -17.5, 9, -1)
          .lineBetween(-9, -1, 0, 1.6).lineBetween(0, 1.6, 9, -1);                                            // barbiquejo
        gH.fillStyle(0xb9c0c8).fillCircle(-9, -1, 1.7).fillCircle(9, -1, 1.7);
      }
    } else {                                                                                                   // nuca: todo cabello, sin rostro
      gH.fillStyle(tono(PIEL, 0.85)).fillEllipse(-12.6, -14.5, 4.6, 8).fillEllipse(12.6, -14.5, 4.6, 8);      // orejas
      if (mujer) poli(gH, pelo, [[-13, -22], [-16, 0], [-14.5, 26], [-6, 30], [6, 30], [14.5, 26], [16, 0], [13, -22]]);   // cabello largo sobre la espalda
      gH.fillStyle(pelo).fillEllipse(0, -15, 26, 30);
      if (!a.casco) gH.fillStyle(tono(pelo, 1.8), 0.3).fillEllipse(-4, -24, 10, 5);                           // brillo
      else {
        const c = a.casco;
        poli(gH, c, [[-15.5, -19], [-16, -27], [-11, -35.5], [0, -40], [11, -35.5], [16, -27], [15.5, -19]]);
        gH.fillStyle(tono(c, 0.88)).fillRoundedRect(-16.5, -21.5, 33, 3.6, 1.8);                              // borde trasero
        gH.fillStyle(tono(c, 1.2), 0.9).fillRoundedRect(-1.6, -39.4, 3.2, 17.5, 1.6);                        // cresta
        gH.fillStyle(0xffffff, 0.22).fillEllipse(-6.5, -33, 10, 6);
        gH.fillStyle(0x0f5a63).fillRoundedRect(-5, -18.5, 10, 3, 1.2);                                        // ajuste trasero
      }
    }

    const brI = brazo(-1), brD = brazo(1), pI = pierna(-1), pD = pierna(1), cab = cont(0, -52, gH);
    cab.setScale(0.93);
    const cuerpo = cont(0, 5, pI, pD, gT);
    if (gV) cuerpo.add(gV);
    cuerpo.add([brI, brD, cab]);
    return { raiz: cont(0, 0, cuerpo), cuerpo, pm: [pI, pD], bm: [brI, brD] };
  }

  // Ciclo de marcha: piernas con rodilla, brazos con codo, leve rebote e inclinación del cuerpo
  caminar(on = true) {
    if (!on) {
      this.tw?.stop();
      this.tw = null;
      this.pose(null);
      return;
    }
    if (this.tw) return;
    const o = { f: 0 };
    this.tw = this.scene.tweens.add({ targets: o, f: 1, duration: 500, repeat: -1, onUpdate: () => this.pose(o.f * Math.PI * 2) });
  }

  pose(p) {
    if (!this.cuerpo) return;
    this.fase = p;
    const [pC, pL] = this.pm, [bC, bL] = this.bm;
    if (this.orient !== 'lado') {   // frente/espalda: marcha en el sitio con rodillas alternadas, leve rebote y balanceo
      if (p === null) {
        pC.y = pL.y = 0; this.cuerpo.y = 5; this.cuerpo.rotation = 0;
        bC.rotation = 0.06; bL.rotation = -0.06; bC.cod.rotation = bL.cod.rotation = 0;
        return;
      }
      pC.y = -4 * Math.max(0, Math.sin(p)); pL.y = -4 * Math.max(0, -Math.sin(p));
      bC.rotation = 0.06 + 0.1 * Math.sin(p); bL.rotation = -0.06 + 0.1 * Math.sin(p);
      this.cuerpo.y = 4.5 + 1.5 * Math.abs(Math.sin(p));
      this.cuerpo.rotation = Math.sin(p) * 0.018;
      return;
    }
    if (p === null) {
      [pC, pL, pC.rod, pL.rod, bC, bL, bC.cod, bL.cod].forEach(c => { c.rotation = 0; });
      this.cuerpo.y = 5; this.cuerpo.rotation = 0;
      return;
    }
    const pierna = (l, f) => { l.rotation = -Math.sin(f) * 0.55; l.rod.rotation = 0.05 + 0.75 * Math.max(0, Math.cos(f)); };
    const brazo = (b, f) => { b.rotation = -Math.sin(f) * 0.5; b.cod.rotation = -(0.22 + 0.4 * Math.max(0, Math.sin(f))); };
    pierna(pC, p); pierna(pL, p + Math.PI);
    brazo(bC, p + Math.PI); brazo(bL, p);
    this.cuerpo.y = 4 + 2 * Math.abs(Math.sin(p));
    this.cuerpo.rotation = 0.03;
  }
}