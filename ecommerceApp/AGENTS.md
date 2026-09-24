# AGENTS.md - Guía Técnica para Desarrolladores e IA

Documentación arquitectónica y técnica para equipos de desarrollo y agentes de IA que mantienen y evolucionan EcommerceApp.

---

## 📋 Descripción Técnica del Proyecto

**EcommerceApp** es una aplicación full-stack de comercio electrónico que implementa un flujo completo de compra online. El backend expone una API REST que maneja autenticación, gestión de productos, órdenes, carritos y cupones. El frontend es una aplicación HTML/CSS/JavaScript vanilla que consume esa API.

**Responsabilidades**:
- Backend: Lógica de negocio, autenticación, persistencia de datos, validaciones
- Frontend: Interfaz de usuario, gestión de estado en localStorage, consumo de API
- Base de datos: Almacenamiento relacional con 12 modelos

---

## 🏗️ Arquitectura General

```
┌──────────────────────────────────────┐
│      Frontend (HTML/CSS/JS)          │
│  - 5 páginas principales             │
│  - Fetch API para comunicación       │
│  - localStorage para JWT             │
└────────────────┬─────────────────────┘
                 │
         HTTP REST con JSON
                 │
┌────────────────▼─────────────────────┐
│      Backend (Express Server)        │
│  - Puerto 3000                       │
│  - Middlewares: Auth                 │
│  - 9 routers                         │
│  - 12 controladores                  │
│  - Validaciones de negocio           │
└────────────────┬─────────────────────┘
                 │
         Sequelize ORM
                 │
┌────────────────▼─────────────────────┐
│    SQLite3 (ecommerce.sqlite)        │
│  - 12 modelos/tablas                 │
│  - Relaciones FK definidas           │
│  - Hooks para hashing de passwords   │
└──────────────────────────────────────┘
```

**Capas**:
1. **Presentation**: Frontend HTML + CSS + JS (vanilla)
2. **API**: Express routers y middlewares
3. **Business Logic**: Controllers
4. **Data Access**: Sequelize models
5. **Database**: SQLite3

---

## 🛠️ Tecnologías Utilizadas

| Capa | Tecnología | Versión | Propósito |
|------|-----------|---------|----------|
| **Runtime** | Node.js | 18+ | Ejecución de código JavaScript |
| **Web Framework** | Express | 5.x | Servidor HTTP y rutas |
| **ORM** | Sequelize | 6.x | Abstracción de base de datos |
| **Base de Datos** | SQLite3 | 6.x | Almacenamiento relacional |
| **Environment** | dotenv | 17.x | Variables de entorno |
| **Autenticación** | Crypto nativo | - | JWT manual y scrypt |
| **Frontend** | Vanilla JS | ES6+ | Sin frameworks |
| **Markup** | HTML5 | - | Estructura semántica |
| **Styling** | CSS3 | - | Estilos y responsive |

**NO usa**: React, Vue, TypeScript, bcryptjs, jsonwebtoken, mongoDB

---

## 📂 Organización del Código

### Backend (`backend/`)

#### Punto de entrada
```
server.js
├─ Inicializa Express
├─ Registra middlewares globales
├─ Monta todos los routers
├─ Sirve frontend desde ../frontend
└─ Inicia servidor en puerto 3000
```

#### src/config/
```
database.js
└─ Configuración de Sequelize
   - Lee DB_DIALECT y DB_STORAGE de .env
   - Retorna instancia de Sequelize
```

#### src/models/ (12 modelos)
```
Usuario.js          - Cuentas con roles y contraseñas
Producto.js         - Catálogo con precio, stock, descuentos
Categoria.js        - Organización de productos
Carrito.js          - Carrito personal por usuario
ItemCarrito.js      - Items dentro del carrito
OrdenCompra.js      - Órdenes finalizadas
DetalleOrden.js     - Detalles de cada orden
Cupon.js            - Códigos de descuento
Pago.js             - Registros de pagos
Envio.js            - Seguimiento de envíos
seed.js             - Datos iniciales
index.js            - Exportaciones y relaciones
```

**Hooks en modelos**:
- `Usuario.beforeCreate`: Hashea contraseña antes de insertar
- `Usuario.beforeUpdate`: Hashea contraseña si cambió
- Similar para `Producto.beforeCreate` etc.

#### src/controllers/ (12 controladores)
```
authController.js        - Login (genera JWT)
usuarioController.js     - Register, CRUD usuarios
productosController.js   - CRUD productos
categoriaController.js   - CRUD categorías
carritoController.js     - Get/create carrito
itemCarritoController.js - Add/update/delete items
ordenCompraController.js - Create orden, get mis-compras
detalleOrdenController.js - CRUD detalles
cuponController.js       - CRUD cupones
pagoController.js        - Registrar pagos
envioController.js       - CRUD envíos
ordenController.js       - Funciones auxiliares
```

**Patrón en controladores**:
- Validación de entrada
- Búsqueda en BD
- Lógica de negocio
- Manejo de errores
- Respuesta JSON

#### src/routes/ (9 routers)
```
auth.js              → /api/auth/login
user.js              → /api/register, /api/usuarios/:id
products.js          → /api/productos*
categoria.js         → /api/categorias*
carrito.js           → /api/carrito
itemCarrito.js       → /api/itemCarrito
ordenCompra.js       → /api/ordenes
detalleOrden.js      → /api/detalles
cupon.js             → /api/cupon
pago.js              → /api/pago
envio.js             → /api/envio
```

**Patrón en rutas**:
```javascript
router.get('/path', [middleware], controller.method);
```

Middlewares usados:
- `authenticateToken`: Valida JWT en header Authorization
- `isAdmin`: Verifica que req.user.role === 'admin'

#### src/middlewares/
```
authMiddleware.js
├─ authenticateToken(req, res, next)
│  ├─ Extrae token de Authorization header
│  ├─ Valida token con verifyToken()
│  ├─ Asigna req.user si válido
│  └─ Retorna 401/403 si inválido
│
└─ isAdmin(req, res, next)
   ├─ Verifica req.user.role === 'admin'
   └─ Retorna 403 si no es admin
```

#### src/utils/
```
jwt.js
├─ signToken(payload, expiresInSeconds)    → Genera JWT
├─ verifyToken(token)                      → Valida y decodifica
└─ Implementación manual con Node.js crypto

password.js
├─ hashPassword(password)                  → Hashea con scrypt
└─ comparePassword(plain, stored)          → Compara segura
```

### Frontend (`frontend/`)

#### HTML Pages
```
index.html        - Catálogo, búsqueda, carrito
login.html        - Formulario de login
register.html     - Formulario de registro
profile.html      - Perfil de usuario, historial
admin.html        - Panel administrativo
```

#### CSS
```
css/style.css     - Estilos globales y responsive
```

#### JavaScript
```
shared.js
├─ getStoredUser()           - Lee usuario de localStorage
├─ loginUser(email, pass)    - POST login, almacena token
├─ logoutUser()              - Limpia localStorage
├─ getToken()                - Retorna token
├─ getAuthHeaders()          - Authorization header
├─ formatMoney(), formatArsCurrency()
└─ Funciones comunes

app.js            - Lógica del catálogo (index.html)
login.js          - Manejo del login
register.js       - Manejo del registro
profile.js        - Historial de órdenes
admin.js          - Panel administrativo
```

---

## 🎯 Convenciones del Proyecto

### Idioma
- **Nombres en Español**: Todos los identificadores de negocio
  - Variables: `nombreProducto`, `idUsuario`, `precioFinal`
  - Funciones: `crearProducto()`, `validarEmail()`, `calcularTotal()`
  - Rutas: `/api/productos`, `/api/categorias`, `/api/ordenes`
  - Tablas/Modelos: `Usuario`, `Producto`, `OrdenCompra`, `DetalleOrden`

### Archivos y Carpetas
- Controladores: `nombreController.js` (camelCase)
- Modelos: `NombreCapitalizado.js` (PascalCase)
- Rutas: `nombre.js` (minúsculas)
- Utilidades: `nombre.js` (minúsculas)
- Variables de entorno: `MAYÚSCULAS_CON_GUIONES` (SNAKE_CASE)

### Convenciones de Rutas API
- Verbos HTTP: GET (leer), POST (crear), PUT (actualizar), DELETE (eliminar)
- Plurales para colecciones: `/api/productos`, `/api/usuarios`
- Singulares para acciones: `/api/auth/login`
- Protecciones: Rutas admin usan middlewares `authenticateToken, isAdmin`

### Respuestas JSON
- **Success**: `{ message, data }` o `{ success: true, token, user }`
- **Error**: `{ error: "descripción" }`
- **Status codes**: 200, 201, 400, 401, 403, 404, 500

### Validaciones
- Entrada: En controladores antes de acceder BD
- Negocio: En controllers, no en models
- Modelos: Solo validaciones de tipo de datos

---

## 🔄 Flujo de Ejecución

### Inicio de la Aplicación
```
npm start
  ↓
server.js inicia
  ├─ Importa todas las rutas
  ├─ Llama initializeDatabase()
  │  ├─ Sequelize.sync() crea tablas si no existen
  │  └─ seedDatabase() inserta datos iniciales
  ├─ Express listen en puerto 3000
  └─ console.log("Servidor corriendo...")

Frontend carga en http://localhost:3000
  ├─ Express sirve frontend desde ../frontend
  └─ Archivos HTML/CSS/JS se cargan
```

### Flujo de Autenticación
```
Usuario escribe email/password en login.html
  ↓
JavaScript captura submit del formulario
  ↓
fetch POST /api/auth/login
  ├─ Body: { email, password }
  └─ Headers: Content-Type: application/json
  ↓
authController.login()
  ├─ Busca Usuario por email
  ├─ Compara password con comparePassword()
  ├─ Genera token con signToken()
  └─ Retorna { success: true, token, user }
  ↓
Frontend recibe respuesta
  ├─ localStorage.setItem('token', token)
  ├─ localStorage.setItem('user', JSON.stringify(user))
  └─ Redirige a index.html o admin.html según role
```

### Flujo de Petición Autenticada
```
Frontend hace GET /api/ordenes/mis-compras
  ├─ Token = localStorage.getItem('token')
  ├─ Headers = { Authorization: `Bearer ${token}` }
  └─ fetch con headers
  ↓
Express recibe petición
  ↓
authMiddleware.authenticateToken()
  ├─ Extrae token de Authorization header
  ├─ Llama verifyToken(token)
  ├─ Si válido: req.user = { id, nombre, email, role }
  └─ Si inválido: res.status(403)
  ↓
ordenCompraController.getMisCompras()
  ├─ Accede a req.user.id
  ├─ Consulta OrdenCompra con usuario_id = req.user.id
  └─ Retorna solo órdenes del usuario
```

### Flujo de Crear Producto (Admin)
```
Admin en admin.html hace click en "Crear Producto"
  ↓
Llena formulario (nombre, precio, stock, etc.)
  ↓
JavaScript POST /api/productos
  ├─ Body: { nombre, precio, stock, id_categoria, ... }
  ├─ Headers incluyen Authorization: Bearer <token>
  └─ fetch
  ↓
Express recibe petición
  ↓
authMiddleware.authenticateToken() → verifica token
  ↓
authMiddleware.isAdmin() → verifica role === 'admin'
  ↓
productosController.create()
  ├─ Valida que id_categoria existe
  ├─ Valida precios, stock, etc.
  ├─ Producto.create() en BD
  ├─ Hook beforeCreate ejecuta (validaciones adicionales)
  └─ Retorna { message, producto }
  ↓
Frontend recibe 201
  ├─ Muestra mensaje éxito
  ├─ Actualiza lista de productos
  └─ Lanza evento sync en BroadcastChannel
```

---

## 🔧 Reglas Para Modificar el Proyecto

### Al Modificar un Modelo

```
□ Revisar relaciones en models/index.js
□ Verificar si hay hooks (beforeCreate, beforeUpdate)
□ Buscar referencias en controladores
□ Buscar referencias en rutas
□ Actualizar seed.js si es necesario
□ Probar que las relaciones FK funcionan
□ Verificar que el tipo de dato es correcto (DataTypes)
```

**Ejemplo**: Si modificas `Producto.js`:
- Revisar `productosController.js` (usa campos)
- Revisar `server.js` (endpoint checkout usa Producto)
- Revisar `routes/products.js` (valida campos)
- Revisar `models/index.js` (Producto.hasMany DetalleOrden)

### Al Modificar una Ruta API

```
□ Verificar que el path y método HTTP son correctos
□ Revisar middlewares (auth, isAdmin)
□ Buscar referencias en frontend
□ Actualizar frontend si cambia el endpoint
□ Verificar que los datos de entrada/salida son iguales
□ Probar con Postman/Thunder Client
□ Revisar manejo de errores
□ Mantener códigos HTTP estándar (200, 201, 400, 401, 403, 404)
```

**Ejemplo**: Si cambias `POST /api/productos` a `POST /api/crear-producto`:
- Buscar referencias en `admin.js`
- Cambiar fetch URL en `admin.js`
- Cambiar en `routes/products.js`
- Revisar que body sigue siendo igual

### Al Modificar la Base de Datos

```
□ Revisar relaciones (FK) en models/index.js
□ Verificar que cascada de eliminación es correcta
□ Actualizar modelos si cambias columnas
□ Revisar todos los controladores que usan esa tabla
□ Probar migraciones (aunque Sequelize.sync() las maneja)
□ Revisar seed.js
□ Verificar hooks de validación
```

### Al Agregar una Nueva Funcionalidad

```
□ Crear/modificar modelo en src/models/
□ Crear/modificar controlador en src/controllers/
□ Crear/modificar router en src/routes/
□ Registrar router en server.js
□ Crear componente frontend en frontend/js/
□ Crear página HTML si es necesario
□ Incluir middlewares de autenticación si es necesario
□ Probar manualmente
□ Actualizar seed.js si es necesario
```

---

## 🔗 Dependencias Entre Módulos

```
Usuario
├─ → OrdenCompra (1:N)
├─ → Carrito (1:1)
└─ → Password hasher

Producto
├─ → Categoria (N:1)
├─ → DetalleOrden (1:N)
├─ → ItemCarrito (1:N)
└─ → Stock management

OrdenCompra
├─ → DetalleOrden (1:N)
├─ → Cupon (N:1)
├─ → Usuario (N:1)
├─ → Pago (1:1)
└─ → Envio (1:1)

DetalleOrden
├─ → Producto (N:1)
└─ → OrdenCompra (N:1)

Carrito
├─ → ItemCarrito (1:N)
└─ → Usuario (N:1)

ItemCarrito
├─ → Carrito (N:1)
└─ → Producto (N:1)

Cupon
├─ → OrdenCompra (1:N)
├─ Validación de fechas
└─ Validación de descuento

JWT Token
├─ → Generado por authController.login()
├─ → Verificado por authMiddleware.authenticateToken()
└─ → Decodificado por productosController (para isAdmin)
```

---

## ⚠️ Puntos Críticos (High Risk Areas)

### 1. Autenticación y JWT
- **Ubicación**: `src/utils/jwt.js`, `src/middlewares/authMiddleware.js`
- **Riesgo**: Token expirado, token inválido, rol incorrecto
- **Validar**: Cada petición protegida verifica token
- **Mantener**: JWT_SECRET en .env, nunca en código

### 2. Autorización (isAdmin)
- **Ubicación**: Todas las rutas admin usan `isAdmin` middleware
- **Riesgo**: Usuario client intenta acceso admin
- **Validar**: `req.user.role === 'admin'`
- **Mantener**: Aplicar a TODAS las rutas sensibles

### 3. Checkout y Transacciones
- **Ubicación**: `server.js` endpoint `/api/checkout`
- **Riesgo**: Fallo a mitad de la transacción
- **Validar**: Stock disponible, cupón válido, total correcto
- **Mantener**: Atomicidad (todo o nada)

### 4. Stock de Productos
- **Ubicación**: `productosController.js`, server.js checkout
- **Riesgo**: Overselling (vender más del disponible)
- **Validar**: Antes de crear DetalleOrden
- **Mantener**: Decrementar stock solo en checkout confirmado

### 5. Contraseñas
- **Ubicación**: `src/utils/password.js`, hooks en Usuario.js
- **Riesgo**: Contraseña almacenada en plain text
- **Validar**: Sempre hashear antes de guardar
- **Mantener**: Usar scrypt, comparar con timingSafeEqual

### 6. Validación de Cupones
- **Ubicación**: `cuponController.js`, server.js checkout
- **Riesgo**: Cupón vencido, inactivo o descuento incorrecto
- **Validar**: Fecha actual está entre validoDesde y validoHasta
- **Mantener**: Usar validación estricta

### 7. Relaciones de Base de Datos
- **Ubicación**: `models/index.js` (todas las relaciones)
- **Riesgo**: Foreign key orphaned, inconsistencia de datos
- **Validar**: Cada create/update respeta FK
- **Mantener**: Cascada ON DELETE correcta

---

## ✅ Buenas Prácticas

### Código General
- ✓ Reutilizar funciones utilitarias (`shared.js`, `utils/`)
- ✓ No duplicar lógica de negocio
- ✓ Mantener español en nombres de negocio
- ✓ Usar const/let, no var
- ✓ Funciones pequeñas y enfocadas
- ✓ Validar entrada siempre

### Backend
- ✓ Validar entrada en controllers, no en routes
- ✓ Usar middlewares para autenticación
- ✓ Retornar códigos HTTP estándar
- ✓ Capturar errores con try/catch
- ✓ No loguear contraseñas
- ✓ Usar req.user después de authMiddleware

### Frontend
- ✓ Usar getToken() para obtener JWT
- ✓ Incluir Authorization header en fetch
- ✓ Manejar 401/403 (redirigir a login)
- ✓ Limpiar formularios después de submit exitoso
- ✓ Mostrar mensajes de error al usuario
- ✓ Usar localStorage para token y user info

### Base de Datos
- ✓ Definir relaciones en models/index.js
- ✓ Usar hooks para validaciones complejas
- ✓ Cascada ON DELETE para integridad referencial
- ✓ Índices en búsquedas frecuentes
- ✓ Validar tipos de datos en modelos

---

## 📋 Checklist Antes de Realizar Cambios

### Antes de Editar Cualquier Archivo

```
□ Entender qué hace el archivo actualmente
□ Buscar todas las referencias a lo que vas a cambiar
  - grep en src/
  - grep en frontend/js/
  - Revisar modelos que lo importan
□ Verificar impacto del cambio (qué se va a romper)
□ Si es ruta API, buscar en frontend dónde se llama
□ Si es modelo, revisar relaciones en models/index.js
□ Si es controlador, verificar rutas que lo usan
□ Hacer backup mental del estado anterior
```

### Antes de Crear Archivo Nuevo

```
□ ¿Es realmente necesario un archivo nuevo?
□ ¿Puedo reutilizar código existente?
□ ¿Dónde debería ir según la estructura?
□ ¿Qué debe importarse/exportarse?
□ ¿Qué es la dependencia de este archivo?
□ ¿Cómo se registra en server.js si es router?
```

### Antes de Cambiar Modelos

```
□ Revisar relaciones en models/index.js
□ Revisar todos los controllers que usan el modelo
□ Revisar seed.js (data inicial)
□ Verificar hooks (beforeCreate, beforeUpdate)
□ Probar que el sync() de Sequelize funciona
□ Verificar que las validaciones tipo DataTypes son correctas
□ Revisar frontend para campos que cambien
```

### Antes de Cambiar Rutas API

```
□ Documentar endpoint actual (path, método, params)
□ Buscar en frontend qué pages lo usan
□ Verificar middlewares de auth/isAdmin
□ Verificar que body de entrada sigue igual
□ Verificar que respuesta sigue igual
□ Probar con curl/Postman antes de pushear
□ Actualizar frontend si cambió algo
```

### Antes de Hacer Commit

```
□ El código compila sin errores
□ Los cambios están completos (no a mitad)
□ Probaste manualmente en navegador
□ No hay console.log() de debug
□ No hay dependencias nuevas sin necesidad
□ El código sigue las convenciones del proyecto
□ No hay archivos innecesarios
□ El mensaje del commit es descriptivo
```

---

## 🤖 Recomendaciones para Agentes de IA

### Filosofía General
- **Mantén la arquitectura actual**: No refactorices sin necesidad
- **Reutiliza código existente**: No dupliques lógica
- **Prefiere modificar a crear**: Agrega a archivos existentes antes de crear nuevos
- **Mantén consistencia**: Sigue patrones que ves en el código

### Antes de Escribir Código
```javascript
// ✓ Bien: Busca funciones existentes
import { formatMoney } from './shared.js';
const formatted = formatMoney(precio);

// ✗ Mal: Duplicar lógica
const formatted = Math.round(precio * 100) / 100;
```

### Cambios en Rutas API
```javascript
// ✓ Actualiza TODAS las referencias
// 1. Cambiar routes/file.js
// 2. Cambiar frontend/js/page.js que la usa
// 3. Probar que funciona end-to-end

// ✗ No cambies solo la ruta sin actualizar frontend
```

### Nuevos Endpoints
```javascript
// ✓ Estructura completa
// 1. Crear/modificar controlador
// 2. Crear/modificar router
// 3. Registrar en server.js
// 4. Incluir middlewares auth/isAdmin
// 5. Validar entrada
// 6. Crear página frontend si es necesario

// ✗ No dejes endpoints sin autenticación si es necesaria
```

### Cambios en Modelos
```javascript
// ✓ Proceso completo
// 1. Modificar archivo Modelo.js
// 2. Actualizar relaciones en models/index.js
// 3. Actualizar seed.js
// 4. Revisar controladores que usan el modelo
// 5. Actualizar rutas si cambia validación
// 6. Actualizar frontend si cambian campos

// ✗ No cambies modelo sin actualizar relaciones
```

### Trabajar con Frontend
```javascript
// ✓ Localización de variables
// - Token: localStorage.getItem('token')
// - Usuario: localStorage.getItem('user')
// - Funciones: shared.js
// - Eventos: addEventListener

// ✗ No uses document.write(), usa DOM APIs
// ✗ No uses var, usa const/let
// ✗ No olvides await en fetch calls
```

### Validaciones
```javascript
// ✓ Validar siempre
try {
  if (!email || !email.includes('@')) throw new Error('Email inválido');
  const user = await Usuario.findOne({ where: { email } });
  if (!user) throw new Error('Usuario no encontrado');
} catch (error) {
  return res.status(400).json({ error: error.message });
}

// ✗ No confíes en datos del cliente
// ✗ No hagas validaciones solo en frontend
```

### Testing Manual
Antes de completar cualquier cambio:
```
□ Accede a http://localhost:3000
□ Prueba el flujo completo
□ Abre DevTools Console para errores
□ Revisa Network tab para peticiones
□ Prueba casos de error
□ Prueba como usuario normal y admin
```

### Cuando Algo No Funciona
```
1. Revisar error en console.log (backend y frontend)
2. Verificar que endpoint existe en routes/
3. Verificar que está registrado en server.js
4. Verificar que frontend está llamando correctamente
5. Revisar que el modelo existe en src/models/
6. Revisar que el controlador existe en src/controllers/
7. Verificar middleware de auth si es protegido
8. Revisar variables de entorno en .env
```

---

## 🎓 Resumen Ejecutivo

**EcommerceApp** es un proyecto bien estructurado que sigue patrones claros:
- Backend MVC con Express + Sequelize
- Frontend vanilla conectado vía API REST
- Autenticación con JWT implementado manualmente
- Base de datos relacional con 12 modelos
- Código completamente en español

**Para mantener coherencia**:
- Respeta la arquitectura actual
- Sigue las convenciones existentes
- Reutiliza código en lugar de duplicar
- Prueba cambios manualmente
- Actualiza todas las referencias afectadas

**Puntos sensibles**:
- Autenticación y autorización
- Stock de productos
- Validación de cupones
- Integridad de datos (FK)

---

**Última actualización**: Junio 2024  
**Versión**: 1.0.0  
**Nivel de Complejidad**: Medio
