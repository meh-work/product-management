import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Products from './components/Products';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Products />} />
      </Routes>
    </Router>
  );
};

export default App;
