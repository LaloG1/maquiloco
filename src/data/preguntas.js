// src/data/preguntas.js
export const preguntasPorArea = [
  // 0: Producción
  {
    nombre: "Producción",
    preguntas: [
      { p: "¿Cuál es el primer paso en la fabricación de balatas?", opciones: ["Prensado", "Mezclado", "Curado", "Rectificado"], correcta: 1 },
      { p: "¿Qué máquina se usa para dar la forma final a la balata?", opciones: ["Prensa hidráulica", "Mezcladora", "Horno de curado", "Rectificadora"], correcta: 0 },
      { p: "¿Cuánto tiempo aproximado dura el proceso de curado?", opciones: ["1 hora", "4 a 6 horas", "24 horas", "30 minutos"], correcta: 1 },
      { p: "¿Qué material NO se usa en la mezcla de balatas?", opciones: ["Fibra de vidrio", "Resina fenólica", "Plomo puro", "Caucho"], correcta: 2 },
      { p: "¿Cuál es el objetivo del rectificado?", opciones: ["Abaratar costos", "Uniformar la superficie de fricción", "Pintar la balata", "Enfriar la mezcla"], correcta: 1 },
      { p: "¿Qué se verifica visualmente antes del prensado?", opciones: ["El color del empaque", "La homogeneidad de la mezcla", "El ruido de la máquina", "La temperatura del pasillo"], correcta: 1 },
      { p: "¿Qué EPP es obligatorio en la zona de mezclado?", opciones: ["Gafas de sol", "Respirador y guantes", "Sandalias", "Reloj de lujo"], correcta: 1 },
      { p: "¿Qué sucede si el curado es insuficiente?", opciones: ["La balata es más barata", "La balata se quiebra o desgasta rápido", "Mejora la fricción", "Nada"], correcta: 1 },
      { p: "¿Dónde se almacena la materia prima antes de mezclar?", opciones: ["En el área de gerencia", "En silos o contenedores secos", "En el baño", "En la calle"], correcta: 1 },
      { p: "¿Quién supervisa la línea de producción directa?", opciones: ["El CEO", "El supervisor de turno", "El de limpieza", "El cliente"], correcta: 1 }
    ]
  },
  // 1: Calidad
  {
    nombre: "Calidad",
    preguntas: [
      { p: "¿Qué prueba mide la resistencia al desgaste de la balata?", opciones: ["Prueba de dureza", "Prueba de frenado en dinamómetro", "Prueba de color", "Prueba de sonido"], correcta: 1 },
      { p: "¿Cuál es un defecto visual común en una balata?", opciones: ["Grietas o porosidad", "Brillo excesivo", "Peso exacto", "Olor a nuevo"], correcta: 0 },
      { p: "¿Qué norma ISO aplica comúnmente a la gestión de calidad?", opciones: ["ISO 9001", "ISO 14000", "ISO 22000", "Ninguna"], correcta: 0 },
      { p: "¿Qué se hace con un lote que no pasa la inspección?", opciones: ["Se envía al cliente", "Se reprocesa o se desecha", "Se esconde", "Se pinta"], correcta: 1 },
      { p: "¿Con qué frecuencia se calibran los equipos de medición?", opciones: ["Nunca", "Según el plan de calibración", "Solo cuando se rompen", "Una vez cada 10 años"], correcta: 1 },
      { p: "¿Qué documento registra los resultados de la inspección?", opciones: ["La nómina", "El reporte de calidad", "El menú del comedor", "El plano de la planta"], correcta: 1 },
      { p: "¿Qué es un 'muestreo aleatorio'?", opciones: ["Revisar solo las primeras piezas", "Revisar piezas seleccionadas al azar del lote", "Revisar todas las piezas", "No revisar nada"], correcta: 1 },
      { p: "¿La balata debe cumplir con especificaciones de...?", opciones: ["Solo tamaño", "Solo color", "Fricción, desgaste y compresibilidad", "Solo peso"], correcta: 2 },
      { p: "¿Qué herramienta mide el espesor de la balata?", opciones: ["Un martillo", "Un micrómetro o calibrador", "Una regla de madera", "La vista"], correcta: 1 },
      { p: "¿Quién tiene la autoridad para detener la línea por calidad?", opciones: ["Nadie", "Solo el gerente", "El inspector de calidad", "El guardia de seguridad"], correcta: 2 }
    ]
  },
  // 2: Almacén
  {
    nombre: "Almacén",
    preguntas: [
      { p: "¿Qué significan las siglas PEPS?", opciones: ["Primero en Entrar, Primero en Salir", "Producto Especial Para Salida", "Pedido Especial Prioritario", "Ninguna"], correcta: 0 },
      { p: "¿Dónde se debe almacenar la materia prima química?", opciones: ["Cualquier estante", "Zona ventilada y con contención", "Junto a la salida de emergencia", "En la oficina"], correcta: 1 },
      { p: "¿Qué documento acompaña a la mercancía que llega?", opciones: ["Un chiste", "La orden de compra y remisión", "Un dibujo", "Nada"], correcta: 1 },
      { p: "¿Qué equipo se usa para mover tarimas pesadas?", opciones: ["Una carretilla de mano", "Un montacargas", "La fuerza humana", "Un globo"], correcta: 1 },
      { p: "¿Qué se hace si hay una diferencia de inventario?", opciones: ["Se ignora", "Se investiga y se ajusta el sistema", "Se culpa al vecino", "Se quema el almacén"], correcta: 1 },
      { p: "¿Las balatas terminadas deben almacenarse...?", opciones: ["A la intemperie", "En lugar seco y libre de contaminantes", "En el pasillo de producción", "Debajo de la lluvia"], correcta: 1 },
      { p: "¿Qué es un 'conteo cíclico'?", opciones: ["Contar todo el almacén una vez al año", "Contar una parte del inventario periódicamente", "Contar solo lo que sobra", "No contar nada"], correcta: 1 },
      { p: "¿Qué EPP es obligatorio para el operador de montacargas?", opciones: ["Casco, chaleco y botas", "Traje de baño", "Guantes de seda", "Lentes de sol"], correcta: 0 },
      { p: "¿Qué se verifica al recibir un embarque?", opciones: ["Solo el peso", "Cantidad, integridad y documentación", "El color del camión", "El clima"], correcta: 1 },
      { p: "¿Qué sistema ayuda a rastrear la ubicación de un producto?", opciones: ["WMS (Sistema de Gestión de Almacén)", "Un post-it", "La memoria", "Un mapa del tesoro"], correcta: 0 }
    ]
  },
  // 3: Mantenimiento
  {
    nombre: "Mantenimiento",
    preguntas: [
      { p: "¿Qué es el mantenimiento preventivo?", opciones: ["Reparar cuando se rompe", "Acciones programadas para evitar fallas", "Comprar máquinas nuevas", "Pintar las paredes"], correcta: 1 },
      { p: "¿Qué es el mantenimiento correctivo?", opciones: ["Reparar después de una falla", "Limpiar la máquina", "Actualizar el software", "Capacitar al personal"], correcta: 0 },
      { p: "¿Qué es el 'Bloqueo y Etiquetado' (LOTO)?", opciones: ["Un juego de niños", "Procedimiento de seguridad para aislar energía", "Poner un candado a la puerta del baño", "Etiquetar productos"], correcta: 1 },
      { p: "¿Con qué frecuencia se debe lubricar una prensa?", opciones: ["Nunca", "Según el manual del fabricante", "Solo cuando hace ruido", "Una vez al año"], correcta: 1 },
      { p: "¿Qué se debe hacer antes de reparar un equipo eléctrico?", opciones: ["Desconectar y verificar ausencia de voltaje", "Mojar las manos", "Gritar fuerte", "Nada"], correcta: 0 },
      { p: "¿Qué es una 'orden de trabajo'?", opciones: ["Un despido", "Documento que detalla la tarea de mantenimiento", "Una factura", "Un plano"], correcta: 1 },
      { p: "¿Cuál es un indicador clave de mantenimiento?", opciones: ["Color de la camisa", "MTBF (Tiempo Medio Entre Fallas)", "Número de empleados", "Temperatura del café"], correcta: 1 },
      { p: "¿Qué se hace con las refacciones usadas?", opciones: ["Se tiran a la basura común", "Se disponen como residuo peligroso o se reciclan", "Se regalan", "Se comen"], correcta: 1 },
      { p: "¿Quién puede operar un montacargas?", opciones: ["Cualquiera", "Solo personal certificado y autorizado", "El gerente aunque no sepa", "Los visitantes"], correcta: 1 },
      { p: "¿Qué extintor se usa para un fuego eléctrico?", opciones: ["Agua", "CO2 o Polvo Químico Seco", "Espuma", "Arena"], correcta: 1 }
    ]
  },
  // 4: Ingeniería
  {
    nombre: "Ingeniería",
    preguntas: [
      { p: "¿Qué es una tolerancia dimensional?", opciones: ["El peso de la pieza", "El rango permitido de variación en una medida", "El color de la pieza", "El costo"], correcta: 1 },
      { p: "¿Qué herramienta se usa para analizar causas raíz de un problema?", opciones: ["Diagrama de Ishikawa (Espina de pescado)", "Un martillo", "Una calculadora", "Un calendario"], correcta: 0 },
      { p: "¿Qué significa 'Mejora Continua'?", opciones: ["No hacer nada", "Kaizen: pequeños cambios constantes para mejorar", "Cambiar todo cada día", "Despedir gente"], correcta: 1 },
      { p: "¿Qué es un 'plano de ingeniería'?", opciones: ["Un mapa de la ciudad", "Un dibujo técnico con especificaciones de la pieza", "Un cuadro de pintura", "Una fotografía"], correcta: 1 },
      { p: "¿Qué material es clave para la fricción en balatas modernas?", opciones: ["Amianto (prohibido)", "Fibras aramidas o metálicas", "Algodón", "Plástico"], correcta: 1 },
      { p: "¿Qué es el 'tiempo de ciclo'?", opciones: ["El tiempo que tarda un operario en ir al baño", "El tiempo para completar una operación o pieza", "El tiempo de descanso", "El tiempo de entrega"], correcta: 1 },
      { p: "¿Qué es un prototipo?", opciones: ["El producto final", "Una versión inicial para pruebas y validación", "Un desecho", "La máquina"], correcta: 1 },
      { p: "¿Qué estudio determina si un proceso es capaz de cumplir especificaciones?", opciones: ["Estudio de mercado", "Análisis de capacidad (Cp, Cpk)", "Encuesta de clima", "Auditoría financiera"], correcta: 1 },
      { p: "¿Qué es la estandarización?", opciones: ["Hacer cada quien lo que quiera", "Establecer métodos únicos y óptimos de trabajo", "Comprar lo más barato", "Cambiar de proveedor diario"], correcta: 1 },
      { p: "¿Qué software se usa comúnmente para diseño de piezas?", opciones: ["Word", "CAD (AutoCAD, SolidWorks)", "Paint", "Excel"], correcta: 1 }
    ]
  },
  // 5: Supervisión
  {
    nombre: "Supervisión",
    preguntas: [
      { p: "¿Cuál es la principal responsabilidad de un supervisor?", opciones: ["Hacer el trabajo de todos", "Lograr resultados a través del equipo", "Irse temprano", "Ignorar los problemas"], correcta: 1 },
      { p: "¿Qué hacer si un operario no usa su EPP?", opciones: ["Ignorarlo", "Detener la actividad y corregir de inmediato", "Gritarle", "Despedirlo sin aviso"], correcta: 1 },
      { p: "¿Qué es una 'charla de 5 minutos'?", opciones: ["Una siesta", "Reunión breve al inicio del turno sobre seguridad o metas", "Un descanso para café", "Una llamada personal"], correcta: 1 },
      { p: "¿Cómo se maneja un conflicto entre dos operarios?", opciones: ["Dejando que peleen", "Escuchando a ambas partes y mediando con base en reglas", "Despidiendo a ambos", "Ignorándolos"], correcta: 1 },
      { p: "¿Qué es el 'tablero de control' (Andon)?", opciones: ["Un televisor", "Herramienta visual para mostrar el estado de la producción", "Un videojuego", "Un reloj"], correcta: 1 },
      { p: "¿Qué se debe hacer ante un accidente de trabajo?", opciones: ["Ocultarlo", "Atender al lesionado, asegurar el área y reportar", "Limpiar y seguir trabajando", "Culpar al trabajador"], correcta: 1 },
      { p: "¿Qué es delegar?", opciones: ["Hacer todo uno mismo", "Asignar tareas con autoridad y responsabilidad", "No hacer nada", "Quejarse"], correcta: 1 },
      { p: "¿Cómo se mide el desempeño de un equipo?", opciones: ["Por simpatía", "Con KPIs (Indicadores Clave de Desempeño)", "Por la hora de llegada", "Por el ruido que hacen"], correcta: 1 },
      { p: "¿Qué es la comunicación asertiva?", opciones: ["Gritar fuerte", "Expresar ideas con claridad y respeto", "Guardar silencio", "Hablar por los demás"], correcta: 1 },
      { p: "¿Qué se hace si se detecta una desviación en la meta diaria?", opciones: ["Esperar a mañana", "Analizar la causa y aplicar contramedidas", "Fingir que no pasó nada", "Culpar a otro turno"], correcta: 1 }
    ]
  },
  // 6: Recursos Humanos
  {
    nombre: "Recursos Humanos",
    preguntas: [
      { p: "¿Qué es la NOM-035 en México?", opciones: ["Norma de extintores", "Factores de riesgo psicosocial en el trabajo", "Norma de construcción", "Norma de tránsito"], correcta: 1 },
      { p: "¿Qué documento formaliza la relación laboral?", opciones: ["Un apretón de manos", "El contrato individual de trabajo", "Un mensaje de texto", "La credencial"], correcta: 1 },
      { p: "¿Qué se debe hacer ante un reporte de acoso laboral?", opciones: ["Ignorarlo", "Investigar de manera confidencial y aplicar el protocolo", "Hacerlo público", "Despedir al que reporta"], correcta: 1 },
      { p: "¿Qué es el 'clima laboral'?", opciones: ["La temperatura de la oficina", "El ambiente de relaciones y percepción de los empleados", "El pronóstico del tiempo", "El color de las paredes"], correcta: 1 },
      { p: "¿Cuántos días de vacaciones mínimas establece la ley (reforma reciente)?", opciones: ["6 días", "12 días", "10 días", "20 días"], correcta: 1 }, // 12 días es la reforma actual
      { p: "¿Qué es la inducción?", opciones: ["Despedir a alguien", "Proceso de integración y capacitación inicial al nuevo empleado", "Una fiesta", "Un examen"], correcta: 1 },
      { p: "¿Qué se evalúa en una evaluación de desempeño?", opciones: ["La vida personal", "Competencias, resultados y comportamientos laborales", "La ropa", "Los amigos"], correcta: 1 },
      { p: "¿Qué es la 'igualdad de género' en la empresa?", opciones: ["Contratar solo mujeres", "Mismas oportunidades y trato sin importar el género", "Pagar más a los hombres", "No aplicar"], correcta: 1 },
      { p: "¿Qué es un Comité de Seguridad e Higiene?", opciones: ["Un grupo de amigos", "Órgano paritario que vigila las condiciones de seguridad", "La junta directiva", "Los sindicatos"], correcta: 1 },
      { p: "¿Qué se debe hacer si un empleado muestra agotamiento extremo (burnout)?", opciones: ["Exigirle más", "Ofrecer apoyo, revisar carga de trabajo y derivar a salud", "Despedirlo", "Ignorarlo"], correcta: 1 }
    ]
  },
  // 7: Gerencia (20 preguntas, requiere 18 aciertos para 9/10)
  {
    nombre: "Gerencia",
    preguntas: [
      { p: "¿Cuál es la misión de una empresa?", opciones: ["Ganar dinero a toda costa", "La razón de ser y propósito de la organización", "Vender acciones", "Despedir gente"], correcta: 1 },
      { p: "¿Qué es un análisis FODA?", opciones: ["Fortalezas, Oportunidades, Debilidades, Amenazas", "Finanzas, Operaciones, Desarrollo, Administración", "Un software", "Una ley"], correcta: 0 },
      { p: "¿Qué es el ROI?", opciones: ["Retorno sobre la Inversión", "Registro de Operaciones Industriales", "Un tipo de balata", "Ninguna"], correcta: 0 },
      { p: "¿Qué área es responsable de la estrategia a largo plazo?", opciones: ["Producción", "Gerencia General", "Mantenimiento", "Limpieza"], correcta: 1 },
      { p: "¿Qué es la 'cadena de suministro'?", opciones: ["Una cadena de metal", "Red de proveedores, producción y distribución", "Un seguro", "Un contrato"], correcta: 1 },
      { p: "¿Qué es la 'sustentabilidad' en la industria?", opciones: ["Usar más recursos", "Operar satisfaciendo necesidades presentes sin comprometer el futuro", "No producir nada", "Talar árboles"], correcta: 1 },
      { p: "¿Qué es un 'stakeholder'?", opciones: ["Un accionista o parte interesada en la empresa", "Un competidor", "Un cliente enojado", "Un tipo de máquina"], correcta: 0 },
      { p: "¿Qué es la 'cultura organizacional'?", opciones: ["Las fiestas de la empresa", "Valores, creencias y comportamientos compartidos", "El uniforme", "El edificio"], correcta: 1 },
      { p: "¿Qué es un presupuesto?", opciones: ["Un gasto sin control", "Plan financiero cuantificado para un período", "Una deuda", "Un regalo"], correcta: 1 },
      { p: "¿Qué es la 'calidad total'?", opciones: ["Solo revisar el producto final", "Involucrar a toda la organización en la mejora continua", "Contratar más inspectores", "Subir precios"], correcta: 1 },
      { p: "¿Qué es el 'benchmarking'?", opciones: ["Copiar ilegalmente", "Comparar procesos con los mejores de la industria", "Ignorar a la competencia", "Bajar la calidad"], correcta: 1 },
      { p: "¿Qué es un 'plan de contingencia'?", opciones: ["Un plan de vacaciones", "Estrategia para responder a emergencias o fallos graves", "Un plan de ventas", "Un menú"], correcta: 1 },
      { p: "¿Qué es la 'automatización'?", opciones: ["Despedir a todos", "Uso de tecnología para realizar procesos con mínima intervención humana", "Escribir a mano", "Pintar robots"], correcta: 1 },
      { p: "¿Qué es el 'valor agregado'?", opciones: ["El precio más alto", "Características que mejoran el producto para el cliente", "Un impuesto", "Un defecto"], correcta: 1 },
      { p: "¿Qué es la 'ética empresarial'?", opciones: ["Hacer lo que sea legal aunque sea malo", "Principios morales que guían la conducta de la empresa", "No pagar impuestos", "Engañar al cliente"], correcta: 1 },
      { p: "¿Qué es un 'KPI estratégico'?", opciones: ["Un número aleatorio", "Indicador que mide el avance hacia los objetivos macro", "El número de empleados", "La temperatura"], correcta: 1 },
      { p: "¿Qué es la 'innovación'?", opciones: ["Hacer lo mismo de siempre", "Introducir novedades o mejoras significativas", "Comprar maquinaria vieja", "Prohibir cambios"], correcta: 1 },
      { p: "¿Qué es la 'responsabilidad social empresarial' (RSE)?", opciones: ["Donar solo por publicidad", "Impacto positivo de la empresa en la sociedad y medio ambiente", "No pagar salarios", "Ignorar a la comunidad"], correcta: 1 },
      { p: "¿Qué es la 'toma de decisiones basada en datos'?", opciones: ["Adivinar", "Usar información y métricas reales para elegir un camino", "Seguir la corazonada", "Hacer lo que dice el que grita más"], correcta: 1 },
      { p: "¡Felicidades! Si llegaste aquí, ¿estás listo para ser Gerente General?", opciones: ["No", "Sí, ¡Maquiloco SA de CV es mía!", "Tal vez", "Me rindo"], correcta: 1 }
    ]
  }
];