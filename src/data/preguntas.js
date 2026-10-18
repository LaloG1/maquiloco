// Banco de preguntas por área. ok = respuesta correcta, mal = 3 respuestas incorrectas (se mezclan al jugar).
// La Fase 5 agrega las demás áreas.
export const PREGUNTAS = {
  produccion: [
    { p: '¿Qué producto fabrica la planta?', ok: 'Balatas (pastillas de freno)', mal: ['Llantas', 'Baterías', 'Bujías'] },
    { p: '¿Cuál es el PRIMER paso del proceso?', ok: 'Dosificación y pesado de materias primas', mal: ['Prensado en caliente', 'Rectificado', 'Empaque'] },
    { p: '¿Qué paso va justo después del mezclado?', ok: 'Preformado en frío', mal: ['Curado en horno', 'Inspección final', 'Rectificado'] },
    { p: '¿A qué temperatura se hace el prensado en caliente?', ok: '150 a 180 °C', mal: ['20 a 40 °C', '50 a 80 °C', '400 a 500 °C'] },
    { p: '¿Para qué sirve la placa de respaldo?', ok: 'Es la base metálica a la que se une el material de fricción', mal: ['Enfría la balata al frenar', 'Es solo decoración', 'Sirve para empacar la pieza'] },
    { p: '¿Qué se hace después del prensado en caliente?', ok: 'Curado en horno', mal: ['Dosificación', 'Preformado en frío', 'Mezclado'] },
    { p: '¿Cuál de estos NO es una materia prima de la balata?', ok: 'Tapones auditivos', mal: ['Fibras', 'Resinas', 'Lubricantes'] },
    { p: '¿Qué equipo de protección te cuida contra el polvo?', ok: 'Mascarilla', mal: ['Tapones auditivos', 'Calzado de seguridad', 'Guantes'] },
    { p: 'Una pieza sale fuera de especificación. ¿Qué haces?', ok: 'Detener la línea y avisar al supervisor', mal: ['Seguir produciendo para cumplir la meta', 'Mezclarla con las piezas buenas', 'Ocultarla y no decir nada'] },
    { p: '¿Qué paso elimina excedentes y da la medida final a la pieza?', ok: 'Rectificado', mal: ['Mezclado', 'Dosificación', 'Curado en horno'] }
  ]
};
