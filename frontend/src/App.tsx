import Nav from '../components/Nav';
import { Routes, Route } from 'react-router-dom';
import Home from '../components/Home';
import Hotel from '../components/Hotel';
import Care from '../components/Care';
import Delivery from '../components/Delivery';
import Shop from '../components/Shop';
import Social from '../components/Social';
import Login from '../components/Login';
import Signup from '../components/Signup';
import FormSignup from '../components/FormSignup';
import FormSignupHotel from '../components/FormSignupHotel';


function App () {
  return (
    <div className = "bg-white-900" >
      <Nav />
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
      </Routes>
    </div>
  );
}

export default App;