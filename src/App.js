import React from 'react';
import Header from './components/common/Header';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import MainListPage from './mainlist/MainListPage';
import PageNotFound from './PageNotFound';
import ServiceListPage from './mainlist/ServiceListPage';
import ReduxListPage from './mainlist/ReduxListPage';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import reducer from './redux'

import thunk from 'redux-thunk'

const store = configureStore({
  reducer,
  devTools: process.env.NODE_ENV !== 'production',
  applyMiddleware: thunk
})

export function App() {
  return (
    <div className="container-fluid">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mainlist" element={<MainListPage />} />
        <Route path="/servicelist" element={<ServiceListPage />} />
        <Route path="/reduxlist" element={<ReduxListPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

function AppContainer() {
  return (
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  )
}

export default AppContainer
