import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LineChart, Line, Legend
} from "recharts";

/* ══════════════════════════════════════════════════════
   PALETA Y TIPOGRAFÍA
══════════════════════════════════════════════════════ */
const C = {
  aplicado:     "#1a56a0",
  ausente:      "#e07b3a",
  noAplicado:   "#c0392b",
  reprogramado: "#8e44ad",
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
};

/* Orden cronológico de fechas disponibles */
const FECHAS_ORDEN = ["19/05", "20/05", "21/05", "22/05", "26/05", "27/05", "28/05", "29/05", "01/06", "02/06", "03/06", "04/06"]; // agregar nuevas fechas aquí

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
        {TABS.map(t => (
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
              <ST>Avance por día</ST>
              <ResponsiveContainer width="100%" height={190}>
                <BarChart data={d.avanceSemanal} barSize={26}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                  <XAxis dataKey="dia" tick={{ fontSize: 10, fill: C.muted }} />
                  <YAxis tick={{ fontSize: 10, fill: C.muted }} width={36} />
                  <Tooltip content={<CTip />} />
                  <Bar dataKey="aplicados" name="Aplicados" radius={[4, 4, 0, 0]}>
                    {d.avanceSemanal.map((_, i) => (
                      <Cell key={i} fill={i === d.avanceSemanal.length - 1 ? C.amarillo : C.aplicado} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
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
                Cobertura — {dd.corte}
              </div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 11, color: "#a8c8f0" }}>
                {dd.semana} · Régimen Sierra-Amazonía
              </div>
            </div>
            {fechaDiario === fechaActual && (
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
              <ST>Estado del día — {dd.diaProgramados.toLocaleString("es-EC")} evaluaciones</ST>
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
