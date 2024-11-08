import Nav from '../components/Nav';
import { Routes, Route } from 'react-router-dom';
import Home from '../components/Home';
import Hotel from '../components/Hotel-Search/Hotel';
import Care from '../components/Care';
import Delivery from '../components/Delivery';
import Shop from '../components/Shop';
import Social from '../components/Social';
import HotelHistory from '../components/Hotel-History/HotelHistory'




function App () {
  return (
    <div className = "bg-white-900" >
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hotelsearch" element={<Hotel />} />
        <Route path="/care" element={<Care />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/social" element={<Social />} />
        <Route path="/hotelhis" element={<HotelHistory />} />
      </Routes>
    </div>
  );
}

export default App;