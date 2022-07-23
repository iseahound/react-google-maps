import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles.css";

import { useLoadScript } from '@react-google-maps/api';
import Map from "./map";

export default function App(){
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDJMEb3aXsmUWdqOx8lvlEHmNI446SBIeY",
    libraries: ['places']
  });

  if (!isLoaded && !loadError) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <div> 
        <Map />
      </div>
      <ToastContainer />
    </div>
  );
}