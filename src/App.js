import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "../src/index.css";
import Explore from "./pages/Explore";
import ForgotPassword from "./pages/ForgotPassword";
import Offer from "./pages/Offer";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import { ToastContainer } from 'react-toastify';
import Category from "./pages/Category";
import 'react-toastify/dist/ReactToastify.css';
import CreateListing from "./pages/CreateListing";
import SingleListing from "./pages/SingleListing";
import Contact from "./pages/Contact";
import EditListing from "./pages/EditListing";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Explore />} />
          <Route path="/offers" element={<Offer />} />
          <Route path="/category/:categoryName" element={<Category />} />
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/contact/:landlordId" element={<Contact />} />
          <Route path="/category/:categoryName/category/:categoryName/:id" element={<SingleListing />} />
          <Route path="/edit-listing/:listingId" element={<EditListing/>}/>
        </Routes>
        <Navbar />
      </Router>
      <ToastContainer />
    </div>
  );
}
export default App;
