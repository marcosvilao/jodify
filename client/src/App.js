import React from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./components2/header/header.jsx";
import HomePage from "./pages/homePage/homePage.jsx";
import UpadatingPage from "./pages/updatingPage/updatingPage.jsx";
import LoginPage from "./pages/loginPage/loginPage.jsx";
import RegisterPage from "./pages/registerPage/registerPage.jsx";
import ResetPasswordPage from "./pages/reset-passwordPage/resetPasswordPage.jsx";
import LinkResetPasswordPage from "./pages/linkResetPasswordPage/linkResetPasswordPage.jsx";
import RegisterPromoterPage from "./pages/register-promoterPage/registerPromoterPage.jsx";
import CreateEventPage from "./pages/createEventPage/createEventPage.jsx";
import CreatePromotersPage from "./pages/createPromotersPage/createPromotersPage.jsx";
import CreateFormPage from "./pages/createFormPage/createFormPage.jsx";
import CreateDjsPage from "./pages/createDjsPage/createDjs.jsx";
import { Helmet } from "react-helmet";
function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register-user" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route
          path="/reset-password/:id/:token"
          element={<LinkResetPasswordPage />}
        />
        <Route path="/register-promoter" element={<RegisterPromoterPage />} />
        <Route path="/create-event" element={<CreateEventPage />} />
        <Route path="/create-promoter" element={<CreatePromotersPage />} />
        <Route path="/create-djs" element={<CreateDjsPage />} />
        <Route path="/create-form" element={<CreateFormPage />} />
      </Routes>
    </div>
  );
}

export default App;
