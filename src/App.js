import React, { useState } from 'react';
import './App.css';

import Web3 from "web3"
import { img1 } from './assets';
import HeaderCPN from './Common/Header';
import FooterCPN from './Common/Footer';

function App() {

  return (
    <div className="App">
      <HeaderCPN />

      <FooterCPN />
    </div>
  );
}

export default App;
