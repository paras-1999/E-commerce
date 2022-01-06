import React, { Suspense } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
const LogInSignUp = React.lazy(() => import('./Components/LogInSignUp'));
const Home = React.lazy(() => import('./Components/Home'));
const Dash = React.lazy(() => import('./Components/Dash'));
const Cart = React.lazy(() => import('./Components/Cart'));
const Orders = React.lazy(() => import('./Components/Orders'));
const Profile = React.lazy(() => import('./Components/Profile'));
const Products = React.lazy(() => import('./Components/Products'));
const Forgetpass = React.lazy(() => import('./Components/Forgetpass'))
const ChangePass = React.lazy(() => import('./Components/ChangePass'))
const UpdateProfile = React.lazy(() => import('./Components/UpdateProfile'))
const Address = React.lazy(() => import('./Components/Address'))
function App() {
  return (
    <Router>
      <Suspense fallback={<img src="https://www.uttf.com.ua/assets/images/loader2.gif" height="100%" width="100%" />}>
        <Routes>
          <Route path="/" element={<Dash />}>
            <Route path="" element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="cart" element={<Cart />} />
            <Route path="profile" element={<Profile />} >
              <Route path="update" element={<UpdateProfile />} />
              <Route path="address" element={<Address />} />
              <Route path="changepass" element={<ChangePass />} />
            </Route>
          </Route>
          <Route path="/forgetpass" element={<Forgetpass />}></Route>
          <Route path="/LoginSignup" element={<LogInSignUp />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
