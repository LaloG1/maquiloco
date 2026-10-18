// src/data/dinamicas.js
export const DINAMICAS = [
    // 0: Producción - Ordenar pasos
    {
        id: 'produccion', nombre: 'Producción', tipo: 'ordenar', minimo: 8,
        pasos: [
            { id: 1, texto: 'Mezclado de materias primas' },
            { id: 2, texto: 'Prensado de la mezcla' },
            { id: 3, texto: 'Curado en horno a alta temperatura' },
            { id: 4, texto: 'Rectificado final y control' }
        ]
    },
    // 1: Calidad - Memorama
    {
        id: 'calidad', nombre: 'Calidad', tipo: 'memorama', minimo: 5,
        parejas: [
            { id: 'a', texto: 'Grieta visible' }, { id: 'a', texto: 'Rechazo inmediato' },
            { id: 'b', texto: 'Prueba de dureza' }, { id: 'b', texto: 'Control de calidad' },
            { id: 'c', texto: 'Sistema PEPS' }, { id: 'c', texto: 'Rotación de inventario' },
            { id: 'd', texto: 'LOTO' }, { id: 'd', texto: 'Seguridad en mantenimiento' }
        ]
    },
    // 2: Almacén - Arrastrar y soltar
    {
        id: 'almacen', nombre: 'Almacén', tipo: 'arrastrar', minimo: 8,
        zonas: ['Materia Prima', 'Producto Terminado'],
        items: [
            { nombre: 'Resina Fenólica', zonaCorrecta: 'Materia Prima' },
            { nombre: 'Balata Terminada', zonaCorrecta: 'Producto Terminado' },
            { nombre: 'Fibra de Acero', zonaCorrecta: 'Materia Prima' }
        ]
    },
    // 3: Mantenimiento - Quiz de diagnóstico
    {
        id: 'mantenimiento', nombre: 'Mantenimiento', tipo: 'quiz', minimo: 8,
        preguntas: [
            { p: "¿Qué es el mantenimiento preventivo?", opciones: ["Reparar tras falla", "Acciones programadas para evitar fallas", "Comprar máquinas nuevas"], correcta: 1 },
            { p: "¿Qué significa LOTO?", opciones: ["Bloqueo y Etiquetado", "Limpieza de Taller", "Lote de Trabajo"], correcta: 0 },
            { p: "¿Cuándo se lubrica una prensa?", opciones: ["Cuando se rompe", "Según el manual del fabricante", "Una vez al año"], correcta: 1 }
        ]
    },
    // 4: Ingeniería - Quiz avanzado
    {
        id: 'ingenieria', nombre: 'Ingeniería', tipo: 'quiz', minimo: 8,
        preguntas: [
            { p: "¿Qué es una tolerancia dimensional?", opciones: ["El peso de la pieza", "Rango permitido de variación en una medida", "El color"], correcta: 1 },
            { p: "¿Herramienta para analizar causa raíz?", opciones: ["Diagrama de Ishikawa", "Martillo", "Calendario"], correcta: 0 },
            { p: "¿Qué es Kaizen?", opciones: ["Despedir gente", "Mejora continua con pequeños cambios", "No hacer nada"], correcta: 1 }
        ]
    },
    // 5: Supervisión - Casos situacionales
    {
        id: 'supervision', nombre: 'Supervisión', tipo: 'quiz', minimo: 8,
        preguntas: [
            { p: "Un operario no usa su EPP. ¿Qué haces?", opciones: ["Ignorarlo", "Detener la actividad y corregir de inmediato", "Gritarle"], correcta: 1 },
            { p: "¿Qué es una charla de 5 minutos?", opciones: ["Una siesta", "Reunión breve sobre seguridad o metas", "Descanso para café"], correcta: 1 },
            { p: "¿Cómo se mide el desempeño del equipo?", opciones: ["Por simpatía", "Con KPIs (Indicadores Clave)", "Por el ruido"], correcta: 1 }
        ]
    },
    // 6: Recursos Humanos - Quiz de casos
    {
        id: 'rrhh', nombre: 'Recursos Humanos', tipo: 'quiz', minimo: 8,
        preguntas: [
            { p: "¿Qué regula la NOM-035?", opciones: ["Extintores", "Riesgos psicosociales en el trabajo", "Tránsito"], correcta: 1 },
            { p: "¿Qué hacer ante un reporte de acoso?", opciones: ["Ignorarlo", "Investigar de manera confidencial", "Hacerlo público"], correcta: 1 },
            { p: "¿Qué es el clima laboral?", opciones: ["Temperatura de la oficina", "Ambiente de relaciones de los empleados", "Pronóstico del tiempo"], correcta: 1 }
        ]
    },

    // 7: Gerencia - Quiz final (20 preguntas, mínimo 9)
    {
        id: 'gerencia',
        nombre: 'Gerencia General',
        tipo: 'quiz',
        minimo: 9,
        preguntas: [
            {
                p: "¿Cuál es la misión de una empresa?",
                opciones: [
                    "Ganar dinero a toda costa",
                    "Vender acciones",
                    "La razón de ser y propósito"
                ],
                correcta: 2
            },
            {
                p: "¿Qué es un análisis FODA?",
                opciones: [
                    "Fortalezas, Oportunidades, Debilidades, Amenazas",
                    "Finanzas, Operaciones, Desarrollo",
                    "Un software"
                ],
                correcta: 0
            },
            {
                p: "¿Qué es el ROI?",
                opciones: [
                    "Registro de Operaciones",
                    "Un tipo de balata",
                    "Retorno sobre la Inversión"
                ],
                correcta: 2
            },
            {
                p: "¿Qué es la cadena de suministro?",
                opciones: [
                    "Una cadena de metal",
                    "Red de proveedores, producción y distribución",
                    "Un seguro"
                ],
                correcta: 1
            },
            {
                p: "¿Qué es la sustentabilidad?",
                opciones: [
                    "Operar sin comprometer el futuro",
                    "Usar más recursos",
                    "No producir nada"
                ],
                correcta: 0
            },
            {
                p: "¿Qué es un stakeholder?",
                opciones: [
                    "Un competidor",
                    "Un cliente enojado",
                    "Una parte interesada en la empresa"
                ],
                correcta: 2
            },
            {
                p: "¿Qué es la cultura organizacional?",
                opciones: [
                    "Las fiestas",
                    "Valores y comportamientos compartidos",
                    "El uniforme"
                ],
                correcta: 1
            },
            {
                p: "¿Qué es un presupuesto?",
                opciones: [
                    "Una deuda",
                    "Un gasto sin control",
                    "Un plan financiero cuantificado"
                ],
                correcta: 2
            },
            {
                p: "¿Qué es la calidad total?",
                opciones: [
                    "Involucrar a toda la organización en la mejora continua",
                    "Solo revisar el producto al final",
                    "Contratar más inspectores"
                ],
                correcta: 0
            },
            {
                p: "¿Qué es el benchmarking?",
                opciones: [
                    "Ignorar a la competencia",
                    "Copiar ilegalmente",
                    "Comparar procesos con los mejores de la industria"
                ],
                correcta: 2
            },
            {
                p: "¿Qué es un plan de contingencia?",
                opciones: [
                    "Un plan de ventas",
                    "Una estrategia para responder a emergencias",
                    "Un plan de vacaciones"
                ],
                correcta: 1
            },
            {
                p: "¿Qué es la automatización?",
                opciones: [
                    "Escribir todos los registros a mano",
                    "Despedir a todos los trabajadores",
                    "Usar tecnología para ejecutar tareas con mínima intervención humana"
                ],
                correcta: 2
            },
            {
                p: "¿Qué es el valor agregado?",
                opciones: [
                    "Características que mejoran el producto para el cliente",
                    "Un impuesto",
                    "El precio más alto"
                ],
                correcta: 0
            },
            {
                p: "¿Qué es la ética empresarial?",
                opciones: [
                    "Hacer cualquier cosa con tal de vender",
                    "Principios morales que guían la conducta de la empresa",
                    "Evitar pagar impuestos"
                ],
                correcta: 1
            },
            {
                p: "¿Qué es un KPI estratégico?",
                opciones: [
                    "El número total de empleados",
                    "Un número aleatorio",
                    "Un indicador que mide el avance hacia objetivos estratégicos"
                ],
                correcta: 2
            },
            {
                p: "¿Qué es la innovación?",
                opciones: [
                    "Introducir novedades o mejoras significativas",
                    "Hacer siempre lo mismo",
                    "Prohibir los cambios"
                ],
                correcta: 0
            },
            {
                p: "¿Qué es la responsabilidad social empresarial (RSE)?",
                opciones: [
                    "Ignorar a la comunidad",
                    "Contribuir al bienestar social y ambiental mediante prácticas responsables",
                    "Donar únicamente para obtener publicidad"
                ],
                correcta: 1
            },
            {
                p: "¿Qué es la toma de decisiones basada en datos?",
                opciones: [
                    "Seguir siempre la corazonada",
                    "Adivinar los resultados",
                    "Utilizar información y métricas reales para decidir"
                ],
                correcta: 2
            },
            {
                p: "¿Qué área es responsable de dirigir la estrategia general a largo plazo?",
                opciones: [
                    "Gerencia General",
                    "Producción",
                    "Mantenimiento"
                ],
                correcta: 0
            },
            {
                p: "¡Felicidades! ¿Estás listo para ser Gerente General?",
                opciones: [
                    "Me rindo",
                    "¡Sí, Maquiloco SA de CV es mía!",
                    "No"
                ],
                correcta: 1
            }
        ]
    }
];