import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PageInicial from './pages/PageInicial';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PageInicial />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;