---
n: 62
title: "Infraestructura como código con Terraform: primeros pasos"
slug: "terraform-infraestructura-como-codigo"
description: "Terraform desde cero: estado remoto, módulos, entornos separados y las prácticas que evitan que un apply borre producción."
category: "DevOps"
keyword: "terraform"
tipo: "satelite"
tags: ["terraform","iac","infraestructura","automatización"]
---


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
