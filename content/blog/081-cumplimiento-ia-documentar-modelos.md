---
n: 81
title: "Cumplimiento en IA: cómo documentar tus modelos y decisiones"
slug: "cumplimiento-ia-documentar-modelos"
description: "Qué documentar de tus sistemas de IA para cumplir y para auditarte: model cards, registro de decisiones, evaluación de sesgo y trazabilidad."
category: "Cumplimiento"
keyword: "cumplimiento normativo inteligencia artificial"
tipo: "satelite"
tags: ["gobernanza ia","documentación","sesgo algorítmico","auditoría"]
---


**Si tu sistema de IA toma o influye en decisiones sobre personas, necesitas poder explicar cómo funciona, con qué datos, qué se evaluó y quién supervisa.** No solo por regulación: porque el día que alguien impugne una decisión, la respuesta "el modelo lo decidió" no es defendible.

Este artículo es informativo y no constituye asesoría legal.

---

### Qué documentar, por nivel de impacto

**Nivel bajo — el sistema asiste sin decidir.**
Redacción asistida, resúmenes, sugerencias que un humano evalúa.
*Documenta:* qué modelo usas, para qué, y qué datos le envías.

**Nivel medio — el sistema clasifica o prioriza.**
Enrutamiento de tickets, priorización de leads, detección de anomalías.
*Documenta:* lo anterior más criterios de clasificación, métricas de desempeño y proceso de revisión de errores.

**Nivel alto — el sistema influye en decisiones sobre personas.**
Evaluación de candidatos, calificación crediticia, detección de fraude que bloquea cuentas, moderación que restringe acceso.
*Documenta:* todo lo anterior más evaluación de sesgo, punto de supervisión humana, mecanismo de impugnación y registro completo de decisiones.

---

### La ficha del modelo

Un documento por cada sistema de IA en producción:

```markdown
# Ficha de sistema: Clasificador de solicitudes entrantes

## Identificación
- Nombre y versión del sistema
- Responsable técnico y responsable de negocio
- Fecha de puesta en producción
- Última revisión

## Propósito
- Qué problema resuelve
- Qué decisión toma o informa
- Quién se ve afectado por sus resultados

## Componente de IA
- Modelo utilizado y proveedor
- Versión del modelo
- Técnica: prompting / RAG / ajuste fino
- Datos que se le proporcionan en cada invocación

## Datos
- Fuentes de datos utilizadas
- Datos personales tratados y su base legal
- Retención de entradas y salidas
- Datos que explícitamente NO se envían al modelo

## Desempeño
- Métricas de evaluación y valores actuales
- Conjunto de pruebas utilizado (tamaño, composición)
- Casos conocidos donde falla
- Fecha de la última evaluación

## Supervisión humana
- En qué punto interviene una persona
- Qué puede hacer esa persona (aprobar, modificar, revertir)
- Tasa de intervención observada

## Riesgos identificados
- Riesgo de sesgo y cómo se evaluó
- Riesgo de error y su impacto
- Medidas de mitigación aplicadas

## Impugnación
- Cómo puede una persona afectada cuestionar una decisión
- Plazo y proceso de revisión
```

**Esto no es burocracia:** es el documento que te salva cuando un cliente, una autoridad o tu propio equipo pregunta cómo funciona algo que se construyó hace ocho meses.

---

### Registro de decisiones automatizadas

Para sistemas de impacto medio o alto, cada decisión debe quedar registrada de forma que puedas reconstruirla:

```sql
CREATE TABLE decisiones_automatizadas (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sistema             text NOT NULL,
  version_sistema     text NOT NULL,
  version_modelo      text NOT NULL,
  sujeto_id           uuid,              -- persona afectada
  entrada_hash        text NOT NULL,     -- hash de los datos de entrada
  entrada_resumen     jsonb,             -- campos relevantes, no todo
  resultado           jsonb NOT NULL,
  confianza           numeric,
  reviso_humano       boolean DEFAULT false,
  revisor_id          uuid,
  resultado_final     jsonb,             -- si el humano modificó
  creado_en           timestamptz DEFAULT now()
);
```

**Puntos importantes:**

- **Versión del sistema y del modelo.** Sin esto no puedes explicar por qué el mismo caso dio resultados distintos en fechas distintas.
- **Resumen de entrada, no la entrada completa.** Guardar todo puede ser desproporcionado y crear un problema de datos personales. Guarda los campos que determinaron la decisión.
- **Distinguir el resultado del modelo del resultado final.** Si un humano modificó la decisión, ambos datos importan.
- **Retención definida.** Este registro también contiene datos personales.

---

### Evaluación de sesgo

Obligatoria si tu sistema clasifica o evalúa personas, y buena práctica en cualquier caso.

**El proceso:**

**1. Define los grupos relevantes.** Según el contexto: género, edad, región, tipo de cliente. Considera qué características podrían generar trato desigual injustificado.

**2. Mide el desempeño por grupo.** No el desempeño global. Un sistema con 92% de precisión global puede tener 97% en un grupo y 71% en otro.

**3. Compara tasas de resultado.** ¿El sistema aprueba, rechaza o prioriza en proporciones muy distintas entre grupos? Si sí, ¿hay una justificación objetiva?

**4. Documenta hallazgos y decisiones.** Incluyendo los casos donde encontraste diferencia y decidiste que estaba justificada, con el razonamiento.

**5. Repite periódicamente.** El sesgo puede aparecer con el tiempo si cambian los datos de entrada.

**Advertencia técnica:** para medir sesgo necesitas datos sobre las características protegidas, y esos datos suelen ser sensibles. Hay una tensión real entre no recopilar datos sensibles y poder verificar que no discriminas. Resuélvela con asesoría, no improvisando: hay enfoques que permiten la evaluación con agregación y minimización.

---

### El mecanismo de impugnación

Si tu sistema afecta a personas, deben poder cuestionar el resultado.

**Lo mínimo:**
- Informarles que hubo un componente automatizado en la decisión
- Un canal claro para solicitar revisión
- Revisión por una persona con capacidad real de modificar el resultado
- Plazo de respuesta definido
- Explicación comprensible de los factores principales

**"Explicación comprensible" no significa mostrar los pesos del modelo.** Significa decir qué factores pesaron: "la solicitud se priorizó como baja porque el documento no incluía los campos X e Y, y porque la fecha del trámite estaba fuera del rango habitual".

---

### La gobernanza mínima viable

Para una empresa pequeña o mediana, sin montar una estructura pesada:

```
□ Inventario de sistemas de IA en producción
□ Ficha de sistema por cada uno, actualizada
□ Clasificación por nivel de impacto
□ Conjunto de evaluación versionado por sistema
□ Registro de decisiones en sistemas de impacto medio/alto
□ Evaluación de sesgo documentada donde aplique
□ Punto de supervisión humana definido
□ Proceso de impugnación publicado
□ Responsable identificado por sistema
□ Revisión trimestral de desempeño
□ Contratos con proveedores de modelo revisados
```

**Una persona puede sostener esto** si el número de sistemas es manejable. Lo importante es que exista y esté actualizado, no que sea extenso.

---

### Preguntas frecuentes

**¿Esto aplica si uso un modelo de un tercero?**
Sí. Tú eres responsable del sistema que construiste, aunque el modelo sea de otro. Y necesitas verificar qué documentación te proporciona tu proveedor.

**¿Cada cuánto reviso las fichas?**
Trimestralmente, y siempre que cambies de modelo, de versión, o modifiques significativamente el prompt o los datos.

**¿Qué pasa si mi sistema falla y afecta a alguien?**
Tener la documentación y el registro no evita el problema, pero te permite identificar la causa, corregirla y demostrar que actuaste con diligencia. Sin ellos, no puedes hacer ninguna de las tres cosas.
