import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import UnoGame from "./pages/UnoGame";
import Layout from "./pages/Layout";
import React from "react";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Login />} />
        </Route>
        <Route path="/unogame" element={<UnoGame />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

