
import Home from './page/Home';
import Nav from '../src/components/Nav';
import Footer from '../src/components/Footer';
import { Routes, Route } from 'react-router-dom';
import Hotel from './page/Hotel';
import Care from './page/Care';
import Delivery from './page/Delivery';
import Shop from './page/Shop';
import Social from './page/Social';
import Login from './page/Login';
import Signup from './page/Signup';
import FormSignupHotel from './page/FormSignupHotel';
import FormSignup from './page/FormSignup';
import HotelHistory from './page/HotelHistory';
import HotelHome from './page/HotelHome';
import HotelDetail from './page/HotelDetail';
import HotelBookDetail from './page/HotelBookDetail';
import TestSearch from './page/TestSearch';
// import TestLogin from './page/TestLogin';


function App() {
  return (
    <div className="bg" >
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hotelsearch" element={<Hotel />} />
        <Route path="/care" element={<Care />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/social" element={<Social />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/FormSignupHotel" element={<FormSignupHotel />} />
        <Route path="/FormSignup" element={<FormSignup />} />
        <Route path="/hotelhis" element={<HotelHistory />} />
        <Route path="/HotelHome" element={<HotelHome />} />
        <Route path="/hoteldetail" element={<HotelDetail />} />
        <Route path="/hotelbookdetail" element={<HotelBookDetail/>}/>

        {/* test api */}
        {/* <Route path="/test/search" element={<TestSearch />} /> */}
        {/* <Route path="/test/login" element={<TestLogin />} /> */}
      </Routes>
      <Footer />
    </div>
  );
}

export default App;