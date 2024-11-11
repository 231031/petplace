import Nav from '../pages/Nav';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Hotel from '../pages/Hotel';
import Care from '../pages/Care';
import Delivery from '../pages/Delivery';
import Shop from '../pages/Shop';
import Social from '../pages/Social';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import FormSignup from '../pages/FormSignup';
import FormSignupHotel from '../pages/FormSignupHotel';
import HotelHome from '../pages/HotelHome';


function App () {
  return (
    <div className = "bg-white-900" >
      <Nav/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hotel" element={<Hotel />} />
        <Route path="/care" element={<Care />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/social" element={<Social />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/FormSignup" element={<FormSignup />} />
        <Route path="/FormSignupHotel" element={<FormSignupHotel />} />
        <Route path="/HotelHome" element={<HotelHome />} />
      </Routes>
    </div>
  );
}

export default App;