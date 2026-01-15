import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import UploadList from './pages/UploadList'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 text-white">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/upload-list" element={<UploadList />} />
          {/* Add more routes here as needed */}
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
