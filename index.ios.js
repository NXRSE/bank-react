'use strict';

import React, { 
  AppRegistry,
  Component,
  Text,
  View,
  StatusBar,
  StyleSheet,
  NavigatorIOS
} from 'react-native';

import {Actions, Scene, Router} from 'react-native-router-flux';

StatusBar.setBarStyle('light-content');

class BankReact extends Component {

	render() {
        return <Router>
            <Scene key="root">
                <Scene key="loginRegister" component={LoginRegisterView} title="Bank"/>
                <Scene key="login" component={LoginView} title="Login"/>
                <Scene key="register" component={RegisterView} title="Register"/>
            </Scene>
        </Router>
    }
}

var styles = require('./styles');
var LoginRegisterView = require('./LoginRegisterView');
var LoginView = require('./LoginView');
var RegisterView = require('./RegisterView');

AppRegistry.registerComponent('BankReact', () => BankReact);
