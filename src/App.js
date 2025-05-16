import { BrowserRouter, Routes, Route } from "react-router-dom";
import CryptoDashboard from "./pages/CryptoDashboard";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CryptoDashboard />} />
        {/* Add more routes as needed */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
