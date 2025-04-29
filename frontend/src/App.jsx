import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import EcommercePages from "./pages/EcommercePages";
import EcommerceLogin from "./pages/EcommerceLogin";
import EcommerceRegister from "./pages/EcommerceRegister";
import EcommerceCart from "./pages/EcommerceCart";
import EcommercePay from "./pages/EcommercePay";
import EcommerceShipping from "./pages/EcommerceShipping";
import Navbar from "./components/Navbar";
import SyncPendingCart from "./components/SyncPendingCart";
import EcommerceProfile from "./pages/EcommerceProfile";
import EcommerceHistory from "./pages/EcommerceHistory";
import EcommerceSettings from "./pages/EcommerceSettings";
import EcommerceStaff from "./pages/EcommerceStaff";
import PrivateRoute from "./components/PrivateRoute";


function App() {
  return (
    <BrowserRouter>
      <div className="App" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Navbar />
        <SyncPendingCart />
        <Routes>
          <Route path="/" element={<Navigate to="/ecommerce" />} />
          <Route path="/ecommerce" element={<EcommercePages />} />
          <Route path="/ecommerce-login" element={<EcommerceLogin />} />
          <Route path="/ecommerce-register" element={<EcommerceRegister />} />
          <Route path="/ecommerce-cart" element={
            <PrivateRoute><EcommerceCart /></PrivateRoute>
          } />
          <Route path="/ecommerce-pay" element={
            <PrivateRoute><EcommercePay /></PrivateRoute>
          } />
          <Route path="/ecommerce-shipping" element={
            <PrivateRoute><EcommerceShipping /></PrivateRoute>
          } />
          <Route path="/ecommerce-history" element={
            <PrivateRoute><EcommerceHistory /></PrivateRoute>
          } />
          <Route path="/ecommerce-profile" element={
            <PrivateRoute><EcommerceProfile /></PrivateRoute>
          } />
          <Route path="/ecommerce-settings" element={
            <PrivateRoute><EcommerceSettings /></PrivateRoute>
          } />
          <Route path="/ecommerce-staff" element={
            <PrivateRoute><EcommerceStaff /></PrivateRoute>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
