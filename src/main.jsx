import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import ReactDOM from 'react-dom/client';
import React from "react";
import Nav from "./components/navUser/nav";
import Home from "./pages/home/home";
import App from "./App";
import Buy from "./pages/buy/Buy.jsx";
import Sell from "./pages/sell/Sell.jsx";
import UserProfile from "./pages/userProfile/userProfile.jsx";
import DashboardAdmin from "./pages/dashboardAdmin/dashboardAdmin";
import Auth from "./pages/auth/Auth";
import NavAdmin from "./components/navAdmin/navAdmin";
import { UserProvider } from './UserContext.jsx'

const LayoutWithNav = () => (
  <>
    <Nav />
    <main>
      <Outlet />
    </main>
  </>
);

const LayoutAdmin = () => (
  <>
    <NavAdmin />
    <main>
      <Outlet />
    </main>
  </>
);

const LayoutWithoutNav = () => (
  <main>
    <Outlet />
  </main>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <UserProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LayoutWithoutNav />}>
          <Route index element={<App />} />
          <Route path="auth" element={<Auth />} />
        </Route>

        <Route element={<LayoutWithNav />}>
          <Route path="home" element={<Home />} />
          <Route path="buy" element={<Buy />} />
          <Route path="sell" element={<Sell />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="*" element={<Home />} />
        </Route>

        <Route element={<LayoutAdmin />}>
          <Route path="admin" element={<DashboardAdmin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </UserProvider>
);
