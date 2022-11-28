import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import FooterCPN from "./Common/Footer";
import HeaderCPN from "./Common/Header";
import LayoutLogin from "./Component/LayoutLogin";
import LoginPage from "./features/login";
import Marketplace from "./features/market/page";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <HeaderCPN />

        <Routes>
          <Route path="/login" element={<LoginPage />}/>
          <Route
            element={<LayoutLogin />}
            redirect={<Navigate to="/login" replace />}
          >
            <Route path="/" element={<Marketplace />} />
          </Route>
        </Routes>
        <FooterCPN />
      </div>
    </BrowserRouter>
  );
}

// export default App;

export default App;
