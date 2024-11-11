<<<<<<< HEAD
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
=======
import { Route,Routes } from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./page/Home";
import Care from "./page/Care";
import Hotel from "./page/Hotel";
import Shop from "./page/Shop";
import Social from "./page/Social";
import HotelDetail from "./page/HotelDetail";
import Delivery from "./page/Delivery";
import HotelBookDetails from "./page/HotelBookDetail";

>>>>>>> 4a2a754b140ef680d96b2fd477467c14e672eff4


function App () {
  return (
    <div className = "bg-white-900" >
      <Nav/>
      <Routes>
<<<<<<< HEAD
        <Route path="/" element={<Home />} />
        <Route path="/hotelsearch" element={<Hotel />} />
        <Route path="/care" element={<Care />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/social" element={<Social />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/FormSignup" element={<FormSignup />} />
        <Route path="/FormSignupHotel" element={<FormSignupHotel />} />
        <Route path="/hotelhis" element={<HotelHistory />} />
        <Route path="/HotelHome" element={<HotelHome />} />
=======
        <Route path="/" element={<Home/>}/>
        <Route path="/care" element={<Care/>}/>
        <Route path="/hotel" element={<Hotel/>}/>
        <Route path="/delivery" element={<Delivery/>}/>
        <Route path="/shop" element={<Shop/>}/>
        <Route path="/socail" element={<Social/>}/>
        <Route path="/hoteldetails" element={<HotelDetail/>}/>
        <Route path ="/hotelbookdetails" element={<HotelBookDetails/>}/>
      
>>>>>>> 4a2a754b140ef680d96b2fd477467c14e672eff4
      </Routes>
    </div>
  );
}

export default App;