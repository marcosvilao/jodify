import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreateForm from "./pages/CreateForm";
import CreatePromoter from "./pages/CreatePromoter";
import WeekEvents from "./pages/weeKevents";
import Header from "./components/header/header.jsx";
import BienvenidoProductora from "./pages/bienvenido-productora.js";
import CreateProductora from "./pages/Create-Productora.js";
import RegisterUser from "./pages/registerUsers.js";
import Login from "./pages/login.js";

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-form" element={<CreateForm />} />
        <Route path="/create-promoter" element={<CreatePromoter />} />
        <Route path="/week-events" element={<WeekEvents />} />
        <Route path="/productora-welcome" element={<BienvenidoProductora />} />
        <Route path="/create-productora" element={<CreateProductora />} />
        <Route path="/register-user" element={<RegisterUser />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
