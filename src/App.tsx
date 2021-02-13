import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {TagNavbar} from "./components/Navbar";
import {HomePage} from "./pages/home";
import './App.css';
import {PetsPage} from "./pages/pets";
import {Route, Switch, BrowserRouter as Router} from "react-router-dom"

function App() {
    return (
      <Router>
        <TagNavbar />
        <Switch>
            <Route path="/pets">
                <PetsPage />
            </Route>
            <Route path="/">
                <HomePage />
            </Route>
        </Switch>
      </Router>
  );
}

export default App;
