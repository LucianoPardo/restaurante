# Restaurante — Frontend (React)

Interfaz del proyecto, migrada desde las plantillas Jinja de Flask a React + TypeScript (Vite).
Habla con la API de Nest que está en `../backend` usando **GraphQL** (`POST /graphql`).

Todas las peticiones pasan por la función `gql()` de `src/api/client.ts`. Cada página define arriba
sus consultas (`query`) y cambios (`mutation`) y pide solo los campos que muestra.
Ver `../backend/GRAPHQL.md` para probar las mismas consultas en el navegador.

## Cómo ejecutarlo

1. Arranca primero el backend (`cd ../backend` y `npm run start:dev`). Debe estar en `http://localhost:3000`.
2. En esta carpeta:

```sh
npm install
npm run dev
```

3. Abre http://localhost:5173

Si el backend está en otra dirección, copia `.env.example` como `.env.local` y cambia `VITE_API_URL`.

## Estructura

```
src/
  main.tsx            Punto de entrada: carga los estilos y monta <App />
  App.tsx             Todas las rutas (equivale a los @app.route de Flask)
  api/                gql(): envía consultas GraphQL con el token; y los tipos de datos
  auth/               Sesión, login/logout y protección de rutas por rol
  hooks/              useFlash (mensajes tipo flash()) y usePageTitle
  components/         Piezas reutilizables: mensajes, formulario de reserva, campo de contraseña
  layouts/            ClientLayout (antes layout_client.html)
  pages/auth/         Login y registro
  pages/client/       Inicio, menú, categorías, perfil y reservas
  pages/admin/        Panel, empleados, insumos, ventas y reservas
  data/menu.ts        Los platos del menú (antes estaban escritos en cada plantilla)
  styles/             admin.css (antes style.css), client.css (antes style_users.css) y lo nuevo
public/img/           Las imágenes del proyecto Flask
```

## De Flask a React

| Flask (plantilla)               | React (página)                          | Ruta                          |
| ------------------------------- | --------------------------------------- | ----------------------------- |
| `login.html`                    | `pages/auth/LoginPage.tsx`              | `/login`                      |
| `register.html`                 | `pages/auth/RegisterPage.tsx`           | `/register`                   |
| `users/home.html`               | `pages/client/HomePage.tsx`             | `/`                           |
| `users/menu.html`               | `pages/client/MenuPage.tsx`             | `/menu`                       |
| `users/platos.html` y similares | `pages/client/CategoryPage.tsx`         | `/platos`, `/bebidas`, ...    |
| `users/perfil_user.html`        | `pages/client/ProfilePage.tsx`          | `/perfil`                     |
| `users/update.html`             | `pages/client/EditProfilePage.tsx`      | `/perfil/editar`              |
| `users/reservas.html`           | `pages/client/ReservationsPage.tsx`     | `/reservas`                   |
| `employees/main.html`           | `pages/admin/DashboardPage.tsx`         | `/admin`                      |
| `employees/employees.html`      | `pages/admin/EmployeesPage.tsx`         | `/admin/empleados`            |
| `employees/create_employee.html`| `pages/admin/CreateEmployeePage.tsx`    | `/admin/empleados/nuevo`      |
| `employees/edit_employee.html`  | `pages/admin/EditEmployeePage.tsx`      | `/admin/empleados/:id/editar` |
| `supplies/get_supplies.html`    | `pages/admin/SuppliesPage.tsx`          | `/admin/insumos`              |
| `supplies/create_supplies.html` | `pages/admin/CreateSupplyPage.tsx`      | `/admin/insumos/nuevo`        |
| `supplies/update_supplies.html` | `pages/admin/EditSupplyPage.tsx`        | `/admin/insumos/:id/editar`   |
| `charts/charts.html`            | `pages/admin/SalesPage.tsx`             | `/admin/ventas`               |
| (no existía)                    | `pages/admin/AllReservationsPage.tsx`   | `/admin/reservas`             |

## Quién ve qué

- **cliente**: inicio, menú, perfil y sus reservas.
- **empleado**: panel con la lista de reservas.
- **admin**: todo el panel (empleados, insumos, ventas y reservas).

Al iniciar sesión, cada rol va a su página. Si alguien abre una ruta que no le corresponde, se le redirige.
La protección real está en el backend (guards de Nest); el frontend solo decide qué pantallas mostrar.
