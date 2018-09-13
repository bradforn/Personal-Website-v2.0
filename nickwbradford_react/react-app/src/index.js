import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

//import Particles from "./particles.js"
//import Particles from "https://cdnjs.cloudflare.com/ajax/libs/particlesjs/2.2.3/particles.min.js"
// window.onload= function() {
//  Particles.init({
//      selector: '.background'  });};

ReactDOM.render(
  <App cat={5}  />,
  document.getElementById('root')
);
