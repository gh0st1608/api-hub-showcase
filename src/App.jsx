import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ApiDetail from "./pages/ApiDetail";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/api/:id" element={<ApiDetail />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
