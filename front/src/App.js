// import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './login';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path = '/' Component={Login}></Route>
      </Routes>
    </Router>
  );
}

export default App;
