import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import {TagNavbar} from "./components/Navbar";
import {HomePage} from "./pages/home";
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
