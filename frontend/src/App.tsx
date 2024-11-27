
import Home from './page/Home';
import Nav from '../src/components/Nav';
import { Outlet } from 'react-router-dom';
import Footer from '../src/components/Footer';
import { Routes, Route } from 'react-router-dom';
import Care from './page/Care';
import Delivery from './page/Delivery';
import Shop from './page/Shop';
import Social from './page/Social';
import Login from './page/Login';
import Signup from './page/Signup';
import FormSignupHotel from './page/FormSignupHotel';
import FormSignup from './page/FormSignup';
import HotelHistory from './page/HotelHistory';
import HotelDetail from './page/HotelDetail';
import HotelFillPayment from './page/HotelFillPayment';
import CreateProfile from './page/CreateProfile';
import HotelBookdetail from './page/HotelBookdetail';
import HotelcPayment from './page/HotelcPayment';
import HotelSearch from './page/HotelSearch';
import SelectProfile from './page/SelectProfile';
import FullMap from './page/Fullmap';

//Test
import TestSearch from './page/TestSearch';
import TestLogin from './page/TestLogin';
import TestPost from './page/TestPost';
import TestBooking from './page/TestBooking';
import TestProfile from './page/TestProfile';
import TestSelectRoom from './page/TestSelectRoom';
import TestUpload from './page/TestUpload';

//Role Hotel
import NavHotel from '../src/components/NavHotel';
import HotelHome from './page/HotelHome';
import HotelEdit from './page/HotelEdit';
import RoomEdit from './page/RoomEdit';
import HotelReservation from './page/HotelReservation';
import HotelBookSuccess from './page/HotelBookSuccess';
import MyProfile from './page/MyProfile';

// import TestLogin from './page/TestLogin';


const DefaultLayout = () => {
  return (
    <>
      <Nav />
      <Outlet />  
      <Footer />
    </>
  );
};

const HotelLayout = () => {
  return (
    <>
      <NavHotel />
      <Outlet />
      <Footer />
    </>
  );
};

function App() {
  return (
    <div className="bg">
      <Routes>
        {/* Routes with Default Layout */}
        <Route element={<DefaultLayout />}>
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
          <Route path="/hoteldetail" element={<HotelDetail />} />
          <Route path="/hotelcpayment" element={<HotelcPayment />} />
          <Route path="/hotelfillpayment" element={<HotelFillPayment />} />
          <Route path="/hotelbookdetail" element={<HotelBookdetail />} />
          <Route path="/hotelbooksuccess" element={<HotelBookSuccess />} />
          <Route path="/CreateProfile" element={<CreateProfile />} />
          <Route path="/MyProfile" element={<MyProfile />} />

          {/* test api */}
          <Route path="/test/search" element={<TestSearch />} />
          <Route path="/test/login" element={<TestLogin />} />
          <Route path="/test/post" element={<TestPost />} />
          <Route path="/test/booking" element={<TestBooking />} />
          <Route path="/test/profile" element={<TestProfile />} />
          <Route path="/test/selectroom" element={<TestSelectRoom />} />
          <Route path="/test/upload" element={<TestUpload />} />
          <Route path="/FullMap" element={<FullMap />} />
          <Route path="/SelectProfile" element={<SelectProfile />} />
        </Route>


        <Route element={<HotelLayout />}>
          <Route path="/HotelHome" element={<HotelHome />} />
          <Route path="/hotel/edit" element={<HotelEdit />} />
          <Route path="/room/edit" element={<RoomEdit />} />
          <Route path="/hotel/reservation" element={<HotelReservation />} />
          
        </Route>
      </Routes>
    </div>
  );
}

export default App;