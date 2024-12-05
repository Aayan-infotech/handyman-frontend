import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./Home";
import Welcome from "./Welcome";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/welcome" element={<Welcome />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
