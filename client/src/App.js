import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";

import WeekEventsPage from "./pages/weekEventsPage/weekEventsPage.jsx";
import Header from "./components2/header/header.jsx";
import HomePageNew from "./pages/homePage/homePage.jsx";
import LoginPage from "./pages/loginPage/loginPage.jsx";
import RegisterPage from "./pages/registerPage/registerPage.jsx";
import ResetPasswordPage from "./pages/reset-passwordPage/resetPasswordPage.jsx";
import LinkResetPasswordPage from "./pages/linkResetPasswordPage/linkResetPasswordPage.jsx";
import RegisterPromoterPage from "./pages/register-promoterPage/registerPromoterPage.jsx";
import CreateEventPage from "./pages/createEventPage/createEventPage.jsx";

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/homeNew" element={<HomePageNew />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register-user" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route
          path="/reset-password/:id/:token"
          element={<LinkResetPasswordPage />}
        />
        <Route path="/register-promoter" element={<RegisterPromoterPage />} />
        <Route path="/week-events" element={<WeekEventsPage />} />
        <Route path="/create-event" element={<CreateEventPage />} />
      </Routes>
    </div>
  );
}

export default App;
