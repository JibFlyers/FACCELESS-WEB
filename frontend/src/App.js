import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import RegistrationScreen from './components/RegistrationScreen'
import SignUpScreen from './components/SignUpScreen'
import SignUpOptionnalScreen from './components/SignUpOptionnalScreen';
import HomeScreen from './components/HomeScreen';
import ProfilScreen from './components/ProfilScreen';
import ConversationScreen from './components/ConversationScreen';
import UsersProfilScreen from './components/UsersProfilScreen';
import SignIn from './components/SignIn';


import userToken from './reducers/user';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
const store = createStore(combineReducers({ userToken }));

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/">
            <RegistrationScreen />
          </Route>
          <Route exact path="/sign-in">
            <SignIn />
          </Route>
          <Route exact path="/sign-up">
            <SignUpScreen />
          </Route>
          <Route exact path="/sign-up-optionnal">
            <SignUpOptionnalScreen />
          </Route>
          <Route exact path="/home">
            <HomeScreen />
          </Route>
          <Route exact path="/profil">
            <ProfilScreen />
          </Route>
          <Route exact path="/conversations">
            <ConversationScreen />
          </Route>
          <Route exact path="/usersprofilscreen/:id">
            <UsersProfilScreen />
          </Route>
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
