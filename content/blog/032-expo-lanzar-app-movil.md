---
n: 32
title: "Expo: cómo lanzar tu app móvil desde el código que ya tienes"
slug: "expo-lanzar-app-movil"
description: "Cómo llevar tu producto web a iOS y Android con Expo: estructura compartida, EAS Build, updates OTA y qué sí necesita código nativo."
category: "Desarrollo"
keyword: "expo react native"
tipo: "satelite"
tags: ["expo","react native","móvil","eas"]
---


**Expo es un conjunto de herramientas sobre React Native que elimina la mayor parte del trabajo de configuración nativa.** Si ya tienes un producto web en React, es el camino más corto a tener una app en las tiendas sin contratar dos equipos.

Lo que no es: una forma de reutilizar tu interfaz web tal cual. Compartes lógica, tipos y datos. La interfaz se rehace.

---

### Qué se comparte y qué no

| Capa | ¿Se comparte? |
|---|---|
| Tipos y contratos | Sí, completamente |
| Cliente de API y consultas | Sí |
| Lógica de negocio y validaciones | Sí |
| Gestión de estado | Sí |
| Utilidades y formateo | Sí |
| Componentes de interfaz | **No** |
| Estilos | **No** (React Native no usa CSS) |
| Navegación | Parcialmente conceptual |

**Regla realista:** entre 40% y 60% del código puede compartirse si tu arquitectura separa bien lógica de presentación. Si tu lógica vive dentro de los componentes, ese porcentaje baja mucho.

---

### Estructura en monorepo

```
mi-producto/
├── apps/
│   ├── web/              # Next.js
│   └── movil/            # Expo
└── packages/
    ├── tipos/            # Compartido
    ├── api/              # Cliente de API compartido
    ├── logica/           # Reglas de negocio compartidas
    ├── ui-web/           # Componentes web
    └── ui-movil/         # Componentes móviles
```

Los paquetes compartidos no deben importar nada específico de web ni de móvil. Si `packages/logica` importa `next/navigation`, ya no es compartible.

---

### Arranque

```bash
npx create-expo-app@latest movil
cd movil
npx expo start
```

Con la aplicación Expo Go en tu teléfono escaneas el código y ya estás viendo la app. Sin Xcode, sin Android Studio, sin cadena de compilación.

Esa velocidad de arranque es el argumento principal de Expo.

---

### Navegación basada en archivos

Expo Router usa la misma idea que el App Router de Next.js, lo cual reduce mucho la carga mental si vienes de ahí:

```
app/
├── _layout.tsx           # Layout raíz
├── index.tsx             # Pantalla inicial
├── (auth)/
│   ├── login.tsx
│   └── registro.tsx
└── (app)/
    ├── _layout.tsx       # Navegación por pestañas
    ├── inicio.tsx
    ├── perfil.tsx
    └── pedido/
        └── [id].tsx      # Ruta dinámica
```

```tsx
// app/(app)/_layout.tsx
import { Tabs } from 'expo-router'

export default function AppLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="inicio" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil' }} />
    </Tabs>
  )
}
```

---

### EAS Build: compilar sin Mac

El obstáculo clásico del desarrollo iOS era necesitar una Mac. EAS Build compila en la nube.

```bash
npm install -g eas-cli
eas login
eas build:configure

eas build --platform ios --profile preview
eas build --platform android --profile production
```

`eas.json` define los perfiles:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": { "simulator": false }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

Y para enviar a las tiendas:

```bash
eas submit --platform ios
eas submit --platform android
```

**Sigues necesitando** cuentas de desarrollador de Apple y Google, y pasar por revisión. EAS elimina la infraestructura, no los requisitos de las tiendas.

---

### Actualizaciones sin pasar por la tienda

Una de las capacidades más valiosas: puedes publicar cambios de JavaScript directamente a los dispositivos.

```bash
eas update --branch production --message "Corrección en el flujo de pago"
```

**Qué puedes actualizar así:** lógica en JavaScript, interfaz, textos, correcciones de errores, estilos.

**Qué NO puedes:** agregar módulos nativos nuevos, cambiar permisos del sistema, modificar la configuración nativa. Eso requiere compilación y envío a la tienda.

**Restricción importante:** las tiendas permiten estas actualizaciones siempre que no cambien sustancialmente el propósito de la app ni introduzcan funcionalidad que no pasó revisión. Usarlo para eludir la revisión es motivo de retiro. Úsalo para corregir y mejorar, no para lanzar productos distintos.

---

### Cuándo necesitas código nativo

Expo cubre la mayoría de las necesidades con sus módulos: cámara, notificaciones, biometría, ubicación, almacenamiento seguro, compras dentro de la app, mapas.

Necesitas más cuando requieres:
- Un SDK de un proveedor sin módulo de Expo disponible.
- Procesamiento intensivo que debe correr en nativo.
- Widgets del sistema operativo o extensiones.
- Integraciones muy específicas de hardware.

La solución no es abandonar Expo: son los **plugins de configuración**, que permiten modificar el proyecto nativo de forma declarativa manteniendo el flujo de trabajo gestionado.

---

### Errores frecuentes al empezar

**Intentar reutilizar componentes web.** No funciona. React Native no tiene `div`, ni CSS, ni DOM. Rehaz la interfaz; comparte la lógica.

**Ignorar las diferencias entre plataformas.** Los gestos, la navegación hacia atrás, las notificaciones y los permisos se comportan distinto en iOS y Android. Prueba en ambos desde el inicio, no al final.

**Probar solo en simulador.** El rendimiento y los permisos se comportan diferente en dispositivo real. Prueba en un teléfono de gama media, no en el más nuevo.

**Dejar la configuración de tiendas para el final.** Los perfiles de firma, los identificadores y las políticas de privacidad toman más tiempo del esperado. Empieza ese trámite en paralelo al desarrollo.

**No planear el modo sin conexión.** En móvil la conectividad se pierde constantemente. Decide desde el diseño qué pasa cuando no hay red.

---

### Preguntas frecuentes

**¿Expo o React Native puro?**
Expo, salvo que tengas una necesidad nativa muy específica desde el inicio. Y aun así, los plugins de configuración cubren la mayoría de esos casos.

**¿El rendimiento es suficiente?**
Para la gran mayoría de aplicaciones de negocio, sí. Para juegos o procesamiento gráfico intensivo, evalúa nativo.

**¿Cuánto tarda llevar un producto web a las tiendas?**
Con lógica ya compartible y una interfaz de complejidad media: de 6 a 12 semanas incluyendo revisión de tiendas. La revisión de Apple suele tomar días y puede requerir iteraciones.
