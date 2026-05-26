import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Login from './Login';
import Register from './Register';

function App() {
  return(
  <BrowserRouter>
      <Routes>
          <Route path="/" element={ <Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
  </BrowserRouter>
  )
  }

export default App
