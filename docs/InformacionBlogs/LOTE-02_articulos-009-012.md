# LOTE 02 — ARTÍCULOS COMPLETOS 009–012
**Autor:** Carlos Anaya Ruiz · Listos para publicar

---
---

# ARTÍCULO 009

```yaml
title: "Chatbots con IA: cómo construir uno que realmente venda"
slug: "chatbot-con-inteligencia-artificial-que-vende"
description: "Cómo diseñar un chatbot con IA que califica leads y cierra ventas en lugar de frustrar clientes. Arquitectura, prompts y métricas."
author: "Carlos Anaya Ruiz"
category: "Inteligencia Artificial"
tags: ["chatbot", "ventas", "atención a clientes", "automatización"]
keyword_principal: "chatbot con inteligencia artificial"
```

## Chatbots con IA: cómo construir uno que realmente venda

**Un chatbot que vende no es el que responde más rápido, es el que califica bien y sabe cuándo salirse.** La mayoría de los bots fracasan porque están diseñados para contener al cliente dentro de la conversación, cuando su trabajo real es moverlo hacia adelante.

He construido bots que generan ventas y he apagado bots que las destruían. La diferencia casi nunca está en el modelo de IA. Está en el diseño de la conversación.

---

### Los tres trabajos de un bot de ventas

**Trabajo 1 — Responder lo que bloquea la decisión.** Precio, tiempos, cobertura, requisitos, garantía. El 70% de las conversaciones se resuelven aquí.

**Trabajo 2 — Calificar.** Averiguar si esta persona es cliente potencial real y qué necesita, sin someterla a un interrogatorio.

**Trabajo 3 — Entregar.** Pasar al humano, agendar, o cerrar la transacción según el caso.

Un bot que hace bien los tres vale mucho. Un bot que solo hace el primero es un FAQ caro. Un bot que intenta hacer los tres sin saber cuándo entregar es una fuga de ventas.

---

### La arquitectura mínima que funciona

```
Mensaje entrante
   ↓
[Clasificador] → ¿intención? ¿urgencia? ¿es cliente existente?
   ↓
[Recuperación de contexto] → RAG sobre catálogo, políticas, precios
   ↓                          + historial del contacto desde el CRM
[Generador] → respuesta con reglas de negocio en el prompt
   ↓
[Evaluador de escalamiento] → ¿debe pasar a humano?
   ↓
Respuesta + registro en CRM
```

El bloque que más se omite es el evaluador de escalamiento. Sin él, el bot pelea conversaciones que ya perdió.

---

### Las reglas de escalamiento que importan

Escala a humano de inmediato cuando detectes:

- **Intención de compra explícita.** "Quiero contratar", "cómo pago". Nunca dejes que un bot cierre una venta grande solo.
- **Frustración.** Repetición de la misma pregunta, mayúsculas, groserías, "quiero hablar con una persona". Esta última se respeta siempre, sin insistir.
- **Caso fuera de catálogo.** Si la respuesta no está en tu base de conocimiento, no la inventes: escala.
- **Tema sensible.** Reclamación formal, mención de aspectos legales, datos delicados.
- **Tres turnos sin avanzar.** Si después de tres intercambios el cliente no obtuvo lo que buscaba, se acabó el intento.

Regla dura: **el botón de "hablar con una persona" siempre visible y siempre funcional.** Esconderlo sube la contención y hunde la conversión.

---

### Cómo calificar sin interrogar

El error clásico es pedir cinco datos antes de dar cualquier valor. Nadie contesta un formulario disfrazado de chat.

El patrón que funciona es **valor primero, dato después**:

1. Responde la pregunta que hizo la persona. Completa, útil, sin condicionar.
2. Haz **una** pregunta de calificación, incrustada de forma natural en la respuesta.
3. Da más valor con esa nueva información.
4. Segunda pregunta, si la conversación lo permite.

Máximo tres datos en toda la conversación. Si necesitas más, es porque el proceso de venta requiere un humano.

---

### El prompt: lo que sí debe contener

Un prompt de bot de ventas serio tiene seis bloques:

1. **Identidad y alcance.** Quién es, de qué empresa, qué puede y qué no puede hacer.
2. **Reglas duras.** Nunca inventar precios. Nunca prometer plazos no confirmados. Nunca dar asesoría legal, médica o financiera. Nunca negar el paso a un humano.
3. **Información de negocio.** Inyectada por RAG, no escrita a mano en el prompt (se desactualiza).
4. **Tono.** Con dos o tres ejemplos reales de cómo responde tu mejor vendedor.
5. **Protocolo de escalamiento.** Las condiciones exactas y el formato de la transferencia.
6. **Manejo del "no sé".** Instrucción explícita: si la información no está en el contexto, decirlo y escalar. No improvisar.

Ese último bloque es el que separa un bot confiable de un generador de problemas.

---

### Métricas: las que sirven y las que engañan

**Miden mal:**
- *Tasa de contención* (conversaciones resueltas sin humano). Optimizarla te empuja a atrapar clientes que querían hablar con alguien.
- *Número de conversaciones*. Volumen no es resultado.
- *Satisfacción del chat*. Se responde al calor del momento y no predice la venta.

**Miden bien:**
- **Leads calificados generados** por cada 100 conversaciones.
- **Tasa de escalamiento exitoso**: de los que pasaron a humano, cuántos avanzaron.
- **Tiempo hasta primera respuesta útil**, no hasta primera respuesta.
- **Conversión atribuida**: ventas cerradas cuyo primer contacto fue el bot.
- **Tasa de abandono por turno**: en qué punto de la conversación se va la gente. Ahí está tu problema.

---

### Los cinco errores que matan la conversión

**1. Saludo genérico y menú de opciones.** Nadie quiere navegar un menú. Que la primera respuesta ya resuelva algo.

**2. Fingir que es humano.** Se descubre siempre y destruye la confianza. Declara que es un asistente automatizado y sigue adelante.

**3. Responder con párrafos largos.** En chat, tres líneas máximo por mensaje. Si necesitas más, divide o ofrece enviar un documento.

**4. No conocer al cliente que ya es cliente.** Si la persona ya está en tu CRM y el bot le pide su nombre otra vez, ya perdiste.

**5. Desplegarlo sin fase de revisión.** Las primeras dos semanas, un humano lee todas las conversaciones al final del día. Ahí sale el 80% de los ajustes.

---

### Preguntas frecuentes

**¿En qué canal conviene arrancar?**
En el que ya te escriben. Si el 80% de tus consultas llegan por WhatsApp, no empieces por un widget web.

**¿Cuánto tarda tener uno decente?**
De 3 a 6 semanas para un bot con RAG sobre tu catálogo e integración con CRM. Menos si es solo FAQ; más si debe ejecutar transacciones.

**¿Debe poder cobrar?**
Solo para tickets bajos y productos estandarizados. Para venta consultiva, el bot califica y agenda; el cierre es humano.

---

**Escrito por Carlos Anaya Ruiz** — Desarrollador y consultor. He implementado bots de atención y ventas sobre WhatsApp y web con integración a CRM.

---

### PROMPT DE PORTADA — Artículo 009

> Dos burbujas de conversación abstractas y geométricas, una de vidrio traslúcido y otra de luz violeta eléctrico sólida, entrelazándose en el aire en un flujo continuo que termina transformado en una forma de flecha direccional. Sin texto dentro de las burbujas. Fondo negro carbón, iluminación suave desde arriba, reflejo tenue en el suelo.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.

---
---

# ARTÍCULO 010

```yaml
title: "10 errores al implementar IA en tu empresa (y cómo evitarlos)"
slug: "errores-al-implementar-ia-empresa"
description: "Los 10 errores que hacen fracasar proyectos de IA en empresas, con el síntoma temprano de cada uno y cómo corregirlo antes de quemar presupuesto."
author: "Carlos Anaya Ruiz"
category: "Inteligencia Artificial"
tags: ["errores comunes", "gestión de proyectos", "inteligencia artificial", "implementación"]
keyword_principal: "errores al implementar inteligencia artificial"
```

## 10 errores al implementar IA en tu empresa (y cómo evitarlos)

**Los proyectos de IA casi nunca fracasan por la tecnología. Fracasan por decisiones que se tomaron antes de escribir la primera línea de código.** Estos son los diez errores que he visto repetirse, con la señal temprana que los delata.

---

### 1. Empezar por la herramienta y no por el problema

**Síntoma temprano:** la conversación arranca con "queremos implementar IA" en lugar de "este proceso nos está costando demasiado".

**Cómo evitarlo:** prohíbe el nombre de cualquier herramienta en las primeras dos reuniones. Habla solo de procesos, volúmenes y costos. La tecnología se elige al final, cuando el problema está definido.

---

### 2. No medir el punto de partida

**Síntoma temprano:** nadie sabe cuánto tarda hoy el proceso ni cuántas veces ocurre al mes.

**Cómo evitarlo:** dos semanas de medición antes de tocar nada. Volumen, tiempo por unidad, tasa de error, costo por hora cargado. Sin esos cuatro números, cualquier resultado posterior será opinión.

---

### 3. Automatizar un proceso roto

**Síntoma temprano:** al documentar el proceso aparecen cinco excepciones no escritas y tres personas que lo hacen distinto.

**Cómo evitarlo:** arregla y estandariza primero. Automatizar el caos produce caos más rápido y más caro. A veces el rediseño del proceso ya entrega la mitad del beneficio esperado, sin IA.

---

### 4. Ignorar a quien hace el trabajo hoy

**Síntoma temprano:** el proyecto lo diseñan dirección y un proveedor externo, sin nadie de la operación en la mesa.

**Cómo evitarlo:** la persona que ejecuta el proceso participa desde el diagnóstico. Sabe las excepciones que no están documentadas, y si no participa, no defenderá el sistema. La resistencia interna mata más proyectos que los errores técnicos.

---

### 5. Subestimar la preparación de datos

**Síntoma temprano:** "los documentos están en la carpeta compartida" dicho con confianza.

**Cómo evitarlo:** audita antes de cotizar. Cuántos archivos, en qué formatos, cuántos escaneados sin texto, cuántas versiones duplicadas, quién puede ver qué. Entre el 30% y el 60% del esfuerzo real de un proyecto está aquí.

---

### 6. Saltarse la fase de revisión humana

**Síntoma temprano:** el plan contempla despliegue directo a producción sin periodo de validación.

**Cómo evitarlo:** los primeros 60 días, toda salida pasa por aprobación humana con registro de si se aprobó, corrigió o descartó. Esos datos son los que te dicen si funciona. Sin ellos, estás adivinando.

---

### 7. Esperar precisión determinista

**Síntoma temprano:** el criterio de éxito es "que no falle nunca".

**Cómo evitarlo:** define un umbral realista según el riesgo. Para clasificación de correos, 92% puede ser excelente. Para generación de documentos legales, ningún umbral sustituye la revisión. Si el proceso exige exactitud absoluta y repetible, usa reglas deterministas, no un modelo generativo.

---

### 8. No presupuestar la operación

**Síntoma temprano:** el presupuesto tiene una cifra única de desarrollo y nada mensual.

**Cómo evitarlo:** presupuesta tokens, infraestructura, mantenimiento y soporte. Un sistema de IA se degrada solo: cambian los documentos, cambian los modelos, cambian los procesos. Entre 15% y 25% anual del costo de desarrollo, únicamente para mantenerlo vivo.

---

### 9. Ignorar el cumplimiento normativo

**Síntoma temprano:** nadie preguntó si los datos que va a procesar el sistema son datos personales.

**Cómo evitarlo:** si procesas datos personales en México, aplica la LFPDPPP: aviso de privacidad actualizado con las finalidades reales, base de licitud, y un proveedor con acuerdo de tratamiento que no entrene con tu información. Si tienes clientes en Europa, entra también el marco europeo. Resolverlo al final cuesta rehacer el sistema.

---

### 10. Arrancar demasiado ancho

**Síntoma temprano:** el alcance incluye tres departamentos y cinco tipos de documento en la fase uno.

**Cómo evitarlo:** un proceso, un tipo de documento, un equipo. Extender después es barato; rescatar un piloto sobredimensionado es caro y quema la credibilidad interna para el siguiente intento.

---

### La señal que predice el fracaso antes que ninguna otra

**Adopción semanal por debajo del 40%** a los dos meses. Puedes tener métricas técnicas impecables, pero si la gente no lo usa, el proyecto ya murió y todavía no lo sabes.

Cuando veas esa señal, no inviertas en más funciones. Ve a hablar con los usuarios. La causa casi siempre es una de tres: no confían en el resultado, es más lento que su forma actual, o nadie les explicó bien para qué sirve.

---

### Preguntas frecuentes

**¿Cuándo hay que apagar un proyecto?**
Cuando a los seis meses el ahorro proyectado a doce no supera la inversión total, y no identificas una causa corregible concreta. Apagar a tiempo es una decisión profesional, no un fracaso.

**¿Conviene un piloto o ir directo a producción?**
Piloto siempre, pero con un alcance que sea representativo. Un piloto con casos fáciles seleccionados a mano no prueba nada.

**¿Cuál de los diez es el más caro?**
El número 3. Automatizar un proceso roto multiplica el problema en lugar de resolverlo, y además consume el presupuesto que necesitabas para arreglarlo.

---

**Escrito por Carlos Anaya Ruiz** — Consultor tecnológico. He rescatado proyectos de IA y he recomendado cerrar otros. Ambas cosas enseñan.

---

### PROMPT DE PORTADA — Artículo 010

> Una estructura geométrica de cristal violeta eléctrico parcialmente fracturada, suspendida sobre un vacío negro, con las grietas emitiendo luz roja tenue desde el interior. Los fragmentos desprendidos flotan alrededor congelados en el aire. Iluminación dramática lateral, altísimo contraste, fondo negro absoluto.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.

---
---

# ARTÍCULO 011

```yaml
title: "Ciberseguridad para PyMEs: guía completa"
slug: "ciberseguridad-para-pymes-guia"
description: "Guía completa de ciberseguridad para PyMEs: las 12 medidas que cubren el 90% del riesgo real, ordenadas por impacto y costo."
author: "Carlos Anaya Ruiz"
category: "Ciberseguridad"
tags: ["ciberseguridad", "pymes", "seguridad informática", "prevención"]
keyword_principal: "ciberseguridad para pymes"
tipo: "pillar"
```

## Ciberseguridad para PyMEs: guía completa

**Las PyMEs no son atacadas por ser interesantes: son atacadas por ser fáciles.** La inmensa mayoría de los incidentes que veo en empresas medianas no involucran técnicas sofisticadas. Involucran una contraseña reutilizada, un correo bien redactado y la ausencia total de respaldos verificados.

La buena noticia es que doce medidas cubren la enorme mayoría del riesgo real, y ocho de ellas son gratuitas o casi.

---

### El modelo de amenaza real de una PyME

Olvida las películas. Estos son los cuatro escenarios que de verdad ocurren:

1. **Fraude por correo comprometido.** Alguien accede al correo de un directivo o del área de pagos y desvía una transferencia. Es el que más dinero mueve.
2. **Ransomware.** Cifran tus archivos y piden rescate. Suele entrar por correo o por un acceso remoto expuesto.
3. **Robo de credenciales por reutilización.** Filtraron la contraseña de un servicio cualquiera, y esa misma contraseña abría el correo corporativo.
4. **Empleado saliente con accesos vivos.** No siempre es malicioso, pero el riesgo es idéntico.

Nota lo que no está en la lista: hackers atravesando firewalls. Eso es raro. Lo común es humano y aburrido.

---

### Las 12 medidas, ordenadas por retorno

#### Nivel 1 — Hazlo esta semana (costo casi nulo)

**1. MFA en todo lo que lo soporte.**
Correo, banca, sistemas administrativos, accesos remotos. Es la medida individual que más ataques detiene. Prioriza aplicaciones autenticadoras o llaves físicas sobre SMS.

**2. Gestor de contraseñas para todo el equipo.**
Elimina de un golpe la reutilización y las contraseñas en post-its y hojas de cálculo. Cuesta poco por usuario y resuelve el vector de ataque más común.

**3. Revisión de accesos.**
Lista todos los sistemas y quién entra a cada uno. Vas a encontrar cuentas de gente que ya no trabaja ahí. Ciérralas hoy.

**4. Actualizaciones automáticas activadas.**
Sistemas operativos, navegadores, aplicaciones críticas. La mayoría de los ataques usan fallas conocidas y parcheadas hace meses.

#### Nivel 2 — Este mes (costo bajo)

**5. Respaldos con la regla 3-2-1.**
Tres copias, en dos medios distintos, una fuera de sitio. Y al menos una **inmutable**: que no se pueda borrar ni cifrar aunque el atacante tenga credenciales de administrador.

**6. Prueba de restauración.**
Un respaldo que nunca has restaurado no es un respaldo, es una esperanza. Restaura algo real cada trimestre y cronometra cuánto tardas.

**7. Separación de la cuenta de administrador.**
Nadie navega ni lee correo con una cuenta administrativa. Cuentas separadas: una para trabajo diario, otra para tareas administrativas.

**8. Protocolo de verificación de pagos.**
Toda instrucción de transferencia o cambio de datos bancarios se confirma por un canal distinto al que llegó, con una persona conocida, por voz. Esta sola regla frena el fraude de correo comprometido.

#### Nivel 3 — Este trimestre (costo medio)

**9. Cierre de servicios expuestos a internet.**
Escritorio remoto, bases de datos y paneles de administración no deben ser accesibles desde cualquier IP del mundo. Acceso por VPN o lista blanca.

**10. Protección de endpoints con detección.**
Un antivirus tradicional ya no basta. Necesitas una solución que detecte comportamiento anómalo, no solo firmas conocidas.

**11. Capacitación con simulacros.**
Una plática anual no sirve. Envía simulacros de correo malicioso cada trimestre, mide quién hace clic, y capacita sin castigar. El objetivo es que reporten, no que se escondan.

**12. Plan de respuesta a incidentes escrito.**
Quién decide, a quién se llama, qué se desconecta primero, cómo se comunica. Una hoja, impresa, accesible sin acceso a la red. Nadie improvisa bien a las 2 de la mañana.

---

### Lo que no necesitas todavía

Para una empresa de menos de 200 personas, estas cosas suelen ser gasto prematuro:

- Centro de operaciones de seguridad propio
- Herramientas de correlación de eventos de gama alta
- Certificaciones internacionales, salvo que un cliente te las exija por contrato
- Pruebas de intrusión anuales, antes de tener las 12 medidas anteriores cubiertas

Contratar una prueba de intrusión sin haber activado MFA es como poner una alarma en una casa con la puerta abierta.

---

### Presupuesto orientativo (empresa de 40 personas)

| Concepto | Costo anual aproximado (MXN) |
|---|---|
| Gestor de contraseñas | 20,000 – 35,000 |
| MFA | Incluido en la mayoría de las suites |
| Protección de endpoints | 45,000 – 90,000 |
| Respaldo en la nube con inmutabilidad | 25,000 – 70,000 |
| Capacitación y simulacros | 20,000 – 50,000 |
| Consultoría de diagnóstico inicial | 40,000 – 100,000 |
| **Total** | **150,000 – 345,000** |

Compáralo con el costo de un solo incidente de ransomware, que en una empresa mediana rara vez baja de los cientos de miles considerando días de operación detenida.

---

### Qué hacer si ya te pasó algo

1. **Aísla, no apagues.** Desconecta de la red los equipos afectados, pero no los apagues: se pierde evidencia en memoria.
2. **Cambia credenciales** desde un equipo limpio, empezando por correo y banca.
3. **Documenta todo** con hora y detalle desde el minuto uno.
4. **Llama a alguien con experiencia** antes de tomar decisiones irreversibles.
5. **Evalúa obligaciones de notificación.** Si hubo datos personales comprometidos, hay deberes legales que atender.
6. **No pagues antes de agotar tus respaldos.** Y si consideras pagar, entiende que no hay garantía de recuperación y que puede haber implicaciones legales.

---

### Preguntas frecuentes

**¿Necesito contratar a alguien de seguridad de tiempo completo?**
Por debajo de 150 empleados, casi nunca. Un responsable interno con apoyo de consultoría externa periódica funciona mejor y cuesta menos.

**¿El seguro cibernético vale la pena?**
Puede ayudar, pero léelo con cuidado: la mayoría de las pólizas exigen controles mínimos —MFA, respaldos— y no pagan si no los tenías activos.

**¿Por dónde empiezo si solo puedo hacer una cosa?**
MFA en el correo corporativo. Es la medida con mejor relación entre esfuerzo y riesgo eliminado.

---

**Escrito por Carlos Anaya Ruiz** — Consultor tecnológico. Trabajo en infraestructura y seguridad para empresas multi-sucursal.

---

### PROMPT DE PORTADA — Artículo 011

> Un escudo geométrico facetado hecho de placas de vidrio cian traslúcido, ensamblándose capa por capa alrededor de un núcleo de luz cálida que representa el negocio. Fondo negro carbón con partículas suspendidas en el aire. Iluminación azul fría desde atrás y cálida desde el núcleo, contraste bicromático, espacio negativo a la derecha.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.

---
---

# ARTÍCULO 012

```yaml
title: "Qué es el phishing y cómo protegerte (con ejemplos reales)"
slug: "que-es-phishing-como-protegerte"
description: "Qué es el phishing, cómo identificarlo en 8 señales y qué hacer exactamente si ya hiciste clic. Con ejemplos reales anonimizados."
author: "Carlos Anaya Ruiz"
category: "Ciberseguridad"
tags: ["phishing", "fraude digital", "correo", "seguridad"]
keyword_principal: "qué es phishing"
```

## Qué es el phishing y cómo protegerte

**El phishing es un fraude en el que alguien se hace pasar por una entidad de confianza para que entregues credenciales, dinero o acceso.** Llega por correo, mensaje, llamada o mensajería instantánea, y hoy está redactado tan bien que los consejos de hace diez años —"fíjate en las faltas de ortografía"— ya no sirven.

Es el punto de entrada de la mayoría de los incidentes graves en empresas. No porque la gente sea descuidada, sino porque los ataques están diseñados por gente que estudia cómo trabajamos.

---

### Los cinco tipos que vas a encontrar

**Phishing masivo.** Miles de correos idénticos suplantando a un banco o servicio popular. Baja tasa de éxito, volumen enorme.

**Spear phishing.** Dirigido a una persona concreta, con información real sobre ella: su jefe, su proyecto, su proveedor. Mucho más peligroso.

**Fraude del directivo.** Suplantan a alguien de la dirección para solicitar una transferencia urgente y confidencial. Explota jerarquía y prisa.

**Vishing.** Por llamada telefónica. Cada vez más frecuente con voces clonadas.

**Smishing y phishing por mensajería.** SMS o WhatsApp con enlaces. Especialmente efectivo en móvil, donde no ves la URL completa.

---

### Las 8 señales que sí funcionan hoy

1. **Urgencia artificial.** "Antes de las 6", "se suspende tu cuenta hoy". La prisa apaga el pensamiento crítico. Es la señal más confiable de todas.

2. **Solicitud de secreto.** "No comentes esto con nadie del equipo todavía." Ninguna solicitud legítima de dinero necesita ocultarse de los compañeros.

3. **Cambio de datos bancarios.** Un proveedor de siempre que "cambió de cuenta". Es uno de los fraudes más rentables que existen.

4. **El dominio del remitente.** No el nombre visible, el dominio real. Una letra cambiada, un guion añadido, un dominio parecido pero distinto.

5. **Enlace que no coincide con su texto.** En computadora, pasa el cursor sin hacer clic y mira a dónde apunta. En móvil, mantén presionado para previsualizar.

6. **Petición de credenciales o códigos.** Ninguna institución legítima te va a pedir tu contraseña ni el código de verificación de seis dígitos. Nadie. Nunca.

7. **Archivo adjunto inesperado.** Especialmente si te pide activar contenido, macros o permisos al abrirlo.

8. **Contexto ligeramente fuera de lugar.** El tono no es el de esa persona. El horario es raro. La firma cambió. Esa sensación de "algo no cuadra" es información: hazle caso.

---

### El protocolo de verificación que corta el 95% de los casos

Una sola regla, aplicada sin excepciones:

> **Cualquier solicitud de dinero, credenciales, datos bancarios o accesos se verifica por un canal distinto al que llegó, con un contacto que tú ya tenías guardado, por voz.**

Distinto canal significa: si llegó por correo, llamas. Si llegó por WhatsApp, llamas al número que ya tenías, no al que aparece en el mensaje.

Contacto ya guardado significa: no uses el teléfono que viene en el correo sospechoso. Ese es parte del ataque.

Por voz significa: no por texto. Una voz conocida es más difícil de falsificar que un mensaje escrito, aunque con clonación de voz esto también está cambiando. Si la llamada suena extraña, haz una pregunta cuya respuesta solo esa persona sepa.

---

### Si ya hiciste clic: los primeros 15 minutos

**Si solo abriste el enlace y no escribiste nada:**
Cierra la pestaña. Reporta al área de sistemas. Riesgo bajo, pero repórtalo igual.

**Si escribiste tu contraseña:**
1. Cambia esa contraseña de inmediato desde otro dispositivo.
2. Cambia la misma contraseña en cualquier otro servicio donde la hayas reutilizado.
3. Revisa y cierra todas las sesiones activas de esa cuenta.
4. Verifica que no se hayan creado reglas de reenvío automático en tu correo. Este es el paso que casi todos olvidan y es el que usan los atacantes para leer tu correspondencia durante meses.
5. Reporta a sistemas y a tu banco si aplica.

**Si autorizaste un pago:**
Llama al banco en ese instante. Los primeros minutos son los que determinan si se puede detener la transferencia. Después denuncia formalmente.

**Si descargaste un archivo:**
Desconecta el equipo de la red. No lo apagues. Llama a soporte.

---

### Cómo proteger a la empresa, no solo a las personas

**Controles técnicos:**
- Autenticación de correo correctamente configurada en tu dominio (SPF, DKIM y DMARC en modo de rechazo). Impide que suplanten tu propio dominio.
- Etiquetado automático de correos externos.
- MFA en todo. Aunque roben la contraseña, no entran.
- Bloqueo de macros en documentos descargados de internet.
- Alertas automáticas ante creación de reglas de reenvío.

**Controles humanos:**
- Simulacros trimestrales, medidos.
- Cultura de reporte sin castigo. Si castigas al que hace clic, dejan de avisarte y pierdes horas críticas.
- Un canal de reporte de un solo paso: un botón, un correo, algo inmediato.

**Métrica que importa:** no el porcentaje de clics, sino el **tiempo promedio hasta el primer reporte**. Bajarlo de horas a minutos vale más que reducir un poco los clics.

---

### Preguntas frecuentes

**¿La IA hizo el phishing más peligroso?**
Sí, en calidad de redacción y personalización. Los errores gramaticales ya no son una señal fiable. Por eso el protocolo de verificación importa más que nunca: no depende de detectar el engaño, sino de confirmar por otro lado.

**¿Sirven los filtros de correo?**
Detienen la mayoría del volumen, pero los ataques dirigidos pasan. Son necesarios, no suficientes.

**¿Y si el correo viene de un compañero real?**
Puede ser que su cuenta esté comprometida. Si la petición es inusual, verifica igual. La confianza en la persona no valida el mensaje.

---

**Escrito por Carlos Anaya Ruiz** — Consultor tecnológico especializado en infraestructura y seguridad para empresas de servicios.

---

### PROMPT DE PORTADA — Artículo 012

> Un anzuelo de pesca minimalista hecho de cromo oscuro descendiendo desde la parte superior del encuadre hacia un sobre de correo hecho de luz cian que flota inocente en la parte inferior. Alrededor, un agua abstracta digital compuesta por líneas de código difuminadas y partículas suspendidas. Tensión visual, mucho espacio negro vacío, iluminación cian fría con un acento rojo tenue en la punta del anzuelo.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.
