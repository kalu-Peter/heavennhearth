import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import BuyLand from './pages/BuyLand'
import RentFarm from './pages/RentFarm'
import SellHouse from './pages/SellHouse'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/buy-land" element={<BuyLand />} />
          <Route path="/rent-farm" element={<RentFarm />} />
          <Route path="/sell-house" element={<SellHouse />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
