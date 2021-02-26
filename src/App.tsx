import React from "react";
import {TagNavbar} from "./components/Navbar";
import {HomePage} from "./pages/home";
import {PetsPage} from "./pages/pets";
import {Route, Switch, BrowserRouter as Router} from "react-router-dom"

import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import { AmplifySignUp, AmplifyAuthenticator, AmplifySignOut }  from '@aws-amplify/ui-react';

Amplify.configure(awsconfig);

function App() {
    return (
      <AmplifyAuthenticator usernameAlias="username">
        <AmplifySignUp 
          slot="sign-up"
          usernameAlias="username"
          formFields={[
            {
              type: "given_name",
              label: "Enter your first name",
              placeholder: "John",
              required: true,
            },
            {
              type: "family_name",
              label: "Enter your last name",
              placeholder: "Doe",
              required: true,
            },
            {
              type: "email",
              label: "Enter your e-mail",
              placeholder: "johndoe@gmail.com",
              required: true,
            },
            {
              type: "username",
              label: "Enter your Username",
              placeholder: "Username",
              required: true,
            },
            {
              type: "password",
              label: "Enter your Password",
              placeholder: "Password",
              required: true,
            },
          ]} />
        <Router>
          <TagNavbar />
          <AmplifySignOut />
          <Switch>
              <Route path="/pets">
                  <PetsPage />
              </Route>
              <Route path="/">
                  <HomePage />
              </Route>
          </Switch>
        </Router>
      </AmplifyAuthenticator>
  );
}

export default App;
