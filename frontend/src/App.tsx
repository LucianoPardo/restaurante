import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { AuthProvider } from './auth/AuthProvider'
import { GuestOnly, RequireRole } from './auth/RouteGuards'
import { ClientLayout } from './layouts/ClientLayout'
import { AllReservationsPage } from './pages/admin/AllReservationsPage'
import { CreateEmployeePage } from './pages/admin/CreateEmployeePage'
import { CreateSupplyPage } from './pages/admin/CreateSupplyPage'
import { DashboardPage } from './pages/admin/DashboardPage'
import { EditEmployeePage } from './pages/admin/EditEmployeePage'
import { EditSupplyPage } from './pages/admin/EditSupplyPage'
import { EmployeesPage } from './pages/admin/EmployeesPage'
import { SalesPage } from './pages/admin/SalesPage'
import { SuppliesPage } from './pages/admin/SuppliesPage'
import { LoginPage } from './pages/auth/LoginPage'
import { RegisterPage } from './pages/auth/RegisterPage'
import { CategoryPage } from './pages/client/CategoryPage'
import { EditProfilePage } from './pages/client/EditProfilePage'
import { HomePage } from './pages/client/HomePage'
import { MenuPage } from './pages/client/MenuPage'
import { ProfilePage } from './pages/client/ProfilePage'
import { ReservationsPage } from './pages/client/ReservationsPage'

// Todas las rutas de la app. Es el equivalente a los @app.route / Blueprints de Flask.
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Públicas */}
          <Route element={<GuestOnly />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Área de clientes: todas comparten el layout con cabecera y banner */}
          <Route element={<RequireRole roles={['cliente']} />}>
            <Route element={<ClientLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/platos" element={<CategoryPage slug="platos" />} />
              <Route path="/bebidas" element={<CategoryPage slug="bebidas" />} />
              <Route path="/postres" element={<CategoryPage slug="postres" />} />
              <Route path="/ensaladas" element={<CategoryPage slug="ensaladas" />} />
              <Route path="/perfil" element={<ProfilePage />} />
              <Route path="/perfil/editar" element={<EditProfilePage />} />
              <Route path="/reservas" element={<ReservationsPage />} />
            </Route>
          </Route>

          {/* Panel: admin y empleados */}
          <Route element={<RequireRole roles={['admin', 'empleado']} />}>
            <Route path="/admin" element={<DashboardPage />} />
            <Route path="/admin/reservas" element={<AllReservationsPage />} />

            {/* Solo admin */}
            <Route element={<RequireRole roles={['admin']} />}>
              <Route path="/admin/empleados" element={<EmployeesPage />} />
              <Route path="/admin/empleados/nuevo" element={<CreateEmployeePage />} />
              <Route path="/admin/empleados/:id/editar" element={<EditEmployeePage />} />
              <Route path="/admin/insumos" element={<SuppliesPage />} />
              <Route path="/admin/insumos/nuevo" element={<CreateSupplyPage />} />
              <Route path="/admin/insumos/:id/editar" element={<EditSupplyPage />} />
              <Route path="/admin/ventas" element={<SalesPage />} />
            </Route>
          </Route>

          {/* Cualquier otra dirección vuelve al inicio */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
