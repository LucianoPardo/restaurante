# GraphQL en el backend

La API funciona de dos formas a la vez:

- **REST**: las rutas de siempre (`/supplies`, `/employees`, `/auth/login`...).
- **GraphQL**: una sola dirección, `POST /graphql`, donde el cliente pide exactamente los campos que quiere.

Las dos usan los mismos services, validaciones (DTOs) y permisos (guards).

## Cómo está armado

| Pieza | Para qué sirve |
| --- | --- |
| `GraphQLModule` en `app.module.ts` | Activa GraphQL en `/graphql` |
| `@ObjectType()` + `@Field()` en las entidades | Lo que se puede **pedir** (tipos de salida) |
| `@InputType()` + `@Field()` en los DTOs | Lo que se puede **enviar** (tipos de entrada) |
| `*.resolver.ts` | El "controller" de GraphQL: `@Query` para leer, `@Mutation` para cambiar |
| `src/auth/get-request.ts` | Permite que los guards y `@CurrentUser()` funcionen también con GraphQL |
| `src/schema.gql` | El esquema completo, **generado solo** al arrancar (no se edita a mano) |

## Probarlo en el navegador (GraphiQL)

1. `npm run start:dev`
2. Abre http://localhost:3000/graphql

### 1. Iniciar sesión

```graphql
mutation {
  login(input: { email: "admin@restaurante.com", password: "tu-clave" }) {
    access_token
    user { id name role }
  }
}
```

### 2. Usar el token

Copia el `access_token` y, abajo en la pestaña **Headers**, escribe:

```json
{ "Authorization": "Bearer EL_TOKEN_AQUI" }
```

### 3. Ejemplos

```graphql
# Insumos de una categoría + la lista de categorías, en una sola petición
query {
  supplies(category: "Bebidas") { name quantity price }
  supplyCategories
}
```

```graphql
mutation {
  createSupply(input: { name: "Fanta", category: "Bebidas", quantity: 12, price: 900 }) {
    id
    name
  }
}
```

```graphql
# Datos para el gráfico de ventas
query {
  monthlySales { labels data }
}
```

```graphql
# Reservas con los datos del cliente (admin o empleado)
query {
  reservations {
    fecha
    numeroPersonas
    user { name lastName email }
  }
}
```

## Operaciones disponibles

| Query (leer) | Mutation (cambiar) | Quién |
| --- | --- | --- |
| | `login`, `register` | Público |
| `me` | `updateMe` | Con sesión |
| `employees`, `employee(id)` | `createEmployee`, `updateEmployee`, `removeEmployee` | Admin |
| `supplies(category)`, `supply(id)`, `supplyCategories` | `createSupply`, `updateSupply`, `removeSupply` | Admin |
| `myReservations` | `createReservation`, `cancelReservation` | Cliente |
| `reservations` | | Admin, empleado |
| `sales`, `monthlySales` | `createSale`, `removeSale` | Admin |
