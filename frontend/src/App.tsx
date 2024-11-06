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



function App () {
  return (
    <div className = "bg-white-900" >
      <Nav/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/care" element={<Care/>}/>
        <Route path="/hotel" element={<Hotel/>}/>
        <Route path="/delivery" element={<Delivery/>}/>
        <Route path="/shop" element={<Shop/>}/>
        <Route path="/socail" element={<Social/>}/>
        <Route path="/hoteldetails" element={<HotelDetail/>}/>
        <Route path ="/hotelbookdetails" element={<HotelBookDetails/>}/>
      
      </Routes>
    </div>
  );
}

export default App;