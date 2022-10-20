import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Home from "./home/Home";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import MainLocations from "./location/MainLocations";
import Nav from "./home/Nav";
import Menu from "./menu/Menu";

const root = ReactDOM.createRoot(document.getElementById("app"));

root.render(
  <>
    <React.StrictMode>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route exact path='/locations' element={<MainLocations />} />
          <Route exact path='/menu' element={<Menu />} />
          <Route exact path='/quantity' element={<App />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  </>
);
