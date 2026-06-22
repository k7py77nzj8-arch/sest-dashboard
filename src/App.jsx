import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LineChart, Line, Legend, ComposedChart
} from "recharts";

/* ══════════════════════════════════════════════════════
   PALETA Y TIPOGRAFÍA
══════════════════════════════════════════════════════ */
const C = {
  aplicado:     "#1a56a0",
  ausente:      "#e07b3a",
  noAplicado:   "#c0392b",
  reprogramado: "#8e44ad",
  enAuditoria:  "#16a085",
  porAplicar:   "#c8d6e5",
  verde:        "#1e8c4e",
  verdeLight:   "#e8f7ef",
  verdeBorder:  "#a8dfc0",
  amarillo:     "#f0a500",
  rojo:         "#c0392b",
  bg:           "#f0f4fa",
  card:         "#ffffff",
  border:       "#dde5f0",
  text:         "#1a2340",
  muted:        "#5a6a8a",
  headerFrom:   "#0d3170",
  headerTo:     "#2471c8",
};
const FONT_COND = "'Barlow Condensed', sans-serif";
const FONT_BODY = "'DM Sans', sans-serif";

/* ══════════════════════════════════════════════════════
   BASE DE DATOS POR FECHA
   Para agregar un nuevo día: añadir una entrada al objeto
   DATOS con la clave "DD/MM" y rellenar todos los campos.
══════════════════════════════════════════════════════ */
const DATOS = {

  /* ─────────────────────────────────────────────────────
     19/05  — solo datos de cobertura diaria
     Los campos acumulados (General/Territorial/Muestra)
     no se cargan para estas fechas intermedias.
  ───────────────────────────────────────────────────── */
  "19/05": {
    corte: "19 de mayo de 2026",
    semana: "Semana 1",
    soloDialy: true,            // marca: no mostrar en General/Territorial/Muestra
    // campos acumulados vacíos — no se usan en General
    evalProgramadas: null, evalAplicadas: null, evalAplicadasPct: null,
    evalReprogramadas: null, evalReprogramadasPct: null,
    evalAusentes: null, evalAusentesPct: null,
    evalNoAplicado: null, evalPorAplicar: null, evalPorAplicarPct: null,
    estProgramados: null, estAplicados: null, estAplicadosPct: null,
    estParcial: null, estParcialPct: null, estAusentes: null,
    estReprogramados: null, estReprogramadosPct: null,
    estPorAplicar: null, estPorAplicarPct: null,
    globalPie: null, subniveles: null, sostenimiento: null,
    areaUrbana: null, areaRural: null, provincias: null,
    labTotal: null, labAplicados: null, labAplicadosPct: null,
    labParcial: null, labParcialPct: null,
    labPorAplicar: null, labPorAplicarPct: null,
    labBajo95: null, labBajo90: null, labsBajo95: null,
    avanceSemanal: null,
    // ── Cobertura diaria ──────────────────────────────
    // Evaluaciones del día
    diaCobPct: 90.28,
    diaAplicados: 3735,
    diaProgramados: 4137,
    diaAusentes: 343,
    diaNoAplicados: 20,
    diaReprogramados: 76,
    // Estudiantes — acumulado al corte 19/05
    diaEstProgramados: 25673,
    diaEstAplicados: 4122,       diaEstAplicadosPct: 16.06,
    diaEstParcial: 2780,         diaEstParcialPct: 10.83,
    diaEstAusentes: 130,
    diaEstReprogramados: 352,    diaEstReprogramadosPct: 1.37,
    diaEstPorAplicar: 18242,     diaEstPorAplicarPct: 71.06,
    diaEstPie: [
      { name: "Aplicado",        value: 4122,  pct: "16,06%", color: "#1a56a0" },
      { name: "Parc. aplicado",  value: 2780,  pct: "10,83%", color: "#f0a500" },
      { name: "Reprogramado",    value: 352,   pct: "1,37%",  color: "#8e44ad" },
      { name: "Ausente",         value: 130,   pct: "0,51%",  color: "#e07b3a" },
      { name: "Por aplicar",     value: 18242, pct: "71,06%", color: "#c8d6e5" },
    ],
    diaLabsTotal: 596,
    diaLabsInicio: null,
    diaLabsInicioPct: null,
    diaSesiones: [],            // reporte 19/05 no incluye detalle por sesión
    diaAusentismoObs: [
      { motivo: "Sin dato",    n: 312 },
      { motivo: "Enfermedad",  n: 20  },
      { motivo: "Calamidad",   n: 4   },
      { motivo: "Deportista",  n: 3   },
      { motivo: "Act. IE",     n: 1   },
      { motivo: "Fuera país",  n: 1   },
      { motivo: "Hospitalizado", n: 1 },
      { motivo: "Maternidad",  n: 1   },
    ],
    diaNoAplicadosObs: [
      { obs: "Retirado",             n: 14, pct: "70,0%" },
      { obs: "Estudiante NEE",       n: 3,  pct: "15,0%" },
      { obs: "No pertenece a la IE", n: 3,  pct: "15,0%" },
    ],
    diaReprogramadosObs: [
      { obs: "Reprogramado", n: 76, pct: "100%" },
    ],
    diaNoInicio: null,
    diaNoInicioN: 0,
    diaNotaSesion: "El reporte del 19/05 no incluye detalle de sesiones ni inicio de sesión.",
  },

  /* ─────────────────────────────────────────────────────
     20/05  — solo datos de cobertura diaria
  ───────────────────────────────────────────────────── */
  "20/05": {
    corte: "20 de mayo de 2026",
    semana: "Semana 1",
    soloDialy: true,
    evalProgramadas: null, evalAplicadas: null, evalAplicadasPct: null,
    evalReprogramadas: null, evalReprogramadasPct: null,
    evalAusentes: null, evalAusentesPct: null,
    evalNoAplicado: null, evalPorAplicar: null, evalPorAplicarPct: null,
    estProgramados: null, estAplicados: null, estAplicadosPct: null,
    estParcial: null, estParcialPct: null, estAusentes: null,
    estReprogramados: null, estReprogramadosPct: null,
    estPorAplicar: null, estPorAplicarPct: null,
    globalPie: null, subniveles: null, sostenimiento: null,
    areaUrbana: null, areaRural: null, provincias: null,
    labTotal: null, labAplicados: null, labAplicadosPct: null,
    labParcial: null, labParcialPct: null,
    labPorAplicar: null, labPorAplicarPct: null,
    labBajo95: null, labBajo90: null, labsBajo95: null,
    avanceSemanal: null,
    // ── Cobertura diaria ──────────────────────────────
    // Evaluaciones del día
    diaCobPct: 88.82,
    diaAplicados: 3847,
    diaProgramados: 4331,
    diaAusentes: 376,
    diaNoAplicados: 32,
    diaReprogramados: 1,
    // Estudiantes — acumulado al corte 20/05
    diaEstProgramados: 25673,
    diaEstAplicados: 3667,       diaEstAplicadosPct: 14.28,
    diaEstParcial: 447,          diaEstParcialPct: 1.74,
    diaEstAusentes: 285,
    diaEstReprogramados: 9,      diaEstReprogramadosPct: 0.04,
    diaEstPorAplicar: 21129,     diaEstPorAplicarPct: 82.30,
    diaEstPie: [
      { name: "Aplicado",        value: 3667,  pct: "14,28%", color: "#1a56a0" },
      { name: "Parc. aplicado",  value: 447,   pct: "1,74%",  color: "#f0a500" },
      { name: "Reprogramado",    value: 9,     pct: "0,04%",  color: "#8e44ad" },
      { name: "Ausente",         value: 285,   pct: "1,11%",  color: "#e07b3a" },
      { name: "Por aplicar",     value: 21129, pct: "82,30%", color: "#c8d6e5" },
    ],
    diaLabsTotal: 596,
    diaLabsInicio: null,
    diaLabsInicioPct: null,
    diaSesiones: [],
    diaAusentismoObs: [
      { motivo: "Sin dato",    n: 344 },
      { motivo: "Enfermedad",  n: 23  },
      { motivo: "Calamidad",   n: 6   },
      { motivo: "Deportista",  n: 2   },
      { motivo: "Hospitalizado", n: 1 },
    ],
    diaNoAplicadosObs: [
      { obs: "Retirado",             n: 19, pct: "59,4%" },
      { obs: "Estudiante NEE",       n: 8,  pct: "25,0%" },
      { obs: "No pertenece a la IE", n: 5,  pct: "15,6%" },
    ],
    diaReprogramadosObs: [
      { obs: "Falla técnica", n: 1, pct: "100%" },
    ],
    diaNoInicio: null,
    diaNoInicioN: 0,
    diaNotaSesion: "El reporte del 20/05 no incluye detalle de sesiones ni inicio de sesión.",
  },

  /* ─────────────────────────────────────────────────────
     21/05  — solo datos de cobertura diaria
  ───────────────────────────────────────────────────── */
  "21/05": {
    corte: "21 de mayo de 2026",
    semana: "Semana 1",
    soloDialy: true,
    evalProgramadas: null, evalAplicadas: null, evalAplicadasPct: null,
    evalReprogramadas: null, evalReprogramadasPct: null,
    evalAusentes: null, evalAusentesPct: null,
    evalNoAplicado: null, evalPorAplicar: null, evalPorAplicarPct: null,
    estProgramados: null, estAplicados: null, estAplicadosPct: null,
    estParcial: null, estParcialPct: null, estAusentes: null,
    estReprogramados: null, estReprogramadosPct: null,
    estPorAplicar: null, estPorAplicarPct: null,
    globalPie: null, subniveles: null, sostenimiento: null,
    areaUrbana: null, areaRural: null, provincias: null,
    labTotal: null, labAplicados: null, labAplicadosPct: null,
    labParcial: null, labParcialPct: null,
    labPorAplicar: null, labPorAplicarPct: null,
    labBajo95: null, labBajo90: null, labsBajo95: null,
    avanceSemanal: null,
    // ── Cobertura diaria ──────────────────────────────
    // Evaluaciones del día
    diaCobPct: 96.22,
    diaAplicados: 3026,
    diaProgramados: 3145,
    diaAusentes: 66,
    diaNoAplicados: 18,
    diaReprogramados: 35,
    // Estudiantes — acumulado al corte 21/05
    diaEstProgramados: 25673,
    diaEstAplicados: 4122,       diaEstAplicadosPct: 16.06,
    diaEstParcial: 2780,         diaEstParcialPct: 10.83,
    diaEstAusentes: 130,
    diaEstReprogramados: 352,    diaEstReprogramadosPct: 1.37,
    diaEstPorAplicar: 18242,     diaEstPorAplicarPct: 71.06,
    diaEstPie: [
      { name: "Aplicado",        value: 4122,  pct: "16,06%", color: "#1a56a0" },
      { name: "Parc. aplicado",  value: 2780,  pct: "10,83%", color: "#f0a500" },
      { name: "Reprogramado",    value: 352,   pct: "1,37%",  color: "#8e44ad" },
      { name: "Ausente",         value: 130,   pct: "0,51%",  color: "#e07b3a" },
      { name: "Por aplicar",     value: 18242, pct: "71,06%", color: "#c8d6e5" },
    ],
    diaLabsTotal: null,
    diaLabsInicio: null,
    diaLabsInicioPct: null,
    diaSesiones: [],
    diaAusentismoObs: [
      { motivo: "Sin dato",    n: 30 },
      { motivo: "Enfermedad",  n: 29 },
      { motivo: "Hospitalizado", n: 3 },
      { motivo: "Act. IE",     n: 1  },
      { motivo: "Calamidad",   n: 1  },
      { motivo: "Deportista",  n: 1  },
      { motivo: "Maternidad",  n: 1  },
    ],
    diaNoAplicadosObs: [
      { obs: "Retirado",              n: 13, pct: "72,2%" },
      { obs: "No pertenece a la IE",  n: 2,  pct: "11,1%" },
      { obs: "Estudiante NEE",        n: 1,  pct: "5,6%"  },
      { obs: "No pertenece al grado", n: 1,  pct: "5,6%"  },
      { obs: "Sin permiso padres",    n: 1,  pct: "5,6%"  },
    ],
    diaReprogramadosObs: [
      { obs: "Falla técnica",  n: 21, pct: "60%" },
      { obs: "Falla eléctrica", n: 14, pct: "40%" },
    ],
    diaNoInicio: null,
    diaNoInicioN: 0,
    diaNotaSesion: "El reporte del 21/05 no incluye detalle de sesiones ni inicio de sesión.",
  },

  "22/05": {
    corte: "22 de mayo de 2026",
    semana: "Semana 1",
    // Cobertura general — evaluaciones
    evalProgramadas: 51346,
    evalAplicadas:   13850,
    evalAplicadasPct: 26.97,
    evalReprogramadas: 1869,
    evalReprogramadasPct: 3.64,
    evalAusentes: 357,
    evalAusentesPct: 0.70,
    evalNoAplicado: 97,
    evalPorAplicar: 35173,
    evalPorAplicarPct: 68.50,
    // Cobertura general — estudiantes
    estProgramados: 25673,
    estAplicados:   6748,
    estAplicadosPct: 26.28,
    estParcial: 354,
    estParcialPct: 1.38,
    estAusentes: 105,
    estReprogramados: 858,
    estReprogramadosPct: 3.34,
    estPorAplicar: 17560,
    estPorAplicarPct: 68.40,
    // Pie global (evaluaciones)
    globalPie: [
      { name: "Aplicado",     value: 13850, pct: "26,97%", color: C.aplicado     },
      { name: "Reprogramado", value: 1869,  pct: "3,64%",  color: C.reprogramado },
      { name: "Ausente",      value: 357,   pct: "0,70%",  color: C.ausente      },
      { name: "No aplicado",  value: 97,    pct: "0,19%",  color: C.noAplicado   },
      { name: "Por aplicar",  value: 35173, pct: "68,50%", color: C.porAplicar   },
    ],
    // Subniveles
    subniveles: [
      { nivel: "Bachillerato", aplicado: 4044, total: 12480, pct: 32.40 },
      { nivel: "Superior",     aplicado: 3478, total: 13274, pct: 26.20 },
      { nivel: "Media",        aplicado: 3406, total: 12902, pct: 26.40 },
      { nivel: "Elemental",    aplicado: 2922, total: 12690, pct: 23.03 },
    ],
    // Sostenimiento
    sostenimiento: [
      { tipo: "Fiscomisional", pct: 27.88, aplicado: 3133, total: 11236 },
      { tipo: "Fiscal",        pct: 27.52, aplicado: 4792, total: 17412 },
      { tipo: "Municipal",     pct: 26.81, aplicado: 2527, total: 9424  },
      { tipo: "Particular",   pct: 25.60, aplicado: 3398, total: 13274 },
    ],
    // Área
    areaUrbana: { aplicado: 9372, total: 32716, pct: 28.65 },
    areaRural:  { aplicado: 4478, total: 18630, pct: 24.04 },
    // Provincias
    provincias: [
      { provincia: "Chimborazo",   pct: 44.78, aplicado: 797,  programado: 1780  },
      { provincia: "Pastaza",      pct: 41.67, aplicado: 265,  programado: 636   },
      { provincia: "Carchi",       pct: 41.39, aplicado: 553,  programado: 1336  },
      { provincia: "Azuay",        pct: 32.07, aplicado: 1320, programado: 4116  },
      { provincia: "Cotopaxi",     pct: 30.11, aplicado: 633,  programado: 2102  },
      { provincia: "Bolívar",      pct: 29.94, aplicado: 106,  programado: 354   },
      { provincia: "Pichincha",    pct: 29.92, aplicado: 7769, programado: 25964 },
      { provincia: "Cañar",        pct: 27.06, aplicado: 328,  programado: 1212  },
      { provincia: "Imbabura",     pct: 26.88, aplicado: 863,  programado: 3210  },
      { provincia: "Tungurahua",   pct: 22.82, aplicado: 747,  programado: 3274  },
      { provincia: "Zamora Ch.",   pct: 19.02, aplicado: 70,   programado: 368   },
      { provincia: "Sucumbíos",    pct: 17.97, aplicado: 193,  programado: 1074  },
      { provincia: "Morona S.",    pct: 14.54, aplicado: 132,  programado: 908   },
      { provincia: "Loja",         pct: 2.74,  aplicado: 74,   programado: 2704  },
      { provincia: "Napo",         pct: 0,     aplicado: 0,    programado: 1152  },
      { provincia: "Orellana",     pct: 0,     aplicado: 0,    programado: 1156  },
    ],
    // Labs
    labTotal: 596,
    labAplicados: 128,   labAplicadosPct: 21.48,
    labParcial: 51,      labParcialPct: 8.56,
    labPorAplicar: 405,  labPorAplicarPct: 67.95,
    labBajo95: 19,
    labBajo90: 3,
    labsBajo95: [
      { prov: "Pichincha", n: 10 }, { prov: "Azuay", n: 3 },
      { prov: "Imbabura", n: 2 },   { prov: "Morona Santiago", n: 2 },
      { prov: "Chimborazo", n: 1 }, { prov: "Sucumbíos", n: 1 },
    ],
    // Día específico — evaluaciones
    diaCobPct: 95.62,
    diaAplicados: 2750,
    diaProgramados: 2876,
    diaAusentes: 92,
    diaNoAplicados: 14,
    diaReprogramados: 20,
    // Estudiantes — acumulado al corte 22/05
    diaEstProgramados: 25673,
    diaEstAplicados: 6748,       diaEstAplicadosPct: 26.28,
    diaEstParcial: 354,          diaEstParcialPct: 1.38,
    diaEstAusentes: 105,
    diaEstReprogramados: 858,    diaEstReprogramadosPct: 3.34,
    diaEstPorAplicar: 17560,     diaEstPorAplicarPct: 68.40,
    diaEstPie: [
      { name: "Aplicado",        value: 6748,  pct: "26,28%", color: "#1a56a0" },
      { name: "Parc. aplicado",  value: 354,   pct: "1,38%",  color: "#f0a500" },
      { name: "Reprogramado",    value: 858,   pct: "3,34%",  color: "#8e44ad" },
      { name: "Ausente",         value: 105,   pct: "0,41%",  color: "#e07b3a" },
      { name: "Por aplicar",     value: 17560, pct: "68,40%", color: "#c8d6e5" },
    ],
    diaLabsTotal: 95,
    diaLabsInicio: 94,
    diaLabsInicioPct: 98.95,
    diaSesiones: [
      { sesion: "S1", total: 1245, aplicado: 1199, pct: 96.31 },
      { sesion: "S2", total: 1280, aplicado: 1236, pct: 96.56 },
      { sesion: "S3", total: 196,  aplicado: 175,  pct: 89.29 },
      { sesion: "S4", total: 155,  aplicado: 140,  pct: 90.32 },
    ],
    diaAusentismoObs: [
      { motivo: "Sin dato",      n: 39 }, { motivo: "Enfermedad",  n: 38 },
      { motivo: "Act. IE",       n: 4  }, { motivo: "Calamidad",   n: 3  },
      { motivo: "Deportista",    n: 3  }, { motivo: "Hospitalizado", n: 3 },
      { motivo: "Vacaciones",    n: 1  }, { motivo: "Fuera país",  n: 1  },
    ],
    diaNoAplicadosObs: [
      { obs: "Retirado",              n: 10, pct: "71,4%" },
      { obs: "No pertenece a la IE",  n: 2,  pct: "14,3%" },
      { obs: "Estudiante NEE",        n: 1,  pct: "7,1%"  },
      { obs: "No pertenece al grado", n: 1,  pct: "7,1%"  },
    ],
    diaReprogramadosObs: [
      { obs: "Falla técnica",  n: 18, pct: "90%" },
      { obs: "Cambio de fecha", n: 2, pct: "10%" },
    ],
    diaNoInicio: "Falla técnica",
    diaNoInicioN: 1,
    // Avance acumulado semanal (para gráfico en General)
    avanceSemanal: [
      { dia: "L 18/05", aplicados: 165,  acum: 165,   pct: 0  },
      { dia: "M 19/05", aplicados: 3849, acum: 4014,  pct: 8  },
      { dia: "X 20/05", aplicados: 4025, acum: 8039,  pct: 16 },
      { dia: "J 21/05", aplicados: 3061, acum: 11100, pct: 22 },
      { dia: "V 22/05", aplicados: 2750, acum: 13850, pct: 27 },
    ],
  },

  "26/05": {
    corte: "26 de mayo de 2026",
    semana: "Semana 2",
    evalProgramadas: 51346,
    evalAplicadas:   17173,
    evalAplicadasPct: 33.45,
    evalReprogramadas: 2060,
    evalReprogramadasPct: 4.01,
    evalAusentes: 442,
    evalAusentesPct: 0.86,
    evalNoAplicado: 123,
    evalPorAplicar: 31548,
    evalPorAplicarPct: 61.44,
    estProgramados: 25673,
    estAplicados:   6957,
    estAplicadosPct: 27.10,
    estParcial: 3259,
    estParcialPct: 12.69,
    estAusentes: 200,
    estReprogramados: 1039,
    estReprogramadosPct: 4.05,
    estPorAplicar: 14148,
    estPorAplicarPct: 55.11,
    globalPie: [
      { name: "Aplicado",     value: 17173, pct: "33,45%", color: C.aplicado     },
      { name: "Reprogramado", value: 2060,  pct: "4,01%",  color: C.reprogramado },
      { name: "Ausente",      value: 442,   pct: "0,86%",  color: C.ausente      },
      { name: "No aplicado",  value: 123,   pct: "0,24%",  color: C.noAplicado   },
      { name: "Por aplicar",  value: 31548, pct: "61,44%", color: C.porAplicar   },
    ],
    subniveles: [
      { nivel: "Bachillerato", aplicado: 5058, total: 12480, pct: 40.53 },
      { nivel: "Superior",     aplicado: 4389, total: 13274, pct: 33.06 },
      { nivel: "Media",        aplicado: 4032, total: 12902, pct: 31.25 },
      { nivel: "Elemental",    aplicado: 3694, total: 12690, pct: 29.11 },
    ],
    sostenimiento: [
      { tipo: "Municipal",     pct: 35.84, aplicado: 3378, total: 9424  },
      { tipo: "Fiscomisional", pct: 35.54, aplicado: 3993, total: 11236 },
      { tipo: "Fiscal",        pct: 32.90, aplicado: 5729, total: 17412 },
      { tipo: "Particular",   pct: 30.68, aplicado: 4073, total: 13274 },
    ],
    areaUrbana: { aplicado: 11643, total: 32716, pct: 35.59 },
    areaRural:  { aplicado: 5530,  total: 18630, pct: 29.68 },
    provincias: [
      { provincia: "Carchi",       pct: 52.69, aplicado: 704,  programado: 1336  },
      { provincia: "Chimborazo",   pct: 51.35, aplicado: 914,  programado: 1780  },
      { provincia: "Pastaza",      pct: 46.38, aplicado: 295,  programado: 636   },
      { provincia: "Bolívar",      pct: 39.83, aplicado: 141,  programado: 354   },
      { provincia: "Cañar",        pct: 38.78, aplicado: 470,  programado: 1212  },
      { provincia: "Azuay",        pct: 38.68, aplicado: 1592, programado: 4116  },
      { provincia: "Cotopaxi",     pct: 36.68, aplicado: 771,  programado: 2102  },
      { provincia: "Pichincha",    pct: 36.38, aplicado: 9447, programado: 25964 },
      { provincia: "Zamora Ch.",   pct: 32.07, aplicado: 118,  programado: 368   },
      { provincia: "Imbabura",     pct: 31.50, aplicado: 1011, programado: 3210  },
      { provincia: "Tungurahua",   pct: 28.04, aplicado: 918,  programado: 3274  },
      { provincia: "Sucumbíos",    pct: 22.16, aplicado: 238,  programado: 1074  },
      { provincia: "Morona S.",    pct: 14.54, aplicado: 132,  programado: 908   },
      { provincia: "Loja",         pct: 13.87, aplicado: 375,  programado: 2704  },
      { provincia: "Napo",         pct: 4.08,  aplicado: 47,   programado: 1152  },
      { provincia: "Orellana",     pct: 0,     aplicado: 0,    programado: 1156  },
    ],
    labTotal: 596,
    labAplicados: 137,   labAplicadosPct: 22.99,
    labParcial: 121,     labParcialPct: 20.30,
    labPorAplicar: 324,  labPorAplicarPct: 54.36,
    labBajo95: 20,
    labBajo90: 3,
    labsBajo95: [
      { prov: "Pichincha", n: 11 }, { prov: "Azuay", n: 3 },
      { prov: "Imbabura", n: 2 },   { prov: "Morona Santiago", n: 2 },
      { prov: "Chimborazo", n: 1 }, { prov: "Sucumbíos", n: 1 },
    ],
    diaCobPct: 93.03,
    diaAplicados: 3284,
    diaProgramados: 3530,
    diaAusentes: 105,
    diaNoAplicados: 23,
    diaReprogramados: 118,
    // Estudiantes — acumulado al corte 26/05
    diaEstProgramados: 25673,
    diaEstAplicados: 6957,       diaEstAplicadosPct: 27.10,
    diaEstParcial: 3259,         diaEstParcialPct: 12.69,
    diaEstAusentes: 200,
    diaEstReprogramados: 1039,   diaEstReprogramadosPct: 4.05,
    diaEstPorAplicar: 14148,     diaEstPorAplicarPct: 55.11,
    diaEstPie: [
      { name: "Aplicado",        value: 6957,  pct: "27,10%", color: "#1a56a0" },
      { name: "Parc. aplicado",  value: 3259,  pct: "12,69%", color: "#f0a500" },
      { name: "Reprogramado",    value: 1039,  pct: "4,05%",  color: "#8e44ad" },
      { name: "Ausente",         value: 200,   pct: "0,78%",  color: "#e07b3a" },
      { name: "Por aplicar",     value: 14148, pct: "55,11%", color: "#c8d6e5" },
    ],
    diaLabsTotal: 114,
    diaLabsInicio: 237,   // sesiones
    diaLabsInicioPct: 97.53,
    diaSesiones: [
      { sesion: "S1", total: 1525, aplicado: 1411, pct: 92.52 },
      { sesion: "S2", total: 1619, aplicado: 1497, pct: 92.46 },
      { sesion: "S3", total: 221,  aplicado: 216,  pct: 97.74 },
      { sesion: "S4", total: 165,  aplicado: 160,  pct: 96.97 },
    ],
    diaAusentismoObs: [
      { motivo: "Sin dato",    n: 48 }, { motivo: "Enfermedad",  n: 41 },
      { motivo: "Calamidad",   n: 12 }, { motivo: "Maternidad",  n: 2  },
      { motivo: "Deportista",  n: 1  }, { motivo: "Fuera país",  n: 1  },
    ],
    diaNoAplicadosObs: [
      { obs: "Retirado",              n: 18, pct: "78,3%" },
      { obs: "Sin permiso padres",    n: 4,  pct: "17,4%" },
      { obs: "No pertenece a la IE",  n: 1,  pct: "4,3%"  },
    ],
    diaReprogramadosObs: [
      { obs: "Cambio de fecha",  n: 78, pct: "66,1%" },
      { obs: "Falla eléctrica",  n: 39, pct: "33,1%" },
      { obs: "Falla técnica",    n: 1,  pct: "0,8%"  },
    ],
    diaNoInicio: "Aplicará próximos días",
    diaNoInicioN: 6,
    avanceSemanal: [
      { dia: "L 18/05", aplicados: 165,  acum: 165,   pct: 0  },
      { dia: "M 19/05", aplicados: 3854, acum: 4019,  pct: 8  },
      { dia: "X 20/05", aplicados: 4024, acum: 8043,  pct: 16 },
      { dia: "J 21/05", aplicados: 3033, acum: 11076, pct: 22 },
      { dia: "V 22/05", aplicados: 2766, acum: 13842, pct: 27 },
      { dia: "M 26/05", aplicados: 3334, acum: 17179, pct: 33 },
      { dia: "X 27/05", aplicados: 4435, acum: 21614, pct: 42 },
    ],
  },

  /* ─────────────────────────────────────────────────────
     27/05  — reporte completo con acumulados
  ───────────────────────────────────────────────────── */
  "27/05": {
    corte: "27 de mayo de 2026",
    semana: "Semana 2",
    soloDialy: false,
    // Evaluaciones acumuladas
    evalProgramadas: 51346,
    evalAplicadas:   21614,   evalAplicadasPct: 42.09,
    evalReprogramadas: 1895,  evalReprogramadasPct: 3.69,
    evalAusentes: 525,        evalAusentesPct: 1.02,
    evalNoAplicado: 152,
    evalPorAplicar: 27160,    evalPorAplicarPct: 52.90,
    // Estudiantes acumulados
    estProgramados: 25673,
    estAplicados:   10021,    estAplicadosPct: 39.03,
    estParcial: 1572,         estParcialPct: 6.12,
    estAusentes: 170,
    estReprogramados: 974,    estReprogramadosPct: 3.79,
    estPorAplicar: 12860,     estPorAplicarPct: 50.09,
    globalPie: [
      { name: "Aplicado",     value: 21614, pct: "42,09%", color: "#1a56a0" },
      { name: "Reprogramado", value: 1895,  pct: "3,69%",  color: "#8e44ad" },
      { name: "Ausente",      value: 525,   pct: "1,02%",  color: "#e07b3a" },
      { name: "No aplicado",  value: 152,   pct: "0,30%",  color: "#c0392b" },
      { name: "Por aplicar",  value: 27160, pct: "52,90%", color: "#c8d6e5" },
    ],
    subniveles: [
      { nivel: "Bachillerato", aplicado: 6210, total: 12480, pct: 49.76 },
      { nivel: "Superior",     aplicado: 5355, total: 13274, pct: 40.34 },
      { nivel: "Media",        aplicado: 5062, total: 12902, pct: 39.23 },
      { nivel: "Elemental",    aplicado: 4987, total: 12690, pct: 39.30 },
    ],
    sostenimiento: [
      { tipo: "Fiscomisional", pct: 44.81, aplicado: 5035, total: 11236 },
      { tipo: "Municipal",     pct: 44.17, aplicado: 4163, total: 9424  },
      { tipo: "Fiscal",        pct: 42.47, aplicado: 7395, total: 17412 },
      { tipo: "Particular",    pct: 37.83, aplicado: 5021, total: 13274 },
    ],
    areaUrbana: { aplicado: 14422, total: 32716, pct: 44.08 },
    areaRural:  { aplicado: 7192,  total: 18630, pct: 38.60 },
    provincias: [
      { provincia: "Carchi",       pct: 66.39, aplicado: 887,   programado: 1336  },
      { provincia: "Chimborazo",   pct: 63.54, aplicado: 1131,  programado: 1780  },
      { provincia: "Pastaza",      pct: 51.42, aplicado: 327,   programado: 636   },
      { provincia: "Cañar",        pct: 50.41, aplicado: 611,   programado: 1212  },
      { provincia: "Bolívar",      pct: 49.44, aplicado: 175,   programado: 354   },
      { provincia: "Azuay",        pct: 49.08, aplicado: 2020,  programado: 4116  },
      { provincia: "Zamora Ch.",   pct: 47.55, aplicado: 175,   programado: 368   },
      { provincia: "Pichincha",    pct: 45.00, aplicado: 11685, programado: 25964 },
      { provincia: "Cotopaxi",     pct: 43.34, aplicado: 911,   programado: 2102  },
      { provincia: "Tungurahua",   pct: 36.96, aplicado: 1210,  programado: 3274  },
      { provincia: "Imbabura",     pct: 36.48, aplicado: 1171,  programado: 3210  },
      { provincia: "Loja",         pct: 28.81, aplicado: 779,   programado: 2704  },
      { provincia: "Sucumbíos",    pct: 26.54, aplicado: 285,   programado: 1074  },
      { provincia: "Morona S.",    pct: 16.96, aplicado: 154,   programado: 908   },
      { provincia: "Napo",         pct: 8.07,  aplicado: 93,    programado: 1152  },
      { provincia: "Orellana",     pct: 0,     aplicado: 0,     programado: 1156  },
    ],
    labTotal: 596,
    labAplicados: 186,    labAplicadosPct: 31.21,
    labParcial: 117,      labParcialPct: 19.63,
    labPorAplicar: 278,   labPorAplicarPct: 46.64,
    labBajo95: 29,
    labBajo90: 4,
    labsBajo95: [
      { prov: "Pichincha",        n: 15 }, { prov: "Azuay",          n: 3  },
      { prov: "Imbabura",         n: 2  }, { prov: "Morona Santiago", n: 2  },
      { prov: "Carchi",           n: 1  }, { prov: "Chimborazo",      n: 1  },
      { prov: "Loja",             n: 1  }, { prov: "Pastaza",         n: 1  },
      { prov: "Sucumbíos",        n: 1  }, { prov: "Tungurahua",      n: 1  },
      { prov: "Zamora Chinchipe", n: 1  },
    ],
    avanceSemanal: [
      { dia: "L 18/05", aplicados: 165,  acum: 165,   pct: 0  },
      { dia: "M 19/05", aplicados: 3854, acum: 4019,  pct: 8  },
      { dia: "X 20/05", aplicados: 4025, acum: 8044,  pct: 16 },
      { dia: "J 21/05", aplicados: 3033, acum: 11077, pct: 22 },
      { dia: "V 22/05", aplicados: 2768, acum: 13845, pct: 27 },
      { dia: "M 26/05", aplicados: 3334, acum: 17179, pct: 33 },
      { dia: "X 27/05", aplicados: 4435, acum: 21614, pct: 42 },
    ],
    // Cobertura diaria 27/05
    diaCobPct: 95.46,
    diaAplicados: 4435,
    diaProgramados: 4646,
    diaAusentes: 122,
    diaNoAplicados: 27,
    diaReprogramados: 62,
    diaLabsTotal: 153,
    diaLabsInicio: 324,
    diaLabsInicioPct: 99.39,
    diaSesiones: [
      { sesion: "S1", total: 2082, aplicado: 1985, pct: 95.34 },
      { sesion: "S2", total: 1971, aplicado: 1875, pct: 95.13 },
      { sesion: "S3", total: 349,  aplicado: 341,  pct: 97.71 },
      { sesion: "S4", total: 244,  aplicado: 234,  pct: 95.90 },
    ],
    diaEstProgramados: 25673,
    diaEstAplicados:   10021,  diaEstAplicadosPct: 39.03,
    diaEstParcial: 1572,       diaEstParcialPct: 6.12,
    diaEstAusentes: 170,
    diaEstReprogramados: 974,  diaEstReprogramadosPct: 3.79,
    diaEstPorAplicar: 12860,   diaEstPorAplicarPct: 50.09,
    diaEstPie: [
      { name: "Aplicado",        value: 10021, pct: "39,03%", color: "#1a56a0" },
      { name: "Parc. aplicado",  value: 1572,  pct: "6,12%",  color: "#f0a500" },
      { name: "Reprogramado",    value: 974,   pct: "3,79%",  color: "#8e44ad" },
      { name: "Ausente",         value: 170,   pct: "0,66%",  color: "#e07b3a" },
      { name: "Por aplicar",     value: 12860, pct: "50,09%", color: "#c8d6e5" },
    ],
    diaAusentismoObs: [
      { motivo: "Sin dato",    n: 61 }, { motivo: "Enfermedad",  n: 37 },
      { motivo: "Calamidad",   n: 16 }, { motivo: "Act. IE",     n: 4  },
      { motivo: "Fuera país",  n: 3  }, { motivo: "Hospitalizado", n: 1 },
    ],
    diaNoAplicadosObs: [
      { obs: "Retirado",              n: 21, pct: "77,8%" },
      { obs: "Estudiante NEE",        n: 4,  pct: "14,8%" },
      { obs: "No pertenece a la IE",  n: 1,  pct: "3,7%"  },
      { obs: "Sin permiso padres",    n: 1,  pct: "3,7%"  },
    ],
    diaReprogramadosObs: [
      { obs: "Falla técnica",        n: 46, pct: "74,2%" },
      { obs: "Cambio de fecha",      n: 16, pct: "25,8%" },
    ],
    diaNoInicio: "Falla técnica",
    diaNoInicioN: 2,
    diaNotaSesion: null,
  },

  /* ─────────────────────────────────────────────────────
     28/05  — reporte completo con acumulados
  ───────────────────────────────────────────────────── */
  "28/05": {
    corte: "28 de mayo de 2026",
    semana: "Semana 2",
    soloDialy: false,
    // Evaluaciones acumuladas
    evalProgramadas: 51346,
    evalAplicadas:   25846,   evalAplicadasPct: 50.34,
    evalReprogramadas: 1920,  evalReprogramadasPct: 3.74,
    evalAusentes: 555,        evalAusentesPct: 1.08,
    evalNoAplicado: 211,
    evalPorAplicar: 22814,    evalPorAplicarPct: 44.43,
    // Estudiantes acumulados
    estProgramados: 25673,
    estAplicados:   11400,    estAplicadosPct: 44.40,
    estParcial: 3046,         estParcialPct: 11.86,
    estAusentes: 207,
    estReprogramados: 867,    estReprogramadosPct: 3.38,
    estPorAplicar: 10030,     estPorAplicarPct: 39.07,
    globalPie: [
      { name: "Aplicado",     value: 25846, pct: "50,34%", color: C.aplicado     },
      { name: "Reprogramado", value: 1920,  pct: "3,74%",  color: C.reprogramado },
      { name: "Ausente",      value: 555,   pct: "1,08%",  color: C.ausente      },
      { name: "No aplicado",  value: 211,   pct: "0,41%",  color: C.noAplicado   },
      { name: "Por aplicar",  value: 22814, pct: "44,43%", color: C.porAplicar   },
    ],
    // Subniveles
    subniveles: [
      { nivel: "Bachillerato", aplicado: 7598, total: 12480, pct: 60.88 },
      { nivel: "Superior",     aplicado: 6305, total: 13274, pct: 47.50 },
      { nivel: "Media",        aplicado: 5959, total: 12902, pct: 46.19 },
      { nivel: "Elemental",    aplicado: 5984, total: 12690, pct: 47.16 },
    ],
    // Sostenimiento
    sostenimiento: [
      { tipo: "Fiscal",        pct: 53.63, aplicado: 9338,  total: 17412 },
      { tipo: "Municipal",     pct: 52.67, aplicado: 4964,  total: 9424  },
      { tipo: "Fiscomisional", pct: 51.29, aplicado: 5763,  total: 11236 },
      { tipo: "Particular",    pct: 43.55, aplicado: 5781,  total: 13274 },
    ],
    // Área
    areaUrbana: { aplicado: 16585, total: 32716, pct: 50.69 },
    areaRural:  { aplicado: 9261,  total: 18630, pct: 49.71 },
    // Provincias
    provincias: [
      { provincia: "Chimborazo",   pct: 75.96, aplicado: 1352, programado: 1780  },
      { provincia: "Carchi",       pct: 72.16, aplicado: 964,  programado: 1336  },
      { provincia: "Pastaza",      pct: 59.59, aplicado: 379,  programado: 636   },
      { provincia: "Azuay",        pct: 56.39, aplicado: 2321, programado: 4116  },
      { provincia: "Bolívar",      pct: 54.24, aplicado: 192,  programado: 354   },
      { provincia: "Pichincha",    pct: 54.61, aplicado: 14179,programado: 25964 },
      { provincia: "Zamora Ch.",   pct: 54.62, aplicado: 201,  programado: 368   },
      { provincia: "Cañar",        pct: 52.72, aplicado: 639,  programado: 1212  },
      { provincia: "Cotopaxi",     pct: 48.05, aplicado: 1010, programado: 2102  },
      { provincia: "Tungurahua",   pct: 46.73, aplicado: 1530, programado: 3274  },
      { provincia: "Imbabura",     pct: 40.84, aplicado: 1311, programado: 3210  },
      { provincia: "Loja",         pct: 38.13, aplicado: 1031, programado: 2704  },
      { provincia: "Sucumbíos",    pct: 32.68, aplicado: 351,  programado: 1074  },
      { provincia: "Napo",         pct: 20.14, aplicado: 232,  programado: 1152  },
      { provincia: "Morona S.",    pct: 16.96, aplicado: 154,  programado: 908   },
      { provincia: "Orellana",     pct: 0,     aplicado: 0,    programado: 1156  },
    ],
    // Labs
    labTotal: 596,
    labAplicados: 235,    labAplicadosPct: 39.43,
    labParcial: 103,      labParcialPct: 17.28,
    labPorAplicar: 243,   labPorAplicarPct: 40.77,
    labBajo95: 38,
    labBajo90: 7,
    labsBajo95: [
      { prov: "Pichincha",        n: 20 }, { prov: "Azuay",          n: 3  },
      { prov: "Chimborazo",       n: 2  }, { prov: "Imbabura",        n: 2  },
      { prov: "Loja",             n: 2  }, { prov: "Morona Santiago", n: 2  },
      { prov: "Tungurahua",       n: 2  }, { prov: "Carchi",          n: 1  },
      { prov: "Napo",             n: 1  }, { prov: "Pastaza",         n: 1  },
      { prov: "Sucumbíos",        n: 1  }, { prov: "Zamora Chinchipe",n: 1  },
    ],
    avanceSemanal: [
      { dia: "L 18/05", aplicados: 165,  acum: 165,   pct: 0  },
      { dia: "M 19/05", aplicados: 3862, acum: 4027,  pct: 8  },
      { dia: "X 20/05", aplicados: 4025, acum: 8052,  pct: 16 },
      { dia: "J 21/05", aplicados: 3033, acum: 11085, pct: 22 },
      { dia: "V 22/05", aplicados: 2772, acum: 13857, pct: 27 },
      { dia: "M 26/05", aplicados: 3350, acum: 17207, pct: 34 },
      { dia: "X 27/05", aplicados: 4469, acum: 21676, pct: 42 },
      { dia: "J 28/05", aplicados: 4100, acum: 25776, pct: 50 },
    ],
    // Cobertura diaria 28/05
    diaCobPct: 95.55,
    diaAplicados: 4100,
    diaProgramados: 4291,
    diaAusentes: 89,
    diaNoAplicados: 49,
    diaReprogramados: 53,
    diaLabsTotal: 596,
    diaLabsInicio: 300,
    diaLabsInicioPct: 99.01,
    diaSesiones: [
      { sesion: "S1", total: 1883, aplicado: 1800, pct: 95.59 },
      { sesion: "S2", total: 1826, aplicado: 1752, pct: 95.95 },
      { sesion: "S3", total: 321,  aplicado: 298,  pct: 92.83 },
      { sesion: "S4", total: 261,  aplicado: 250,  pct: 95.79 },
    ],
    diaEstProgramados: 25673,
    diaEstAplicados:   11400,  diaEstAplicadosPct: 44.40,
    diaEstParcial: 3046,       diaEstParcialPct: 11.86,
    diaEstAusentes: 207,
    diaEstReprogramados: 867,  diaEstReprogramadosPct: 3.38,
    diaEstPorAplicar: 10030,   diaEstPorAplicarPct: 39.07,
    diaEstPie: [
      { name: "Aplicado",        value: 11400, pct: "44,40%", color: "#1a56a0" },
      { name: "Parc. aplicado",  value: 3046,  pct: "11,86%", color: "#f0a500" },
      { name: "Reprogramado",    value: 867,   pct: "3,38%",  color: "#8e44ad" },
      { name: "Ausente",         value: 207,   pct: "0,81%",  color: "#e07b3a" },
      { name: "Por aplicar",     value: 10030, pct: "39,07%", color: "#c8d6e5" },
    ],
    diaAusentismoObs: [
      { motivo: "Ausente",       n: 43 },
      { motivo: "Enfermedad",    n: 27 },
      { motivo: "Calamidad",     n: 10 },
      { motivo: "Maternidad",    n: 4  },
      { motivo: "Hospitalizado", n: 3  },
      { motivo: "Act. IE",       n: 1  },
      { motivo: "Deportista",    n: 1  },
    ],
    diaNoAplicadosObs: [
      { obs: "Retirado",              n: 35, pct: "71,4%" },
      { obs: "Estudiante NEE",        n: 7,  pct: "14,3%" },
      { obs: "No pertenece a la IE",  n: 5,  pct: "10,2%" },
      { obs: "Sin permiso padres",    n: 2,  pct: "4,1%"  },
    ],
    diaReprogramadosObs: [
      { obs: "Cambio de fecha",  n: 52, pct: "98,1%" },
      { obs: "Falla técnica",    n: 1,  pct: "1,9%"  },
    ],
    diaNoInicio: "Cambio de fecha de aplicación",
    diaNoInicioN: 3,
    diaNotaSesion: null,
  },

  /* ─────────────────────────────────────────────────────
     29/05  — reporte completo con acumulados
  ───────────────────────────────────────────────────── */
  "29/05": {
    corte: "29 de mayo de 2026",
    semana: "Semana 2",
    soloDialy: false,
    // Evaluaciones acumuladas
    evalProgramadas: 51346,
    evalAplicadas:   28711,   evalAplicadasPct: 55.92,
    evalReprogramadas: 1715,  evalReprogramadasPct: 3.34,
    evalAusentes: 592,        evalAusentesPct: 1.15,
    evalNoAplicado: 239,
    evalPorAplicar: 20089,    evalPorAplicarPct: 39.12,
    // Estudiantes acumulados
    estProgramados: 25673,
    estAplicados:   14191,    estAplicadosPct: 55.28,
    estParcial: 329,          estParcialPct: 1.28,
    estAusentes: 175,
    estReprogramados: 817,    estReprogramadosPct: 3.18,
    estPorAplicar: 10044,     estPorAplicarPct: 39.12,
    globalPie: [
      { name: "Aplicado",     value: 28711, pct: "55,92%", color: C.aplicado     },
      { name: "Reprogramado", value: 1715,  pct: "3,34%",  color: C.reprogramado },
      { name: "Ausente",      value: 592,   pct: "1,15%",  color: C.ausente      },
      { name: "No aplicado",  value: 239,   pct: "0,47%",  color: C.noAplicado   },
      { name: "Por aplicar",  value: 20089, pct: "39,12%", color: C.porAplicar   },
    ],
    // Subniveles
    subniveles: [
      { nivel: "Bachillerato", aplicado: 8755, total: 12480, pct: 70.15 },
      { nivel: "Superior",     aplicado: 7064, total: 13274, pct: 53.22 },
      { nivel: "Media",        aplicado: 6444, total: 12902, pct: 49.95 },
      { nivel: "Elemental",    aplicado: 6448, total: 12690, pct: 50.81 },
    ],
    // Sostenimiento
    sostenimiento: [
      { tipo: "Municipal",     pct: 60.65, aplicado: 5716,  total: 9424  },
      { tipo: "Fiscal",        pct: 60.16, aplicado: 10475, total: 17412 },
      { tipo: "Fiscomisional", pct: 56.23, aplicado: 6318,  total: 11236 },
      { tipo: "Particular",    pct: 46.72, aplicado: 6202,  total: 13274 },
    ],
    // Área
    areaUrbana: { aplicado: 18031, total: 32716, pct: 55.11 },
    areaRural:  { aplicado: 10680, total: 18630, pct: 57.33 },
    // Provincias
    provincias: [
      { provincia: "Chimborazo",   pct: 82.75, aplicado: 1473, programado: 1780  },
      { provincia: "Carchi",       pct: 75.97, aplicado: 1015, programado: 1336  },
      { provincia: "Pastaza",      pct: 67.77, aplicado: 431,  programado: 636   },
      { provincia: "Azuay",        pct: 61.73, aplicado: 2541, programado: 4116  },
      { provincia: "Pichincha",    pct: 61.12, aplicado: 15868,programado: 25964 },
      { provincia: "Bolívar",      pct: 59.04, aplicado: 209,  programado: 354   },
      { provincia: "Zamora Ch.",   pct: 58.70, aplicado: 216,  programado: 368   },
      { provincia: "Cañar",        pct: 55.03, aplicado: 667,  programado: 1212  },
      { provincia: "Cotopaxi",     pct: 52.76, aplicado: 1109, programado: 2102  },
      { provincia: "Tungurahua",   pct: 51.13, aplicado: 1674, programado: 3274  },
      { provincia: "Imbabura",     pct: 43.86, aplicado: 1408, programado: 3210  },
      { provincia: "Loja",         pct: 43.82, aplicado: 1185, programado: 2704  },
      { provincia: "Sucumbíos",    pct: 38.64, aplicado: 415,  programado: 1074  },
      { provincia: "Napo",         pct: 30.03, aplicado: 346,  programado: 1152  },
      { provincia: "Morona S.",    pct: 16.96, aplicado: 154,  programado: 908   },
      { provincia: "Orellana",     pct: 0,     aplicado: 0,    programado: 1156  },
    ],
    // Labs
    labTotal: 596,
    labAplicados: 300,    labAplicadosPct: 50.34,
    labParcial: 38,       labParcialPct: 6.38,
    labPorAplicar: 244,   labPorAplicarPct: 40.94,
    labBajo95: 47,
    labBajo90: 8,
    labsBajo95: [
      { prov: "Pichincha",        n: 28 }, { prov: "Azuay",          n: 4  },
      { prov: "Carchi",           n: 2  }, { prov: "Chimborazo",      n: 2  },
      { prov: "Morona Santiago",  n: 2  }, { prov: "Tungurahua",      n: 2  },
      { prov: "Zamora Chinchipe", n: 2  }, { prov: "Imbabura",        n: 1  },
      { prov: "Loja",             n: 1  }, { prov: "Napo",            n: 1  },
      { prov: "Pastaza",          n: 1  }, { prov: "Sucumbíos",       n: 1  },
    ],
    avanceSemanal: [
      { dia: "L 25/05", aplicados: 0,    acum: 0,     pct: 0  },
      { dia: "M 26/05", aplicados: 3353, acum: 3353,  pct: 7  },
      { dia: "X 27/05", aplicados: 4504, acum: 7857,  pct: 15 },
      { dia: "J 28/05", aplicados: 4184, acum: 12041, pct: 23 },
      { dia: "V 29/05", aplicados: 2801, acum: 14842, pct: 29 },
    ],
    // Cobertura diaria 29/05
    diaCobPct: 96.02,
    diaAplicados: 2801,
    diaProgramados: 2917,
    diaAusentes: 79,
    diaNoAplicados: 35,
    diaReprogramados: 2,
    diaLabsTotal: 596,
    diaLabsInicio: 199,
    diaLabsInicioPct: 100.00,
    diaSesiones: [
      { sesion: "S1", total: 1275, aplicado: 1232, pct: 96.63 },
      { sesion: "S2", total: 1279, aplicado: 1232, pct: 96.33 },
      { sesion: "S3", total: 191,  aplicado: 174,  pct: 91.10 },
      { sesion: "S4", total: 172,  aplicado: 163,  pct: 94.77 },
    ],
    diaEstProgramados: 25673,
    diaEstAplicados:   14191,  diaEstAplicadosPct: 55.28,
    diaEstParcial: 329,        diaEstParcialPct: 1.28,
    diaEstAusentes: 175,
    diaEstReprogramados: 817,  diaEstReprogramadosPct: 3.18,
    diaEstPorAplicar: 10044,   diaEstPorAplicarPct: 39.12,
    diaEstPie: [
      { name: "Aplicado",        value: 14191, pct: "55,28%", color: "#1a56a0" },
      { name: "Parc. aplicado",  value: 329,   pct: "1,28%",  color: "#f0a500" },
      { name: "Reprogramado",    value: 817,   pct: "3,18%",  color: "#8e44ad" },
      { name: "Ausente",         value: 175,   pct: "0,68%",  color: "#e07b3a" },
      { name: "Por aplicar",     value: 10044, pct: "39,12%", color: "#c8d6e5" },
    ],
    diaAusentismoObs: [
      { motivo: "Ausente",        n: 45 },
      { motivo: "Calamidad",      n: 13 },
      { motivo: "Enfermedad",     n: 10 },
      { motivo: "Maternidad",     n: 6  },
      { motivo: "Deportista",     n: 2  },
      { motivo: "Hospitalizado",  n: 2  },
      { motivo: "Fuera del país", n: 1  },
    ],
    diaNoAplicadosObs: [
      { obs: "Retirado",              n: 22, pct: "62,9%" },
      { obs: "No pertenece a la IE",  n: 6,  pct: "17,1%" },
      { obs: "Estudiante NEE",        n: 4,  pct: "11,4%" },
      { obs: "Sin permiso padres",    n: 3,  pct: "8,6%"  },
    ],
    diaReprogramadosObs: [
      { obs: "Cambio de fecha", n: 2, pct: "100%" },
    ],
    diaNoInicio: null,
    diaNoInicioN: 0,
    diaNotaSesion: null,
  },

  /* ─────────────────────────────────────────────────────
     01/06  — reporte completo con acumulados
  ───────────────────────────────────────────────────── */
  "01/06": {
    corte: "1 de junio de 2026",
    semana: "Semana 3",
    soloDialy: false,
    // Evaluaciones acumuladas
    evalProgramadas: 51346,
    evalAplicadas:   29870,   evalAplicadasPct: 58.17,
    evalReprogramadas: 1591,  evalReprogramadasPct: 3.10,
    evalAusentes: 609,        evalAusentesPct: 1.19,
    evalNoAplicado: 246,
    evalPorAplicar: 19030,    evalPorAplicarPct: 37.06,
    // Estudiantes acumulados
    estProgramados: 25673,
    estAplicados:   14269,    estAplicadosPct: 55.58,
    estParcial: 1332,         estParcialPct: 5.19,
    estAusentes: 219,
    estReprogramados: 756,    estReprogramadosPct: 2.94,
    estPorAplicar: 8973,      estPorAplicarPct: 34.95,
    globalPie: [
      { name: "Aplicado",     value: 29870, pct: "58,17%", color: C.aplicado     },
      { name: "Reprogramado", value: 1591,  pct: "3,10%",  color: C.reprogramado },
      { name: "Ausente",      value: 609,   pct: "1,19%",  color: C.ausente      },
      { name: "No aplicado",  value: 246,   pct: "0,48%",  color: C.noAplicado   },
      { name: "Por aplicar",  value: 19030, pct: "37,06%", color: C.porAplicar   },
    ],
    // Subniveles
    subniveles: [
      { nivel: "Bachillerato", aplicado: 9120, total: 12480, pct: 73.08 },
      { nivel: "Superior",     aplicado: 7649, total: 13274, pct: 57.62 },
      { nivel: "Media",        aplicado: 6566, total: 12902, pct: 50.89 },
      { nivel: "Elemental",    aplicado: 6535, total: 12690, pct: 51.50 },
    ],
    // Sostenimiento
    sostenimiento: [
      { tipo: "Municipal",     pct: 63.52, aplicado: 5986,  total: 9424  },
      { tipo: "Fiscal",        pct: 61.77, aplicado: 10755, total: 17412 },
      { tipo: "Fiscomisional", pct: 59.13, aplicado: 6644,  total: 11236 },
      { tipo: "Particular",    pct: 48.85, aplicado: 6485,  total: 13274 },
    ],
    // Área
    areaUrbana: { aplicado: 18842, total: 32716, pct: 57.59 },
    areaRural:  { aplicado: 11028, total: 18630, pct: 59.19 },
    // Provincias
    provincias: [
      { provincia: "Chimborazo",   pct: 83.65, aplicado: 1489, programado: 1780  },
      { provincia: "Carchi",       pct: 81.06, aplicado: 1083, programado: 1336  },
      { provincia: "Pastaza",      pct: 70.44, aplicado: 448,  programado: 636   },
      { provincia: "Azuay",        pct: 64.67, aplicado: 2662, programado: 4116  },
      { provincia: "Zamora Ch.",   pct: 64.13, aplicado: 236,  programado: 368   },
      { provincia: "Bolívar",      pct: 64.12, aplicado: 227,  programado: 354   },
      { provincia: "Pichincha",    pct: 62.87, aplicado: 16323,programado: 25964 },
      { provincia: "Cañar",        pct: 56.44, aplicado: 684,  programado: 1212  },
      { provincia: "Cotopaxi",     pct: 55.80, aplicado: 1173, programado: 2102  },
      { provincia: "Tungurahua",   pct: 52.05, aplicado: 1704, programado: 3274  },
      { provincia: "Imbabura",     pct: 49.16, aplicado: 1578, programado: 3210  },
      { provincia: "Loja",         pct: 48.52, aplicado: 1312, programado: 2704  },
      { provincia: "Sucumbíos",    pct: 38.83, aplicado: 417,  programado: 1074  },
      { provincia: "Napo",         pct: 32.99, aplicado: 380,  programado: 1152  },
      { provincia: "Morona S.",    pct: 16.96, aplicado: 154,  programado: 908   },
      { provincia: "Orellana",     pct: 0,     aplicado: 0,    programado: 1156  },
    ],
    // Labs
    labTotal: 596,
    labAplicados: 301,    labAplicadosPct: 50.50,
    labParcial: 62,       labParcialPct: 10.40,
    labPorAplicar: 220,   labPorAplicarPct: 36.91,
    labBajo95: 43,
    labBajo90: 8,
    labsBajo95: [
      { prov: "Pichincha",        n: 26 }, { prov: "Azuay",          n: 3  },
      { prov: "Carchi",           n: 2  }, { prov: "Chimborazo",      n: 2  },
      { prov: "Morona Santiago",  n: 2  }, { prov: "Tungurahua",      n: 2  },
      { prov: "Imbabura",         n: 1  }, { prov: "Loja",            n: 1  },
      { prov: "Napo",             n: 1  }, { prov: "Pastaza",         n: 1  },
      { prov: "Sucumbíos",        n: 1  }, { prov: "Zamora Chinchipe",n: 1  },
    ],
    avanceSemanal: [
      { dia: "L 18/05", aplicados: 165,  acum: 165,   pct: 0  },
      { dia: "M 19/05", aplicados: 3868, acum: 4033,  pct: 8  },
      { dia: "X 20/05", aplicados: 4028, acum: 8061,  pct: 16 },
      { dia: "J 21/05", aplicados: 3033, acum: 11094, pct: 22 },
      { dia: "V 22/05", aplicados: 2778, acum: 13872, pct: 27 },
      { dia: "M 26/05", aplicados: 3393, acum: 17265, pct: 34 },
      { dia: "X 27/05", aplicados: 4509, acum: 21774, pct: 42 },
      { dia: "J 28/05", aplicados: 4186, acum: 25960, pct: 51 },
      { dia: "V 29/05", aplicados: 2819, acum: 28779, pct: 56 },
      { dia: "L 01/06", aplicados: 1091, acum: 29870, pct: 58 },
    ],
    // Cobertura diaria 01/06
    diaCobPct: 94.70,
    diaAplicados: 1091,
    diaProgramados: 1152,
    diaAusentes: 49,
    diaNoAplicados: 7,
    diaReprogramados: 5,
    diaLabsTotal: 596,
    diaLabsInicio: 79,
    diaLabsInicioPct: 97.53,
    diaSesiones: [
      { sesion: "S1", total: 473, aplicado: 455, pct: 96.19 },
      { sesion: "S2", total: 470, aplicado: 438, pct: 93.19 },
      { sesion: "S3", total: 110, aplicado: 104, pct: 94.55 },
      { sesion: "S4", total: 99,  aplicado: 94,  pct: 94.95 },
    ],
    diaEstProgramados: 25673,
    diaEstAplicados:   14269,  diaEstAplicadosPct: 55.58,
    diaEstParcial: 1332,       diaEstParcialPct: 5.19,
    diaEstAusentes: 219,
    diaEstReprogramados: 756,  diaEstReprogramadosPct: 2.94,
    diaEstPorAplicar: 8973,    diaEstPorAplicarPct: 34.95,
    diaEstPie: [
      { name: "Aplicado",        value: 14269, pct: "55,58%", color: "#1a56a0" },
      { name: "Parc. aplicado",  value: 1332,  pct: "5,19%",  color: "#f0a500" },
      { name: "Reprogramado",    value: 756,   pct: "2,94%",  color: "#8e44ad" },
      { name: "Ausente",         value: 219,   pct: "0,85%",  color: "#e07b3a" },
      { name: "Por aplicar",     value: 8973,  pct: "34,95%", color: "#c8d6e5" },
    ],
    diaAusentismoObs: [
      { motivo: "Práct. preprofes.", n: 17 },
      { motivo: "Ausente",           n: 11 },
      { motivo: "Enfermedad",        n: 11 },
      { motivo: "Calamidad",         n: 6  },
      { motivo: "Fuera del país",    n: 2  },
      { motivo: "Hospitalizado",     n: 2  },
    ],
    diaNoAplicadosObs: [
      { obs: "Retirado",           n: 6, pct: "85,7%" },
      { obs: "Sin permiso padres", n: 1, pct: "14,3%" },
    ],
    diaReprogramadosObs: [
      { obs: "Aplicará próximos días", n: 5, pct: "100%" },
    ],
    diaNoInicio: "Sin sustentantes",
    diaNoInicioN: 2,
    diaNotaSesion: null,
  },

  /* ─────────────────────────────────────────────────────
     02/06  — reporte completo con acumulados
  ───────────────────────────────────────────────────── */
  "02/06": {
    corte: "2 de junio de 2026",
    semana: "Semana 3",
    soloDialy: false,
    // Evaluaciones acumuladas
    evalProgramadas: 51346,
    evalAplicadas:   33757,   evalAplicadasPct: 65.74,
    evalReprogramadas: 1687,  evalReprogramadasPct: 3.29,
    evalAusentes: 673,        evalAusentesPct: 1.31,
    evalNoAplicado: 268,
    evalEnAuditoria: 12,
    evalPorAplicar: 14949,    evalPorAplicarPct: 29.11,
    // Estudiantes acumulados
    estProgramados: 25673,
    estAplicados:   15327,    estAplicadosPct: 59.70,
    estParcial: 3091,         estParcialPct: 12.04,
    estAusentes: 263,
    estReprogramados: 908,    estReprogramadosPct: 3.54,
    estEnAuditoria: 12,
    estPorAplicar: 5933,      estPorAplicarPct: 23.11,
    globalPie: [
      { name: "Aplicado",     value: 33757, pct: "65,74%", color: C.aplicado     },
      { name: "Reprogramado", value: 1687,  pct: "3,29%",  color: C.reprogramado },
      { name: "Ausente",      value: 673,   pct: "1,31%",  color: C.ausente      },
      { name: "No aplicado",  value: 268,   pct: "0,52%",  color: C.noAplicado   },
      { name: "En auditoría", value: 12,    pct: "0,02%",  color: C.enAuditoria  },
      { name: "Por aplicar",  value: 14949, pct: "29,11%", color: C.porAplicar   },
    ],
    // Subniveles
    subniveles: [
      { nivel: "Bachillerato", aplicado: 9914, total: 12480, pct: 79.44 },
      { nivel: "Superior",     aplicado: 8951, total: 13274, pct: 67.43 },
      { nivel: "Media",        aplicado: 7420, total: 12902, pct: 57.51 },
      { nivel: "Elemental",    aplicado: 7472, total: 12690, pct: 58.88 },
    ],
    // Sostenimiento
    sostenimiento: [
      { tipo: "Municipal",     pct: 71.29, aplicado: 6718,  total: 9424  },
      { tipo: "Fiscal",        pct: 68.28, aplicado: 11889, total: 17412 },
      { tipo: "Fiscomisional", pct: 67.53, aplicado: 7588,  total: 11236 },
      { tipo: "Particular",    pct: 56.97, aplicado: 7562,  total: 13274 },
    ],
    // Área
    areaUrbana: { aplicado: 21495, total: 32716, pct: 65.70 },
    areaRural:  { aplicado: 12262, total: 18630, pct: 65.82 },
    // Provincias
    provincias: [
      { provincia: "Carchi",       pct: 87.57, aplicado: 1170, programado: 1336  },
      { provincia: "Chimborazo",   pct: 85.73, aplicado: 1526, programado: 1780  },
      { provincia: "Pastaza",      pct: 75.79, aplicado: 482,  programado: 636   },
      { provincia: "Zamora Ch.",   pct: 73.91, aplicado: 272,  programado: 368   },
      { provincia: "Azuay",        pct: 71.91, aplicado: 2960, programado: 4116  },
      { provincia: "Pichincha",    pct: 69.93, aplicado: 18156,programado: 25964 },
      { provincia: "Cañar",        pct: 69.31, aplicado: 840,  programado: 1212  },
      { provincia: "Bolívar",      pct: 69.21, aplicado: 245,  programado: 354   },
      { provincia: "Cotopaxi",     pct: 62.08, aplicado: 1305, programado: 2102  },
      { provincia: "Loja",         pct: 59.65, aplicado: 1613, programado: 2704  },
      { provincia: "Tungurahua",   pct: 59.62, aplicado: 1952, programado: 3274  },
      { provincia: "Imbabura",     pct: 58.26, aplicado: 1870, programado: 3210  },
      { provincia: "Napo",         pct: 47.83, aplicado: 551,  programado: 1152  },
      { provincia: "Sucumbíos",    pct: 47.21, aplicado: 507,  programado: 1074  },
      { provincia: "Morona S.",    pct: 23.35, aplicado: 212,  programado: 908   },
      { provincia: "Orellana",     pct: 8.30,  aplicado: 96,   programado: 1156  },
    ],
    // Labs
    labTotal: 596,
    labAplicados: 325,    labAplicadosPct: 54.53,
    labParcial: 133,      labParcialPct: 22.32,
    labPorAplicar: 127,   labPorAplicarPct: 21.31,
    labBajo95: 47,
    labBajo90: 8,
    labsBajo95: [
      { prov: "Pichincha",        n: 28 }, { prov: "Azuay",          n: 3  },
      { prov: "Carchi",           n: 3  }, { prov: "Chimborazo",      n: 3  },
      { prov: "Morona Santiago",  n: 2  }, { prov: "Tungurahua",      n: 2  },
      { prov: "Imbabura",         n: 1  }, { prov: "Loja",            n: 1  },
      { prov: "Napo",             n: 1  }, { prov: "Pastaza",         n: 1  },
      { prov: "Sucumbíos",        n: 1  }, { prov: "Zamora Chinchipe",n: 1  },
    ],
    avanceSemanal: [
      { dia: "L 18/05", aplicados: 165,  acum: 165,   pct: 0  },
      { dia: "M 19/05", aplicados: 3868, acum: 4033,  pct: 8  },
      { dia: "X 20/05", aplicados: 4028, acum: 8061,  pct: 16 },
      { dia: "J 21/05", aplicados: 3033, acum: 11094, pct: 22 },
      { dia: "V 22/05", aplicados: 2778, acum: 13872, pct: 27 },
      { dia: "M 26/05", aplicados: 3400, acum: 17272, pct: 34 },
      { dia: "X 27/05", aplicados: 4510, acum: 21782, pct: 42 },
      { dia: "J 28/05", aplicados: 4186, acum: 25968, pct: 51 },
      { dia: "V 29/05", aplicados: 2825, acum: 28793, pct: 56 },
      { dia: "L 01/06", aplicados: 1108, acum: 29901, pct: 58 },
      { dia: "M 02/06", aplicados: 3855, acum: 33756, pct: 66 },
      { dia: "X 03/06", aplicados: 1,    acum: 33757, pct: 66 }, // parcial al corte
    ],
    // Cobertura diaria 02/06
    diaCobPct: 92.89,
    diaAplicados: 3855,
    diaProgramados: 4150,
    diaAusentes: 110,
    diaNoAplicados: 22,
    diaReprogramados: 151,
    diaLabsTotal: 596,
    diaLabsInicio: 297,
    diaLabsInicioPct: 96.74,
    diaSesiones: [
      { sesion: "S1", total: 1913, aplicado: 1820, pct: 95.14 },
      { sesion: "S2", total: 1789, aplicado: 1620, pct: 90.55 },
      { sesion: "S3", total: 254,  aplicado: 232,  pct: 91.34 },
      { sesion: "S4", total: 194,  aplicado: 183,  pct: 94.33 },
    ],
    diaEstProgramados: 25673,
    diaEstAplicados:   15327,  diaEstAplicadosPct: 59.70,
    diaEstParcial: 3091,       diaEstParcialPct: 12.04,
    diaEstAusentes: 263,
    diaEstReprogramados: 908,  diaEstReprogramadosPct: 3.54,
    diaEstPorAplicar: 5933,    diaEstPorAplicarPct: 23.11,
    diaEstPie: [
      { name: "Aplicado",        value: 15327, pct: "59,70%", color: "#1a56a0" },
      { name: "Parc. aplicado",  value: 3091,  pct: "12,04%", color: "#f0a500" },
      { name: "Reprogramado",    value: 908,   pct: "3,54%",  color: "#8e44ad" },
      { name: "Ausente",         value: 263,   pct: "1,02%",  color: "#e07b3a" },
      { name: "Por aplicar",     value: 5933,  pct: "23,11%", color: "#c8d6e5" },
    ],
    diaAusentismoObs: [
      { motivo: "Ausente",        n: 59 },
      { motivo: "Enfermedad",     n: 29 },
      { motivo: "Calamidad",      n: 10 },
      { motivo: "Hospitalizado",  n: 5  },
      { motivo: "Fuera del país", n: 4  },
      { motivo: "Maternidad",     n: 2  },
      { motivo: "Deportista",     n: 1  },
    ],
    diaNoAplicadosObs: [
      { obs: "Retirado",              n: 15, pct: "68,2%" },
      { obs: "Estudiante NEE",        n: 4,  pct: "18,2%" },
      { obs: "No pertenece a la IE",  n: 2,  pct: "9,1%"  },
      { obs: "Sin permiso padres",    n: 1,  pct: "4,5%"  },
    ],
    diaReprogramadosObs: [
      { obs: "Falla eléctrica",       n: 114, pct: "75,5%" },
      { obs: "Práct. preprofes.",     n: 17,  pct: "11,3%" },
      { obs: "Paro",                  n: 12,  pct: "7,9%"  },
      { obs: "Cambio de fecha",       n: 7,   pct: "4,6%"  },
      { obs: "Falla técnica",         n: 1,   pct: "0,7%"  },
    ],
    diaNoInicio: "Falla eléctrica / Cambio de fecha / Sin sustentantes",
    diaNoInicioN: 10,
    diaNotaSesion: "151 reprogramados principalmente por falla eléctrica (75,5%) y paro (7,9%)",
  },

  "03/06": {
    corte: "3 de junio de 2026",
    semana: "Semana 3",
    soloDialy: false,
    // Evaluaciones acumuladas
    evalProgramadas: 51346,
    evalAplicadas:   37637,   evalAplicadasPct: 73.30,
    evalReprogramadas: 1420,  evalReprogramadasPct: 2.77,
    evalAusentes: 713,        evalAusentesPct: 1.39,
    evalNoAplicado: 285,
    evalEnAuditoria: 0,
    evalPorAplicar: 11291,    evalPorAplicarPct: 21.99,
    // Estudiantes acumulados
    estProgramados: 25673,
    estAplicados:   18235,    estAplicadosPct: 71.03,
    estParcial: 1167,         estParcialPct: 4.55,
    estAusentes: 228,
    estReprogramados: 666,    estReprogramadosPct: 2.59,
    estEnAuditoria: 0,
    estPorAplicar: 5238,      estPorAplicarPct: 20.40,
    globalPie: [
      { name: "Aplicado",     value: 37637, pct: "73,30%", color: C.aplicado     },
      { name: "Reprogramado", value: 1420,  pct: "2,77%",  color: C.reprogramado },
      { name: "Ausente",      value: 713,   pct: "1,39%",  color: C.ausente      },
      { name: "No aplicado",  value: 285,   pct: "0,56%",  color: C.noAplicado   },
      { name: "Por aplicar",  value: 11291, pct: "21,99%", color: C.porAplicar   },
    ],
    // Subniveles
    subniveles: [
      { nivel: "Bachillerato", aplicado: 10520, total: 12480, pct: 84.29 },
      { nivel: "Superior",     aplicado: 9851,  total: 13274, pct: 74.21 },
      { nivel: "Elemental",    aplicado: 8733,  total: 12690, pct: 68.82 },
      { nivel: "Media",        aplicado: 8533,  total: 12902, pct: 66.14 },
    ],
    // Sostenimiento
    sostenimiento: [
      { tipo: "Municipal",     pct: 78.95, aplicado: 7440,  total: 9424  },
      { tipo: "Fiscomisional", pct: 75.74, aplicado: 8510,  total: 11236 },
      { tipo: "Fiscal",        pct: 74.61, aplicado: 12991, total: 17412 },
      { tipo: "Particular",    pct: 65.51, aplicado: 8696,  total: 13274 },
    ],
    // Área
    areaUrbana: { aplicado: 24193, total: 32716, pct: 73.95 },
    areaRural:  { aplicado: 13444, total: 18630, pct: 72.16 },
    // Provincias
    provincias: [
      { provincia: "Carchi",       pct: 90.72, aplicado: 1212, programado: 1336  },
      { provincia: "Zamora Ch.",   pct: 88.59, aplicado: 326,  programado: 368   },
      { provincia: "Chimborazo",   pct: 86.91, aplicado: 1547, programado: 1780  },
      { provincia: "Cañar",        pct: 83.66, aplicado: 1014, programado: 1212  },
      { provincia: "Pastaza",      pct: 78.30, aplicado: 498,  programado: 636   },
      { provincia: "Azuay",        pct: 78.21, aplicado: 3219, programado: 4116  },
      { provincia: "Pichincha",    pct: 77.11, aplicado: 20020,programado: 25964 },
      { provincia: "Bolívar",      pct: 71.75, aplicado: 254,  programado: 354   },
      { provincia: "Imbabura",     pct: 71.03, aplicado: 2280, programado: 3210  },
      { provincia: "Loja",         pct: 69.56, aplicado: 1881, programado: 2704  },
      { provincia: "Tungurahua",   pct: 66.28, aplicado: 2170, programado: 3274  },
      { provincia: "Cotopaxi",     pct: 65.84, aplicado: 1384, programado: 2102  },
      { provincia: "Napo",         pct: 60.24, aplicado: 694,  programado: 1152  },
      { provincia: "Sucumbíos",    pct: 56.42, aplicado: 606,  programado: 1074  },
      { provincia: "Morona S.",    pct: 29.74, aplicado: 270,  programado: 908   },
      { provincia: "Orellana",     pct: 22.66, aplicado: 262,  programado: 1156  },
    ],
    // Labs
    labTotal: 596,
    labAplicados: 394,    labAplicadosPct: 66.11,
    labParcial: 82,       labParcialPct: 13.76,
    labPorAplicar: 109,   labPorAplicarPct: 18.29,
    labBajo95: 55,
    labBajo90: 10,
    labsBajo95: [
      { prov: "Pichincha",        n: 30 }, { prov: "Azuay",           n: 5  },
      { prov: "Carchi",           n: 3  }, { prov: "Chimborazo",       n: 3  },
      { prov: "Loja",             n: 2  }, { prov: "Morona Santiago",  n: 2  },
      { prov: "Sucumbíos",        n: 2  }, { prov: "Tungurahua",       n: 2  },
      { prov: "Zamora Chinchipe", n: 2  }, { prov: "Imbabura",         n: 1  },
      { prov: "Napo",             n: 1  }, { prov: "Orellana",         n: 1  },
      { prov: "Pastaza",          n: 1  },
    ],
    avanceSemanal: [
      { dia: "L 18/05", aplicados: 165,  acum: 165,   pct: 0  },
      { dia: "M 19/05", aplicados: 3868, acum: 4033,  pct: 8  },
      { dia: "X 20/05", aplicados: 4028, acum: 8061,  pct: 16 },
      { dia: "J 21/05", aplicados: 3033, acum: 11094, pct: 22 },
      { dia: "V 22/05", aplicados: 2778, acum: 13872, pct: 27 },
      { dia: "M 26/05", aplicados: 3400, acum: 17272, pct: 34 },
      { dia: "X 27/05", aplicados: 4517, acum: 21789, pct: 42 },
      { dia: "J 28/05", aplicados: 4187, acum: 25976, pct: 51 },
      { dia: "V 29/05", aplicados: 2826, acum: 28802, pct: 56 },
      { dia: "L 01/06", aplicados: 1109, acum: 29911, pct: 58 },
      { dia: "M 02/06", aplicados: 3997, acum: 33908, pct: 66 },
      { dia: "X 03/06", aplicados: 3713, acum: 37621, pct: 73 },
      { dia: "J 04/06", aplicados: 15,   acum: 37636, pct: 73 }, // parcial al corte
      { dia: "L 08/06", aplicados: 1,    acum: 37637, pct: 73 }, // parcial al corte
    ],
    // Cobertura diaria 03/06
    diaCobPct: 95.70,
    diaAplicados: 3713,
    diaProgramados: 3880,
    diaAusentes: 91,
    diaNoAplicados: 18,
    diaReprogramados: 58,
    diaLabsTotal: 292,
    diaLabsInicio: 287,
    diaLabsInicioPct: 98.29,
    diaSesiones: [
      { sesion: "S1", total: 1839, aplicado: 1774, pct: 96.47 },
      { sesion: "S2", total: 1720, aplicado: 1639, pct: 95.29 },
      { sesion: "S3", total: 184,  aplicado: 168,  pct: 91.30 },
      { sesion: "S4", total: 137,  aplicado: 132,  pct: 96.35 },
    ],
    diaEstProgramados: 25673,
    diaEstAplicados:   18235,  diaEstAplicadosPct: 71.03,
    diaEstParcial: 1167,       diaEstParcialPct: 4.55,
    diaEstAusentes: 228,
    diaEstReprogramados: 666,  diaEstReprogramadosPct: 2.59,
    diaEstPorAplicar: 5238,    diaEstPorAplicarPct: 20.40,
    diaEstPie: [
      { name: "Aplicado",        value: 18235, pct: "71,03%", color: "#1a56a0" },
      { name: "Parc. aplicado",  value: 1167,  pct: "4,55%",  color: "#f0a500" },
      { name: "Reprogramado",    value: 666,   pct: "2,59%",  color: "#8e44ad" },
      { name: "Ausente",         value: 228,   pct: "0,89%",  color: "#e07b3a" },
      { name: "Por aplicar",     value: 5238,  pct: "20,40%", color: "#c8d6e5" },
    ],
    diaAusentismoObs: [
      { motivo: "Ausente",        n: 49 },
      { motivo: "Enfermedad",     n: 25 },
      { motivo: "Calamidad",      n: 6  },
      { motivo: "Hospitalizado",  n: 5  },
      { motivo: "Fuera del país", n: 3  },
      { motivo: "Maternidad",     n: 2  },
      { motivo: "Act. IE",        n: 1  },
    ],
    diaNoAplicadosObs: [
      { obs: "Retirado",              n: 11, pct: "61,1%" },
      { obs: "Estudiante NEE",        n: 5,  pct: "27,8%" },
      { obs: "No pertenece a la IE",  n: 2,  pct: "11,1%" },
    ],
    diaReprogramadosObs: [
      { obs: "Aplicará en los próximos días", n: 58, pct: "100%" },
    ],
    diaNoInicio: "Aplicará próximos días (4) / Sin técnico aplicador (1)",
    diaNoInicioN: 5,
    diaNotaSesion: "58 reprogramados (aplicarán en los próximos días); 5 sesiones sin iniciar de 292 (98,29% ejecutadas)",
  },

  "04/06": {
    corte: "4 de junio de 2026",
    semana: "Semana 3",
    soloDialy: false,
    // Evaluaciones acumuladas
    evalProgramadas: 51346,
    evalAplicadas:   40315,   evalAplicadasPct: 78.52,
    evalReprogramadas: 1001,  evalReprogramadasPct: 1.95,
    evalAusentes: 741,        evalAusentesPct: 1.44,
    evalNoAplicado: 301,
    evalEnAuditoria: 0,
    evalPorAplicar: 8988,     evalPorAplicarPct: 17.50,
    // Estudiantes acumulados
    estProgramados: 25673,
    estAplicados:   19099,    estAplicadosPct: 74.39,
    estParcial: 2117,         estParcialPct: 8.25,
    estAusentes: 269,
    estReprogramados: 392,    estReprogramadosPct: 1.53,
    estEnAuditoria: 0,
    estPorAplicar: 3644,      estPorAplicarPct: 14.19,
    globalPie: [
      { name: "Aplicado",     value: 40315, pct: "78,52%", color: C.aplicado     },
      { name: "Reprogramado", value: 1001,  pct: "1,95%",  color: C.reprogramado },
      { name: "Ausente",      value: 741,   pct: "1,44%",  color: C.ausente      },
      { name: "No aplicado",  value: 301,   pct: "0,59%",  color: C.noAplicado   },
      { name: "Por aplicar",  value: 8988,  pct: "17,50%", color: C.porAplicar   },
    ],
    // Subniveles
    subniveles: [
      { nivel: "Bachillerato", aplicado: 10977, total: 12480, pct: 87.96 },
      { nivel: "Superior",     aplicado: 10376, total: 13274, pct: 78.17 },
      { nivel: "Elemental",    aplicado: 9587,  total: 12690, pct: 75.55 },
      { nivel: "Media",        aplicado: 9375,  total: 12902, pct: 72.66 },
    ],
    // Sostenimiento
    sostenimiento: [
      { tipo: "Municipal",     pct: 85.42, aplicado: 8050,  total: 9424  },
      { tipo: "Fiscomisional", pct: 80.79, aplicado: 9078,  total: 11236 },
      { tipo: "Fiscal",        pct: 78.51, aplicado: 13670, total: 17412 },
      { tipo: "Particular",    pct: 71.70, aplicado: 9517,  total: 13274 },
    ],
    // Área
    areaUrbana: { aplicado: 26147, total: 32716, pct: 79.92 },
    areaRural:  { aplicado: 14168, total: 18630, pct: 76.05 },
    // Provincias
    provincias: [
      { provincia: "Zamora Ch.",   pct: 96.47, aplicado: 355,  programado: 368   },
      { provincia: "Carchi",       pct: 92.59, aplicado: 1237, programado: 1336  },
      { provincia: "Cañar",        pct: 91.91, aplicado: 1114, programado: 1212  },
      { provincia: "Chimborazo",   pct: 86.91, aplicado: 1547, programado: 1780  },
      { provincia: "Azuay",        pct: 82.17, aplicado: 3382, programado: 4116  },
      { provincia: "Pichincha",    pct: 81.63, aplicado: 21195,programado: 25964 },
      { provincia: "Pastaza",      pct: 81.13, aplicado: 516,  programado: 636   },
      { provincia: "Imbabura",     pct: 79.10, aplicado: 2539, programado: 3210  },
      { provincia: "Loja",         pct: 77.29, aplicado: 2090, programado: 2704  },
      { provincia: "Bolívar",      pct: 74.29, aplicado: 263,  programado: 354   },
      { provincia: "Cotopaxi",     pct: 72.03, aplicado: 1514, programado: 2102  },
      { provincia: "Tungurahua",   pct: 71.66, aplicado: 2346, programado: 3274  },
      { provincia: "Napo",         pct: 66.93, aplicado: 771,  programado: 1152  },
      { provincia: "Sucumbíos",    pct: 66.76, aplicado: 717,  programado: 1074  },
      { provincia: "Morona S.",    pct: 35.90, aplicado: 326,  programado: 908   },
      { provincia: "Orellana",     pct: 34.86, aplicado: 403,  programado: 1156  },
    ],
    // Labs
    labTotal: 596,
    labAplicados: 419,    labAplicadosPct: 70.30,
    labParcial: 78,       labParcialPct: 13.09,
    labPorAplicar: 92,    labPorAplicarPct: 15.44,
    labBajo95: 59,
    labBajo90: 9,
    labsBajo95: [
      { prov: "Pichincha",        n: 32 }, { prov: "Azuay",           n: 6  },
      { prov: "Carchi",           n: 3  }, { prov: "Chimborazo",       n: 3  },
      { prov: "Loja",             n: 3  }, { prov: "Morona Santiago",  n: 2  },
      { prov: "Napo",             n: 2  }, { prov: "Sucumbíos",        n: 2  },
      { prov: "Zamora Chinchipe", n: 2  }, { prov: "Imbabura",         n: 1  },
      { prov: "Orellana",         n: 1  }, { prov: "Pastaza",          n: 1  },
      { prov: "Tungurahua",       n: 1  },
    ],
    avanceSemanal: [
      { dia: "L 18/05", aplicados: 165,  acum: 165,   pct: 0  },
      { dia: "M 19/05", aplicados: 3885, acum: 4050,  pct: 8  },
      { dia: "X 20/05", aplicados: 4028, acum: 8078,  pct: 16 },
      { dia: "J 21/05", aplicados: 3033, acum: 11111, pct: 22 },
      { dia: "V 22/05", aplicados: 2778, acum: 13889, pct: 27 },
      { dia: "M 26/05", aplicados: 3400, acum: 17289, pct: 34 },
      { dia: "X 27/05", aplicados: 4519, acum: 21808, pct: 42 },
      { dia: "J 28/05", aplicados: 4191, acum: 25999, pct: 51 },
      { dia: "V 29/05", aplicados: 2827, acum: 28826, pct: 56 },
      { dia: "L 01/06", aplicados: 1111, acum: 29937, pct: 58 },
      { dia: "M 02/06", aplicados: 4008, acum: 33945, pct: 66 },
      { dia: "X 03/06", aplicados: 3770, acum: 37715, pct: 73 },
      { dia: "J 04/06", aplicados: 2600, acum: 40315, pct: 79 },
    ],
    // Cobertura diaria 04/06
    diaCobPct: 95.52,
    diaAplicados: 2600,
    diaProgramados: 2722,
    diaAusentes: 70,
    diaNoAplicados: 13,
    diaReprogramados: 39,
    diaLabsTotal: 195,
    diaLabsInicio: 191,
    diaLabsInicioPct: 97.95,
    diaSesiones: [
      { sesion: "S1", total: 1273, aplicado: 1223, pct: 96.07 },
      { sesion: "S2", total: 1252, aplicado: 1194, pct: 95.37 },
      { sesion: "S3", total: 119,  aplicado: 107,  pct: 89.92 },
      { sesion: "S4", total: 78,   aplicado: 76,   pct: 97.44 },
    ],
    diaEstProgramados: 25673,
    diaEstAplicados:   19099,  diaEstAplicadosPct: 74.39,
    diaEstParcial: 2117,       diaEstParcialPct: 8.25,
    diaEstAusentes: 269,
    diaEstReprogramados: 392,  diaEstReprogramadosPct: 1.53,
    diaEstPorAplicar: 3644,    diaEstPorAplicarPct: 14.19,
    diaEstPie: [
      { name: "Aplicado",        value: 19099, pct: "74,39%", color: "#1a56a0" },
      { name: "Parc. aplicado",  value: 2117,  pct: "8,25%",  color: "#f0a500" },
      { name: "Reprogramado",    value: 392,   pct: "1,53%",  color: "#8e44ad" },
      { name: "Ausente",         value: 269,   pct: "1,05%",  color: "#e07b3a" },
      { name: "Por aplicar",     value: 3644,  pct: "14,19%", color: "#c8d6e5" },
    ],
    diaAusentismoObs: [
      { motivo: "Ausente",        n: 30 },
      { motivo: "Enfermedad",     n: 23 },
      { motivo: "Calamidad",      n: 9  },
      { motivo: "Fuera del país", n: 6  },
      { motivo: "Hospitalizado",  n: 2  },
    ],
    diaNoAplicadosObs: [
      { obs: "Estudiante NEE",        n: 7, pct: "53,8%" },
      { obs: "Retirado",              n: 3, pct: "23,1%" },
      { obs: "No pertenece a la IE",  n: 2, pct: "15,4%" },
      { obs: "Sin permiso padres",    n: 1, pct: "7,7%"  },
    ],
    diaReprogramadosObs: [
      { obs: "Cambio de fecha de aplicación", n: 39, pct: "100%" },
    ],
    diaNoInicio: "Aplicará próximos días (3) / Sin técnico aplicador (1)",
    diaNoInicioN: 4,
    diaNotaSesion: "39 reprogramados por cambio de fecha; 4 sesiones sin iniciar de 195 (97,95% ejecutadas)",
  },

  "05/06": {
    corte: "5 de junio de 2026",
    semana: "Semana 3",
    soloDialy: false,
    // Evaluaciones acumuladas
    evalProgramadas: 51346,
    evalAplicadas:   42213,   evalAplicadasPct: 82.21,
    evalReprogramadas: 546,   evalReprogramadasPct: 1.06,
    evalAusentes: 761,        evalAusentesPct: 1.48,
    evalNoAplicado: 308,
    evalEnAuditoria: 0,
    evalPorAplicar: 7518,     evalPorAplicarPct: 14.64,
    // Estudiantes acumulados
    estProgramados: 25673,
    estAplicados:   20895,    estAplicadosPct: 81.39,
    estParcial: 423,          estParcialPct: 1.65,
    estAusentes: 243,
    estReprogramados: 262,    estReprogramadosPct: 1.02,
    estEnAuditoria: 0,
    estPorAplicar: 3700,      estPorAplicarPct: 14.41,
    globalPie: [
      { name: "Aplicado",     value: 42213, pct: "82,21%", color: C.aplicado     },
      { name: "Reprogramado", value: 546,   pct: "1,06%",  color: C.reprogramado },
      { name: "Ausente",      value: 761,   pct: "1,48%",  color: C.ausente      },
      { name: "No aplicado",  value: 308,   pct: "0,60%",  color: C.noAplicado   },
      { name: "Por aplicar",  value: 7518,  pct: "14,64%", color: C.porAplicar   },
    ],
    // Subniveles
    subniveles: [
      { nivel: "Bachillerato", aplicado: 11315, total: 12480, pct: 90.67 },
      { nivel: "Superior",     aplicado: 10780, total: 13274, pct: 81.21 },
      { nivel: "Elemental",    aplicado: 10184, total: 12690, pct: 80.25 },
      { nivel: "Media",        aplicado: 9934,  total: 12902, pct: 77.00 },
    ],
    // Sostenimiento
    sostenimiento: [
      { tipo: "Municipal",     pct: 90.01, aplicado: 8483,  total: 9424  },
      { tipo: "Fiscomisional", pct: 84.70, aplicado: 9517,  total: 11236 },
      { tipo: "Fiscal",        pct: 81.33, aplicado: 14161, total: 17412 },
      { tipo: "Particular",    pct: 75.73, aplicado: 10052, total: 13274 },
    ],
    // Área
    areaUrbana: { aplicado: 27496, total: 32716, pct: 84.04 },
    areaRural:  { aplicado: 14717, total: 18630, pct: 79.00 },
    // Provincias
    provincias: [
      { provincia: "Cañar",        pct: 97.28, aplicado: 1179, programado: 1212  },
      { provincia: "Zamora Ch.",   pct: 96.47, aplicado: 355,  programado: 368   },
      { provincia: "Carchi",       pct: 92.59, aplicado: 1237, programado: 1336  },
      { provincia: "Chimborazo",   pct: 86.91, aplicado: 1547, programado: 1780  },
      { provincia: "Azuay",        pct: 84.84, aplicado: 3492, programado: 4116  },
      { provincia: "Pichincha",    pct: 84.43, aplicado: 21921,programado: 25964 },
      { provincia: "Pastaza",      pct: 83.96, aplicado: 534,  programado: 636   },
      { provincia: "Imbabura",     pct: 83.18, aplicado: 2670, programado: 3210  },
      { provincia: "Loja",         pct: 81.62, aplicado: 2207, programado: 2704  },
      { provincia: "Tungurahua",   pct: 78.77, aplicado: 2579, programado: 3274  },
      { provincia: "Cotopaxi",     pct: 77.50, aplicado: 1629, programado: 2102  },
      { provincia: "Sucumbíos",    pct: 77.19, aplicado: 829,  programado: 1074  },
      { provincia: "Bolívar",      pct: 74.29, aplicado: 263,  programado: 354   },
      { provincia: "Napo",         pct: 73.18, aplicado: 843,  programado: 1152  },
      { provincia: "Orellana",     pct: 46.71, aplicado: 540,  programado: 1156  },
      { provincia: "Morona S.",    pct: 42.73, aplicado: 388,  programado: 908   },
    ],
    // Labs
    labTotal: 596,
    labAplicados: 469,    labAplicadosPct: 78.69,
    labParcial: 30,       labParcialPct: 5.03,
    labPorAplicar: 93,    labPorAplicarPct: 15.60,
    labBajo95: 67,
    labBajo90: 11,
    labsBajo95: [
      { prov: "Pichincha",        n: 37 }, { prov: "Azuay",           n: 7  },
      { prov: "Carchi",           n: 3  }, { prov: "Chimborazo",       n: 3  },
      { prov: "Loja",             n: 3  }, { prov: "Napo",             n: 3  },
      { prov: "Sucumbíos",        n: 3  }, { prov: "Morona Santiago",  n: 2  },
      { prov: "Zamora Chinchipe", n: 2  }, { prov: "Imbabura",         n: 1  },
      { prov: "Orellana",         n: 1  }, { prov: "Pastaza",          n: 1  },
      { prov: "Tungurahua",       n: 1  },
    ],
    avanceSemanal: [
      { dia: "L 18/05", aplicados: 165,  acum: 165,   pct: 0  },
      { dia: "M 19/05", aplicados: 3885, acum: 4050,  pct: 8  },
      { dia: "X 20/05", aplicados: 4045, acum: 8095,  pct: 16 },
      { dia: "J 21/05", aplicados: 3033, acum: 11128, pct: 22 },
      { dia: "V 22/05", aplicados: 2778, acum: 13906, pct: 27 },
      { dia: "M 26/05", aplicados: 3404, acum: 17310, pct: 34 },
      { dia: "X 27/05", aplicados: 4521, acum: 21831, pct: 43 },
      { dia: "J 28/05", aplicados: 4191, acum: 26022, pct: 51 },
      { dia: "V 29/05", aplicados: 2827, acum: 28849, pct: 56 },
      { dia: "L 01/06", aplicados: 1111, acum: 29960, pct: 58 },
      { dia: "M 02/06", aplicados: 4012, acum: 33972, pct: 66 },
      { dia: "X 03/06", aplicados: 3786, acum: 37758, pct: 74 },
      { dia: "J 04/06", aplicados: 2657, acum: 40415, pct: 79 },
      { dia: "V 05/06", aplicados: 1798, acum: 42213, pct: 82 },
    ],
    // Cobertura diaria 05/06
    diaCobPct: 95.64,
    diaAplicados: 1798,
    diaProgramados: 1880,
    diaAusentes: 47,
    diaNoAplicados: 12,
    diaReprogramados: 23,
    diaLabsTotal: 134,
    diaLabsInicio: 134,
    diaLabsInicioPct: 100.00,
    diaSesiones: [
      { sesion: "S1", total: 898, aplicado: 852, pct: 94.88 },
      { sesion: "S2", total: 876, aplicado: 842, pct: 96.12 },
      { sesion: "S3", total: 70,  aplicado: 69,  pct: 98.57 },
      { sesion: "S4", total: 36,  aplicado: 35,  pct: 97.22 },
    ],
    diaEstProgramados: 25673,
    diaEstAplicados:   20895,  diaEstAplicadosPct: 81.39,
    diaEstParcial: 423,        diaEstParcialPct: 1.65,
    diaEstAusentes: 243,
    diaEstReprogramados: 262,  diaEstReprogramadosPct: 1.02,
    diaEstPorAplicar: 3700,    diaEstPorAplicarPct: 14.41,
    diaEstPie: [
      { name: "Aplicado",        value: 20895, pct: "81,39%", color: "#1a56a0" },
      { name: "Parc. aplicado",  value: 423,   pct: "1,65%",  color: "#f0a500" },
      { name: "Reprogramado",    value: 262,   pct: "1,02%",  color: "#8e44ad" },
      { name: "Ausente",         value: 243,   pct: "0,95%",  color: "#e07b3a" },
      { name: "Por aplicar",     value: 3700,  pct: "14,41%", color: "#c8d6e5" },
    ],
    diaAusentismoObs: [
      { motivo: "Enfermedad",     n: 25 },
      { motivo: "Ausente",        n: 13 },
      { motivo: "Calamidad",      n: 4  },
      { motivo: "Fuera del país", n: 2  },
      { motivo: "Hospitalizado",  n: 2  },
      { motivo: "Act. IE",        n: 1  },
    ],
    diaNoAplicadosObs: [
      { obs: "Estudiante NEE",     n: 7, pct: "58,3%" },
      { obs: "Retirado",           n: 4, pct: "33,3%" },
      { obs: "Sin permiso padres", n: 1, pct: "8,3%"  },
    ],
    diaReprogramadosObs: [
      { obs: "Cambio de fecha de aplicación", n: 23, pct: "100%" },
    ],
    diaNoInicio: null,
    diaNoInicioN: 0,
    diaNotaSesion: "23 reprogramados por cambio de fecha; 134 de 134 sesiones iniciadas (100% ejecutadas)",
  },

  "08/06": {
    corte: "8 de junio de 2026",
    semana: "Semana 4",
    soloDialy: false,
    // Evaluaciones acumuladas
    evalProgramadas: 51346,
    evalAplicadas:   43877,   evalAplicadasPct: 85.45,
    evalReprogramadas: 628,   evalReprogramadasPct: 1.22,
    evalAusentes: 834,        evalAusentesPct: 1.62,
    evalNoAplicado: 310,
    evalEnAuditoria: 17,
    evalPorAplicar: 5680,     evalPorAplicarPct: 11.06,
    // Estudiantes acumulados
    estProgramados: 25673,
    estAplicados:   21007,    estAplicadosPct: 81.83,
    estParcial: 1846,         estParcialPct: 7.19,
    estAusentes: 310,
    estReprogramados: 309,    estReprogramadosPct: 1.20,
    estEnAuditoria: 17,
    estPorAplicar: 2031,      estPorAplicarPct: 7.91,
    globalPie: [
      { name: "Aplicado",     value: 43877, pct: "85,45%", color: C.aplicado     },
      { name: "Reprogramado", value: 628,   pct: "1,22%",  color: C.reprogramado },
      { name: "Ausente",      value: 834,   pct: "1,62%",  color: C.ausente      },
      { name: "No aplicado",  value: 310,   pct: "0,60%",  color: C.noAplicado   },
      { name: "En auditoría", value: 17,    pct: "0,03%",  color: C.enAuditoria  },
      { name: "Por aplicar",  value: 5680,  pct: "11,06%", color: C.porAplicar   },
    ],
    // Subniveles
    subniveles: [
      { nivel: "Bachillerato", aplicado: 11471, total: 12480, pct: 91.92 },
      { nivel: "Superior",     aplicado: 11189, total: 13274, pct: 84.29 },
      { nivel: "Elemental",    aplicado: 10636, total: 12690, pct: 83.81 },
      { nivel: "Media",        aplicado: 10581, total: 12902, pct: 82.01 },
    ],
    // Sostenimiento
    sostenimiento: [
      { tipo: "Municipal",     pct: 92.98, aplicado: 8762,  total: 9424  },
      { tipo: "Fiscomisional", pct: 88.04, aplicado: 9892,  total: 11236 },
      { tipo: "Fiscal",        pct: 83.89, aplicado: 14607, total: 17412 },
      { tipo: "Particular",    pct: 79.98, aplicado: 10616, total: 13274 },
    ],
    // Área
    areaUrbana: { aplicado: 28535, total: 32716, pct: 87.22 },
    areaRural:  { aplicado: 15342, total: 18630, pct: 82.35 },
    // Provincias
    provincias: [
      { provincia: "Cañar",        pct: 97.28, aplicado: 1179, programado: 1212  },
      { provincia: "Zamora Ch.",   pct: 96.47, aplicado: 355,  programado: 368   },
      { provincia: "Carchi",       pct: 92.59, aplicado: 1237, programado: 1336  },
      { provincia: "Imbabura",     pct: 89.00, aplicado: 2857, programado: 3210  },
      { provincia: "Pichincha",    pct: 87.97, aplicado: 22841,programado: 25964 },
      { provincia: "Chimborazo",   pct: 86.91, aplicado: 1547, programado: 1780  },
      { provincia: "Bolívar",      pct: 86.72, aplicado: 307,  programado: 354   },
      { provincia: "Azuay",        pct: 86.39, aplicado: 3556, programado: 4116  },
      { provincia: "Pastaza",      pct: 85.38, aplicado: 543,  programado: 636   },
      { provincia: "Loja",         pct: 84.21, aplicado: 2277, programado: 2704  },
      { provincia: "Tungurahua",   pct: 82.01, aplicado: 2685, programado: 3274  },
      { provincia: "Cotopaxi",     pct: 81.16, aplicado: 1706, programado: 2102  },
      { provincia: "Sucumbíos",    pct: 78.49, aplicado: 843,  programado: 1074  },
      { provincia: "Napo",         pct: 75.00, aplicado: 864,  programado: 1152  },
      { provincia: "Orellana",     pct: 52.34, aplicado: 605,  programado: 1156  },
      { provincia: "Morona S.",    pct: 52.31, aplicado: 475,  programado: 908   },
    ],
    // Labs
    labTotal: 596,
    labAplicados: 473,    labAplicadosPct: 79.36,
    labParcial: 52,       labParcialPct: 8.72,
    labPorAplicar: 66,    labPorAplicarPct: 11.07,
    labBajo95: 68,
    labBajo90: 12,
    labsBajo95: [
      { prov: "Pichincha",        n: 38 }, { prov: "Azuay",           n: 7  },
      { prov: "Carchi",           n: 3  }, { prov: "Chimborazo",       n: 3  },
      { prov: "Loja",             n: 3  }, { prov: "Napo",             n: 3  },
      { prov: "Sucumbíos",        n: 3  }, { prov: "Morona Santiago",  n: 2  },
      { prov: "Zamora Chinchipe", n: 2  }, { prov: "Imbabura",         n: 1  },
      { prov: "Orellana",         n: 1  }, { prov: "Pastaza",          n: 1  },
      { prov: "Tungurahua",       n: 1  },
    ],
    avanceSemanal: [
      { dia: "L 18/05", aplicados: 165,  acum: 165,   pct: 0  },
      { dia: "M 19/05", aplicados: 3885, acum: 4050,  pct: 8  },
      { dia: "X 20/05", aplicados: 4045, acum: 8095,  pct: 16 },
      { dia: "J 21/05", aplicados: 3033, acum: 11128, pct: 22 },
      { dia: "V 22/05", aplicados: 2779, acum: 13907, pct: 27 },
      { dia: "M 26/05", aplicados: 3405, acum: 17312, pct: 34 },
      { dia: "X 27/05", aplicados: 4521, acum: 21833, pct: 43 },
      { dia: "J 28/05", aplicados: 4191, acum: 26024, pct: 51 },
      { dia: "V 29/05", aplicados: 2827, acum: 28851, pct: 56 },
      { dia: "L 01/06", aplicados: 1111, acum: 29962, pct: 58 },
      { dia: "M 02/06", aplicados: 4013, acum: 33975, pct: 66 },
      { dia: "X 03/06", aplicados: 3785, acum: 37760, pct: 74 },
      { dia: "J 04/06", aplicados: 2660, acum: 40420, pct: 79 },
      { dia: "V 05/06", aplicados: 1804, acum: 42224, pct: 82 },
      { dia: "L 08/06", aplicados: 1605, acum: 43829, pct: 85 },
      { dia: "M 09/06", aplicados: 31,   acum: 43860, pct: 85 }, // parcial al corte
      { dia: "X 10/06", aplicados: 17,   acum: 43877, pct: 85 }, // parcial al corte
    ],
    // Cobertura diaria 08/06
    diaCobPct: 94.41,
    diaAplicados: 1605,
    diaProgramados: 1700,
    diaAusentes: 77,
    diaNoAplicados: 4,
    diaReprogramados: 14,
    diaLabsTotal: 121,
    diaLabsInicio: 117,
    diaLabsInicioPct: 96.69,
    diaSesiones: [
      { sesion: "S1", total: 797, aplicado: 756, pct: 94.86 },
      { sesion: "S2", total: 713, aplicado: 668, pct: 93.69 },
      { sesion: "S3", total: 112, aplicado: 105, pct: 93.75 },
      { sesion: "S4", total: 78,  aplicado: 76,  pct: 97.44 },
    ],
    diaEstProgramados: 25673,
    diaEstAplicados:   21007,  diaEstAplicadosPct: 81.83,
    diaEstParcial: 1846,       diaEstParcialPct: 7.19,
    diaEstAusentes: 310,
    diaEstReprogramados: 309,  diaEstReprogramadosPct: 1.20,
    diaEstPorAplicar: 2031,    diaEstPorAplicarPct: 7.91,
    diaEstPie: [
      { name: "Aplicado",        value: 21007, pct: "81,83%", color: "#1a56a0" },
      { name: "Parc. aplicado",  value: 1846,  pct: "7,19%",  color: "#f0a500" },
      { name: "Reprogramado",    value: 309,   pct: "1,20%",  color: "#8e44ad" },
      { name: "Ausente",         value: 310,   pct: "1,21%",  color: "#e07b3a" },
      { name: "Por aplicar",     value: 2031,  pct: "7,91%",  color: "#c8d6e5" },
    ],
    diaAusentismoObs: [
      { motivo: "Ausente",        n: 51 },
      { motivo: "Enfermedad",     n: 17 },
      { motivo: "Deportista",     n: 3  },
      { motivo: "Act. IE",        n: 2  },
      { motivo: "Fuera del país", n: 2  },
      { motivo: "Calamidad",      n: 1  },
      { motivo: "Hospitalizado",  n: 1  },
    ],
    diaNoAplicadosObs: [
      { obs: "Retirado",       n: 3, pct: "75%" },
      { obs: "Estudiante NEE", n: 1, pct: "25%" },
    ],
    diaReprogramadosObs: [
      { obs: "Cambio de fecha de aplicación", n: 14, pct: "100%" },
    ],
    diaNoInicio: "Cambio de fecha (2) / Sin especificar (2)",
    diaNoInicioN: 4,
    diaNotaSesion: "14 reprogramados por cambio de fecha; 4 sesiones sin iniciar de 121 (96,69% ejecutadas)",
  },

  "09/06": {
    corte: "9 de junio de 2026",
    semana: "Semana 4",
    soloDialy: false,
    // Evaluaciones acumuladas
    evalProgramadas: 51346,
    evalAplicadas:   46159,   evalAplicadasPct: 89.90,
    evalReprogramadas: 566,   evalReprogramadasPct: 1.10,
    evalAusentes: 843,        evalAusentesPct: 1.64,
    evalNoAplicado: 324,
    evalEnAuditoria: 0,
    evalPorAplicar: 3454,     evalPorAplicarPct: 6.73,
    // Estudiantes acumulados
    estProgramados: 25673,
    estAplicados:   22484,    estAplicadosPct: 87.58,
    estParcial: 1191,         estParcialPct: 4.64,
    estAusentes: 290,
    estReprogramados: 214,    estReprogramadosPct: 0.83,
    estEnAuditoria: 0,
    estPorAplicar: 1333,      estPorAplicarPct: 5.19,
    globalPie: [
      { name: "Aplicado",     value: 46159, pct: "89,90%", color: C.aplicado     },
      { name: "Reprogramado", value: 566,   pct: "1,10%",  color: C.reprogramado },
      { name: "Ausente",      value: 843,   pct: "1,64%",  color: C.ausente      },
      { name: "No aplicado",  value: 324,   pct: "0,63%",  color: C.noAplicado   },
      { name: "Por aplicar",  value: 3454,  pct: "6,73%",  color: C.porAplicar   },
    ],
    // Subniveles
    subniveles: [
      { nivel: "Bachillerato", aplicado: 11688, total: 12480, pct: 93.65 },
      { nivel: "Superior",     aplicado: 11887, total: 13274, pct: 89.55 },
      { nivel: "Media",        aplicado: 11475, total: 12902, pct: 88.94 },
      { nivel: "Elemental",    aplicado: 11109, total: 12690, pct: 87.54 },
    ],
    // Sostenimiento
    sostenimiento: [
      { tipo: "Municipal",     pct: 95.07, aplicado: 8959,  total: 9424  },
      { tipo: "Fiscomisional", pct: 92.84, aplicado: 10432, total: 11236 },
      { tipo: "Fiscal",        pct: 88.23, aplicado: 15362, total: 17412 },
      { tipo: "Particular",    pct: 85.93, aplicado: 11406, total: 13274 },
    ],
    // Área
    areaUrbana: { aplicado: 29853, total: 32716, pct: 91.25 },
    areaRural:  { aplicado: 16306, total: 18630, pct: 87.53 },
    // Provincias
    provincias: [
      { provincia: "Bolívar",      pct: 99.72, aplicado: 353,  programado: 354   },
      { provincia: "Cañar",        pct: 98.35, aplicado: 1192, programado: 1212  },
      { provincia: "Zamora Ch.",   pct: 96.47, aplicado: 355,  programado: 368   },
      { provincia: "Imbabura",     pct: 94.67, aplicado: 3039, programado: 3210  },
      { provincia: "Carchi",       pct: 92.59, aplicado: 1237, programado: 1336  },
      { provincia: "Pastaza",      pct: 92.14, aplicado: 586,  programado: 636   },
      { provincia: "Pichincha",    pct: 91.99, aplicado: 23885,programado: 25964 },
      { provincia: "Azuay",        pct: 88.39, aplicado: 3638, programado: 4116  },
      { provincia: "Loja",         pct: 88.02, aplicado: 2380, programado: 2704  },
      { provincia: "Tungurahua",   pct: 87.97, aplicado: 2880, programado: 3274  },
      { provincia: "Chimborazo",   pct: 86.91, aplicado: 1547, programado: 1780  },
      { provincia: "Cotopaxi",     pct: 85.92, aplicado: 1806, programado: 2102  },
      { provincia: "Napo",         pct: 85.42, aplicado: 984,  programado: 1152  },
      { provincia: "Sucumbíos",    pct: 83.71, aplicado: 899,  programado: 1074  },
      { provincia: "Morona S.",    pct: 71.26, aplicado: 647,  programado: 908   },
      { provincia: "Orellana",     pct: 63.24, aplicado: 731,  programado: 1156  },
    ],
    // Labs
    labTotal: 596,
    labAplicados: 515,    labAplicadosPct: 86.41,
    labParcial: 23,       labParcialPct: 3.86,
    labPorAplicar: 57,    labPorAplicarPct: 9.56,
    labBajo95: 73,
    labBajo90: 15,
    labsBajo95: [
      { prov: "Pichincha",        n: 39 }, { prov: "Azuay",           n: 8  },
      { prov: "Loja",             n: 4  }, { prov: "Napo",             n: 4  },
      { prov: "Carchi",           n: 3  }, { prov: "Chimborazo",       n: 3  },
      { prov: "Morona Santiago",  n: 3  }, { prov: "Sucumbíos",        n: 3  },
      { prov: "Zamora Chinchipe", n: 2  }, { prov: "Imbabura",         n: 1  },
      { prov: "Orellana",         n: 1  }, { prov: "Pastaza",          n: 1  },
      { prov: "Tungurahua",       n: 1  },
    ],
    avanceSemanal: [
      { dia: "L 18/05", aplicados: 165,  acum: 165,   pct: 0  },
      { dia: "M 19/05", aplicados: 3885, acum: 4050,  pct: 8  },
      { dia: "X 20/05", aplicados: 4045, acum: 8095,  pct: 16 },
      { dia: "J 21/05", aplicados: 3033, acum: 11128, pct: 22 },
      { dia: "V 22/05", aplicados: 2779, acum: 13907, pct: 27 },
      { dia: "M 26/05", aplicados: 3405, acum: 17312, pct: 34 },
      { dia: "X 27/05", aplicados: 4521, acum: 21833, pct: 43 },
      { dia: "J 28/05", aplicados: 4191, acum: 26024, pct: 51 },
      { dia: "V 29/05", aplicados: 2827, acum: 28851, pct: 56 },
      { dia: "L 01/06", aplicados: 1111, acum: 29962, pct: 58 },
      { dia: "M 02/06", aplicados: 4013, acum: 33975, pct: 66 },
      { dia: "X 03/06", aplicados: 3787, acum: 37762, pct: 74 },
      { dia: "J 04/06", aplicados: 2664, acum: 40426, pct: 79 },
      { dia: "V 05/06", aplicados: 1805, acum: 42231, pct: 82 },
      { dia: "L 08/06", aplicados: 1658, acum: 43889, pct: 85 },
      { dia: "M 09/06", aplicados: 2185, acum: 46074, pct: 90 },
      { dia: "X 10/06", aplicados: 35,   acum: 46109, pct: 90 }, // parcial al corte
      { dia: "J 11/06", aplicados: 50,   acum: 46159, pct: 90 }, // parcial al corte
    ],
    // Cobertura diaria 09/06
    diaCobPct: 91.04,
    diaAplicados: 2185,
    diaProgramados: 2400,
    diaAusentes: 59,
    diaNoAplicados: 13,
    diaReprogramados: 143,
    diaLabsTotal: 184,
    diaLabsInicio: 170,
    diaLabsInicioPct: 92.39,
    diaSesiones: [
      { sesion: "S1", total: 1147, aplicado: 1099, pct: 95.82 },
      { sesion: "S2", total: 1044, aplicado: 931,  pct: 89.18 },
      { sesion: "S3", total: 131,  aplicado: 104,  pct: 79.39 },
      { sesion: "S4", total: 78,   aplicado: 51,   pct: 65.38 },
    ],
    diaEstProgramados: 25673,
    diaEstAplicados:   22484,  diaEstAplicadosPct: 87.58,
    diaEstParcial: 1191,       diaEstParcialPct: 4.64,
    diaEstAusentes: 290,
    diaEstReprogramados: 214,  diaEstReprogramadosPct: 0.83,
    diaEstPorAplicar: 1333,    diaEstPorAplicarPct: 5.19,
    diaEstPie: [
      { name: "Aplicado",        value: 22484, pct: "87,58%", color: "#1a56a0" },
      { name: "Parc. aplicado",  value: 1191,  pct: "4,64%",  color: "#f0a500" },
      { name: "Reprogramado",    value: 214,   pct: "0,83%",  color: "#8e44ad" },
      { name: "Ausente",         value: 290,   pct: "1,13%",  color: "#e07b3a" },
      { name: "Por aplicar",     value: 1333,  pct: "5,19%",  color: "#c8d6e5" },
    ],
    diaAusentismoObs: [
      { motivo: "Ausente",        n: 29 },
      { motivo: "Enfermedad",     n: 20 },
      { motivo: "Calamidad",      n: 4  },
      { motivo: "Fuera del país", n: 4  },
      { motivo: "Deportista",     n: 1  },
      { motivo: "Hospitalizado",  n: 1  },
    ],
    diaNoAplicadosObs: [
      { obs: "Retirado",       n: 11, pct: "84,6%" },
      { obs: "Estudiante NEE", n: 2,  pct: "15,4%" },
    ],
    diaReprogramadosObs: [
      { obs: "Falla eléctrica",                n: 97, pct: "67,8%" },
      { obs: "Cambio de fecha de aplicación",  n: 35, pct: "24,5%" },
      { obs: "Falla técnica",                  n: 11, pct: "7,7%"  },
    ],
    diaNoInicio: "Falla eléctrica (6) / IE difícil acceso (2) / Sin registro (6)",
    diaNoInicioN: 14,
    diaNotaSesion: "143 reprogramados (falla eléctrica 67,8%); 14 sesiones sin iniciar de 184 (92,39% ejecutadas)",
  },

  "10/06": {
    corte: "10 de junio de 2026",
    semana: "Semana 4",
    soloDialy: false,
    // Evaluaciones acumuladas
    evalProgramadas: 51346,
    evalAplicadas:   47431,   evalAplicadasPct: 92.38,
    evalReprogramadas: 333,   evalReprogramadasPct: 0.65,
    evalAusentes: 840,        evalAusentesPct: 1.64,
    evalNoAplicado: 337,
    evalEnAuditoria: 0,
    evalPorAplicar: 2405,     evalPorAplicarPct: 4.68,
    // Estudiantes acumulados
    estProgramados: 25673,
    estAplicados:   23343,    estAplicadosPct: 90.92,
    estParcial: 745,          estParcialPct: 2.90,
    estAusentes: 262,
    estReprogramados: 167,    estReprogramadosPct: 0.65,
    estEnAuditoria: 0,
    estPorAplicar: 989,       estPorAplicarPct: 3.85,
    globalPie: [
      { name: "Aplicado",     value: 47431, pct: "92,38%", color: C.aplicado     },
      { name: "Reprogramado", value: 333,   pct: "0,65%",  color: C.reprogramado },
      { name: "Ausente",      value: 840,   pct: "1,64%",  color: C.ausente      },
      { name: "No aplicado",  value: 337,   pct: "0,66%",  color: C.noAplicado   },
      { name: "Por aplicar",  value: 2405,  pct: "4,68%",  color: C.porAplicar   },
    ],
    // Subniveles
    subniveles: [
      { nivel: "Bachillerato", aplicado: 11864, total: 12480, pct: 95.06 },
      { nivel: "Superior",     aplicado: 12304, total: 13274, pct: 92.69 },
      { nivel: "Media",        aplicado: 11950, total: 12902, pct: 92.62 },
      { nivel: "Elemental",    aplicado: 11313, total: 12690, pct: 89.15 },
    ],
    // Sostenimiento
    sostenimiento: [
      { tipo: "Municipal",     pct: 97.08, aplicado: 9149,  total: 9424  },
      { tipo: "Fiscomisional", pct: 95.96, aplicado: 10782, total: 11236 },
      { tipo: "Fiscal",        pct: 90.44, aplicado: 15748, total: 17412 },
      { tipo: "Particular",    pct: 88.53, aplicado: 11752, total: 13274 },
    ],
    // Área
    areaUrbana: { aplicado: 30646, total: 32716, pct: 93.67 },
    areaRural:  { aplicado: 16785, total: 18630, pct: 90.10 },
    // Provincias
    provincias: [
      { provincia: "Bolívar",      pct: 99.72, aplicado: 353,  programado: 354   },
      { provincia: "Cañar",        pct: 99.42, aplicado: 1205, programado: 1212  },
      { provincia: "Pastaza",      pct: 97.48, aplicado: 620,  programado: 636   },
      { provincia: "Imbabura",     pct: 96.95, aplicado: 3112, programado: 3210  },
      { provincia: "Zamora Ch.",   pct: 96.47, aplicado: 355,  programado: 368   },
      { provincia: "Napo",         pct: 95.66, aplicado: 1102, programado: 1152  },
      { provincia: "Pichincha",    pct: 93.59, aplicado: 24301,programado: 25964 },
      { provincia: "Carchi",       pct: 92.59, aplicado: 1237, programado: 1336  },
      { provincia: "Tungurahua",   pct: 92.52, aplicado: 3029, programado: 3274  },
      { provincia: "Loja",         pct: 90.46, aplicado: 2446, programado: 2704  },
      { provincia: "Morona S.",    pct: 89.76, aplicado: 815,  programado: 908   },
      { provincia: "Azuay",        pct: 89.63, aplicado: 3689, programado: 4116  },
      { provincia: "Sucumbíos",    pct: 87.80, aplicado: 943,  programado: 1074  },
      { provincia: "Chimborazo",   pct: 86.91, aplicado: 1547, programado: 1780  },
      { provincia: "Cotopaxi",     pct: 86.73, aplicado: 1823, programado: 2102  },
      { provincia: "Orellana",     pct: 73.88, aplicado: 854,  programado: 1156  },
    ],
    // Labs
    labTotal: 596,
    labAplicados: 539,    labAplicadosPct: 90.44,
    labParcial: 22,       labParcialPct: 3.69,
    labPorAplicar: 34,    labPorAplicarPct: 5.70,
    labBajo95: 78,
    labBajo90: 16,
    labsBajo95: [
      { prov: "Pichincha",        n: 41 }, { prov: "Azuay",           n: 8  },
      { prov: "Napo",             n: 6  }, { prov: "Loja",             n: 4  },
      { prov: "Carchi",           n: 3  }, { prov: "Chimborazo",       n: 3  },
      { prov: "Morona Santiago",  n: 3  }, { prov: "Sucumbíos",        n: 3  },
      { prov: "Zamora Chinchipe", n: 2  }, { prov: "Cañar",            n: 1  },
      { prov: "Imbabura",         n: 1  }, { prov: "Orellana",         n: 1  },
      { prov: "Pastaza",          n: 1  }, { prov: "Tungurahua",       n: 1  },
    ],
    avanceSemanal: [
      { dia: "L 18/05", aplicados: 165,  acum: 165,   pct: 0  },
      { dia: "M 19/05", aplicados: 3885, acum: 4050,  pct: 8  },
      { dia: "X 20/05", aplicados: 4045, acum: 8095,  pct: 16 },
      { dia: "J 21/05", aplicados: 3033, acum: 11128, pct: 22 },
      { dia: "V 22/05", aplicados: 2779, acum: 13907, pct: 27 },
      { dia: "M 26/05", aplicados: 3405, acum: 17312, pct: 34 },
      { dia: "X 27/05", aplicados: 4521, acum: 21833, pct: 43 },
      { dia: "J 28/05", aplicados: 4191, acum: 26024, pct: 51 },
      { dia: "V 29/05", aplicados: 2827, acum: 28851, pct: 56 },
      { dia: "L 01/06", aplicados: 1111, acum: 29962, pct: 58 },
      { dia: "M 02/06", aplicados: 4013, acum: 33975, pct: 66 },
      { dia: "X 03/06", aplicados: 3787, acum: 37762, pct: 74 },
      { dia: "J 04/06", aplicados: 2664, acum: 40426, pct: 79 },
      { dia: "V 05/06", aplicados: 1805, acum: 42231, pct: 82 },
      { dia: "L 08/06", aplicados: 1671, acum: 43902, pct: 86 },
      { dia: "M 09/06", aplicados: 2232, acum: 46134, pct: 90 },
      { dia: "X 10/06", aplicados: 1205, acum: 47339, pct: 92 },
      { dia: "J 11/06", aplicados: 57,   acum: 47396, pct: 92 }, // parcial al corte
      { dia: "V 12/06", aplicados: 35,   acum: 47431, pct: 92 }, // parcial al corte
    ],
    // Cobertura diaria 10/06
    diaCobPct: 96.17,
    diaAplicados: 1205,
    diaProgramados: 1253,
    diaAusentes: 25,
    diaNoAplicados: 12,
    diaReprogramados: 11,
    diaLabsTotal: 104,
    diaLabsInicio: 101,
    diaLabsInicioPct: 97.12,
    diaSesiones: [
      { sesion: "S1", total: 612, aplicado: 592, pct: 96.73 },
      { sesion: "S2", total: 548, aplicado: 523, pct: 95.44 },
      { sesion: "S3", total: 83,  aplicado: 81,  pct: 97.59 },
      { sesion: "S4", total: 10,  aplicado: 9,   pct: 90.00 },
    ],
    diaEstProgramados: 25673,
    diaEstAplicados:   23343,  diaEstAplicadosPct: 90.92,
    diaEstParcial: 745,        diaEstParcialPct: 2.90,
    diaEstAusentes: 262,
    diaEstReprogramados: 167,  diaEstReprogramadosPct: 0.65,
    diaEstPorAplicar: 989,     diaEstPorAplicarPct: 3.85,
    diaEstPie: [
      { name: "Aplicado",        value: 23343, pct: "90,92%", color: "#1a56a0" },
      { name: "Parc. aplicado",  value: 745,   pct: "2,90%",  color: "#f0a500" },
      { name: "Reprogramado",    value: 167,   pct: "0,65%",  color: "#8e44ad" },
      { name: "Ausente",         value: 262,   pct: "1,02%",  color: "#e07b3a" },
      { name: "Por aplicar",     value: 989,   pct: "3,85%",  color: "#c8d6e5" },
    ],
    diaAusentismoObs: [
      { motivo: "Enfermedad",     n: 9 },
      { motivo: "Ausente",        n: 8 },
      { motivo: "Calamidad",      n: 6 },
      { motivo: "Fuera del país", n: 2 },
    ],
    diaNoAplicadosObs: [
      { obs: "Retirado",            n: 9, pct: "75,0%" },
      { obs: "Sin permiso padres",  n: 2, pct: "16,7%" },
      { obs: "No pertenece a la IE", n: 1, pct: "8,3%" },
    ],
    diaReprogramadosObs: [
      { obs: "Cambio de fecha de aplicación", n: 11, pct: "100%" },
    ],
    diaNoInicio: "IE difícil acceso (2) / Sin registro (1)",
    diaNoInicioN: 3,
    diaNotaSesion: "11 reprogramados por cambio de fecha; 3 sesiones sin iniciar de 104 (97,12% ejecutadas)",
  },

  /* ─────────────────────────────────────────────────────
     11/06  — corte completo (General/Territorial/Muestra)
  ───────────────────────────────────────────────────── */
  "11/06": {
    corte: "11 de junio de 2026",
    semana: "Semana 4",
    soloDialy: false,
    // Evaluaciones acumuladas
    evalProgramadas: 51346,
    evalAplicadas:   48425,   evalAplicadasPct: 94.31,
    evalReprogramadas: 275,   evalReprogramadasPct: 0.54,
    evalAusentes: 838,        evalAusentesPct: 1.63,
    evalNoAplicado: 352,
    evalEnAuditoria: 28,
    evalPorAplicar: 1428,     evalPorAplicarPct: 2.78,
    // Estudiantes acumulados
    estProgramados: 25673,
    estAplicados:   23767,    estAplicadosPct: 92.58,
    estParcial: 864,          estParcialPct: 3.37,
    estAusentes: 271,
    estReprogramados: 102,    estReprogramadosPct: 0.40,
    estEnAuditoria: 28,
    estPorAplicar: 465,       estPorAplicarPct: 1.81,
    globalPie: [
      { name: "Aplicado",     value: 48425, pct: "94,31%", color: C.aplicado     },
      { name: "Reprogramado", value: 275,   pct: "0,54%",  color: C.reprogramado },
      { name: "Ausente",      value: 838,   pct: "1,63%",  color: C.ausente      },
      { name: "No aplicado",  value: 352,   pct: "0,69%",  color: C.noAplicado   },
      { name: "Por aplicar",  value: 1428,  pct: "2,78%",  color: C.porAplicar   },
    ],
    // Subniveles
    subniveles: [
      { nivel: "Bachillerato", aplicado: 12008, total: 12480, pct: 96.22 },
      { nivel: "Media",        aplicado: 12258, total: 12902, pct: 95.01 },
      { nivel: "Superior",     aplicado: 12529, total: 13274, pct: 94.39 },
      { nivel: "Elemental",    aplicado: 11630, total: 12690, pct: 91.65 },
    ],
    // Sostenimiento
    sostenimiento: [
      { tipo: "Municipal",     pct: 98.07, aplicado: 9242,  total: 9424  },
      { tipo: "Fiscomisional", pct: 97.21, aplicado: 10923, total: 11236 },
      { tipo: "Fiscal",        pct: 93.03, aplicado: 16198, total: 17412 },
      { tipo: "Particular",    pct: 90.87, aplicado: 12062, total: 13274 },
    ],
    // Área
    areaUrbana: { aplicado: 31122, total: 32716, pct: 95.13 },
    areaRural:  { aplicado: 17303, total: 18630, pct: 92.88 },
    // Provincias
    provincias: [
      { provincia: "Bolívar",      pct: 99.72, aplicado: 353,   programado: 354   },
      { provincia: "Cañar",        pct: 99.42, aplicado: 1205,  programado: 1212  },
      { provincia: "Imbabura",     pct: 98.88, aplicado: 3174,  programado: 3210  },
      { provincia: "Morona S.",    pct: 98.68, aplicado: 896,   programado: 908   },
      { provincia: "Napo",         pct: 97.74, aplicado: 1126,  programado: 1152  },
      { provincia: "Pastaza",      pct: 97.48, aplicado: 620,   programado: 636   },
      { provincia: "Zamora Ch.",   pct: 96.47, aplicado: 355,   programado: 368   },
      { provincia: "Carchi",       pct: 95.21, aplicado: 1272,  programado: 1336  },
      { provincia: "Pichincha",    pct: 94.67, aplicado: 24580, programado: 25964 },
      { provincia: "Tungurahua",   pct: 93.86, aplicado: 3073,  programado: 3274  },
      { provincia: "Sucumbíos",    pct: 93.58, aplicado: 1005,  programado: 1074  },
      { provincia: "Loja",         pct: 92.83, aplicado: 2510,  programado: 2704  },
      { provincia: "Azuay",        pct: 92.13, aplicado: 3792,  programado: 4116  },
      { provincia: "Cotopaxi",     pct: 90.01, aplicado: 1892,  programado: 2102  },
      { provincia: "Chimborazo",   pct: 88.60, aplicado: 1577,  programado: 1780  },
      { provincia: "Orellana",     pct: 86.07, aplicado: 995,   programado: 1156  },
    ],
    // Labs
    labTotal: 596,
    labAplicados: 553,    labAplicadosPct: 92.79,
    labParcial: 14,       labParcialPct: 2.35,
    labPorAplicar: 29,    labPorAplicarPct: 4.87,
    labBajo95: 78,
    labBajo90: 15,
    labsBajo95: [
      { prov: "Pichincha",        n: 42 }, { prov: "Azuay",           n: 8  },
      { prov: "Napo",             n: 5  }, { prov: "Loja",             n: 4  },
      { prov: "Carchi",           n: 3  }, { prov: "Chimborazo",       n: 3  },
      { prov: "Morona Santiago",  n: 3  }, { prov: "Sucumbíos",        n: 3  },
      { prov: "Zamora Chinchipe", n: 2  }, { prov: "Cañar",            n: 1  },
      { prov: "Imbabura",         n: 1  }, { prov: "Orellana",         n: 1  },
      { prov: "Pastaza",          n: 1  }, { prov: "Tungurahua",       n: 1  },
    ],
    avanceSemanal: [
      { dia: "L 18/05", aplicados: 165,  acum: 165,   pct: 0  },
      { dia: "M 19/05", aplicados: 3885, acum: 4050,  pct: 8  },
      { dia: "X 20/05", aplicados: 4045, acum: 8095,  pct: 16 },
      { dia: "J 21/05", aplicados: 3033, acum: 11128, pct: 22 },
      { dia: "V 22/05", aplicados: 2779, acum: 13907, pct: 27 },
      { dia: "M 26/05", aplicados: 3405, acum: 17312, pct: 34 },
      { dia: "X 27/05", aplicados: 4521, acum: 21833, pct: 43 },
      { dia: "J 28/05", aplicados: 4191, acum: 26024, pct: 51 },
      { dia: "V 29/05", aplicados: 2827, acum: 28851, pct: 56 },
      { dia: "L 01/06", aplicados: 1111, acum: 29962, pct: 58 },
      { dia: "M 02/06", aplicados: 4013, acum: 33975, pct: 66 },
      { dia: "X 03/06", aplicados: 3787, acum: 37762, pct: 74 },
      { dia: "J 04/06", aplicados: 2664, acum: 40426, pct: 79 },
      { dia: "V 05/06", aplicados: 1805, acum: 42231, pct: 82 },
      { dia: "L 08/06", aplicados: 1698, acum: 43929, pct: 86 },
      { dia: "M 09/06", aplicados: 2275, acum: 46204, pct: 90 },
      { dia: "X 10/06", aplicados: 1250, acum: 47454, pct: 92 },
      { dia: "J 11/06", aplicados: 961,  acum: 48415, pct: 94 },
      { dia: "V 12/06", aplicados: 10,   acum: 48425, pct: 94 }, // parcial al corte
    ],
    // Cobertura diaria 11/06
    diaCobPct: 92.32,
    diaAplicados: 961,
    diaProgramados: 1041,
    diaAusentes: 19,
    diaNoAplicados: 15,
    diaReprogramados: 18,
    diaLabsTotal: 83,            // sesiones programadas del día (en 39 laboratorios)
    diaLabsInicio: 81,
    diaLabsInicioPct: 97.59,
    diaSesiones: [
      { sesion: "S1", total: 513, aplicado: 481, pct: 93.76 },
      { sesion: "S2", total: 482, aplicado: 446, pct: 92.53 },
      { sesion: "S3", total: 36,  aplicado: 25,  pct: 69.44 },
      { sesion: "S4", total: 10,  aplicado: 9,   pct: 90.00 },
    ],
    diaEstProgramados: 25673,
    diaEstAplicados:   23767,  diaEstAplicadosPct: 92.58,
    diaEstParcial: 864,        diaEstParcialPct: 3.37,
    diaEstAusentes: 271,
    diaEstReprogramados: 102,  diaEstReprogramadosPct: 0.40,
    diaEstPorAplicar: 465,     diaEstPorAplicarPct: 1.81,
    diaEstPie: [
      { name: "Aplicado",        value: 23767, pct: "92,58%", color: "#1a56a0" },
      { name: "Parc. aplicado",  value: 864,   pct: "3,37%",  color: "#f0a500" },
      { name: "Reprogramado",    value: 102,   pct: "0,40%",  color: "#8e44ad" },
      { name: "Ausente",         value: 271,   pct: "1,06%",  color: "#e07b3a" },
      { name: "Por aplicar",     value: 465,   pct: "1,81%",  color: "#c8d6e5" },
    ],
    diaAusentismoObs: [
      { motivo: "Enfermedad",          n: 10 },
      { motivo: "Ausente",             n: 6  },
      { motivo: "Calamidad doméstica", n: 3  },
    ],
    diaNoAplicadosObs: [
      { obs: "Estudiante NEE",        n: 6, pct: "40,0%" },
      { obs: "Retirado",              n: 6, pct: "40,0%" },
      { obs: "Sin permiso de padres", n: 2, pct: "13,3%" },
      { obs: "No pertenece a la IE",  n: 1, pct: "6,7%"  },
    ],
    diaReprogramadosObs: [
      { obs: "Cambio de fecha de aplicación", n: 18, pct: "100%" },
    ],
    diaNoInicio: "Falla eléctrica (2)",
    diaNoInicioN: 2,
    diaNotaSesion: "18 reprogramados por cambio de fecha; 2 sesiones sin iniciar de 83 por falla eléctrica (97,59% ejecutadas). En auditoría del día: 28 estudiantes",
  },

  /* ─────────────────────────────────────────────────────
     12/06  — corte completo · ÚLTIMO DÍA de aplicación
     (el reporte ya no registra estado "En auditoría")
  ───────────────────────────────────────────────────── */
  "12/06": {
    corte: "12 de junio de 2026",
    semana: "Semana 4",
    soloDialy: false,
    // Evaluaciones acumuladas
    evalProgramadas: 51346,
    evalAplicadas:   48967,   evalAplicadasPct: 95.37,
    evalReprogramadas: 191,   evalReprogramadasPct: 0.37,
    evalAusentes: 846,        evalAusentesPct: 1.65,
    evalNoAplicado: 399,
    evalEnAuditoria: 0,
    evalPorAplicar: 943,      evalPorAplicarPct: 1.84,
    // Estudiantes acumulados
    estProgramados: 25673,
    estAplicados:   24284,    estAplicadosPct: 94.59,
    estParcial: 399,          estParcialPct: 1.55,
    estAusentes: 268,
    estReprogramados: 84,     estReprogramadosPct: 0.33,
    estEnAuditoria: 0,
    estPorAplicar: 460,       estPorAplicarPct: 1.79,
    globalPie: [
      { name: "Aplicado",     value: 48967, pct: "95,37%", color: C.aplicado     },
      { name: "Reprogramado", value: 191,   pct: "0,37%",  color: C.reprogramado },
      { name: "Ausente",      value: 846,   pct: "1,65%",  color: C.ausente      },
      { name: "No aplicado",  value: 399,   pct: "0,78%",  color: C.noAplicado   },
      { name: "Por aplicar",  value: 943,   pct: "1,84%",  color: C.porAplicar   },
    ],
    // Subniveles
    subniveles: [
      { nivel: "Bachillerato", aplicado: 12091, total: 12480, pct: 96.88 },
      { nivel: "Media",        aplicado: 12374, total: 12902, pct: 95.91 },
      { nivel: "Superior",     aplicado: 12651, total: 13274, pct: 95.31 },
      { nivel: "Elemental",    aplicado: 11851, total: 12690, pct: 93.39 },
    ],
    // Sostenimiento
    sostenimiento: [
      { tipo: "Municipal",     pct: 98.07, aplicado: 9242,  total: 9424  },
      { tipo: "Fiscomisional", pct: 97.34, aplicado: 10937, total: 11236 },
      { tipo: "Fiscal",        pct: 94.88, aplicado: 16520, total: 17412 },
      { tipo: "Particular",    pct: 92.42, aplicado: 12268, total: 13274 },
    ],
    // Área
    areaUrbana: { aplicado: 31362, total: 32716, pct: 95.86 },
    areaRural:  { aplicado: 17605, total: 18630, pct: 94.50 },
    // Provincias
    provincias: [
      { provincia: "Bolívar",      pct: 99.72, aplicado: 353,   programado: 354   },
      { provincia: "Cañar",        pct: 99.42, aplicado: 1205,  programado: 1212  },
      { provincia: "Imbabura",     pct: 98.88, aplicado: 3174,  programado: 3210  },
      { provincia: "Morona S.",    pct: 98.68, aplicado: 896,   programado: 908   },
      { provincia: "Carchi",       pct: 97.83, aplicado: 1307,  programado: 1336  },
      { provincia: "Napo",         pct: 97.74, aplicado: 1126,  programado: 1152  },
      { provincia: "Pastaza",      pct: 97.48, aplicado: 620,   programado: 636   },
      { provincia: "Zamora Ch.",   pct: 96.47, aplicado: 355,   programado: 368   },
      { provincia: "Pichincha",    pct: 95.36, aplicado: 24758, programado: 25964 },
      { provincia: "Orellana",     pct: 95.16, aplicado: 1100,  programado: 1156  },
      { provincia: "Tungurahua",   pct: 94.56, aplicado: 3096,  programado: 3274  },
      { provincia: "Loja",         pct: 94.01, aplicado: 2542,  programado: 2704  },
      { provincia: "Azuay",        pct: 93.83, aplicado: 3862,  programado: 4116  },
      { provincia: "Sucumbíos",    pct: 93.58, aplicado: 1005,  programado: 1074  },
      { provincia: "Cotopaxi",     pct: 93.29, aplicado: 1961,  programado: 2102  },
      { provincia: "Chimborazo",   pct: 90.28, aplicado: 1607,  programado: 1780  },
    ],
    // Labs
    labTotal: 596,
    labAplicados: 575,    labAplicadosPct: 96.48,
    labParcial: 0,        labParcialPct: 0,
    labPorAplicar: 21,    labPorAplicarPct: 3.52,
    labBajo95: 86,
    labBajo90: 17,
    labsBajo95: [
      { prov: "Pichincha",        n: 43 }, { prov: "Azuay",           n: 10 },
      { prov: "Loja",             n: 5  }, { prov: "Napo",             n: 5  },
      { prov: "Orellana",         n: 4  }, { prov: "Sucumbíos",        n: 4  },
      { prov: "Carchi",           n: 3  }, { prov: "Chimborazo",       n: 3  },
      { prov: "Morona Santiago",  n: 3  }, { prov: "Zamora Chinchipe", n: 2  },
      { prov: "Cañar",            n: 1  }, { prov: "Imbabura",         n: 1  },
      { prov: "Pastaza",          n: 1  }, { prov: "Tungurahua",       n: 1  },
    ],
    avanceSemanal: [
      { dia: "L 18/05", aplicados: 165,  acum: 165,   pct: 0  },
      { dia: "M 19/05", aplicados: 3885, acum: 4050,  pct: 8  },
      { dia: "X 20/05", aplicados: 4045, acum: 8095,  pct: 16 },
      { dia: "J 21/05", aplicados: 3033, acum: 11128, pct: 22 },
      { dia: "V 22/05", aplicados: 2779, acum: 13907, pct: 27 },
      { dia: "M 26/05", aplicados: 3405, acum: 17312, pct: 34 },
      { dia: "X 27/05", aplicados: 4521, acum: 21833, pct: 43 },
      { dia: "J 28/05", aplicados: 4191, acum: 26024, pct: 51 },
      { dia: "V 29/05", aplicados: 2827, acum: 28851, pct: 56 },
      { dia: "L 01/06", aplicados: 1111, acum: 29962, pct: 58 },
      { dia: "M 02/06", aplicados: 4014, acum: 33976, pct: 66 },
      { dia: "X 03/06", aplicados: 3787, acum: 37763, pct: 74 },
      { dia: "J 04/06", aplicados: 2664, acum: 40427, pct: 79 },
      { dia: "V 05/06", aplicados: 1805, acum: 42232, pct: 82 },
      { dia: "L 08/06", aplicados: 1698, acum: 43930, pct: 86 },
      { dia: "M 09/06", aplicados: 2275, acum: 46205, pct: 90 },
      { dia: "X 10/06", aplicados: 1251, acum: 47456, pct: 92 },
      { dia: "J 11/06", aplicados: 973,  acum: 48429, pct: 94 },
      { dia: "V 12/06", aplicados: 538,  acum: 48967, pct: 95 },
    ],
    // Cobertura diaria 12/06
    diaCobPct: 96.07,
    diaAplicados: 538,
    diaProgramados: 560,
    diaAusentes: 13,
    diaNoAplicados: 9,
    diaReprogramados: 0,
    diaLabsTotal: 45,            // sesiones programadas del día (en 23 laboratorios)
    diaLabsInicio: 45,
    diaLabsInicioPct: 100.00,
    diaSesiones: [
      { sesion: "S1", total: 288, aplicado: 276, pct: 95.83 },
      { sesion: "S2", total: 248, aplicado: 239, pct: 96.37 },
      { sesion: "S3", total: 24,  aplicado: 23,  pct: 95.83 },
    ],
    diaEstProgramados: 25673,
    diaEstAplicados:   24284,  diaEstAplicadosPct: 94.59,
    diaEstParcial: 399,        diaEstParcialPct: 1.55,
    diaEstAusentes: 268,
    diaEstReprogramados: 84,   diaEstReprogramadosPct: 0.33,
    diaEstPorAplicar: 460,     diaEstPorAplicarPct: 1.79,
    diaEstPie: [
      { name: "Aplicado",        value: 24284, pct: "94,59%", color: "#1a56a0" },
      { name: "Parc. aplicado",  value: 399,   pct: "1,55%",  color: "#f0a500" },
      { name: "Reprogramado",    value: 84,    pct: "0,33%",  color: "#8e44ad" },
      { name: "Ausente",         value: 268,   pct: "1,04%",  color: "#e07b3a" },
      { name: "Por aplicar",     value: 460,   pct: "1,79%",  color: "#c8d6e5" },
    ],
    diaAusentismoObs: [
      { motivo: "Enfermedad",          n: 8 },
      { motivo: "Ausente",             n: 4 },
      { motivo: "Calamidad doméstica", n: 1 },
    ],
    diaNoAplicadosObs: [
      { obs: "Estudiante NEE", n: 6, pct: "66,7%" },
      { obs: "Retirado",       n: 3, pct: "33,3%" },
    ],
    diaReprogramadosObs: [],   // 12/06: no existieron reprogramaciones
    diaNoInicio: null,
    diaNoInicioN: 0,
    diaNotaSesion: "Último día de la semana regular (08–12/06): 45 de 45 sesiones ejecutadas (100%); sin reprogramaciones. La aplicación continúa con jornadas de recuperación",
  },

  /* ─────────────────────────────────────────────────────
     16/06  — corte completo · jornada de recuperación
     (Lun 15/06 y Mar 16/06 se suman a la curva acumulada)
  ───────────────────────────────────────────────────── */
  "16/06": {
    corte: "16 de junio de 2026",
    semana: "Recuperación",
    soloDialy: false,
    // Evaluaciones acumuladas
    evalProgramadas: 51346,
    evalAplicadas:   49883,   evalAplicadasPct: 97.15,
    evalReprogramadas: 17,    evalReprogramadasPct: 0.03,
    evalAusentes: 869,        evalAusentesPct: 1.69,
    evalNoAplicado: 401,
    evalEnAuditoria: 0,
    evalPorAplicar: 176,      evalPorAplicarPct: 0.34,
    // Estudiantes acumulados
    estProgramados: 25673,
    estAplicados:   24752,    estAplicadosPct: 96.41,
    estParcial: 379,          estParcialPct: 1.48,
    estAusentes: 275,
    estReprogramados: 0,      estReprogramadosPct: 0,
    estEnAuditoria: 0,
    estPorAplicar: 88,        estPorAplicarPct: 0.34,
    globalPie: [
      { name: "Aplicado",     value: 49883, pct: "97,15%", color: C.aplicado     },
      { name: "Ausente",      value: 869,   pct: "1,69%",  color: C.ausente      },
      { name: "No aplicado",  value: 401,   pct: "0,78%",  color: C.noAplicado   },
      { name: "Por aplicar",  value: 176,   pct: "0,34%",  color: C.porAplicar   },
      { name: "Reprogramado", value: 17,    pct: "0,03%",  color: C.reprogramado },
    ],
    // Subniveles
    subniveles: [
      { nivel: "Media",        aplicado: 12617, total: 12902, pct: 97.79 },
      { nivel: "Elemental",    aplicado: 12333, total: 12690, pct: 97.19 },
      { nivel: "Bachillerato", aplicado: 12112, total: 12480, pct: 97.05 },
      { nivel: "Superior",     aplicado: 12821, total: 13274, pct: 96.59 },
    ],
    // Sostenimiento
    sostenimiento: [
      { tipo: "Fiscomisional", pct: 98.26, aplicado: 11040, total: 11236 },
      { tipo: "Municipal",     pct: 98.08, aplicado: 9243,  total: 9424  },
      { tipo: "Fiscal",        pct: 96.67, aplicado: 16833, total: 17412 },
      { tipo: "Particular",    pct: 96.18, aplicado: 12767, total: 13274 },
    ],
    // Área
    areaUrbana: { aplicado: 31836, total: 32716, pct: 97.31 },
    areaRural:  { aplicado: 18047, total: 18630, pct: 96.87 },
    // Provincias
    provincias: [
      { provincia: "Bolívar",      pct: 99.72, aplicado: 353,   programado: 354   },
      { provincia: "Cañar",        pct: 99.42, aplicado: 1205,  programado: 1212  },
      { provincia: "Imbabura",     pct: 98.94, aplicado: 3176,  programado: 3210  },
      { provincia: "Morona S.",    pct: 98.68, aplicado: 896,   programado: 908   },
      { provincia: "Tungurahua",   pct: 98.38, aplicado: 3221,  programado: 3274  },
      { provincia: "Chimborazo",   pct: 97.98, aplicado: 1744,  programado: 1780  },
      { provincia: "Carchi",       pct: 97.83, aplicado: 1307,  programado: 1336  },
      { provincia: "Loja",         pct: 97.78, aplicado: 2644,  programado: 2704  },
      { provincia: "Napo",         pct: 97.74, aplicado: 1126,  programado: 1152  },
      { provincia: "Pastaza",      pct: 97.48, aplicado: 620,   programado: 636   },
      { provincia: "Pichincha",    pct: 97.27, aplicado: 25255, programado: 25964 },
      { provincia: "Zamora Ch.",   pct: 96.47, aplicado: 355,   programado: 368   },
      { provincia: "Cotopaxi",     pct: 95.81, aplicado: 2014,  programado: 2102  },
      { provincia: "Orellana",     pct: 95.16, aplicado: 1100,  programado: 1156  },
      { provincia: "Azuay",        pct: 93.83, aplicado: 3862,  programado: 4116  },
      { provincia: "Sucumbíos",    pct: 93.58, aplicado: 1005,  programado: 1074  },
    ],
    // Labs
    labTotal: 596,
    labAplicados: 593,    labAplicadosPct: 99.50,
    labParcial: 0,        labParcialPct: 0,
    labPorAplicar: 3,     labPorAplicarPct: 0.50,
    labBajo95: 89,
    labBajo90: 18,
    labsBajo95: [
      { prov: "Pichincha",        n: 44 }, { prov: "Azuay",           n: 10 },
      { prov: "Loja",             n: 5  }, { prov: "Napo",             n: 5  },
      { prov: "Orellana",         n: 4  }, { prov: "Sucumbíos",        n: 4  },
      { prov: "Carchi",           n: 3  }, { prov: "Chimborazo",       n: 3  },
      { prov: "Morona Santiago",  n: 3  }, { prov: "Tungurahua",       n: 3  },
      { prov: "Zamora Chinchipe", n: 2  }, { prov: "Cañar",            n: 1  },
      { prov: "Imbabura",         n: 1  }, { prov: "Pastaza",          n: 1  },
    ],
    avanceSemanal: [
      { dia: "L 18/05", aplicados: 165,  acum: 165,   pct: 0  },
      { dia: "M 19/05", aplicados: 3885, acum: 4050,  pct: 8  },
      { dia: "X 20/05", aplicados: 4045, acum: 8095,  pct: 16 },
      { dia: "J 21/05", aplicados: 3033, acum: 11128, pct: 22 },
      { dia: "V 22/05", aplicados: 2779, acum: 13907, pct: 27 },
      { dia: "M 26/05", aplicados: 3405, acum: 17312, pct: 34 },
      { dia: "X 27/05", aplicados: 4522, acum: 21834, pct: 43 },
      { dia: "J 28/05", aplicados: 4191, acum: 26025, pct: 51 },
      { dia: "V 29/05", aplicados: 2827, acum: 28852, pct: 56 },
      { dia: "L 01/06", aplicados: 1111, acum: 29963, pct: 58 },
      { dia: "M 02/06", aplicados: 4014, acum: 33977, pct: 66 },
      { dia: "X 03/06", aplicados: 3787, acum: 37764, pct: 74 },
      { dia: "J 04/06", aplicados: 2664, acum: 40428, pct: 79 },
      { dia: "V 05/06", aplicados: 1826, acum: 42254, pct: 82 },
      { dia: "L 08/06", aplicados: 1698, acum: 43952, pct: 86 },
      { dia: "M 09/06", aplicados: 2275, acum: 46227, pct: 90 },
      { dia: "X 10/06", aplicados: 1251, acum: 47478, pct: 92 },
      { dia: "J 11/06", aplicados: 974,  acum: 48452, pct: 94 },
      { dia: "V 12/06", aplicados: 538,  acum: 48990, pct: 95 },
      { dia: "L 15/06", aplicados: 469,  acum: 49459, pct: 96 },
      { dia: "M 16/06", aplicados: 424,  acum: 49883, pct: 97 },
    ],
    // Cobertura diaria 16/06
    diaCobPct: 93.39,
    diaAplicados: 424,
    diaProgramados: 454,
    diaAusentes: 12,
    diaNoAplicados: 1,
    diaReprogramados: 17,
    diaLabsTotal: 34,            // sesiones programadas del día (en 16 laboratorios)
    diaLabsInicio: 32,
    diaLabsInicioPct: 94.12,
    diaSesiones: [
      { sesion: "S1", total: 193, aplicado: 177, pct: 91.71 },
      { sesion: "S2", total: 204, aplicado: 190, pct: 93.14 },
      { sesion: "S3", total: 39,  aplicado: 39,  pct: 100.00 },
      { sesion: "S4", total: 18,  aplicado: 18,  pct: 100.00 },
    ],
    diaEstProgramados: 25673,
    diaEstAplicados:   24752,  diaEstAplicadosPct: 96.41,
    diaEstParcial: 379,        diaEstParcialPct: 1.48,
    diaEstAusentes: 275,
    diaEstReprogramados: 0,    diaEstReprogramadosPct: 0,
    diaEstPorAplicar: 88,      diaEstPorAplicarPct: 0.34,
    diaEstPie: [
      { name: "Aplicado",        value: 24752, pct: "96,41%", color: "#1a56a0" },
      { name: "Parc. aplicado",  value: 379,   pct: "1,48%",  color: "#f0a500" },
      { name: "Ausente",         value: 275,   pct: "1,07%",  color: "#e07b3a" },
      { name: "No aplicado",     value: 179,   pct: "0,70%",  color: "#b0bec5" },
      { name: "Por aplicar",     value: 88,    pct: "0,34%",  color: "#c8d6e5" },
    ],
    diaAusentismoObs: [
      { motivo: "Calamidad doméstica", n: 3 },
      { motivo: "Enfermedad",          n: 3 },
      { motivo: "Ausente",             n: 2 },
      { motivo: "Deportista",          n: 2 },
      { motivo: "Fuera del país",      n: 2 },
    ],
    diaNoAplicadosObs: [
      { obs: "Estudiante NEE", n: 1, pct: "100%" },
    ],
    diaReprogramadosObs: [
      { obs: "Cambio de fecha de aplicación", n: 17, pct: "100%" },
    ],
    diaNoInicio: "Sin técnico aplicador (2)",
    diaNoInicioN: 2,
    diaNotaSesion: "Jornada de recuperación: 17 reprogramados por cambio de fecha; 2 sesiones sin iniciar de 34 por falta de técnico aplicador (94,12% ejecutadas)",
  },

  /* ─────────────────────────────────────────────────────
     19/06  — CIERRE PRELIMINAR del proceso
     · Estado global resuelto (solo Aplicado/Ausente/No aplicado)
     · Secciones de sesión/ausentismo ahora CONSOLIDADAS
     · Incluye módulo nuevo: Factores Asociados (54.713 registros)
  ───────────────────────────────────────────────────── */
  "19/06": {
    corte: "19 de junio de 2026",
    semana: "Cierre preliminar",
    soloDialy: false,
    cierre: true,
    // Evaluaciones acumuladas (cierre)
    evalProgramadas: 51346,
    evalAplicadas:   50071,   evalAplicadasPct: 97.52,
    evalReprogramadas: 0,     evalReprogramadasPct: 0,
    evalAusentes: 874,        evalAusentesPct: 1.70,
    evalNoAplicado: 401,
    evalEnAuditoria: 0,
    evalPorAplicar: 0,        evalPorAplicarPct: 0,
    // Estudiantes acumulados (cierre)
    estProgramados: 25673,
    estAplicados:   24853,    estAplicadosPct: 96.81,
    estParcial: 365,          estParcialPct: 1.42,
    estAusentes: 276,
    estReprogramados: 0,      estReprogramadosPct: 0,
    estEnAuditoria: 0,
    estPorAplicar: 0,         estPorAplicarPct: 0,
    globalPie: [
      { name: "Aplicado",    value: 50071, pct: "97,52%", color: C.aplicado   },
      { name: "Ausente",     value: 874,   pct: "1,70%",  color: C.ausente    },
      { name: "No aplicado", value: 401,   pct: "0,78%",  color: C.noAplicado },
    ],
    // Subniveles
    subniveles: [
      { nivel: "Media",        aplicado: 12670, total: 12902, pct: 98.20 },
      { nivel: "Elemental",    aplicado: 12403, total: 12690, pct: 97.74 },
      { nivel: "Bachillerato", aplicado: 12177, total: 12480, pct: 97.57 },
      { nivel: "Superior",     aplicado: 12821, total: 13274, pct: 96.59 },
    ],
    // Sostenimiento
    sostenimiento: [
      { tipo: "Fiscomisional", pct: 98.26, aplicado: 11040, total: 11236 },
      { tipo: "Municipal",     pct: 98.08, aplicado: 9243,  total: 9424  },
      { tipo: "Particular",    pct: 97.20, aplicado: 12902, total: 13274 },
      { tipo: "Fiscal",        pct: 96.98, aplicado: 16886, total: 17412 },
    ],
    // Área
    areaUrbana: { aplicado: 31971, total: 32716, pct: 97.72 },
    areaRural:  { aplicado: 18100, total: 18630, pct: 97.16 },
    // Provincias
    provincias: [
      { provincia: "Bolívar",      pct: 99.72, aplicado: 353,   programado: 354   },
      { provincia: "Cañar",        pct: 99.42, aplicado: 1205,  programado: 1212  },
      { provincia: "Imbabura",     pct: 98.94, aplicado: 3176,  programado: 3210  },
      { provincia: "Morona S.",    pct: 98.68, aplicado: 896,   programado: 908   },
      { provincia: "Tungurahua",   pct: 98.38, aplicado: 3221,  programado: 3274  },
      { provincia: "Cotopaxi",     pct: 98.33, aplicado: 2067,  programado: 2102  },
      { provincia: "Chimborazo",   pct: 97.98, aplicado: 1744,  programado: 1780  },
      { provincia: "Carchi",       pct: 97.83, aplicado: 1307,  programado: 1336  },
      { provincia: "Loja",         pct: 97.78, aplicado: 2644,  programado: 2704  },
      { provincia: "Napo",         pct: 97.74, aplicado: 1126,  programado: 1152  },
      { provincia: "Pastaza",      pct: 97.48, aplicado: 620,   programado: 636   },
      { provincia: "Pichincha",    pct: 97.27, aplicado: 25255, programado: 25964 },
      { provincia: "Azuay",        pct: 97.11, aplicado: 3997,  programado: 4116  },
      { provincia: "Zamora Ch.",   pct: 96.47, aplicado: 355,   programado: 368   },
      { provincia: "Orellana",     pct: 95.16, aplicado: 1100,  programado: 1156  },
      { provincia: "Sucumbíos",    pct: 93.58, aplicado: 1005,  programado: 1074  },
    ],
    // Labs (100% aplicados)
    labTotal: 596,
    labAplicados: 596,    labAplicadosPct: 100.00,
    labParcial: 0,        labParcialPct: 0,
    labPorAplicar: 0,     labPorAplicarPct: 0,
    labBajo95: 90,
    labBajo90: 18,
    labsBajo95: [
      { prov: "Pichincha",        n: 44 }, { prov: "Azuay",           n: 11 },
      { prov: "Loja",             n: 5  }, { prov: "Napo",             n: 5  },
      { prov: "Orellana",         n: 4  }, { prov: "Sucumbíos",        n: 4  },
      { prov: "Carchi",           n: 3  }, { prov: "Chimborazo",       n: 3  },
      { prov: "Morona Santiago",  n: 3  }, { prov: "Tungurahua",       n: 3  },
      { prov: "Zamora Chinchipe", n: 2  }, { prov: "Cañar",            n: 1  },
      { prov: "Imbabura",         n: 1  }, { prov: "Pastaza",          n: 1  },
    ],
    avanceSemanal: [
      { dia: "L 18/05", aplicados: 165,  acum: 165,   pct: 0  },
      { dia: "M 19/05", aplicados: 3885, acum: 4050,  pct: 8  },
      { dia: "X 20/05", aplicados: 4045, acum: 8095,  pct: 16 },
      { dia: "J 21/05", aplicados: 3033, acum: 11128, pct: 22 },
      { dia: "V 22/05", aplicados: 2779, acum: 13907, pct: 27 },
      { dia: "M 26/05", aplicados: 3405, acum: 17312, pct: 34 },
      { dia: "X 27/05", aplicados: 4522, acum: 21834, pct: 43 },
      { dia: "J 28/05", aplicados: 4191, acum: 26025, pct: 51 },
      { dia: "V 29/05", aplicados: 2827, acum: 28852, pct: 56 },
      { dia: "L 01/06", aplicados: 1111, acum: 29963, pct: 58 },
      { dia: "M 02/06", aplicados: 4014, acum: 33977, pct: 66 },
      { dia: "X 03/06", aplicados: 3787, acum: 37764, pct: 74 },
      { dia: "J 04/06", aplicados: 2664, acum: 40428, pct: 79 },
      { dia: "V 05/06", aplicados: 1826, acum: 42254, pct: 82 },
      { dia: "L 08/06", aplicados: 1698, acum: 43952, pct: 86 },
      { dia: "M 09/06", aplicados: 2275, acum: 46227, pct: 90 },
      { dia: "X 10/06", aplicados: 1251, acum: 47478, pct: 92 },
      { dia: "J 11/06", aplicados: 974,  acum: 48452, pct: 94 },
      { dia: "V 12/06", aplicados: 538,  acum: 48990, pct: 95 },
      { dia: "L 15/06", aplicados: 469,  acum: 49459, pct: 96 },
      { dia: "M 16/06", aplicados: 441,  acum: 49900, pct: 97 },
      { dia: "X 17/06", aplicados: 18,   acum: 49918, pct: 97 },
      { dia: "J 18/06", aplicados: 87,   acum: 50005, pct: 97 },
      { dia: "V 19/06", aplicados: 66,   acum: 50071, pct: 98 },
    ],
    // "Diario" en este corte = CONSOLIDADO de cierre (secciones 6–8 del reporte)
    diaCobPct: 97.52,
    diaAplicados: 50071,
    diaProgramados: 51346,
    diaAusentes: 874,
    diaNoAplicados: 401,
    diaReprogramados: 0,
    diaLabsTotal: 3708,         // sesiones totales del proceso (en 596 laboratorios)
    diaLabsInicio: 3702,
    diaLabsInicioPct: 99.84,
    diaSesiones: [
      { sesion: "S1", total: 23161, aplicado: 22622, pct: 97.67 },
      { sesion: "S2", total: 21747, aplicado: 21217, pct: 97.56 },
      { sesion: "S3", total: 3799,  aplicado: 3669,  pct: 96.58 },
      { sesion: "S4", total: 2639,  aplicado: 2563,  pct: 97.12 },
    ],
    diaEstProgramados: 25673,
    diaEstAplicados:   24853,  diaEstAplicadosPct: 96.81,
    diaEstParcial: 365,        diaEstParcialPct: 1.42,
    diaEstAusentes: 276,
    diaEstReprogramados: 0,    diaEstReprogramadosPct: 0,
    diaEstPorAplicar: 0,       diaEstPorAplicarPct: 0,
    diaEstPie: [
      { name: "Aplicado",       value: 24853, pct: "96,81%", color: "#1a56a0" },
      { name: "Parc. aplicado", value: 365,   pct: "1,42%",  color: "#f0a500" },
      { name: "Ausente",        value: 276,   pct: "1,08%",  color: "#e07b3a" },
      { name: "No aplicado",    value: 179,   pct: "0,70%",  color: "#b0bec5" },
    ],
    diaAusentismoObs: [
      { motivo: "Enfermedad",            n: 334 },
      { motivo: "Ausente",               n: 241 },
      { motivo: "Calamidad doméstica",   n: 100 },
      { motivo: "Activ. propias IE",     n: 76  },
      { motivo: "Hospitalizado",         n: 43  },
      { motivo: "Fuera del país",        n: 39  },
      { motivo: "Maternidad",            n: 21  },
      { motivo: "Deportista",            n: 18  },
      { motivo: "Sistema de protección", n: 2   },
    ],
    diaNoAplicadosObs: [
      { obs: "Retirado",                   n: 234, pct: "58,4%" },
      { obs: "Estudiante NEE",             n: 71,  pct: "17,7%" },
      { obs: "No pertenece a la IE",       n: 38,  pct: "9,5%"  },
      { obs: "Sin aplicador/falla eléct.", n: 35,  pct: "8,7%"  },
      { obs: "Sin permiso de padres",      n: 21,  pct: "5,2%"  },
      { obs: "No pertenece al grado",      n: 2,   pct: "0,5%"  },
    ],
    diaReprogramadosObs: [],
    diaNoInicio: "Sin sustentantes (4) / Falla eléctrica (2)",
    diaNoInicioN: 6,
    diaNotaSesion: "Consolidado de cierre: 3.702 de 3.708 sesiones ejecutadas (99,84%) en 596 laboratorios; 6 sin iniciar (sin sustentantes/falla eléctrica)",
    // ── Módulo Factores Asociados (cuestionario por actor) ──
    factores: {
      programados: 54713,
      finalizado: 53756,  finalizadoPct: 98.25,
      enProceso: 36,      enProcesoPct: 0.07,
      noIniciado: 921,    noIniciadoPct: 1.68,
      globalPie: [
        { name: "Finalizado",  value: 53756, pct: "98,25%", color: C.aplicado   },
        { name: "En proceso",  value: 36,    pct: "0,07%",  color: C.amarillo   },
        { name: "No iniciado", value: 921,   pct: "1,68%",  color: C.noAplicado },
      ],
      actores: [
        { actor: "Rector",       prog: 582,   fin: 581,   pct: 99.83 },
        { actor: "Docente",      prog: 2785,  fin: 2774,  pct: 99.61 },
        { actor: "Estudiante",   prog: 25673, fin: 25341, pct: 98.71 },
        { actor: "Representante",prog: 25673, fin: 25060, pct: 97.61 },
      ],
      sostenimiento: [
        { tipo: "Fiscomisional", prog: 11976, fin: 11917, pct: 99.51 },
        { tipo: "Fiscal",        prog: 18783, fin: 18516, pct: 98.58 },
        { tipo: "Municipal",     prog: 9775,  fin: 9618,  pct: 98.39 },
        { tipo: "Particular",    prog: 14179, fin: 13705, pct: 96.66 },
      ],
      areaUrbano: { fin: 34302, prog: 34828, pct: 98.49 },
      areaRural:  { fin: 19454, prog: 19885, pct: 97.83 },
      provincias: [
        { provincia: "Bolívar",      prog: 375,   fin: 375,   pct: 100.00 },
        { provincia: "Loja",         prog: 2879,  fin: 2877,  pct: 99.93  },
        { provincia: "Napo",         prog: 1231,  fin: 1229,  pct: 99.84  },
        { provincia: "Cañar",        prog: 1283,  fin: 1279,  pct: 99.69  },
        { provincia: "Imbabura",     prog: 3385,  fin: 3372,  pct: 99.62  },
        { provincia: "Zamora Ch.",   prog: 407,   fin: 405,   pct: 99.51  },
        { provincia: "Tungurahua",   prog: 3494,  fin: 3475,  pct: 99.46  },
        { provincia: "Morona S.",    prog: 965,   fin: 959,   pct: 99.38  },
        { provincia: "Cotopaxi",     prog: 2251,  fin: 2236,  pct: 99.33  },
        { provincia: "Chimborazo",   prog: 1908,  fin: 1895,  pct: 99.32  },
        { provincia: "Carchi",       prog: 1417,  fin: 1407,  pct: 99.29  },
        { provincia: "Pastaza",      prog: 684,   fin: 678,   pct: 99.12  },
        { provincia: "Orellana",     prog: 1235,  fin: 1213,  pct: 98.22  },
        { provincia: "Azuay",        prog: 4454,  fin: 4371,  pct: 98.14  },
        { provincia: "Sucumbíos",    prog: 1128,  fin: 1104,  pct: 97.87  },
        { provincia: "Pichincha",    prog: 27617, fin: 26881, pct: 97.33  },
      ],
    },
  },
};

/* Orden cronológico de fechas disponibles */
const FECHAS_ORDEN = ["19/05", "20/05", "21/05", "22/05", "26/05", "27/05", "28/05", "29/05", "01/06", "02/06", "03/06", "04/06", "05/06", "08/06", "09/06", "10/06", "11/06", "12/06", "16/06", "19/06"]; // agregar nuevas fechas aquí

/* ══════════════════════════════════════════════════════
   COMPONENTES
══════════════════════════════════════════════════════ */
const KPI = ({ icon, label, value, sub, color, highlight }) => (
  <div style={{
    background: highlight ? color + "10" : C.card,
    border: `1.5px solid ${highlight ? color + "60" : C.border}`,
    borderRadius: 12, padding: "14px 16px",
    boxShadow: "0 2px 10px rgba(26,86,160,.07)",
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <span style={{ fontFamily: FONT_COND, fontSize: 10, fontWeight: 700,
        letterSpacing: 1.1, color: C.muted, textTransform: "uppercase" }}>{label}</span>
    </div>
    <div style={{ fontFamily: FONT_COND, fontSize: 30, fontWeight: 800,
      color: color || C.text, lineHeight: 1 }}>{value}</div>
    {sub && <div style={{ fontFamily: FONT_BODY, fontSize: 11,
      color: C.muted, marginTop: 3 }}>{sub}</div>}
  </div>
);

const PBar = ({ label, sub, pct, color, prev }) => {
  const delta = prev !== undefined ? (pct - prev).toFixed(2) : null;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600, color: C.text }}>{label}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {delta !== null && delta !== "0.00" && (
            <span style={{ fontSize: 11, color: parseFloat(delta) > 0 ? C.verde : C.rojo,
              fontWeight: 700 }}>{parseFloat(delta) > 0 ? `▲${delta}pp` : `▼${Math.abs(delta)}pp`}</span>
          )}
          <span style={{ fontFamily: FONT_COND, fontSize: 14, fontWeight: 700,
            color: color || C.aplicado }}>{pct}%</span>
        </span>
      </div>
      {sub && <div style={{ fontFamily: FONT_BODY, fontSize: 11, color: C.muted, marginBottom: 3 }}>{sub}</div>}
      <div style={{ background: C.bg, borderRadius: 6, height: 10,
        border: `1px solid ${C.border}`, overflow: "hidden" }}>
        <div style={{ width: `${Math.min(pct, 100)}%`, background: color || C.aplicado,
          height: "100%", borderRadius: 6, transition: "width .6s ease" }} />
      </div>
    </div>
  );
};

const ST = ({ children }) => (
  <div style={{ fontFamily: FONT_COND, fontSize: 12, fontWeight: 700, letterSpacing: 1.3,
    color: C.muted, textTransform: "uppercase", marginBottom: 12 }}>{children}</div>
);

const Card = ({ children, style }) => (
  <div style={{ background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 14,
    padding: "16px 16px", boxShadow: "0 2px 10px rgba(26,86,160,.07)", ...style }}>
    {children}
  </div>
);

const CTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: `1px solid ${C.border}`,
      borderRadius: 8, padding: "8px 12px", fontFamily: FONT_BODY, fontSize: 13 }}>
      <div style={{ fontWeight: 700, color: C.text, marginBottom: 3 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || C.aplicado }}>
          {p.name}: <strong>{typeof p.value === "number"
            ? p.value.toLocaleString("es-EC") : p.value}</strong>
        </div>
      ))}
    </div>
  );
};

/* Pie donut con leyenda en cuadrícula */
const PieDonut = ({ data, size = 150 }) => {
  const total = data.reduce((s, d) => s + d.value, 0);
  let startAngle = -Math.PI / 2;
  const cx = size / 2, cy = size / 2;
  const R = size * 0.38, r = size * 0.22;

  const slices = data.map(d => {
    const angle = (d.value / total) * 2 * Math.PI;
    const end = startAngle + angle;
    const x1 = cx + R * Math.cos(startAngle), y1 = cy + R * Math.sin(startAngle);
    const x2 = cx + R * Math.cos(end),       y2 = cy + R * Math.sin(end);
    const ix1 = cx + r * Math.cos(startAngle), iy1 = cy + r * Math.sin(startAngle);
    const ix2 = cx + r * Math.cos(end),        iy2 = cy + r * Math.sin(end);
    const large = angle > Math.PI ? 1 : 0;
    const path = [
      `M ${x1} ${y1}`, `A ${R} ${R} 0 ${large} 1 ${x2} ${y2}`,
      `L ${ix2} ${iy2}`, `A ${r} ${r} 0 ${large} 0 ${ix1} ${iy1}`, "Z"
    ].join(" ");
    startAngle = end;
    return { ...d, path };
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <svg width={size} height={size} style={{ display: "block", margin: "0 auto" }}>
        {slices.map((s, i) => <path key={i} d={s.path} fill={s.color} />)}
      </svg>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 10px" }}>
        {data.map(d => (
          <div key={d.name} style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
            <div style={{ width: 11, height: 11, borderRadius: 3,
              background: d.color, flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 11, color: C.muted, lineHeight: 1.2 }}>{d.name}</div>
              <div style={{ fontFamily: FONT_COND, fontSize: 17, fontWeight: 800,
                color: d.color, lineHeight: 1 }}>{d.pct}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   TABS PRINCIPALES
══════════════════════════════════════════════════════ */
const TABS = [
  { id: "general",     label: "General",      acum: true  },
  { id: "territorial", label: "Territorial",  acum: true  },
  { id: "muestra",     label: "Laboratorio",  acum: true  },
  { id: "factores",    label: "Factores",     acum: true, soloSi: "factores" },
  { id: "diario",      label: "Diario",       acum: false },
];

/* ══════════════════════════════════════════════════════
   APP
══════════════════════════════════════════════════════ */
export default function SestDashboard() {
  /* fechaActual = último corte con datos acumulados completos */
  const fechaActual = [...FECHAS_ORDEN].reverse().find(f => !DATOS[f].soloDialy) || FECHAS_ORDEN[FECHAS_ORDEN.length - 1];
  const [tab, setTab] = useState("general");
  const [fechaDiario, setFechaDiario] = useState(fechaActual);

  /* Para la pestaña General/Territorial/Muestra siempre
     se usan los datos del último corte disponible */
  const d = DATOS[fechaActual];

  /* Para la pestaña Diario se usa la fecha seleccionada */
  const dd = DATOS[fechaDiario];

  /* Datos del corte anterior (para deltas) */
  const prevKey = FECHAS_ORDEN[FECHAS_ORDEN.indexOf(fechaActual) - 1];
  const prev = prevKey ? DATOS[prevKey] : null;

  /* Pestañas visibles: las condicionadas (soloSi) solo si el corte las trae */
  const visibleTabs = TABS.filter(t => !t.soloSi || d[t.soloSi]);

  return (
    <div style={{ fontFamily: FONT_BODY, background: C.bg, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-thumb { background: #b0bfd4; border-radius: 3px; }

        .kpi5 { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; margin-bottom:14px; }
        @media(min-width:540px){ .kpi5 { grid-template-columns:repeat(3,1fr); } }
        @media(min-width:860px){ .kpi5 { grid-template-columns:repeat(5,1fr); } }

        .kpi4 { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; margin-bottom:14px; }
        @media(min-width:860px){ .kpi4 { grid-template-columns:repeat(4,1fr); } }

        .kpi3 { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; margin-bottom:14px; }
        @media(min-width:600px){ .kpi3 { grid-template-columns:repeat(3,1fr); } }

        .two  { display:grid; grid-template-columns:1fr; gap:12px; margin-bottom:12px; }
        @media(min-width:700px){ .two { grid-template-columns:1fr 1fr; } }

        .asym { display:grid; grid-template-columns:1fr; gap:12px; margin-bottom:12px; }
        @media(min-width:700px){ .asym { grid-template-columns:1.35fr 1fr; } }

        .wrap { padding:14px 12px; max-width:1280px; margin:0 auto; }
        @media(min-width:600px){ .wrap { padding:20px 22px; } }

        .tabs { display:flex; overflow-x:auto; -webkit-overflow-scrolling:touch;
          background:#fff; border-bottom:2px solid #dde5f0; scrollbar-width:none; }
        .tabs::-webkit-scrollbar { display:none; }

        .tbtn { padding:11px 18px; font-family:'Barlow Condensed',sans-serif;
          font-weight:700; font-size:14px; letter-spacing:1px; border:none;
          background:#fff; color:#5a6a8a; border-bottom:3px solid transparent;
          cursor:pointer; white-space:nowrap; flex-shrink:0; transition:all .2s; }
        .tbtn.act { background:#f0f4fa; color:#1a56a0; border-bottom-color:#1a56a0; }

        .hdr { display:flex; flex-direction:column; gap:10px; }
        @media(min-width:600px){ .hdr { flex-direction:row; align-items:center; justify-content:space-between; } }

        .ptable { width:100%; border-collapse:collapse; font-size:13px; }
        .ptable th { padding:7px 9px; font-family:'Barlow Condensed',sans-serif;
          font-weight:700; font-size:11px; letter-spacing:1px; color:#5a6a8a;
          text-transform:uppercase; border-bottom:2px solid #dde5f0;
          background:#f0f4fa; text-align:right; }
        .ptable th:first-child { text-align:left; }
        .ptable td { padding:5px 9px; text-align:right; border-bottom:1px solid #f0f4fa; color:#5a6a8a; }
        .ptable td:first-child { text-align:left; font-weight:600; color:#1a2340; }
        .ptable tr:hover td { background:#f7faff; }

        .date-tabs { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:14px; }
        .dtab { padding:6px 14px; border-radius:20px; border:1.5px solid #dde5f0;
          background:#fff; font-family:'Barlow Condensed',sans-serif;
          font-size:13px; font-weight:700; cursor:pointer; color:#5a6a8a;
          transition:all .2s; }
        .dtab.act { background:#1a56a0; color:#fff; border-color:#1a56a0; }
        .dtab.latest::after { content:'● NUEVO'; font-size:9px; margin-left:6px;
          color:#e07b3a; vertical-align:middle; }
      `}</style>

      {/* HEADER */}
      <div style={{ background: `linear-gradient(135deg,${C.headerFrom} 0%,${C.headerTo} 100%)`,
        padding: "16px 16px 12px", boxShadow: "0 4px 20px rgba(13,49,112,.2)" }}>
        <div className="hdr">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
              <span style={{ fontSize: 22 }}>📊</span>
              <span style={{ fontFamily: FONT_COND, fontSize: 22, fontWeight: 800,
                color: "#fff", letterSpacing: 1 }}>SEST 2025–2026</span>
            </div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 11, color: "#a8c8f0" }}>
              Cobertura Preliminar · Régimen Sierra-Amazonía · DACT-UAT
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <span style={{ background: "#ffffff22", border: "1px solid #ffffff44",
              borderRadius: 8, padding: "4px 12px", color: "#fff", fontSize: 12, fontWeight: 600 }}>
              🗓 Último corte: {d.corte}
            </span>
            <span style={{ color: "#7ab4e8", fontSize: 11 }}>{d.semana} de aplicación</span>
          </div>
        </div>
      </div>

      {/* TABS PRINCIPALES */}
      <div className="tabs">
        {visibleTabs.map(t => (
          <button key={t.id} className={`tbtn${tab === t.id ? " act" : ""}`}
            onClick={() => setTab(t.id)}
            style={{ display: "flex", alignItems: "center", gap: 5 }}>
            {t.label}
            {t.acum
              ? <span style={{
                  background: tab === t.id ? "#1a56a022" : "#1a56a015",
                  color: tab === t.id ? C.aplicado : C.muted,
                  border: `1px solid ${tab === t.id ? C.aplicado + "55" : C.border}`,
                  borderRadius: 10, padding: "1px 6px",
                  fontSize: 9, fontWeight: 700, letterSpacing: 0.5,
                  textTransform: "uppercase", lineHeight: 1.6,
                }}>ACUM</span>
              : <span style={{
                  background: tab === t.id ? "#e07b3a22" : "#e07b3a12",
                  color: tab === t.id ? C.ausente : C.muted,
                  border: `1px solid ${tab === t.id ? C.ausente + "55" : C.border}`,
                  borderRadius: 10, padding: "1px 6px",
                  fontSize: 9, fontWeight: 700, letterSpacing: 0.5,
                  textTransform: "uppercase", lineHeight: 1.6,
                }}>DÍA</span>
            }
          </button>
        ))}
      </div>

      <div className="wrap">

        {/* ════ GENERAL ════ */}
        {tab === "general" && (<>

          {/* Bloque evaluaciones */}
          <div style={{ fontFamily: FONT_COND, fontSize: 12, fontWeight: 700, letterSpacing: 1.2,
            color: C.muted, textTransform: "uppercase", marginBottom: 8, marginTop: 2 }}>
            Evaluaciones (base estructurada)
          </div>
          <div className="kpi5">
            <KPI icon="📋" label="Programadas"    value={d.evalProgramadas.toLocaleString("es-EC")} sub="total del proceso" />
            <KPI icon="✅" label="Aplicadas"      value={d.evalAplicadas.toLocaleString("es-EC")}   sub={`${d.evalAplicadasPct}% del total`}    color={C.aplicado}     highlight />
            <KPI icon="🔄" label="Reprogramadas"  value={d.evalReprogramadas.toLocaleString("es-EC")} sub={`${d.evalReprogramadasPct}% del total`} color={C.reprogramado} />
            <KPI icon="❌" label="Ausentes"       value={d.evalAusentes.toLocaleString("es-EC")}     sub={`${d.evalAusentesPct}% del total`}     color={C.ausente}      />
            <KPI icon="⏳" label="Por aplicar"    value={d.evalPorAplicar.toLocaleString("es-EC")}   sub={`${d.evalPorAplicarPct}% del total`}   color="#7a9cc0"        />
          </div>

          {/* Bloque estudiantes */}
          <div style={{ fontFamily: FONT_COND, fontSize: 12, fontWeight: 700, letterSpacing: 1.2,
            color: C.muted, textTransform: "uppercase", marginBottom: 8, marginTop: 4 }}>
            Estudiantes
          </div>
          <div className="kpi5">
            <KPI icon="🎓" label="Programados"    value={d.estProgramados.toLocaleString("es-EC")} sub="universo muestral" />
            <KPI icon="✅" label="Aplicados"      value={d.estAplicados.toLocaleString("es-EC")}   sub={`${d.estAplicadosPct}% del total`}    color={C.aplicado}     highlight />
            <KPI icon="📝" label="Parc. aplicados" value={d.estParcial.toLocaleString("es-EC")}   sub={`${d.estParcialPct}% del total`}      color={C.amarillo}     />
            <KPI icon="🔄" label="Reprogramados"  value={d.estReprogramados.toLocaleString("es-EC")} sub={`${d.estReprogramadosPct}% del total`} color={C.reprogramado} />
            <KPI icon="⏳" label="Por aplicar"    value={d.estPorAplicar.toLocaleString("es-EC")}   sub={`${d.estPorAplicarPct}% del total`} color="#7a9cc0" />
          </div>

          <div className="two">
            {/* Donut estado global */}
            <Card>
              <ST>Estado global — {d.evalProgramadas.toLocaleString("es-EC")} evaluaciones</ST>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <PieDonut data={d.globalPie} size={180} />
              </div>
            </Card>

            {/* Avance acumulado */}
            <Card>
              <ST>Avance acumulado por día</ST>
              {d.avanceSemanal && d.avanceSemanal.length > 0 ? (<>
              <ResponsiveContainer width="100%" height={210}>
                <ComposedChart data={d.avanceSemanal} barSize={22} margin={{ top: 6, right: 4, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                  <XAxis dataKey="dia" tick={{ fontSize: 9, fill: C.muted }}
                    interval={0} angle={-38} textAnchor="end" height={48} />
                  <YAxis yAxisId="left" tick={{ fontSize: 10, fill: C.muted }} width={38} />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 100]}
                    tickFormatter={v => `${v}%`} tick={{ fontSize: 10, fill: C.muted }} width={40} />
                  <Tooltip content={<CTip />} />
                  <Bar yAxisId="left" dataKey="aplicados" name="Aplicados" radius={[4, 4, 0, 0]}>
                    {d.avanceSemanal.map((_, i) => (
                      <Cell key={i} fill={i === d.avanceSemanal.length - 1 ? C.amarillo : C.aplicado} />
                    ))}
                  </Bar>
                  <Line yAxisId="right" type="monotone" dataKey="pct" name="% acumulado"
                    stroke={C.headerFrom} strokeWidth={2.5}
                    dot={{ r: 2.5, fill: C.headerFrom }} activeDot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", justifyContent: "center", gap: 18, marginTop: 2,
                fontFamily: FONT_BODY, fontSize: 11, color: C.muted }}>
                <span><span style={{ display: "inline-block", width: 10, height: 10,
                  background: C.aplicado, borderRadius: 2, marginRight: 5, verticalAlign: "middle" }} />Aplicados/día</span>
                <span><span style={{ display: "inline-block", width: 14, height: 3,
                  background: C.headerFrom, marginRight: 5, verticalAlign: "middle" }} />% acumulado</span>
              </div>
              </>) : (
                <div style={{ padding: "28px 12px", textAlign: "center", fontFamily: FONT_BODY,
                  fontSize: 13, color: C.muted }}>
                  Este corte no incluye serie de avance acumulado por día.
                </div>
              )}
            </Card>
          </div>

          <div className="asym">
            <Card>
              <ST>Cobertura por subnivel/nivel</ST>
              {d.subniveles.map((x, i) => (
                <PBar key={x.nivel} label={x.nivel}
                  sub={`${x.aplicado.toLocaleString("es-EC")} de ${x.total.toLocaleString("es-EC")}`}
                  pct={x.pct} color={C.aplicado}
                  prev={prev ? prev.subniveles.find(p => p.nivel === x.nivel)?.pct : undefined} />
              ))}
            </Card>
            <Card>
              <ST>Cobertura por sostenimiento</ST>
              {d.sostenimiento.map(x => (
                <PBar key={x.tipo} label={x.tipo}
                  sub={`${x.aplicado.toLocaleString("es-EC")} de ${x.total.toLocaleString("es-EC")}`}
                  pct={x.pct} color={x.tipo === "Municipal" || x.tipo === "Fiscomisional" ? C.verde : C.aplicado}
                  prev={prev ? prev.sostenimiento.find(p => p.tipo === x.tipo)?.pct : undefined} />
              ))}
              <div style={{ marginTop: 12, padding: "8px 12px",
                background: C.verdeLight, border: `1px solid ${C.verdeBorder}`, borderRadius: 8 }}>
                <span style={{ fontSize: 12, color: "#1a7a48", fontWeight: 600 }}>
                  Urbana: <strong>{d.areaUrbana.pct}%</strong>
                  &nbsp;|&nbsp; Rural: <strong>{d.areaRural.pct}%</strong>
                </span>
              </div>
            </Card>
          </div>
        </>)}

        {/* ════ TERRITORIAL ════ */}
        {tab === "territorial" && (<>
          <div className="kpi4">
            {[...d.provincias].sort((a, b) => b.pct - a.pct).slice(0, 3).map((p, i) => (
              <KPI key={p.provincia} icon={["🥇","🥈","🥉"][i]}
                label={`${i+1}er lugar`} value={p.provincia}
                sub={`${p.pct}% aplicado`} color={C.verde} />
            ))}
            {d.provincias.filter(p => p.pct === 0).length > 0 && (
              <KPI icon="⚠️" label="Sin avance"
                value={d.provincias.filter(p => p.pct === 0).map(p => p.provincia).join(" / ")}
                sub="0% — pendientes" color={C.rojo} />
            )}
          </div>

          <Card style={{ marginBottom: 12 }}>
            <ST>% Aplicado por provincia — corte {d.corte}</ST>
            <ResponsiveContainer width="100%" height={390}>
              <BarChart data={[...d.provincias].sort((a, b) => b.pct - a.pct)}
                layout="vertical" barSize={12}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
                <XAxis type="number" domain={[0, 60]} tickFormatter={v => `${v}%`}
                  tick={{ fontSize: 10, fill: C.muted }} />
                <YAxis type="category" dataKey="provincia" width={95}
                  tick={{ fontSize: 11, fill: C.text }} />
                <Tooltip content={<CTip />} />
                <Bar dataKey="pct" name="% Aplicado" radius={[0, 5, 5, 0]}>
                  {[...d.provincias].sort((a, b) => b.pct - a.pct).map((p, i) => (
                    <Cell key={i} fill={
                      p.pct === 0 ? "#dde5f0" :
                      p.pct >= 50 ? C.verde :
                      p.pct >= 35 ? C.aplicado : "#7ab4e8"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <ST>Tabla detallada por provincia</ST>
            <div style={{ overflowX: "auto" }}>
              <table className="ptable">
                <thead>
                  <tr>
                    <th>Provincia</th>
                    <th>Program.</th>
                    <th>Aplicado</th>
                    <th>Por aplicar</th>
                    {prev && <th>Ant.</th>}
                    <th>% Aplic.</th>
                  </tr>
                </thead>
                <tbody>
                  {[...d.provincias].sort((a, b) => b.pct - a.pct).map(p => {
                    const ant = prev?.provincias.find(x => x.provincia === p.provincia);
                    return (
                      <tr key={p.provincia}>
                        <td>{p.provincia}</td>
                        <td>{p.programado.toLocaleString("es-EC")}</td>
                        <td style={{ color: C.aplicado, fontWeight: 700 }}>
                          {p.aplicado.toLocaleString("es-EC")}</td>
                        <td>{(p.programado - p.aplicado).toLocaleString("es-EC")}</td>
                        {prev && <td style={{ color: C.muted }}>{ant?.pct ?? "—"}%</td>}
                        <td>
                          <span style={{ fontFamily: FONT_COND, fontSize: 14, fontWeight: 800,
                            color: p.pct === 0 ? C.rojo : p.pct >= 50 ? C.verde :
                              p.pct >= 35 ? C.aplicado : "#7a9cc0" }}>
                            {p.pct}%
                          </span>
                          {prev && ant && p.pct > ant.pct && (
                            <span style={{ fontSize: 10, color: C.verde, marginLeft: 4 }}>
                              ▲{(p.pct - ant.pct).toFixed(2)}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </>)}

        {/* ════ MUESTRA ════ */}
        {tab === "muestra" && (<>
          <div className="kpi4">
            <KPI icon="🏫" label="Labs totales"    value={d.labTotal}       sub={`${d.labAplicados} aplicados (${d.labAplicadosPct}%)`} color={C.aplicado} />
            <KPI icon="⚠️" label="Labs < 95%"      value={d.labBajo95}     sub="por debajo del umbral"   color={C.ausente}      />
            <KPI icon="🚨" label="Labs < 90%"      value={d.labBajo90}     sub="atención inmediata"      color={C.rojo}         />
            <KPI icon="🔄" label="Parc. aplicados" value={d.labParcial}    sub={`${d.labParcialPct}% de laboratorios`} color={C.reprogramado} />
          </div>

          <div className="two">
            <Card>
              <ST>Estado de laboratorios — {d.labTotal} total</ST>
              {[
                { name: "Aplicado",       value: d.labAplicados,  pct: d.labAplicadosPct,  color: C.aplicado     },
                { name: "Parc. aplicado", value: d.labParcial,    pct: d.labParcialPct,    color: C.reprogramado },
                { name: "Por aplicar",    value: d.labPorAplicar, pct: d.labPorAplicarPct, color: C.porAplicar   },
              ].map(x => (
                <PBar key={x.name} label={x.name}
                  sub={`${x.value} laboratorios`} pct={x.pct} color={x.color} />
              ))}
            </Card>
            <Card>
              <ST>Labs &lt;95% cobertura por provincia</ST>
              {d.labsBajo95.map(x => (
                <div key={x.prov} style={{ display: "flex", justifyContent: "space-between",
                  alignItems: "center", padding: "7px 0", borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ fontFamily: FONT_BODY, fontSize: 13,
                    fontWeight: 600, color: C.text }}>{x.prov}</span>
                  <span style={{ background: C.ausente + "22", color: C.ausente,
                    border: `1px solid ${C.ausente}44`, borderRadius: 20,
                    padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>
                    {x.n} lab{x.n > 1 ? "s" : ""}
                  </span>
                </div>
              ))}
              <div style={{ marginTop: 12, padding: "8px 12px",
                background: "#fff8f0", border: `1px solid #f0c080`, borderRadius: 8,
                fontSize: 11, color: "#8a4a00" }}>
                ⚠️ Coordinar con territorio: <strong>Pichincha, Azuay, Imbabura</strong>
              </div>
            </Card>
          </div>

          <div className="two">
            <Card>
              <ST>Por área geográfica</ST>
              <PBar label="Urbana" sub={`${d.areaUrbana.aplicado.toLocaleString("es-EC")} de ${d.areaUrbana.total.toLocaleString("es-EC")}`} pct={d.areaUrbana.pct} color={C.aplicado}
                prev={prev?.areaUrbana.pct} />
              <PBar label="Rural"  sub={`${d.areaRural.aplicado.toLocaleString("es-EC")} de ${d.areaRural.total.toLocaleString("es-EC")}`}   pct={d.areaRural.pct}  color="#7ab4e8"
                prev={prev?.areaRural.pct} />
              <div style={{ marginTop: 10, fontSize: 12, color: C.muted }}>
                Brecha urbano-rural: <strong style={{ color: C.text }}>
                  {(d.areaUrbana.pct - d.areaRural.pct).toFixed(2)} pp</strong>
              </div>
            </Card>
            <Card>
              <ST>Por día de aplicación</ST>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: C.text, marginBottom: 6 }}>
                  Día 1 — Matemática / CHSE
                </div>
                <PBar label="Aplicados" sub="primer instrumento" pct={39.47} color={C.aplicado} />
                <div style={{ fontSize: 11, color: C.muted }}>Reprogramados: <strong>1.052</strong> (4,10%)</div>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: C.text, marginBottom: 6 }}>
                  Día 2 — Lengua y Literatura / CC.SS.
                </div>
                <PBar label="Aplicados" sub="segundo instrumento" pct={27.42} color={C.aplicado} />
                <div style={{ fontSize: 11, color: C.muted }}>Reprogramados: <strong>1.008</strong> (3,93%)</div>
              </div>
            </Card>
          </div>
        </>)}


        {/* ════ FACTORES ASOCIADOS ════ */}
        {tab === "factores" && d.factores && (() => {
          const fa = d.factores;
          return (<>
            <div style={{ fontFamily: FONT_COND, fontSize: 12, fontWeight: 700, letterSpacing: 1.2,
              color: C.muted, textTransform: "uppercase", marginBottom: 8, marginTop: 2 }}>
              Factores asociados — cuestionario por actor
            </div>
            <div className="kpi4">
              <KPI icon="📋" label="Programados"  value={fa.programados.toLocaleString("es-EC")} sub="registros (actores)" />
              <KPI icon="✅" label="Finalizados"  value={fa.finalizado.toLocaleString("es-EC")}  sub={`${fa.finalizadoPct}% del total`}  color={C.aplicado} highlight />
              <KPI icon="⏳" label="En proceso"   value={fa.enProceso.toLocaleString("es-EC")}   sub={`${fa.enProcesoPct}% del total`}   color={C.amarillo} />
              <KPI icon="🚫" label="No iniciados" value={fa.noIniciado.toLocaleString("es-EC")}  sub={`${fa.noIniciadoPct}% del total`}  color={C.ausente}  />
            </div>

            <div className="two">
              <Card>
                <ST>Estado global — {fa.programados.toLocaleString("es-EC")} registros</ST>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <PieDonut data={fa.globalPie} size={180} />
                </div>
              </Card>
              <Card>
                <ST>Finalizados por actor</ST>
                {fa.actores.map(a => (
                  <PBar key={a.actor} label={a.actor}
                    sub={`${a.fin.toLocaleString("es-EC")} de ${a.prog.toLocaleString("es-EC")}`}
                    pct={a.pct} color={a.actor === "Rector" || a.actor === "Docente" ? C.verde : C.aplicado} />
                ))}
              </Card>
            </div>

            <div className="asym">
              <Card>
                <ST>% Finalizado por provincia</ST>
                <ResponsiveContainer width="100%" height={390}>
                  <BarChart data={[...fa.provincias].sort((a, b) => b.pct - a.pct)}
                    layout="vertical" barSize={12}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
                    <XAxis type="number" domain={[95, 100]} tickFormatter={v => `${v}%`}
                      tick={{ fontSize: 10, fill: C.muted }} />
                    <YAxis type="category" dataKey="provincia" width={95}
                      tick={{ fontSize: 11, fill: C.text }} />
                    <Tooltip content={<CTip />} />
                    <Bar dataKey="pct" name="% Finalizado" radius={[0, 4, 4, 0]}>
                      {[...fa.provincias].sort((a, b) => b.pct - a.pct).map((p, i) => (
                        <Cell key={i} fill={p.pct >= 99 ? C.verde : p.pct >= 98 ? C.aplicado : "#7a9cc0"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
              <Card>
                <ST>Por sostenimiento</ST>
                {fa.sostenimiento.map(x => (
                  <PBar key={x.tipo} label={x.tipo}
                    sub={`${x.fin.toLocaleString("es-EC")} de ${x.prog.toLocaleString("es-EC")}`}
                    pct={x.pct} color={x.tipo === "Fiscomisional" || x.tipo === "Municipal" ? C.verde : C.aplicado} />
                ))}
                <div style={{ marginTop: 12, padding: "8px 12px",
                  background: C.verdeLight, border: `1px solid ${C.verdeBorder}`, borderRadius: 8 }}>
                  <span style={{ fontSize: 12, color: "#1a7a48", fontWeight: 600 }}>
                    Urbano: <strong>{fa.areaUrbano.pct}%</strong>
                    &nbsp;|&nbsp; Rural: <strong>{fa.areaRural.pct}%</strong>
                  </span>
                </div>
              </Card>
            </div>
          </>);
        })()}


        {/* ════ DIARIO ════ — réplica exacta de la estructura de General */}
        {tab === "diario" && (<>

          {/* Selector de fecha */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: FONT_COND, fontSize: 11, fontWeight: 700,
              letterSpacing: 1.2, color: C.muted, textTransform: "uppercase",
              marginBottom: 8 }}>Seleccionar fecha</div>
            <div className="date-tabs">
              {[...FECHAS_ORDEN].reverse().map((f, i) => (
                <button key={f}
                  className={`dtab${fechaDiario === f ? " act" : ""}${i === 0 ? " latest" : ""}`}
                  onClick={() => setFechaDiario(f)}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Banner fecha */}
          <div style={{ background: `linear-gradient(135deg,${C.headerFrom} 0%,${C.headerTo} 100%)`,
            borderRadius: 10, padding: "10px 16px", marginBottom: 14,
            display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 16 }}>📅</span>
            <div>
              <div style={{ fontFamily: FONT_COND, fontSize: 16, fontWeight: 800, color: "#fff" }}>
                {dd.cierre ? "Consolidado de cierre" : "Cobertura"} — {dd.corte}
              </div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 11, color: "#a8c8f0" }}>
                {dd.cierre
                  ? "Cifras consolidadas del proceso · sesión y ausentismo acumulados"
                  : `${dd.semana} · Régimen Sierra-Amazonía`}
              </div>
            </div>
            {dd.cierre ? (
              <span style={{ background: C.verde, color: "#fff", borderRadius: 20,
                padding: "2px 10px", fontSize: 11, fontWeight: 700, marginLeft: "auto",
                whiteSpace: "nowrap" }}>CIERRE</span>
            ) : fechaDiario === fechaActual && (
              <span style={{ background: C.amarillo, color: "#fff", borderRadius: 20,
                padding: "2px 10px", fontSize: 11, fontWeight: 700, marginLeft: "auto",
                whiteSpace: "nowrap" }}>ÚLTIMO CORTE</span>
            )}
          </div>

          {/* ══ BLOQUE 1 — Evaluaciones — idéntico a General ══ */}
          <div style={{ fontFamily: FONT_COND, fontSize: 12, fontWeight: 700, letterSpacing: 1.2,
            color: C.muted, textTransform: "uppercase", marginBottom: 8, marginTop: 2 }}>
            Evaluaciones (base estructurada)
          </div>
          <div className="kpi5">
            <KPI icon="📋" label="Programadas"   value={dd.diaProgramados.toLocaleString("es-EC")}        sub="total del día" />
            <KPI icon="✅" label="Aplicadas"     value={dd.diaAplicados.toLocaleString("es-EC")}          sub={`${dd.diaCobPct}% del día`}              color={C.aplicado}    highlight />
            <KPI icon="🔄" label="Reprogramadas" value={dd.diaReprogramados.toLocaleString("es-EC")}      sub="pendientes reubicación"                  color={C.reprogramado} />
            <KPI icon="❌" label="Ausentes"      value={dd.diaAusentes.toLocaleString("es-EC")}           sub="no se presentaron"                       color={C.ausente}     />
            <KPI icon="🚫" label="No aplicados"  value={(dd.diaNoAplicados ?? 0).toLocaleString("es-EC")} sub="fuera de muestra"                        color={C.rojo}        />
          </div>

          {/* ══ BLOQUE 2 — Estudiantes — idéntico a General ══ */}
          <div style={{ fontFamily: FONT_COND, fontSize: 12, fontWeight: 700, letterSpacing: 1.2,
            color: C.muted, textTransform: "uppercase", marginBottom: 8, marginTop: 4 }}>
            Estudiantes
          </div>
          <div className="kpi5">
            <KPI icon="🎓" label="Programados"     value={dd.diaEstProgramados.toLocaleString("es-EC")}    sub="universo muestral" />
            <KPI icon="✅" label="Aplicados"       value={dd.diaEstAplicados.toLocaleString("es-EC")}      sub={`${dd.diaEstAplicadosPct}% del total`}    color={C.aplicado}    highlight />
            <KPI icon="📝" label="Parc. aplicados" value={dd.diaEstParcial.toLocaleString("es-EC")}        sub={`${dd.diaEstParcialPct}% del total`}       color={C.amarillo}    />
            <KPI icon="🔄" label="Reprogramados"   value={dd.diaEstReprogramados.toLocaleString("es-EC")}  sub={`${dd.diaEstReprogramadosPct}% del total`} color={C.reprogramado} />
            <KPI icon="⏳" label="Por aplicar"     value={dd.diaEstPorAplicar.toLocaleString("es-EC")}     sub={`${dd.diaEstPorAplicarPct}% del total`}   color="#7a9cc0"       />
          </div>

          {/* ══ BLOQUE 3 — Donut evaluaciones + Donut/sesiones ══
               Espejo de "Estado global + avance acumulado" */}
          <div className="two">
            <Card>
              <ST>{dd.cierre ? "Estado consolidado" : "Estado del día"} — {dd.diaProgramados.toLocaleString("es-EC")} evaluaciones</ST>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <PieDonut data={[
                  { name: "Aplicado",     value: dd.diaAplicados,
                    pct: `${dd.diaCobPct}%`, color: C.aplicado },
                  { name: "Reprogramado", value: dd.diaReprogramados,
                    pct: `${((dd.diaReprogramados/dd.diaProgramados)*100).toFixed(1)}%`, color: C.reprogramado },
                  { name: "Ausente",      value: dd.diaAusentes,
                    pct: `${((dd.diaAusentes/dd.diaProgramados)*100).toFixed(1)}%`, color: C.ausente },
                  { name: "No aplicado",  value: dd.diaNoAplicados||0,
                    pct: `${(((dd.diaNoAplicados||0)/dd.diaProgramados)*100).toFixed(1)}%`, color: C.noAplicado },
                ].filter(x => x.value > 0)} size={180} />
              </div>
            </Card>

            <Card>
              {dd.diaSesiones && dd.diaSesiones.length > 0 ? (<>
                <ST>Cobertura por sesión</ST>
                <ResponsiveContainer width="100%" height={190}>
                  <BarChart data={dd.diaSesiones} barSize={34}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                    <XAxis dataKey="sesion" tick={{ fontSize: 12, fill: C.muted }} />
                    <YAxis tick={{ fontSize: 10, fill: C.muted }} width={38} />
                    <Tooltip content={<CTip />} />
                    <Bar dataKey="aplicado" name="Aplicados" radius={[4, 4, 0, 0]}>
                      {dd.diaSesiones.map((s, i) => (
                        <Cell key={i} fill={s.pct < 92 ? C.ausente : C.aplicado} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", justifyContent: "space-around", marginTop: 4 }}>
                  {dd.diaSesiones.map(s => (
                    <div key={s.sesion} style={{ textAlign: "center" }}>
                      <div style={{ fontFamily: FONT_BODY, fontSize: 10, color: C.muted }}>{s.sesion}</div>
                      <div style={{ fontFamily: FONT_COND, fontSize: 14, fontWeight: 800,
                        color: s.pct < 92 ? C.ausente : C.verde }}>{s.pct}%</div>
                    </div>
                  ))}
                </div>
                {dd.diaLabsInicioPct && (
                  <div style={{ marginTop: 10, padding: "7px 10px",
                    background: C.verdeLight, border: `1px solid ${C.verdeBorder}`,
                    borderRadius: 8, fontSize: 12, color: "#1a7a48", fontWeight: 600 }}>
                    🔌 Inicio de sesión: <strong>{dd.diaLabsInicioPct}%</strong>
                    &nbsp;· {dd.diaLabsInicio} de {dd.diaLabsTotal}
                    {dd.diaNoInicioN > 0 && (
                      <span style={{ color: C.ausente, marginLeft: 6 }}>
                        · {dd.diaNoInicioN} sin iniciar: {dd.diaNoInicio}
                      </span>
                    )}
                  </div>
                )}
              </>) : (<>
                <ST>Avance del día</ST>
                <PBar label="Evaluaciones aplicadas"
                  sub={`${dd.diaAplicados.toLocaleString("es-EC")} de ${dd.diaProgramados.toLocaleString("es-EC")}`}
                  pct={dd.diaCobPct}
                  color={dd.diaCobPct >= 95 ? C.verde : dd.diaCobPct >= 90 ? C.aplicado : C.ausente} />
                <div style={{ marginTop: 10, padding: "10px 12px",
                  background: C.bg, border: `1px solid ${C.border}`,
                  borderRadius: 8, fontSize: 12, color: C.muted }}>
                  📋 {dd.diaNotaSesion}
                </div>
              </>)}
            </Card>
          </div>

          {/* ══ BLOQUE 4 — Donut estudiantes + motivos ══
               Espejo de "subniveles + sostenimiento/área" */}
          <div className="asym">
            <Card>
              <ST>Estado de estudiantes — {dd.diaEstProgramados.toLocaleString("es-EC")} en muestra</ST>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
                <PieDonut data={dd.diaEstPie} size={180} />
              </div>
              <ST>Motivos de ausentismo</ST>
              <ResponsiveContainer width="100%" height={Math.max(130, dd.diaAusentismoObs.length * 26)}>
                <BarChart data={dd.diaAusentismoObs} layout="vertical" barSize={12}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: C.muted }} />
                  <YAxis type="category" dataKey="motivo" width={100}
                    tick={{ fontSize: 11, fill: C.text }} />
                  <Tooltip content={<CTip />} />
                  <Bar dataKey="n" name="Estudiantes" radius={[0, 5, 5, 0]}>
                    {dd.diaAusentismoObs.map((_, i) => (
                      <Cell key={i} fill={i === 0 ? C.ausente : `${C.ausente}88`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <ST>No aplicados</ST>
              {dd.diaNoAplicadosObs.map(x => (
                <PBar key={x.obs} label={x.obs}
                  sub={`${x.n} estudiante${x.n !== 1 ? "s" : ""}`}
                  pct={parseFloat(x.pct)} color={C.rojo} />
              ))}

              <div style={{ marginTop: 16 }}>
                <ST>Reprogramados</ST>
                {dd.diaReprogramadosObs.map(x => (
                  <div key={x.obs} style={{ display: "flex", justifyContent: "space-between",
                    alignItems: "center", padding: "8px 0",
                    borderBottom: `1px solid ${C.border}` }}>
                    <span style={{ fontFamily: FONT_BODY, fontSize: 13,
                      fontWeight: 600, color: C.text }}>{x.obs}</span>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <span style={{ fontFamily: FONT_COND, fontSize: 20,
                        fontWeight: 800, color: C.reprogramado }}>{x.n}</span>
                      <span style={{ fontFamily: FONT_COND, fontSize: 13,
                        fontWeight: 700, color: C.muted }}>{x.pct}</span>
                    </div>
                  </div>
                ))}
              </div>

              {dd.diaNoInicioN > 0 && (
                <div style={{ marginTop: 14, padding: "9px 12px",
                  background: "#fff8f0", border: `1px solid #f0c080`,
                  borderRadius: 8, fontSize: 12, color: "#8a4a00" }}>
                  ⚠️ Sesiones no iniciadas: <strong>{dd.diaNoInicioN}</strong> — {dd.diaNoInicio}
                </div>
              )}
            </Card>
          </div>
        </>)}


      </div>

      <div style={{ textAlign: "center", padding: "14px 0", fontSize: 11,
        color: C.muted, borderTop: `1px solid ${C.border}`, marginTop: 8 }}>
        INEVAL · DACT-UAT · SEST 2025-2026 · Actualizado: {d.corte}
      </div>
    </div>
  );
}
