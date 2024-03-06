import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signin from './Signin';
import Register from './Register';
import UserPage from './Components/UserPage';
import Private from './Components/Private';
import Datadetails from './Components/Datadetails';
import Request from './Components/Request';
import Appointment from './Components/Appointment';
import {Toaster} from 'react-hot-toast'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/homepage" element={<UserPage />} />
        <Route path="/private" element={<Private />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/request/:id" element={<Request />} />
        <Route path="/details/:id" element={<Datadetails />} />
      </Routes>
      <Toaster position='bottom-center'/>
    </Router>
  );
}

export default App;
