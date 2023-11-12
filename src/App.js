import React from 'react';
import Header from './components/common/Header';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import MainListPage from './mainlist/MainListPage';
import PageNotFound from './PageNotFound';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="container-fluid">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mainlist" element={<MainListPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}
export default App;
