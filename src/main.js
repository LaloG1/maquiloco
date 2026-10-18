import Phaser from 'phaser';
import LogoScene from './scenes/LogoScene.js';
import MenuScene from './scenes/MenuScene.js';
import PersonajeScene from './scenes/PersonajeScene.js';
import TutorialScene from './scenes/TutorialScene.js';
import IntroScene from './scenes/IntroScene.js';
import GameScene from './scenes/GameScene.js';

// Resolución base 1920x1080: se ve nítida en pantallas Full HD y se reduce suave en las pequeñas.
new Phaser.Game({
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  parent: 'juego',
  backgroundColor: '#050914',
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  render: { antialias: true, pixelArt: false, roundPixels: false },
  physics: { default: 'arcade', arcade: { debug: false } },
  scene: [LogoScene, MenuScene, PersonajeScene, TutorialScene, IntroScene, GameScene]
});
