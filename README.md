# SEST 2025-2026 — Dashboard de Cobertura Preliminar

Dashboard interactivo de cobertura del proceso Ser Estudiante (SEST) 2025-2026,  
Régimen Sierra-Amazonía. Desarrollado por DACT-UAT / INEVAL.

## Estructura del proyecto

```
sest-dashboard/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx       ← punto de entrada (no modificar)
    └── App.jsx        ← ARCHIVO PRINCIPAL — aquí están todos los datos
```

## Actualización  diaria

El único archivo que se modifica cada día es **`src/App.jsx`**.

### Pasos para actualizar

1. Abre `src/App.jsx`
2. Localiza el objeto `DATOS` al inicio del archivo (línea ~37)
3. Agrega una nueva entrada con la clave `"DD/MM"` (ej. `"27/05"`)
4. Rellena todos los campos siguiendo la estructura de las entradas existentes
5. Agrega la clave al arreglo `FECHAS_ORDEN` al final de `DATOS`

### Ejemplo de entrada nueva

```js
"27/05": {
  corte: "27 de mayo de 2026",
  semana: "Semana 2",
  // evaluaciones acumuladas
  evalProgramadas: 51346,
  evalAplicadas: 20000,
  evalAplicadasPct: 38.95,
  // ... resto de campos
}
```

### Publicar en Vercel

Después de editar `App.jsx`:

```bash
git add src/App.jsx
git commit -m "Actualización cobertura 27/05"
git push
```

Vercel detecta el push y republica automáticamente en **el mismo link**, en 1-2 minutos.

---

## Instalación local (opcional)

```bash
npm install
npm run dev
```

Abre http://localhost:5173
