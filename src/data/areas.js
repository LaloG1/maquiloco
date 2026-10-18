// Orden oficial de desbloqueo.
// atuendo = ropa del personaje dentro del área · minimo = calificación mínima (base 10) · n = preguntas del quiz
// info = lo que muestra el icono de INFORMACIÓN (aquí está todo lo necesario para resolver la dinámica).
export const AREAS = [
  { id: 'produccion', nombre: 'Producción', atuendo: 'produccion', minimo: 8, n: 10, info: [
    'La planta fabrica balatas (pastillas de freno) para autos: material de fricción pegado a una placa metálica de respaldo.',
    'Proceso en orden: 1 Dosificación y pesado de materias primas, 2 Mezclado, 3 Preformado en frío, 4 Prensado en caliente (150 a 180 °C), 5 Curado en horno, 6 Rectificado y acabado, 7 Inspección y empaque.',
    'Materias primas: fibras, resinas, abrasivos, lubricantes y rellenos.',
    'El rectificado elimina excedentes y deja la pieza en su medida final.',
    'EPP obligatorio: lentes, guantes, mascarilla contra polvo, tapones auditivos y calzado de seguridad.',
    'Si una pieza sale fuera de especificación, se detiene la línea y se avisa al supervisor.'
  ] },
  { id: 'calidad', nombre: 'Calidad', atuendo: 'calidad', minimo: 8, n: 10, info: [
    'Calidad verifica que cada balata cumpla las especificaciones del cliente antes de enviarla.',
    'Con un calibrador (vernier) se mide el espesor y las dimensiones de la pieza.',
    'La prueba de dureza y la prueba de fricción en dinamómetro verifican cómo se comporta la balata al frenar.',
    'Inspección visual: se buscan grietas, rebabas, golpes y fallas en el pegado de la placa.',
    'Muestreo: se revisa una muestra representativa del lote, con criterios estadísticos.',
    'Pieza no conforme: se separa e identifica (segregación) y se abre una acción correctiva.'
  ] },
  { id: 'almacen', nombre: 'Almacén', atuendo: 'almacen', minimo: 8, n: 10, info: [
    'PEPS: Primeras Entradas, Primeras Salidas. Se usa primero el material que llegó antes.',
    'Tres tipos de inventario: materia prima, producto en proceso y producto terminado.',
    'Cada caja o tarima lleva etiqueta o código de barras con lote, cantidad y fecha.',
    'Inventario cíclico: se cuentan pocas ubicaciones cada día para detectar diferencias a tiempo.',
    'El montacargas solo lo opera personal capacitado y autorizado, respetando el límite de carga.',
    'Los pasillos y las salidas de emergencia siempre deben estar libres.'
  ] },
  { id: 'mantenimiento', nombre: 'Mantenimiento', atuendo: 'mantenimiento', minimo: 8, n: 10, info: [
    'Preventivo: se hace en fechas programadas para evitar fallas (lubricar, ajustar, cambiar piezas).',
    'Correctivo: se hace después de que la máquina falla, para repararla.',
    'Predictivo: se mide vibración o temperatura para anticipar una falla antes de que ocurra.',
    'LOTO (bloqueo y etiquetado): antes de intervenir una máquina se corta y bloquea su energía y se coloca una etiqueta.',
    'TPM: el operador también cuida su máquina con limpieza, inspección básica y lubricación.',
    'Un paro de línea cuesta producción, por eso se registra la causa y el tiempo de cada falla.'
  ] },
  { id: 'ingenieria', nombre: 'Ingeniería', atuendo: 'formal', minimo: 8, n: 10, info: [
    'Ingeniería define el proceso, los planos y las especificaciones del producto.',
    'Tolerancia: variación permitida en una medida. Fuera de tolerancia, la pieza se rechaza.',
    'AMEF: análisis de modo y efecto de falla, para prevenir problemas antes de que sucedan.',
    'Cp y Cpk miden si el proceso es capaz de producir dentro de tolerancia; un Cpk de 1.33 o más se considera capaz.',
    'Kaizen: mejora continua con pequeños cambios constantes en el proceso.',
    'Balanceo de línea: repartir el trabajo para que ninguna estación se convierta en cuello de botella.'
  ] },
  { id: 'supervision', nombre: 'Supervisión', atuendo: 'formal', minimo: 8, n: 10, info: [
    'El supervisor organiza al equipo, asigna tareas y cuida la seguridad de su turno.',
    'Indicadores clave: producción contra la meta, merma (scrap) y paros de línea.',
    'OEE mide la eficiencia real de un equipo: disponibilidad, rendimiento y calidad.',
    'Entrega de turno: se informa pendientes, incidentes y estado de las máquinas al turno siguiente.',
    'Ante un accidente o incidente se atiende, se reporta de inmediato y se investiga la causa.',
    'Un buen líder da instrucciones claras, escucha al equipo y reconoce los logros.'
  ] },
  { id: 'rrhh', nombre: 'Recursos Humanos', atuendo: 'formal', minimo: 8, n: 10, info: [
    'RH recluta, contrata, capacita y da seguimiento al personal de la planta.',
    'La inducción y la capacitación son obligatorias antes de operar un equipo.',
    'Seguridad e higiene: las normas de la STPS (como las NOM) protegen al trabajador y se auditan.',
    'El equipo de protección personal (EPP) lo entrega la empresa y el trabajador debe usarlo.',
    'Clima laboral: encuestas y comunicación para mantener buen ambiente y reducir la rotación de personal.',
    'Nómina, prestaciones, asistencia y contratos también se administran en esta área.'
  ] },
  { id: 'gerencia', nombre: 'Gerencia', atuendo: 'formal', minimo: 9, n: 20, info: [
    'La gerencia define la estrategia y vigila que la planta sea rentable y cumpla con los clientes.',
    'Certificaciones: ISO 9001 (calidad) e IATF 16949 (estándar del sector automotriz).',
    'Indicadores globales: entregas a tiempo, calidad, costos, seguridad y rotación de personal.',
    'Producción fabrica, Calidad verifica, Almacén resguarda y Mantenimiento cuida las máquinas.',
    'Ingeniería mejora el proceso, Supervisión dirige el turno y RH cuida al personal.',
    'El quiz final cubre las ocho áreas: necesitas mínimo 9/10 para ser gerente general.'
  ] }
];
