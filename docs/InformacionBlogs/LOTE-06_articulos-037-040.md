# LOTE 06 — ARTÍCULOS COMPLETOS 037–040
**Autor:** Carlos Anaya Ruiz · Listos para publicar

---
---

# ARTÍCULO 037

```yaml
title: "Cómo automatizar tu operación con n8n"
slug: "automatizar-procesos-con-n8n"
description: "Cómo automatizar procesos reales con n8n autohospedado: flujos que puedes copiar hoy y cuándo n8n es peor idea que escribir código."
author: "Carlos Anaya Ruiz"
category: "Automatización"
tags: ["n8n", "automatización", "workflows", "no-code"]
keyword_principal: "automatizar procesos n8n"
```

## Cómo automatizar tu operación con n8n

**n8n es una herramienta de automatización de flujos que puedes autohospedar, con nodos para cientos de servicios y la posibilidad de escribir código cuando los nodos no alcanzan.** Ocupa un espacio útil: más potente que las herramientas puramente visuales, más rápido que escribir todo desde cero.

Su ventaja decisiva sobre las alternativas en la nube es el autohospedaje: tus datos no salen de tu infraestructura y el costo no escala por número de ejecuciones.

---

### Cuándo n8n es la herramienta correcta

**Sí, cuando:**
- Conectas servicios que ya existen y tienen API.
- El flujo cambia con frecuencia y quien lo mantiene no es desarrollador de tiempo completo.
- Necesitas visibilidad visual de un proceso para explicárselo a alguien más.
- El volumen es moderado: decenas o cientos de ejecuciones diarias.
- Quieres iterar rápido para validar si el proceso vale la pena antes de codificarlo.

**No, cuando:**
- El flujo tiene lógica de negocio compleja con muchas ramas. En un editor visual eso se vuelve ilegible.
- El volumen es alto y sostenido.
- Necesitas control de versiones serio, pruebas automatizadas y despliegue por rama.
- Es el núcleo de tu producto. La automatización operativa sí; la lógica de tu producto, no.

**La señal de que te pasaste:** si tu flujo tiene más de veinticinco nodos y tres niveles de condicionales anidados, deberías haber escrito código hace rato.

---

### Ocho flujos que aportan valor rápido

**1. Correo entrante → clasificación → enrutamiento.**
Disparador de correo, nodo de IA que clasifica por tipo y urgencia, condicional que asigna al departamento correcto, notificación al responsable.

**2. Formulario web → validación → CRM → seguimiento.**
Webhook recibe, se enriquece con datos públicos de la empresa, se crea el registro, se dispara secuencia de correos.

**3. Nueva reseña → alerta y borrador de respuesta.**
Consulta periódica de reseñas, si es negativa alerta inmediata al responsable, en todos los casos genera borrador de respuesta para aprobación.

**4. Factura recibida → extracción → sistema administrativo.**
Correo con adjunto, extracción de campos con IA, validación de que los números cuadran, alta en el sistema. Uno de los flujos con mayor retorno.

**5. Reporte periódico automatizado.**
Consulta a base de datos, consulta a analítica, resumen generado con IA, envío por correo cada lunes.

**6. Alerta de saldo o inventario.**
Consulta programada, comparación contra umbral, notificación al canal correspondiente.

**7. Sincronización entre sistemas.**
CRM y sistema administrativo que no hablan entre sí. n8n como puente, con detección de cambios y control de conflictos.

**8. Publicación en redes desde una hoja de cálculo.**
Fila marcada como aprobada, se publica en los canales configurados, se marca como publicada.

---

### El nodo de código: donde n8n gana a las alternativas

Cuando ningún nodo hace lo que necesitas:

```js
// Nodo Code — modo "Run Once for All Items"
const items = $input.all()

const agrupado = items.reduce((acc, item) => {
  const clave = item.json.organizacionId
  if (!acc[clave]) acc[clave] = { organizacionId: clave, total: 0, pedidos: [] }
  acc[clave].total += item.json.monto
  acc[clave].pedidos.push(item.json.id)
  return acc
}, {})

return Object.values(agrupado).map(json => ({ json }))
```

Esta capacidad es la que te salva de flujos con quince nodos de transformación encadenados.

---

### Manejo de errores: lo que separa un flujo de juguete de uno de producción

**1. Flujo de error global.** Configura un flujo dedicado que se dispara cuando cualquier otro falla, y que notifica con contexto: qué flujo, qué nodo, qué datos de entrada.

**2. Reintentos por nodo.** Para llamadas a APIs externas, activa reintentos con espera. Un fallo transitorio no debe tumbar todo el flujo.

**3. Continuar en caso de error donde tenga sentido.** Si procesas cien registros y uno falla, decide si eso debe detener los otros noventa y nueve.

**4. Idempotencia.** Antes de crear un registro, verifica si ya existe. Los reintentos y los webhooks duplicados son la norma, no la excepción.

**5. Límites de tasa.** Si consultas una API con restricciones, agrega esperas o usa el nodo de división en lotes. Que te bloqueen la clave de API a media noche no es divertido.

---

### Autohospedaje: consideraciones reales

```yaml
# docker-compose.yml simplificado
services:
  n8n:
    image: n8nio/n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_ENCRYPTION_KEY=${N8N_ENCRYPTION_KEY}
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - N8N_PROTOCOL=https
      - WEBHOOK_URL=https://automatizacion.midominio.com/
    volumes:
      - n8n_data:/home/node/.n8n
```

**Puntos que importan:**

- **Base de datos Postgres, no SQLite.** SQLite funciona para probar; en producción con volumen se degrada.
- **Guarda la clave de cifrado.** Si la pierdes, pierdes todas las credenciales almacenadas. Sin recuperación posible.
- **Nunca expongas n8n directamente a internet sin autenticación.** El panel da acceso a todas tus credenciales conectadas. Detrás de proxy inverso, con autenticación y, si es posible, restringido por IP o VPN.
- **Respalda la base de datos.** Contiene tus flujos y credenciales.
- **Vigila el crecimiento de ejecuciones.** Configura la política de retención o la base crece sin control.

---

### Los errores que hacen doloroso el mantenimiento

**Flujos gigantes que hacen de todo.** Divide en flujos pequeños que se llaman entre sí. Más fácil de depurar y de reutilizar.

**Credenciales duplicadas.** Una credencial por servicio, compartida entre flujos.

**Sin nombres descriptivos en los nodos.** "HTTP Request 7" no le dice nada a nadie, incluido tú en dos meses.

**Sin documentación del propósito.** Una nota al inicio de cada flujo explicando qué hace, quién lo pidió y qué pasa si falla.

**Datos sensibles en los registros de ejecución.** n8n guarda entradas y salidas. Si pasan datos personales, considera la retención y el acceso al panel. Aplica la normativa de protección de datos igual que a cualquier otro sistema.

---

### Preguntas frecuentes

**¿n8n o escribir código?**
n8n para conectar servicios y para procesos que cambian seguido. Código para lógica de negocio propia y para cualquier cosa que sea núcleo de tu producto.

**¿Se puede versionar?**
Los flujos se exportan como JSON y se pueden guardar en un repositorio. No es tan cómodo como versionar código, pero es viable y recomendable.

**¿Cuánto cuesta autohospedado?**
Una instancia modesta en la nube: entre 500 y 1,500 pesos mensuales para cargas pequeñas y medianas. El costo real es el tiempo de operación y actualización.

---

**Escrito por Carlos Anaya Ruiz** — Consultor tecnológico. Uso n8n autohospedado para automatización operativa y código para el núcleo de producto.

---

### PROMPT DE PORTADA — Artículo 037

> Un diagrama de flujo tridimensional flotante compuesto por nodos hexagonales de color ámbar unidos por cables curvos de luz, con paquetes de datos viajando por ellos congelados en pleno movimiento. Vista tres cuartos con profundidad. Fondo negro carbón con niebla técnica, iluminación cálida ámbar, algunos nodos desenfocados al fondo.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.

---
---

# ARTÍCULO 038

```yaml
title: "Claude Code: guía práctica para desarrolladores"
slug: "claude-code-guia-desarrolladores"
description: "Cómo usar Claude Code de verdad: instalación, CLAUDE.md, permisos, subagentes y el flujo que evita que la IA rompa tu repositorio."
author: "Carlos Anaya Ruiz"
category: "Desarrollo"
tags: ["claude code", "ia para programar", "productividad", "agentes"]
keyword_principal: "claude code"
```

## Claude Code: guía práctica para desarrolladores

**Claude Code es una herramienta de programación agéntica que lee tu base de código, edita archivos, ejecuta comandos y se integra con tus herramientas de desarrollo.** No es un autocompletado dentro del editor: es un agente que trabaja sobre el proyecto completo.

Esa diferencia es lo que lo hace potente y lo que exige disciplina para usarlo bien.

---

### Instalación

Está disponible en varias superficies —terminal, extensiones de IDE, aplicación de escritorio y navegador— y todas se conectan al mismo motor, así que tu configuración y tus archivos de contexto funcionan en cualquiera.

Para la terminal, la instalación nativa:

```bash
# macOS, Linux, WSL
curl -fsSL https://claude.ai/install.sh | bash

# Windows PowerShell
irm https://claude.ai/install.ps1 | iex
```

También está disponible por Homebrew (`brew install --cask claude-code`) y por WinGet (`winget install Anthropic.ClaudeCode`).

Después, en cualquier proyecto:

```bash
cd tu-proyecto
claude
```

En Windows nativo conviene tener Git for Windows instalado para que pueda usar Bash como shell; si no, usa PowerShell.

Consulta siempre la documentación oficial para métodos alternativos y solución de problemas: `code.claude.com/docs`.

---

### CLAUDE.md: el archivo que cambia todo

Es un archivo markdown en la raíz de tu proyecto que se lee al inicio de cada sesión. Es la diferencia entre una herramienta que adivina tus convenciones y una que las conoce.

Lo que debe contener:

```markdown
# Proyecto: Plataforma de gestión

## Stack
- Monorepo pnpm + Turborepo
- Next.js App Router, TypeScript strict
- Supabase (Postgres + Auth), RLS en todas las tablas
- Inngest para trabajo en background

## Comandos
- `pnpm dev` — desarrollo
- `pnpm typecheck` — verificación de tipos (ejecutar SIEMPRE antes de terminar)
- `pnpm test` — pruebas
- `pnpm lint`

## Convenciones
- Commits convencionales en inglés
- Componentes de servidor por defecto; 'use client' solo en hojas del árbol
- Toda tabla nueva necesita política RLS + prueba de acceso cruzado
- Validación con Zod en la frontera de toda Server Action
- Nunca usar `any`; si es inevitable, comentar el porqué

## Reglas duras
- NUNCA hacer push directo a main
- NUNCA modificar archivos de migración ya aplicados
- NUNCA commitear archivos .env
- Antes de terminar cualquier tarea: ejecutar typecheck y lint
```

**Consejo práctico:** empieza corto. Cada vez que corrijas algo dos veces, esa corrección se convierte en una línea del CLAUDE.md. Es un documento que crece por uso, no por planeación.

Además del archivo que tú escribes, Claude Code construye memoria automática conforme trabaja, guardando aprendizajes entre sesiones.

---

### El flujo de trabajo que evita desastres

**1. Rama por tarea, siempre.**
Nunca trabajes directo sobre `main`. Es la regla más importante y la más fácil de olvidar cuando algo parece un cambio pequeño.

**2. Pide un plan antes de que escriba código.**
Para tareas no triviales, pide primero el enfoque. Revisar un plan de diez líneas toma un minuto; revisar quinientas líneas de código mal enfocado toma una hora.

**3. Tareas acotadas.**
"Refactoriza el módulo de autenticación" es demasiado ancho. "Extrae la validación de sesión de estas tres rutas a una función compartida en lib/sesion.ts" es una tarea.

**4. Revisa el diff, no la explicación.**
La descripción de lo que hizo puede sonar perfecta y el código estar mal. Lee el cambio.

**5. Que ejecute las verificaciones.**
Si tu CLAUDE.md dice que debe correr `typecheck` y `test` antes de terminar, lo hará. El código que compila y pasa pruebas es un piso mínimo razonable.

**6. Commits pequeños y frecuentes.**
Facilita revertir cuando algo salió mal. Que lo haga él: trabaja directamente con git, prepara cambios, escribe mensajes y abre pull requests.

---

### Permisos: la decisión que más importa

Puedes configurar qué operaciones requieren tu aprobación. Vale la pena pensarlo bien.

**Lo razonable para la mayoría:**
- Lectura de archivos: sin aprobación.
- Edición de archivos: sin aprobación dentro del proyecto.
- Comandos de solo lectura (`ls`, `cat`, `git status`, `git diff`): sin aprobación.
- Comandos que modifican estado (`git push`, migraciones, instalación de paquetes, despliegues): **con aprobación**.
- Cualquier cosa que toque producción: **con aprobación, siempre**.

**El modo sin aprobaciones existe** y acelera mucho el trabajo, pero úsalo solo en entornos donde el peor caso sea aceptable: una rama desechable, un contenedor aislado, un proyecto experimental. En un repositorio de producción con credenciales activas, no.

---

### Capacidades que vale la pena conocer

**MCP.** Puedes conectarlo a fuentes externas mediante servidores del Model Context Protocol: documentos, sistemas de tickets, tus propias herramientas internas. Es lo que le da contexto más allá del repositorio.

**Skills.** Empaquetan flujos de trabajo repetibles que tu equipo puede compartir, como una revisión de pull request estandarizada o un despliegue a staging.

**Hooks.** Ejecutan comandos de shell antes o después de sus acciones. Útil para formatear automáticamente después de cada edición o correr el linter antes de un commit.

**Subagentes.** Para tareas grandes puedes lanzar varios agentes que trabajan en partes distintas en paralelo, con uno coordinando.

**Uso desde la línea de comandos.** Es componible al estilo Unix, así que puedes canalizarle salida de otros procesos:

```bash
tail -200 app.log | claude -p "resume los errores recurrentes"
git diff main --name-only | claude -p "revisa estos archivos por problemas de seguridad"
```

Esa capacidad de usarlo como filtro dentro de un pipeline es de lo más infravalorado de la herramienta.

**Tareas programadas.** Puede correr en horario: revisión de pull requests por la mañana, análisis de fallos de integración continua por la noche, auditoría semanal de dependencias.

---

### Los errores que hacen que la gente se decepcione

**No escribir CLAUDE.md.** Sin él, cada sesión empieza de cero y las convenciones se pierden.

**Pedir tareas demasiado grandes.** Cuanto más ancha la tarea, más probable que el enfoque no sea el que querías.

**Aceptar cambios sin leerlos.** Es la vía rápida hacia una base de código que nadie entiende.

**Usarlo en un repositorio sin pruebas.** Sin verificación automática, no tienes forma de saber si rompió algo.

**Esperar que adivine el contexto de negocio.** Sabe programar; no sabe por qué tu tabla de facturación tiene esa columna rara. Explícaselo o documéntalo.

---

### Preguntas frecuentes

**¿Reemplaza al desarrollador?**
Cambia la proporción del trabajo: menos escritura de código, más diseño, revisión y decisión. Sigues siendo responsable de lo que se despliega.

**¿Y los datos de mi código?**
Revisa la documentación oficial y los términos del plan que uses. Para código sensible, verifica las condiciones por escrito antes de conectarlo.

**¿Funciona bien en bases de código grandes?**
Sí, y ahí es donde más se nota, porque puede rastrear cómo se relacionan archivos que tú no conoces. La calidad depende mucho de lo bien documentado que esté el proyecto.

---

**Escrito por Carlos Anaya Ruiz** — Desarrollador full-stack. Construyo productos completos usando agentes de código como herramienta principal de desarrollo.

---

### PROMPT DE PORTADA — Artículo 038

> Una losa de obsidiana negra pulida flotando horizontalmente en el aire, de cuya superficie emergen líneas de luz ámbar que se autoorganizan formando estructuras de código abstractas sin caracteres legibles. Iluminación cálida rasante que revela el reflejo en la piedra. Fondo negro absoluto, partículas suspendidas, espacio negativo a la derecha.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.

---
---

# ARTÍCULO 039

```yaml
title: "Prompt engineering avanzado: 20 técnicas que sí funcionan"
slug: "prompt-engineering-avanzado-tecnicas"
description: "20 técnicas de prompt engineering probadas, con el antes y después de cada prompt y cuándo cada técnica deja de servir."
author: "Carlos Anaya Ruiz"
category: "Inteligencia Artificial"
tags: ["prompt engineering", "ia", "productividad", "técnicas"]
keyword_principal: "prompt engineering"
```

## Prompt engineering avanzado: 20 técnicas que sí funcionan

**El prompt engineering no es magia de palabras clave: es especificación.** La mayoría de los prompts malos fallan porque no dicen qué se quiere, para quién, en qué formato y bajo qué restricciones.

Estas veinte técnicas están ordenadas de más básicas a más avanzadas. Las primeras diez resuelven el 80% de los casos.

---

### Fundamentos

**1. Da contexto de rol y audiencia.**
No "explica Kubernetes", sino "explica Kubernetes a un director financiero que necesita decidir si aprobar la migración".

**2. Especifica el formato de salida.**
"Responde con una tabla de tres columnas: opción, costo estimado, riesgo principal." La ambigüedad de formato genera respuestas que hay que reformatear a mano.

**3. Define la extensión.**
"En máximo 150 palabras" o "tres párrafos". Sin esto, obtienes lo que el modelo considere apropiado, que rara vez coincide.

**4. Da ejemplos (few-shot).**
Uno o dos ejemplos de entrada y salida deseada valen más que un párrafo de descripción. Es la técnica con mejor relación esfuerzo/resultado que existe.

**5. Estructura el prompt con delimitadores.**
Separa instrucciones, contexto y datos con etiquetas claras. Reduce mucho la confusión entre "esto es una instrucción" y "esto es material a procesar".

```
<instrucciones>
Resume el documento en 5 viñetas.
</instrucciones>

<documento>
...
</documento>
```

**6. Di qué hacer, no solo qué evitar.**
"Escribe en frases cortas" funciona mejor que "no escribas frases largas". Los modelos siguen mejor las instrucciones afirmativas.

**7. Pide razonamiento antes de la conclusión.**
"Analiza primero los tres factores y después da tu recomendación." Invertir el orden —conclusión primero— degrada la calidad del análisis.

**8. Divide tareas complejas en pasos.**
Una tarea con cinco objetivos distintos produce peores resultados que cinco intercambios enfocados.

**9. Da criterios de calidad explícitos.**
"Una buena respuesta incluye cifras concretas y menciona al menos un riesgo." El modelo puede optimizar contra criterios que conoce.

**10. Itera sobre el prompt, no sobre la respuesta.**
Si corriges la misma cosa tres veces, esa corrección pertenece al prompt.

---

### Intermedias

**11. Prefill de la respuesta.**
Empieza tú la respuesta para forzar el formato:

```
Asistente: {
  "categoria":
```

Elimina preámbulos y garantiza que la salida sea JSON válido.

**12. Pide que declare su incertidumbre.**
"Si no tienes información suficiente para responder algo, dilo explícitamente en lugar de estimar." Reduce mucho la invención.

**13. Separa generación de evaluación.**
Primero pide tres opciones. Después, en un intercambio distinto, pide que las evalúe contra criterios. Mezclarlo hace que defienda su primera idea.

**14. Usa el prompt de sistema para lo permanente.**
Rol, restricciones duras y formato van en el prompt de sistema. La tarea concreta va en el mensaje. Mezclarlo hace que las reglas se diluyan.

**15. Ancla con datos, no con adjetivos.**
"Un texto profesional" es vago. "Frases de máximo 20 palabras, sin adverbios de intensidad, en tercera persona" es especificable y verificable.

**16. Pide autocrítica en un segundo paso.**
"Revisa la respuesta anterior y señala sus tres debilidades más importantes." Suele encontrar problemas reales.

**17. Controla la temperatura según la tarea.**
Baja para extracción, clasificación y datos estructurados. Alta para lluvia de ideas y variantes creativas. Usar el mismo valor para todo es dejar calidad sobre la mesa.

---

### Avanzadas

**18. Cadena de prompts especializados.**
En lugar de un prompt gigante, encadena: extracción → normalización → análisis → redacción. Cada paso con su prompt afinado. Más costoso en tokens, mucho mejor en calidad y mucho más fácil de depurar.

**19. Estructura para aprovechar el caching de contexto.**
Coloca lo estable —instrucciones largas, documentos de referencia— al **inicio** del prompt, y lo variable al final. Los proveedores que ofrecen caché de prefijo pueden reutilizar esa parte y reducir el costo de forma sustancial. Es una decisión de arquitectura de prompt con impacto económico directo.

**20. Evalúa con un conjunto de pruebas, no con impresiones.**
Ten de 30 a 100 casos con resultado esperado. Cada cambio de prompt se mide contra ese conjunto. Sin esto, "el prompt nuevo se siente mejor" es todo lo que tienes, y suele estar equivocado.

---

### Lo que no funciona (aunque circule mucho)

**Prometer recompensas o amenazar.** No mejora los resultados de forma consistente y ensucia el prompt.

**Insistir en mayúsculas.** Un "IMPORTANTE" ocasional ayuda a jerarquizar. Diez instrucciones en mayúsculas se anulan entre sí.

**Prompts de 3,000 palabras con reglas contradictorias.** Más largo no es mejor. Si tu prompt tiene reglas que se contradicen, el modelo elegirá una y no sabrás cuál.

**Copiar plantillas sin adaptarlas.** Un prompt afinado para un dominio suele funcionar peor en otro que uno simple escrito para el tuyo.

---

### El proceso que uso

1. Escribe la versión más simple que podría funcionar.
2. Pruébala en 10 casos reales.
3. Anota cada fallo y su categoría.
4. Ataca la categoría más frecuente con una técnica concreta.
5. Vuelve a medir sobre los mismos 10 casos.
6. Cuando esté estable, amplía a 50 casos y repite.

**Nunca cambies dos cosas a la vez.** No sabrás cuál funcionó.

---

### Preguntas frecuentes

**¿Los prompts son transferibles entre modelos?**
Los principios sí, los detalles no. Un prompt muy afinado para un modelo suele necesitar ajuste en otro. Prueba antes de migrar.

**¿Vale la pena versionar los prompts?**
Sí. Guárdalos en el repositorio, con su conjunto de pruebas. Un prompt en producción es código.

**¿Cuándo un prompt deja de ser suficiente?**
Cuando el problema es de información que el modelo no tiene: ahí necesitas RAG, no un mejor prompt.

---

**Escrito por Carlos Anaya Ruiz** — Desarrollador y consultor. Escribo y evalúo prompts en producción con conjuntos de pruebas versionados.

---

### PROMPT DE PORTADA — Artículo 039

> Un prisma de cristal tallado recibiendo por un lado un haz de luz blanca desordenada y difusa, y emitiendo por el otro un rayo ámbar perfectamente enfocado y direccional. Metáfora visual de precisión y refinamiento. Fondo negro absoluto, partículas de polvo visibles dentro de los haces, iluminación de estudio con alto contraste.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.

---
---

# ARTÍCULO 040

```yaml
title: "Pipeline de contenido automatizado con IA (sin publicar basura)"
slug: "pipeline-contenido-automatizado-ia"
description: "Cómo montar un pipeline de contenido con IA que produce a escala sin caer en spam: investigación, redacción, revisión humana y publicación."
author: "Carlos Anaya Ruiz"
category: "Automatización"
tags: ["contenido", "ia", "seo", "automatización"]
keyword_principal: "automatizar contenido con ia"
```

## Pipeline de contenido automatizado con IA (sin publicar basura)

**Se puede producir contenido a escala con IA y que sea bueno. Lo que no se puede es saltarse el criterio humano y esperar resultados.** La diferencia entre un pipeline que construye autoridad y uno que genera penalizaciones está en dónde pones a la persona.

---

### La arquitectura

```
[1] Investigación de temas → keywords, intención, huecos de contenido
        ↓
[2] Brief estructurado → ángulo, estructura, fuentes, criterios
        ↓
[3] Generación de borrador → con contexto propio, no genérico
        ↓
[4] Verificación de hechos → automática + humana
        ↓
[5] REVISIÓN HUMANA ← el paso que no se elimina
        ↓
[6] Optimización técnica → metadatos, schema, enlazado interno
        ↓
[7] Publicación programada
        ↓
[8] Medición → qué funcionó vuelve al paso 1
```

---

### Paso 1 — Investigación

Automatizable casi por completo. Combina datos de herramientas de keywords con análisis de lo que ya posicionan tus competidores.

Lo que debe salir de aquí, por tema:
- Keyword principal y su intención de búsqueda
- Preguntas relacionadas reales que hace la gente
- Qué cubren los primeros resultados y **qué no cubren** (ahí está tu ángulo)
- Extensión de referencia de los que ya posicionan

**El hueco es lo importante.** Si vas a decir lo mismo que los diez primeros resultados, no hay razón para que alguien te lea ni para que Google te suba.

---

### Paso 2 — El brief: donde se define la calidad

Este es el paso que la gente se salta y por el que todo el pipeline produce contenido genérico.

Un brief útil incluye:

```
TEMA: [título de trabajo]
KEYWORD PRINCIPAL: [una sola]
INTENCIÓN: [informacional / comercial / transaccional]
AUDIENCIA: [quién es y qué sabe ya]
ÁNGULO ÚNICO: [qué dice este artículo que no dicen los otros]
EXPERIENCIA PROPIA A INCLUIR: [qué caso, dato o error propio se cuenta]
ESTRUCTURA: [H2 y H3 propuestos]
DATOS OBLIGATORIOS: [cifras que deben aparecer, con fuente]
LO QUE NO SE DEBE DECIR: [afirmaciones a evitar]
LLAMADA A LA ACCIÓN: [qué queremos que haga el lector]
```

**El campo "experiencia propia" es el que separa contenido útil de relleno.** Un dato de un proyecto real, un error que cometiste, un número de tu operación. La IA no puede inventar eso, y es justo lo que hace que valga la pena leerte.

---

### Paso 3 — Generación

Con el brief bien hecho, la generación es la parte fácil. Dos reglas:

**Genera por secciones, no el artículo completo de golpe.** Mejor control, mejor calidad, más fácil de corregir.

**Inyecta contexto propio.** Tus artículos anteriores, tu voz de marca, tus datos. Un modelo sin contexto propio produce el mismo texto que produciría para tu competencia.

---

### Paso 4 — Verificación de hechos

**Automatizable parcialmente:**
- Verificar que las cifras citadas tengan fuente
- Detectar afirmaciones sin respaldo
- Comprobar que los enlaces funcionan
- Detectar contradicciones con artículos propios anteriores

**No automatizable:** juzgar si la afirmación es correcta en tu dominio. Si publicas sobre temas donde un error tiene consecuencias —salud, finanzas, legal— la verificación experta es obligatoria y no negociable.

---

### Paso 5 — Revisión humana

**Este paso no se elimina. Nunca.** No por cumplimiento formal, sino porque es donde el contenido pasa de correcto a útil.

Lo que revisa una persona:

- ¿Esto aporta algo que no esté en los diez primeros resultados?
- ¿Los datos son correctos y están actualizados?
- ¿Suena a nosotros o a texto genérico?
- ¿Hay algo aquí que solo nosotros podemos decir?
- ¿Recomendaría este artículo a un cliente?

Si la respuesta a la última pregunta es no, no se publica. Es el filtro más simple y el más efectivo.

**Tiempo realista:** de 20 a 40 minutos por artículo. Si tu proceso no contempla ese tiempo, tu pipeline es una máquina de producir ruido.

---

### Paso 6 — Optimización técnica

Automatizable por completo:
- Meta title y description dentro de límites
- Schema markup correspondiente
- Enlazado interno hacia la pillar del clúster y hacia satélites relacionados
- Alt text descriptivo en imágenes
- Estructura de encabezados jerárquica y coherente

---

### Sobre las políticas de los buscadores

Conviene tener claro el marco, porque circula mucha confusión:

Google ha sido explícito en que **no penaliza el contenido por haber sido generado con IA**. Lo que penaliza es el contenido creado principalmente para manipular posiciones en buscadores en lugar de para ayudar a personas. Es una distinción sobre el propósito y la calidad, no sobre la herramienta.

En la práctica eso significa:

**Lo que está bien:** usar IA para investigar, estructurar, redactar borradores y ampliar tu capacidad de producción, siempre con criterio, verificación y aporte propio.

**Lo que te mete en problemas:** publicar cientos de artículos genéricos sin revisión, contenido que reformula lo que ya existe sin añadir nada, o producción masiva pensada únicamente para capturar keywords.

**La prueba práctica:** si quitaras tu logo del artículo, ¿alguien notaría que es tuyo? Si la respuesta es no, tienes un problema de contenido, no de herramienta.

---

### Los números realistas

Con un pipeline bien montado y una persona dedicada medio tiempo a revisión:

- **Sin pipeline:** de 4 a 8 artículos al mes
- **Con pipeline y revisión seria:** de 20 a 40 artículos al mes
- **Con pipeline sin revisión:** cientos, y ninguno vale la pena

La ganancia real es de 3 a 5 veces, no de 50. Quien te promete cien artículos semanales de calidad está describiendo el escenario que te va a costar la visibilidad.

---

### Preguntas frecuentes

**¿Debo declarar que uso IA?**
No hay obligación general de etiquetar cada artículo, pero la transparencia sobre tu proceso editorial construye confianza. Una página de política editorial que explique cómo produces y verificas contenido es una buena práctica.

**¿Cuántos artículos publico al mes?**
Consistencia sobre volumen. Tres artículos semanales sostenidos durante un año valen más que cien de golpe y luego silencio.

**¿Y si mi competencia publica cien al mes sin revisar?**
Deja que lo hagan. El contenido genérico es cada vez más abundante y cada vez menos diferenciador. Lo escaso es la experiencia real.

---

**Escrito por Carlos Anaya Ruiz** — Consultor tecnológico. Diseño pipelines de contenido asistido por IA con revisión humana obligatoria.

---

### PROMPT DE PORTADA — Artículo 040

> Una línea de producción industrial abstracta e isométrica donde bloques informes y rugosos entran por la izquierda y salen por la derecha convertidos en placas pulidas y perfectamente ordenadas, con un puesto de inspección iluminado intensamente en el punto medio del recorrido. Acento ámbar sobre fondo negro carbón, materiales industriales, iluminación cálida focalizada en la estación de inspección.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.
