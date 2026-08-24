# LOTE 10 — ARTÍCULOS COMPLETOS 061–064
**Autor:** Carlos Anaya Ruiz · Listos para publicar

---
---

# ARTÍCULO 061

```yaml
title: "Cómo elegir región de nube para usuarios en LATAM"
slug: "elegir-region-cloud-latam"
description: "Cómo elegir región cloud para usuarios en México y LATAM: latencia real, costo por región, residencia de datos y estrategia de CDN."
author: "Carlos Anaya Ruiz"
category: "Cloud"
tags: ["latencia", "latinoamérica", "arquitectura", "cdn"]
keyword_principal: "región aws latinoamérica"
```

## Cómo elegir región de nube para usuarios en LATAM

**Para la mayoría de los productos con usuarios en México, una región del este o centro de Estados Unidos ofrece mejor combinación de latencia, costo y catálogo de servicios que las regiones sudamericanas.** Eso sorprende a mucha gente que asume que "más cerca geográficamente" significa "más rápido".

No siempre. La latencia depende de la topología de la red, no de la distancia en línea recta.

---

### Los cuatro factores de decisión

**1. Latencia real hacia tus usuarios.**
No la distancia. Mídelo: los proveedores publican herramientas de latencia entre regiones, y puedes hacer pruebas desde las ubicaciones de tus usuarios.

Para usuarios en México, las regiones del este y centro de Estados Unidos suelen ofrecer latencias muy competitivas por la densidad de interconexión entre México y esos puntos.

**2. Costo por región.**
Las regiones no cuestan lo mismo. Las sudamericanas suelen tener precios notablemente más altos que las de Estados Unidos para los mismos recursos. La diferencia puede ser sustancial en una factura mensual.

**3. Catálogo de servicios disponibles.**
No todos los servicios están en todas las regiones, y los nuevos llegan primero a las regiones principales. Si dependes de un servicio específico, verifica su disponibilidad antes de decidir.

**4. Residencia de datos y cumplimiento.**
Este es el factor que puede anular a los otros tres.

---

### Residencia de datos: cuándo es obligatorio quedarse

**En México**, la normativa de protección de datos personales no exige de forma general que los datos residan en territorio nacional. Lo que sí exige es:

- Informar en el aviso de privacidad si habrá transferencias, incluidas las internacionales
- Contar con la base de licitud correspondiente
- Que el encargado del tratamiento —tu proveedor de nube— mantenga las medidas de seguridad y esté vinculado contractualmente

Es decir: **puedes alojar fuera de México, pero debes declararlo y tenerlo contractualmente resuelto.**

**Sectores regulados** pueden tener requisitos adicionales. Servicios financieros, salud y contratación con el sector público suelen tener reglas específicas sobre dónde y cómo pueden residir ciertos datos. Si operas en uno de esos sectores, esa evaluación se hace con asesoría legal antes de elegir región, no después.

**Si tienes usuarios en Europa**, el marco europeo aplica y las transferencias internacionales requieren mecanismos específicos. Alojar en una región europea simplifica considerablemente ese análisis.

**Si tienes usuarios en Brasil**, la normativa brasileña tiene sus propios requisitos que conviene revisar.

**Regla práctica:** resuelve el cumplimiento primero, optimiza latencia y costo después. Migrar por un requisito legal descubierto tarde es mucho más caro que elegir bien desde el inicio.

---

### La arquitectura que resuelve casi todo

Para la gran mayoría de los productos, esta configuración da excelente resultado sin complejidad multi-región:

```
[CDN global]  ← estáticos, imágenes, assets, páginas cacheadas
      ↓
[Cómputo en una región principal]  ← lógica de aplicación
      ↓
[Base de datos en la misma región]  ← con réplica de lectura si aplica
```

**Por qué funciona:** la percepción de velocidad de un sitio la domina el contenido estático y la primera carga. Un CDN con presencia en Latinoamérica sirve esos recursos desde un punto cercano al usuario, independientemente de dónde esté tu servidor.

Las peticiones dinámicas van a tu región, y ahí unos 30-60 ms adicionales de latencia rara vez son perceptibles frente a lo que tarda tu propia consulta a base de datos.

**Dónde sí duele la distancia:** aplicaciones con muchas peticiones secuenciales al servidor por interacción. Si tu interfaz hace ocho llamadas encadenadas para pintar una pantalla, la latencia se multiplica por ocho. La solución ahí no es cambiar de región: es reducir el número de llamadas.

---

### Cuándo sí necesitas multi-región

Sé honesto: multi-región multiplica la complejidad operativa y el costo. Solo se justifica con una razón concreta:

- **Requisito legal** de residencia de datos en varios países.
- **Requisito contractual** de disponibilidad que una sola región no puede cumplir.
- **Base de usuarios verdaderamente global** con latencia inaceptable en alguna zona importante.
- **Continuidad de negocio** con tolerancia a fallo de región completa.

Si tu razón es "por si acaso" o "para estar preparados", no lo hagas todavía. La complejidad de mantener consistencia de datos entre regiones es considerable y muchos equipos la subestiman gravemente.

---

### Cómo medir la latencia real antes de decidir

**Paso 1.** Selecciona tres o cuatro regiones candidatas.

**Paso 2.** Levanta un endpoint mínimo en cada una que devuelva una respuesta trivial.

**Paso 3.** Mide desde las ubicaciones reales de tus usuarios. Puedes hacerlo con un script en tu propio sitio que mida y reporte, o con servicios de monitoreo sintético desde múltiples ubicaciones.

**Paso 4.** Compara percentil 95, no promedio. Y mide en distintos momentos del día: la congestión de red varía.

**Paso 5.** Contrasta la diferencia de latencia contra la diferencia de costo. Si una región es 40% más cara para ahorrar 25 ms que el usuario no percibe, la decisión es clara.

---

### Optimizaciones que valen más que cambiar de región

Antes de mover tu infraestructura, verifica que hayas hecho esto:

- **CDN configurado correctamente**, con caché agresivo en estáticos.
- **Compresión** activada.
- **Reducir el número de peticiones** por interacción. Es la optimización con mayor impacto.
- **Renderizado en servidor** con caché para páginas que no cambian por usuario.
- **Réplica de lectura** cerca de los usuarios si el problema es de consultas.
- **Conexiones persistentes** y reutilización correcta.

He visto sitios "lentos por la región" que en realidad hacían doce peticiones secuenciales y cargaban 4 MB de JavaScript.

---

### Preguntas frecuentes

**¿Y si mis usuarios están en varios países de LATAM?**
Una región de Estados Unidos con CDN global suele dar una latencia razonablemente uniforme en toda la región. Es la configuración más común y funciona bien.

**¿Vale la pena una región local por marketing?**
Si tus clientes preguntan dónde residen sus datos y eso influye en la venta, puede tener valor comercial aunque técnicamente no sea necesario. Es una decisión de negocio legítima; solo ten claro que es esa y no una decisión técnica.

**¿Cómo migro de región si ya estoy en producción?**
Con infraestructura como código, levantando el entorno completo en la nueva región, replicando datos, y cambiando el tráfico progresivamente. La parte compleja es siempre la base de datos: planifica la ventana y el mecanismo de sincronización con cuidado.

---

**Escrito por Carlos Anaya Ruiz** — Consultor tecnológico. Diseño arquitecturas para productos con usuarios en México y LATAM.

---

### PROMPT DE PORTADA — Artículo 061

> Un globo terráqueo abstracto construido con una malla oscura de líneas, centrado en América Latina, con nodos azules brillando en puntos geográficos clave y arcos de luz curvos midiendo las distancias entre ellos. Vista espacial desde fuera de la atmósfera. Fondo negro absoluto, iluminación azul fría, partículas suspendidas.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.

---
---

# ARTÍCULO 062

```yaml
title: "Infraestructura como código con Terraform: primeros pasos"
slug: "terraform-infraestructura-como-codigo"
description: "Terraform desde cero: estado remoto, módulos, entornos separados y las prácticas que evitan que un apply borre producción."
author: "Carlos Anaya Ruiz"
category: "DevOps"
tags: ["terraform", "iac", "infraestructura", "automatización"]
keyword_principal: "terraform"
```

## Infraestructura como código con Terraform: primeros pasos

**Terraform describe tu infraestructura en archivos versionados y la crea, modifica o destruye para que coincida con esa descripción.** El beneficio no es la automatización: es que la infraestructura deja de ser un conocimiento que vive en la cabeza de una persona y pasa a ser un artefacto revisable.

---

### El concepto que hay que entender primero: el estado

Terraform mantiene un archivo de estado que mapea lo que hay en tu descripción con lo que existe realmente en el proveedor. Es la pieza más importante y la que más problemas causa.

**Reglas del estado, no negociables:**

**1. El estado va remoto, nunca en local.** Si vive en tu máquina, nadie más puede trabajar y lo pierdes al cambiar de computadora.

**2. Con bloqueo.** Dos personas aplicando cambios simultáneamente corrompen el estado.

**3. Con versionado.** Necesitas poder volver a un estado anterior.

**4. Con cifrado.** El estado contiene información sensible: cadenas de conexión, a veces credenciales generadas.

```hcl
terraform {
  required_version = ">= 1.9"

  backend "s3" {
    bucket         = "mi-empresa-terraform-state"
    key            = "produccion/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}
```

**Nunca edites el archivo de estado a mano.** Si necesitas cambiarlo, usa los comandos específicos (`terraform state mv`, `terraform import`, `terraform state rm`). Editarlo directamente es la forma más rápida de dejar tu infraestructura en un estado irrecuperable.

---

### Estructura de proyecto

```
infraestructura/
├── modulos/
│   ├── red/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── base-datos/
│   └── aplicacion/
├── entornos/
│   ├── dev/
│   │   ├── main.tf
│   │   ├── terraform.tfvars
│   │   └── backend.tf
│   ├── staging/
│   └── produccion/
└── README.md
```

**Entornos completamente separados, con su propio estado.** Es la protección más importante que existe: un error en desarrollo no puede tocar producción porque son estados distintos.

**Nunca uses espacios de trabajo (workspaces) para separar entornos de producción.** Comparten configuración y el riesgo de aplicar en el entorno equivocado es alto. Directorios separados.

---

### Un módulo básico

```hcl
# modulos/base-datos/variables.tf
variable "entorno" {
  type        = string
  description = "Nombre del entorno (dev, staging, produccion)"
}

variable "clase_instancia" {
  type        = string
  description = "Tipo de instancia de la base de datos"
}

variable "multi_az" {
  type        = bool
  default     = false
  description = "Habilitar alta disponibilidad"
}

# modulos/base-datos/main.tf
resource "aws_db_instance" "principal" {
  identifier     = "${var.entorno}-principal"
  engine         = "postgres"
  engine_version = "16.4"
  instance_class = var.clase_instancia
  multi_az       = var.multi_az

  storage_type          = "gp3"
  allocated_storage     = 100
  storage_encrypted     = true

  backup_retention_period = var.entorno == "produccion" ? 30 : 7
  deletion_protection     = var.entorno == "produccion"
  skip_final_snapshot     = var.entorno != "produccion"

  tags = {
    Entorno   = var.entorno
    Gestion   = "terraform"
  }

  lifecycle {
    prevent_destroy = true
  }
}
```

**`prevent_destroy` en recursos críticos.** Hace que Terraform falle si un plan intentaría destruir ese recurso. Es una red de seguridad que ha salvado muchas bases de datos.

**`deletion_protection` condicional por entorno.** Producción protegida, desarrollo no.

---

### El flujo de trabajo seguro

```bash
terraform init          # Descarga proveedores y configura el backend
terraform fmt -check    # Verifica formato
terraform validate      # Verifica sintaxis
terraform plan -out=plan.tfplan    # Genera el plan y lo guarda
# ← REVISIÓN HUMANA DEL PLAN
terraform apply plan.tfplan        # Aplica exactamente ese plan
```

**El punto crítico: guarda el plan en un archivo y aplica ese archivo.**

Si haces `terraform apply` sin plan guardado, Terraform vuelve a calcular el plan en ese momento. Lo que apruebas visualmente y lo que se aplica pueden ser distintos si algo cambió en el intervalo.

**Cómo leer un plan:**
- `+` crear — normalmente seguro
- `~` modificar en sitio — revisar qué atributo
- `-/+` **destruir y recrear** — **peligro**, revisa siempre por qué
- `-` destruir — revisa siempre

**El símbolo `-/+` es el que hay que mirar con atención.** Ciertos cambios de atributo obligan a recrear el recurso. Si es una base de datos, eso significa perder los datos. Terraform te lo dice; hay que leerlo.

---

### En integración continua

```yaml
  plan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: hashicorp/setup-terraform@v3
      - run: terraform init
      - run: terraform fmt -check
      - run: terraform validate
      - run: terraform plan -no-color -out=plan.tfplan
      - name: Publicar el plan en el pull request
        run: # comentar la salida del plan en el PR

  apply:
    needs: plan
    environment: produccion    # Requiere aprobación humana
    steps:
      - run: terraform apply plan.tfplan
```

**El plan se publica en el pull request y se revisa como código.** Es la forma correcta de operar infraestructura en equipo: los cambios de infraestructura pasan por revisión igual que los cambios de aplicación.

---

### Los errores que causan incidentes

**1. Estado local o sin bloqueo.** Corrupción del estado con múltiples personas trabajando.

**2. Aplicar sin leer el plan.** El origen de la mayoría de los desastres.

**3. Cambios manuales en la consola.** Generan deriva: el estado real deja de coincidir con el descrito. La siguiente ejecución intentará "corregir" y puede destruir algo. **Si está gestionado por Terraform, se toca solo por Terraform.**

**4. Secretos en el código.** Nunca escribas credenciales en archivos `.tf` ni en `.tfvars` versionados. Usa un gestor de secretos y referencias.

**5. Un solo estado gigante.** Un estado con 500 recursos hace que cada `plan` tarde minutos y que cualquier error tenga alcance total. Divide por dominio: red, datos, aplicación.

**6. No fijar versiones.** Fija la versión de Terraform y de los proveedores. Una actualización automática puede cambiar comportamientos.

```hcl
terraform {
  required_version = "~> 1.9.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.60"
    }
  }
}
```

---

### Preguntas frecuentes

**¿Terraform u otra herramienta?**
Terraform tiene el ecosistema más amplio y es agnóstico de proveedor. Alternativas que permiten definir infraestructura en un lenguaje de programación general son buenas si tu equipo prefiere eso, a costa de que el código pueda volverse más complejo de lo necesario.

**¿Puedo importar infraestructura que ya existe?**
Sí, con `terraform import` o con bloques de importación. Es un trabajo tedioso pero factible, y vale la pena para poner bajo control lo que se creó a mano.

**¿Cómo empiezo si toda mi infraestructura está hecha a mano?**
No intentes importar todo. Empieza gestionando con Terraform solo lo nuevo, y ve importando lo existente por dominios conforme lo toques.

---

**Escrito por Carlos Anaya Ruiz** — Consultor tecnológico. Gestiono infraestructura como código en entornos de producción.

---

### PROMPT DE PORTADA — Artículo 062

> Un terreno tridimensional generándose bloque por bloque desde un plano base de líneas azules luminosas, con las estructuras emergiendo del suelo ya completamente formadas y ordenadas. Estilo construcción procedural. Vista isométrica. Fondo negro carbón, iluminación azul fría, retícula de referencia tenue bajo el terreno.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.

---
---

# ARTÍCULO 063

```yaml
title: "Kubernetes: ¿de verdad lo necesitas?"
slug: "kubernetes-cuando-usarlo"
description: "Cuándo Kubernetes vale la pena y cuándo es sobreingeniería cara. Criterios de decisión y qué usar si la respuesta es no."
author: "Carlos Anaya Ruiz"
category: "DevOps"
tags: ["kubernetes", "contenedores", "arquitectura", "devops"]
keyword_principal: "kubernetes cuándo usar"
```

## Kubernetes: ¿de verdad lo necesitas?

**Kubernetes resuelve problemas reales de orquestación de contenedores a escala. Y la mayoría de los equipos que lo adoptan no tienen esos problemas.** Lo adoptan porque es el estándar de la industria, y terminan pagando una complejidad operativa considerable para ejecutar tres servicios que cabrían en dos máquinas.

Esta es la evaluación honesta.

---

### Qué resuelve realmente

- **Programación de cargas** en un conjunto de máquinas, aprovechando la capacidad.
- **Autorreparación**: si un contenedor muere, se levanta otro.
- **Escalado automático** horizontal según métricas.
- **Despliegues progresivos** con reversión automática.
- **Descubrimiento de servicios** y balanceo interno.
- **Abstracción del proveedor**: la misma definición corre en cualquier nube.

Todos son beneficios reales. La pregunta es si los necesitas y cuánto cuesta obtenerlos.

---

### El costo real

**Complejidad conceptual.** Pods, servicios, ingress, volúmenes persistentes, configuraciones, secretos, políticas de red, cuentas de servicio y control de acceso. Es un sistema operativo distribuido con su propio modelo mental.

**Operación continua.** Actualizaciones del clúster, gestión de nodos, certificados, monitoreo del propio clúster. En un servicio gestionado el proveedor se encarga del plano de control, pero los nodos y las cargas siguen siendo tuyos.

**Depuración más difícil.** Un problema puede estar en el contenedor, en el pod, en el servicio, en el ingress, en la política de red, en el nodo o en el clúster. La superficie de diagnóstico se multiplica.

**Costo de infraestructura.** Un clúster tiene sobrecarga: el plano de control, los nodos con capacidad reservada, los componentes del sistema. Para cargas pequeñas, esa sobrecarga puede ser mayor que las cargas mismas.

**Costo de conocimiento.** Necesitas al menos una persona que lo entienda de verdad. Si esa persona se va, tienes un problema serio.

---

### Los criterios de decisión

**Kubernetes probablemente SÍ, si cumples tres o más:**

- Tienes más de 15-20 servicios distintos en producción.
- Necesitas escalado automático con variabilidad de carga real y significativa.
- Tienes un equipo con capacidad dedicada a plataforma.
- Requieres portabilidad entre nubes por razón concreta, no hipotética.
- Tus cargas son heterogéneas: distintos lenguajes, distintos requisitos de recursos.
- Ya estás pagando el costo de complejidad de otra forma y lo consolidarías.

**Kubernetes probablemente NO, si:**

- Tienes menos de 10 servicios.
- Tu carga es relativamente estable.
- Tu equipo es de menos de 8 personas sin rol dedicado a infraestructura.
- Tu producto es principalmente una aplicación web con base de datos.
- La razón principal para adoptarlo es "es lo que se usa" o "para estar preparados".

**El escenario que más veo:** cinco microservicios que en realidad deberían ser un monolito, corriendo en un clúster que cuesta más de operar que todo lo demás junto.

---

### Las alternativas, por orden de complejidad

**1. Plataforma como servicio.**
Empujas el código, la plataforma lo ejecuta. Sin contenedores que gestionar, sin nodos. Cubre la mayoría de las aplicaciones web y APIs.
*Cuándo: hasta que tengas requisitos que la plataforma no soporte.*

**2. Contenedores gestionados sin clúster.**
Defines una tarea en un contenedor y el servicio la ejecuta sin que tú administres máquinas. Te da contenedores reales, escalado y despliegue, sin el modelo mental de Kubernetes.
*Cuándo: necesitas contenedores y control, no necesitas orquestación compleja.*

**3. Máquinas virtuales con contenedores.**
Dos o tres instancias con Docker Compose detrás de un balanceador. Sorprendentemente viable para muchos productos.
*Cuándo: pocos servicios, carga predecible, equipo cómodo con administración de servidores.*

**4. Serverless.**
Funciones que se ejecutan por evento. Cero administración de infraestructura.
*Cuándo: cargas por evento, tráfico irregular, tolerancia a arranques en frío.*

**5. Kubernetes.**
*Cuándo: cumples los criterios de arriba.*

---

### Si decides adoptarlo, hazlo bien

**Usa un servicio gestionado.** Administrar el plano de control tú mismo solo tiene sentido en casos muy específicos.

**Empieza simple.** Despliegues, servicios, ingress. No metas malla de servicios, operadores personalizados y despliegues progresivos avanzados en el mes uno.

**Define límites y solicitudes de recursos desde el inicio.** Sin ellos, un contenedor con fuga de memoria puede tumbar un nodo entero.

**Todo declarativo y versionado.** Manifiestos en el repositorio, aplicados por pipeline. Nunca `kubectl apply` desde la máquina de alguien.

**Monitorea el clúster, no solo las aplicaciones.** Estado de nodos, presión de recursos, pods reiniciándose en bucle.

**Ten un plan de actualización.** Las versiones de Kubernetes tienen ciclo de soporte limitado. Actualizar es un proyecto recurrente que hay que presupuestar.

---

### El costo de la decisión equivocada

**Adoptarlo sin necesitarlo:** meses de curva de aprendizaje, incidentes por configuración, un costo de infraestructura mayor y un equipo dedicando tiempo a plataforma en lugar de a producto.

**No adoptarlo cuando lo necesitas:** despliegues manuales frágiles, escalado que requiere intervención, incidentes por falta de autorreparación.

El primer error es mucho más común que el segundo. Y el segundo se corrige migrando cuando el dolor sea evidente; el primero se corrige desmontando algo en lo que ya invertiste mucho.

---

### Preguntas frecuentes

**¿Puedo empezar simple y migrar después?**
Sí, y es lo recomendable. Si contenedorizas tu aplicación desde el inicio, migrar a Kubernetes más adelante es factible. Lo que no debes hacer es adoptar Kubernetes hoy "para no tener que migrar mañana".

**¿Y si mis clientes empresariales lo exigen?**
Ocurre en ventas empresariales, especialmente si el cliente quiere desplegarlo en su propia infraestructura. Es una razón de negocio válida. Solo ten claro que es esa la razón.

**¿Cuánto cuesta un clúster pequeño?**
Entre el plano de control gestionado y dos o tres nodos modestos, para producción estás en el rango de varios miles de pesos mensuales antes de tus propias cargas. Compáralo contra la alternativa antes de decidir.

---

**Escrito por Carlos Anaya Ruiz** — Consultor tecnológico. Recomiendo la arquitectura proporcional al problema, no la que se ve mejor en un diagrama.

---

### PROMPT DE PORTADA — Artículo 063

> Una maquinaria de precisión extremadamente compleja con decenas de engranajes azules entrelazados girando en múltiples planos, cuya única salida visible es un cubo simple y liso que emerge por un extremo. Contraste deliberado entre la complejidad del mecanismo y la simplicidad del resultado. Vista macro, fondo negro carbón, iluminación azul fría.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.

---
---

# ARTÍCULO 064

```yaml
title: "Disaster recovery: RTO, RPO y planes que sí funcionan"
slug: "disaster-recovery-rto-rpo"
description: "RTO y RPO explicados con números, las 4 estrategias de disaster recovery en la nube y cómo probar el plan sin romper producción."
author: "Carlos Anaya Ruiz"
category: "Cloud"
tags: ["disaster recovery", "continuidad", "rto", "rpo"]
keyword_principal: "rto rpo"
```

## Disaster recovery: RTO, RPO y planes que sí funcionan

**RTO es cuánto tiempo puedes estar caído. RPO es cuántos datos puedes permitirte perder.** Esos dos números determinan tu arquitectura de recuperación y su costo. Todo lo demás son detalles de implementación.

Y la mayoría de las empresas no los tiene definidos, lo cual significa que su plan de recuperación es una esperanza.

---

### Definir los dos números

**RTO (Recovery Time Objective).** Desde que ocurre el desastre hasta que el servicio vuelve a operar. Si tu RTO es de 4 horas y tardas 30, incumpliste.

**RPO (Recovery Point Objective).** Cuánto trabajo puedes perder. Si respaldas cada 24 horas, tu RPO es de 24 horas: en el peor caso pierdes un día completo de datos.

**Cómo definirlos:** no preguntes al área técnica. Pregunta al negocio.

- ¿Cuánto cuesta cada hora de operación detenida? Ingresos perdidos, penalizaciones contractuales, costo de personal parado, daño reputacional.
- ¿Qué pasa si perdemos las últimas 4 horas de datos? ¿Y las últimas 24? ¿Se puede reconstruir?

Con esos números puedes justificar la inversión. Sin ellos, cualquier propuesta de continuidad parece cara.

---

### Clasifica tus sistemas por nivel

Tratar todo con el mismo estándar es o carísimo o insuficiente.

| Nivel | Ejemplo | RTO típico | RPO típico |
|---|---|---|---|
| **Crítico** | Transaccional, cobros | < 1 hora | < 15 min |
| **Importante** | CRM, gestión interna | 4-8 horas | 1-4 horas |
| **Estándar** | Reportería, herramientas internas | 24-48 horas | 24 horas |
| **Diferible** | Archivo histórico | Días | Días |

La mayoría de los sistemas de una empresa mediana son "importante" o "estándar". Solo unos pocos son verdaderamente críticos.

---

### Las cuatro estrategias

**1. Respaldo y restauración.**
Respaldos periódicos hacia otra ubicación. Ante un desastre, se levanta la infraestructura y se restaura.
*RTO: horas a días. RPO: según frecuencia de respaldo. Costo: el más bajo.*

**2. Piloto encendido (pilot light).**
Los componentes centrales —principalmente la base de datos con replicación— están corriendo en la región secundaria, apagados o al mínimo. Ante un desastre, se escala y se activa.
*RTO: decenas de minutos a horas. RPO: minutos. Costo: bajo-medio.*

**3. Espera templada (warm standby).**
Una versión reducida pero funcional del entorno completo corriendo en paralelo. Ante un desastre, se escala y se redirige el tráfico.
*RTO: minutos. RPO: segundos a minutos. Costo: medio-alto.*

**4. Activo-activo.**
Dos regiones sirviendo tráfico simultáneamente. Si una cae, la otra absorbe todo.
*RTO: casi cero. RPO: casi cero. Costo: el más alto, y complejidad de consistencia de datos considerable.*

**Recomendación práctica:** la mayoría de las empresas medianas están bien con respaldo y restauración para sistemas estándar, y piloto encendido para los críticos. Activo-activo se justifica en muy pocos casos y muchos equipos lo subestiman: mantener consistencia de datos entre regiones activas es un problema difícil.

---

### Lo que la gente olvida incluir en el plan

**La configuración, no solo los datos.** Reglas de red, variables de entorno, certificados, configuración de DNS. Restaurar datos sin configuración te deja a mitad del camino.

**Los secretos.** Si tus credenciales viven solo en el sistema caído, no puedes levantar nada. Necesitas acceso a un gestor de secretos desde el entorno de recuperación.

**Las dependencias externas.** Tu proveedor de pagos, tu servicio de correo, tu API de terceros. ¿Tienen listas blancas de IP que hay que actualizar? ¿Certificados vinculados?

**El DNS.** El tiempo de propagación puede añadir minutos u horas a tu RTO. Un TTL bajo configurado de antemano es una preparación barata que ahorra mucho tiempo.

**La documentación.** Impresa o accesible sin acceso a tu infraestructura. Que no viva únicamente en el servidor que se cayó.

**El orden de arranque.** Qué se levanta primero, qué depende de qué. Sin esto documentado, la recuperación es prueba y error bajo presión.

**Las personas.** Quién decide activar el plan. Quién ejecuta. Quién comunica. Y qué pasa si esa persona está de vacaciones.

---

### Cómo probar el plan

Un plan no probado es ficción. Tres niveles de prueba, en orden:

**Nivel 1 — Simulacro de mesa (trimestral).**
El equipo se reúne, se plantea un escenario y se recorren las decisiones verbalmente. Dura 90 minutos y siempre encuentra huecos: contactos desactualizados, dependencias no consideradas, ambigüedad sobre quién decide.

**Nivel 2 — Restauración parcial (semestral).**
Restaurar un sistema real en un entorno aislado. **Cronometrar.** Verificar integridad de los datos abriendo archivos y consultando la base.

Lo que sale a la luz aquí, siempre: la restauración tarda más de lo asumido, falta la clave de cifrado del respaldo, o un respaldo llevaba meses corrupto sin que nadie lo supiera.

**Nivel 3 — Prueba de conmutación completa (anual).**
Activar la región secundaria con tráfico real. Es la prueba de verdad y la que casi nadie hace por miedo. Se hace en ventana planificada, con plan de reversión, y comunicando al equipo.

**Documenta cada prueba:** tiempo real de recuperación vs. RTO objetivo, qué falló, qué se corrigió. Esa documentación es también tu evidencia ante auditorías y clientes que preguntan.

---

### La métrica que importa

**RTO real medido, no RTO objetivo declarado.**

Si tu documento dice 4 horas y tu última prueba tardó 19, tu RTO real es 19 horas. Ese es el número que debes reportar y el que debes atacar.

---

### Preguntas frecuentes

**¿Cuánto debería costar mi estrategia de recuperación?**
Compara contra el costo de la caída. Si una hora detenido cuesta 80,000 pesos y tu RTO objetivo es de 4 horas, una inversión que garantice ese RTO tiene un techo racional de referencia claro.

**¿Multi-región es lo mismo que disaster recovery?**
No. Multi-región puede ser para latencia. Recuperación ante desastres requiere que la región secundaria pueda operar de forma independiente y que hayas probado que puede.

**¿Los respaldos del proveedor son suficientes?**
Los respaldos automáticos de un servicio gestionado cubren fallos del servicio, no un borrado accidental fuera de la ventana de retención ni un compromiso de tu cuenta. Necesitas una copia adicional, idealmente en otra cuenta y con inmutabilidad.

---

**Escrito por Carlos Anaya Ruiz** — Consultor tecnológico. Diseño y pruebo planes de continuidad para operaciones multi-sucursal.

---

### PROMPT DE PORTADA — Artículo 064

> Un reloj de arena tridimensional donde la arena está compuesta por partículas de datos azules luminosas cayendo, con un segundo reloj de arena idéntico y espejo ya completamente lleno esperando en el fondo desenfocado. Iluminación dramática lateral, fondo negro carbón, materiales de vidrio y metal oscuro, reflejo en la base.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.
