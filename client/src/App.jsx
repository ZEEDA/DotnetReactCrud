import { Route, Routes } from 'react-router'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import PersonPage from './pages/PersonPage'
import NotFound from './pages/NotFound'
import AppToaster from './components/AppToaster'

function App() {
  return (
    <>
      <Navbar />
      <AppToaster />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/person" element={<PersonPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  )
}

export default App
