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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/contest' element={<ContestLandingPage />} />
          <Route path='/auth' element={<AuthPage />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/about' element={<About />} />
          <Route path='/events' element={<Events />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/links' element={<LinksPage />} />
          <Route path='/registration' element={<RegistrationPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
