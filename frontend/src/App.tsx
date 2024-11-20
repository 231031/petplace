
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
import HotelFillPayment from './page/HotelFillPayment';
import TestSearch from './page/TestSearch';
import TestLogin from './page/TestLogin';
import TestPost from './page/TestPost';
import TestBooking from './page/TestBooking';
import TestProfile from './page/TestProfile';
import CreateProfile from './page/CreateProfile';
import HotelBookdetail from './page/HotelBookdetail';
import TestSelectRoom from './page/TestSelectRoom';
import HotelcPayment from './page/HotelcPayment';

import HotelSearch from './page/HotelSearch';

import HotelEdit from './page/HotelEdit';
import RoomEdit from './page/RoomEdit';
import TestUpload from './page/TestUpload';
import FullMap from './page/Fullmap';

// import TestLogin from './page/TestLogin';


function App() {
  return (
    <div className="bg" >
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hotelsearch" element={<HotelSearch />} />
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
        <Route path="/hotelcpayment" element={<HotelcPayment/>}/>
        <Route path="/hotelfillpayment" element={<HotelFillPayment />} />
        <Route path="/hotelbookdetail" element={<HotelBookdetail/>}/>
        <Route path="/hotel/edit" element={<HotelEdit />} />
        <Route path="/room/edit" element={<RoomEdit />} />
        <Route path="/CreateProfile" element={<CreateProfile />} />

        {/* test api */}
        <Route path="/test/search" element={<TestSearch />} />
        <Route path="/test/login" element={<TestLogin />} />
        <Route path="/test/post" element={<TestPost />} />
        <Route path="/test/booking" element={<TestBooking />} />
        <Route path="/test/profile" element={<TestProfile />} />
        <Route path="/test/selectroom" element={<TestSelectRoom/>} />
        <Route path="/CreateProfile" element={<CreateProfile />} />
        {/* <Route path="/test/search" element={<TestSearch />} /> */}
        {/* <Route path="/test/login" element={<TestLogin />} /> */}
        <Route path="/test/upload" element={<TestUpload />} />
        <Route path="/FullMap" element={<FullMap/>} />

      </Routes>
      <Footer />
    </div>
  );
}

export default App;