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
      { dia: "M 26/05", aplicados: 3284, acum: 17126, pct: 33 },
      { dia: "X 27/05", aplicados: 47,   acum: 17173, pct: 33 },
    ],
  },
};

/* Orden cronológico de fechas disponibles */
const FECHAS_ORDEN = ["19/05", "20/05", "21/05", "22/05", "26/05"]; // agregar nuevas fechas aquí

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
