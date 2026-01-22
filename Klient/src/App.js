import './App.css';
import {BrowserRouter, Routes, Route, Link} from "react-router-dom";
import Rosliny from './Rosliny.js';
import ModyfikujRosline from './ModyfikujRosline.js';

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <label>NAWIGACJA: </label>
        <Link to="/rosliny">Rosliny</Link>
      </nav>

      <Routes>
        <Route path="/rosliny" element={<Rosliny />} />
        <Route path="/rosliny/:id" element={<ModyfikujRosline />} />
        <Route path="/rosliny/dodaj" element={<ModyfikujRosline />} />
      </Routes>
    </BrowserRouter>
  );
}
