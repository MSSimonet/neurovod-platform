# DESIGN SYSTEM & BRAND SPECIFICATION: NEUROVOD MÉDICA

Este documento establece las reglas estrictas de UI/UX, tokens cromáticos y geometría visual para la plataforma `neurovod-platform`. Claude Code debe consultar obligatoriamente este archivo y cumplir con todas las restricciones negativas.

---

## 1. ANÁLISIS DE REQUISITOS Y FEEDBACK DEL CLIENTE
- **Problema Detectado en el Prototipo Inicial:** El cliente rechazó la estética por considerarla "estilo genérico de Claude/IA" (fondo oscuro neón, degradados morados/cian, sombras flotantes, tarjetas con transparencias borrosas y exceso de bloques de texto).
- **Dirección Solicitada por el Cliente:**
  - Estética minimalista, sobria, limpia y desprovista de relleno.
  - Colores inspirados en la marca personal del médico (extraídos de su perfil de Instagram: tonos tierra/clínicos sobrios sobre fondo claro).
  - Reducción drástica de paredes de texto; priorizar tarjetas visuales de episodios VOD, duraciones y botones directos.
  - Tipografía con autoridad médica que rompa el estándar predecible de las IAs.

---

## 2. RESTRICCIONES NEGATIVAS ESTRICTAS (EVITAR EL "LOOK DE IA")

Para erradicar la apariencia de plantilla generada por IA:
- ❌ **PROHIBIDO:** Fondos oscuros saturados (#070A12) con resplandores neón cian/verde (`medical-glow`, `emerald-glow-sm`).
- ❌ **PROHIBIDO:** Transparencias de cristal borroso (`glassmorphism`, `backdrop-blur-md`, `glass-card`, `glass-island`).
- ❌ **PROHIBIDO:** Esquinas ultra redondeadas (`rounded-full`, `rounded-3xl`, `rounded-2xl`) en tarjetas principales y botones.
- ❌ **PROHIBIDO:** Sobrecarga de iconos flotantes de Lucide React sin función clínica clara.
- ❌ **PROHIBIDO:** Sombras suaves flotantes multidireccionales (`shadow-2xl`, `shadow-cyan-950`).
- ❌ **PROHIBIDO:** Párrafos largos e introductorios. Toda la información debe ser sintética, escaneable y orientada a la acción.
- ❌ **PROHIBIDO:** Carruseles horizontales tipo Netflix con desplazamiento infinito que oculten información.

---

## 3. INSPIRACIÓN EN INSTITUCIONES MÉDICAS MUNDIALES

- **Mayo Clinic:** Navegación orientada a condiciones médicas (TDAH, Autismo/TEA, Neurodesarrollo) con filtrado instantáneo y brújula clínica directa.
- **Cleveland Clinic:** Tarjetas estructuradas tipo "Biblioteca de Salud" con acceso a programas, guías descargables e indicadores claros de resultados.
- **Pfizer:** Sellos de validación científica, bibliografía en PDF adjunta a cada video y estructura modular por áreas de especialidad.
- **Maven Clinic:** Enfoque humano centrado en el paciente y la familia, con una interfaz clara, serena y accesible.

---

## 4. SISTEMA DE TOKENS CROMÁTICOS (`src/index.css`)

Basado en la paleta clínica sobria de marca personal (Modo Claro Editorial por Defecto):

```css
:root {
  /* Superficies: Papel Médico y Estructura Editorial */
  --bg-app: #FAFAFA;          /* Fondo general tono papel clínico limpio */
  --bg-card: #FFFFFF;         /* Fondo de tarjetas y módulos */
  --bg-subtle: #F1F5F9;       /* Fondo de contenedores secundarios */
  --bg-alt: #E2E8F0;          /* Contrastes estructurales */

  /* Tipografía y Contraste de Lectura */
  --text-primary: #0F172A;    /* Slate-900: Máxima nitidez y autoridad médica */
  --text-secondary: #334155;  /* Slate-700: Subtítulos y descripciones cortas */
  --text-muted: #64748B;      /* Slate-500: Metadatos, duraciones y matrículas */
  --text-muted-strong: #475569; /* Slate-600: El mismo gris tenue cuando va a 11px o sobre gris */
  --text-inverse: #FFFFFF;    /* Texto sobre botones activos */

  /* Acento Clínico (Regla del 10% Máximo de Uso) */
  --accent-primary: #0369A1;  /* Sky-700: Azul clínico sereno para CTAs principales (AA: 5,9:1) */
  --accent-hover: #075985;    /* Sky-800: Estado hover */
  --accent-surface: #F0F9FF;  /* Sky-50: Fichas seleccionadas y etiquetas activas */
  --accent-border: #BAE6FD;   /* Borde de selección */

  /* Confirmación y Alerta Médica */
  --success-primary: #047857; /* Emerald-700: Estado Módulo Desbloqueado (AA: 5,5:1) */
  --success-surface: #ECFDF5;

  /* Retícula y Bordes de Estructura */
  --border-clean: #E2E8F0;    /* Slate-200: Bordes ultra limpios de 1px */
  --border-strong: #CBD5E1;   /* Slate-300: Separadores de secciones */

  /* Geometría Editorial */
  --radius-xs: 2px;
  --radius-sm: 4px;
  --radius-md: 6px;
  --shadow-subtle: 0 1px 2px 0 rgba(15, 23, 42, 0.05);
}
```

---

## 5. SISTEMA TIPOGRÁFICO DUAL & RETÍCULA EDITORIAL

1. **Titulares Principales (`h1`, `h2`, `h3`):** Tipografía Serif de alto impacto y literatura médica (`Instrument Serif` o `Playfair Display`). Transmite postura humana, serenidad y elegancia médica.
2. **Cuerpo de Texto y Controles:** Sans-Serif moderna y limpia (`Plus Jakarta Sans` o `Inter`) con alto contraste y espaciado cómodo (`leading-relaxed`).
3. **Metadatos y Precios en $ARS:** Tipografía Monospace (`Geist Mono` o `JetBrains Mono`) para precios en Pesos Argentinos, duraciones de episodios y matrículas profesionales.
4. **Retícula Visible de 3-4 Columnas:** Reemplazar los carruseles de Netflix por un **Catálogo en Cuadrícula Estructurada** con divisiones finas de `1px solid var(--border-clean)`, creando el orden visual de un compendio médico impreso.
