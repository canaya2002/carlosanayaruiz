---
n: 36
title: "MCP (Model Context Protocol): qué es y por qué importa"
slug: "model-context-protocol-mcp-que-es"
description: "MCP explicado: el protocolo abierto que conecta modelos de IA con tus herramientas y datos. Cómo funciona y cómo montar tu primer servidor."
category: "Inteligencia Artificial"
keyword: "model context protocol"
tipo: "satelite"
tags: ["mcp","integraciones","agentes","protocolo"]
---


**MCP es un estándar abierto para conectar asistentes de IA con fuentes de datos y herramientas externas.** Resuelve un problema de combinatoria: sin un estándar, cada asistente necesita una integración a medida con cada herramienta. Con MCP, escribes el servidor una vez y funciona con cualquier cliente compatible.

Es, conceptualmente, lo que hizo un puerto universal por los cables propietarios.

---

### El problema que resuelve

Antes: si tienes tres asistentes de IA y quieres conectarlos a cinco sistemas internos, necesitas quince integraciones distintas, cada una con su formato y su mantenimiento.

Con MCP: escribes cinco servidores. Cualquier cliente compatible los consume.

Y hacia el otro lado: cuando un proveedor publica un servidor MCP de su producto, todos los asistentes compatibles lo pueden usar sin trabajo adicional.

---

### Qué expone un servidor MCP

Tres tipos de capacidad:

**Herramientas (tools).** Acciones que el modelo puede ejecutar. Consultar la base de datos, crear un ticket, enviar un mensaje. Es lo que más se usa.

**Recursos (resources).** Datos que el cliente puede leer: archivos, registros, documentación. Se identifican por URI.

**Prompts.** Plantillas de instrucciones reutilizables que el servidor ofrece al cliente.

La mayoría de los servidores útiles exponen sobre todo herramientas.

---

### Un servidor mínimo

```ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'

const server = new McpServer({ name: 'crm-interno', version: '1.0.0' })

server.tool(
  'buscar_cliente',
  'Busca un cliente por correo o teléfono. Devuelve id, nombre, plan y saldo.',
  { criterio: z.string().describe('Correo electrónico o teléfono') },
  async ({ criterio }) => {
    const cliente = await db.cliente.findFirst({
      where: { OR: [{ email: criterio }, { telefono: criterio }] },
      select: { id: true, nombre: true, plan: true, saldo: true },
    })

    if (!cliente) {
      return { content: [{ type: 'text', text: 'No se encontró ningún cliente.' }] }
    }

    return { content: [{ type: 'text', text: JSON.stringify(cliente, null, 2) }] }
  }
)

const transport = new StdioServerTransport()
await server.connect(transport)
```

Eso es un servidor funcional. Lo conectas a un cliente compatible y el asistente ya puede consultar tu CRM.

---

### Las decisiones de diseño que importan

**1. La descripción de la herramienta es crítica.**
El modelo decide cuándo usar una herramienta basándose únicamente en su nombre y descripción. Sé explícito sobre qué hace, qué devuelve y en qué casos conviene. Una descripción vaga produce un agente que la usa mal o la ignora.

**2. Devuelve solo los campos necesarios.**
Un `SELECT *` que devuelve cincuenta columnas gasta contexto, cuesta dinero y puede exponer datos sensibles. Selecciona explícitamente.

**3. Los errores deben ser informativos.**
Si la herramienta falla, devuelve un mensaje que el modelo pueda usar para corregir. "Error 500" no le sirve. "El criterio debe ser un correo válido o un teléfono de 10 dígitos" sí.

**4. Herramientas de grano medio.**
Ni una sola herramienta que hace todo con veinte parámetros, ni cuarenta herramientas microscópicas. Una herramienta por operación de negocio comprensible.

**5. Los permisos van en el servidor.**
No confíes en que el modelo respete restricciones escritas en un prompt. Si un usuario no debe ver los datos de otra organización, el servidor filtra por la identidad del usuario. Siempre.

---

### Seguridad: lo que hay que tener presente

MCP le da a un modelo acceso a tus sistemas. Eso exige disciplina:

**Autenticación y contexto de usuario.** El servidor debe saber en nombre de quién actúa y aplicar los permisos de esa persona, no permisos de administrador genéricos.

**Separación de lectura y escritura.** Empieza con servidores de solo lectura. Añade escritura cuando tengas confianza y auditoría funcionando.

**Confirmación en operaciones irreversibles.** Borrar, enviar dinero, comunicar a clientes: el flujo debe requerir aprobación explícita.

**Cuidado con servidores de terceros.** Un servidor MCP ejecuta código en tu entorno y puede ver lo que le pasas. Revisa el origen antes de conectarlo, igual que revisarías una dependencia.

**Contenido no confiable.** Si una herramienta devuelve texto que viene de fuera —un correo, una página web, un comentario de usuario— ese texto puede contener instrucciones dirigidas al modelo. No le des a un agente que lee contenido externo herramientas de escritura sensibles.

---

### Qué construir primero

Si estás evaluando por dónde empezar, en orden de valor y menor riesgo:

1. **Consulta de solo lectura sobre tu base de datos principal.** Con permisos por usuario y campos seleccionados.
2. **Búsqueda en tu documentación interna.** Combina bien con RAG.
3. **Consulta de estado en sistemas operativos.** Tickets, pedidos, expedientes.
4. **Creación de registros con aprobación.** El primer paso hacia escritura.
5. **Operaciones transaccionales.** Solo con auditoría completa y límites en el código.

---

### Preguntas frecuentes

**¿MCP reemplaza a las APIs REST?**
No. Un servidor MCP normalmente **envuelve** tu API existente y la expone en el formato que los modelos entienden, con descripciones pensadas para que un modelo decida cuándo usarla.

**¿Puedo exponer un servidor MCP públicamente?**
Sí, con transporte HTTP y autenticación. Pero trátalo con el mismo rigor que cualquier API pública: autenticación, autorización, límites de tasa y registro.

**¿Sirve solo para asistentes conversacionales?**
No. Cualquier sistema agéntico puede consumir servidores MCP. Es un estándar de integración, no una función de producto.
