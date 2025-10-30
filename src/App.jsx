import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Home from './pages/Home'
import About from './pages/About'
import Events from './pages/Events'
import Contact from './pages/Contact'
import LinksPage from './pages/Links'
import RegistrationPage from './pages/Registration'
import ContestLandingPage from './pages/contest/LandingPage'
import AuthPage from './pages/contest/AuthPage'
import Dashboard from './pages/contest/Dashboard'
import ContestListPage from './pages/ContestListPage'
import ContestPage from './pages/contest/ContestPage'
import ContestLayout from './layouts/ContestLayout'
import ContestManagement from './pages/admin/ContestManagement'
import AdminRoute from './components/admin/AdminRoute'
import CodingModuleRoutes from './coding/CodingRoutes'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/auth' element={<AuthPage />} />
          <Route path='/about' element={<About />} />
          <Route path='/events' element={<Events />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/links' element={<LinksPage />} />
          <Route path='/registration' element={<RegistrationPage />} />
          
          {/* Contest Platform Routes with Layout */}
          <Route path='/contest' element={
            <ContestLayout>
              <ContestLandingPage />
            </ContestLayout>
          } />
              <Route path='/contests' element={
                <ContestLayout>
                  <ContestListPage />
                </ContestLayout>
              } />
              <Route path='/contest/:contestId' element={<ContestPage />} />
              <Route path='/dashboard' element={
                <ContestLayout>
                  <Dashboard />
                </ContestLayout>
              } />
          <Route path='/admin' element={
            <ContestLayout>
              <AdminRoute>
                <ContestManagement />
              </AdminRoute>
            </ContestLayout>
          } />
          <Route path='/coding/*' element={<CodingModuleRoutes />} />


        </Routes> 
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
