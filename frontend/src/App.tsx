
import Home from './page/Default/HomePage';
import Nav from '../src/components/Nav';
import { Outlet } from 'react-router-dom';
import Footer from '../src/components/Footer';
import { Routes, Route } from 'react-router-dom';

// Default Layout
import Care from './page/MockPage/Care';
import Delivery from './page/MockPage/Delivery';
import Shop from './page/MockPage/Shop';
import Social from './page/MockPage/Social';
import Login from './page/Authentication/Login';
import Signup from './page/Authentication/Signup';
import HotelHistory from './page/Default/HotelHistory';
import HotelDetail from './page/Default/HotelDetail';
import HotelFillPayment from './page/Default/HotelFillPayment';
import CreateProfile from './page/Default/CreateProfile';
import HotelBookdetail from './page/Default/HotelBookDetail';
import HotelSelectPayment from './page/Default/HotelSelectPayment';
import HotelSearch from './page/Default/HotelSearch';
import SelectProfile from './page/Default/SelectProfile';
import FullMap from './page/Default/Fullmap';
import HotelBookSuccess from './page/Default/HotelBookSuccess';
import MyProfile from './page/Default/MyProfile';
import BookAgain from './page/Default/HotelBookAgain'

// Test
import TestSearch from './page/Test/TestSearch';
import TestLogin from './page/Test/TestLogin';
import TestPost from './page/Test/TestPost';
import TestBooking from './page/Test/TestBooking';
import TestProfile from './page/Test/TestProfile';
import TestSelectRoom from './page/Test/TestSelectRoom';
import TestUpload from './page/Test/TestUpload';

// Role Hotel
import NavHotel from '../src/components/NavHotel';
import HotelHome from './page/Hotel/HotelHome';
import HotelEdit from './page/Hotel/HotelEdit';
import RoomEdit from './page/Hotel/RoomEdit';
import MyprofileHotel from './page/Hotel/MyProfileHotel';
import HotelResponseAccept from './page/Hotel/HotelResponseAccept';
import HotelResponseReject from './page/Hotel/HotelResponseReject';
import HotelResponsePass from './page/Hotel/HotelResponsePass';
import HotelResponseUpcoming from './page/Hotel/HotelResponseUpcoming';


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
          <Route path="/hotelhistory" element={<HotelHistory />} />
          <Route path="/hoteldetail" element={<HotelDetail />} />
          <Route path="/hotelselectpayment" element={<HotelSelectPayment />} />
          <Route path="/hotelfillpayment" element={<HotelFillPayment />} />
          <Route path="/hotelbookdetail" element={<HotelBookdetail />} />
          <Route path="/hotelbooksuccess" element={<HotelBookSuccess />} />
          <Route path="/CreateProfile" element={<CreateProfile />} />
          <Route path="/MyProfile" element={<MyProfile />} />
          <Route path="/hotelbookagain" element={<BookAgain />} />

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

        {/* Routes with Hotel Layout */}
        <Route element={<HotelLayout />}>
          <Route path="/hotelhome" element={<HotelHome />} />
          <Route path="/hotel/edit" element={<HotelEdit />} />
          <Route path="/room/edit" element={<RoomEdit />} />
          <Route path="/hotel/MyProfileHotel" element={<MyprofileHotel />} />
          <Route path="/hotel/reservation/upcoming" element={<HotelResponseUpcoming />} />
          <Route path="/hotel/reservation/accepted" element={<HotelResponseAccept />} />
          <Route path="/hotel/reservation/rejected" element={<HotelResponseReject />} />
          <Route path="/hotel/reservation/passedby" element={<HotelResponsePass />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;