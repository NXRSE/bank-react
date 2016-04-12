'use strict';

import React, { 
  AppRegistry,
  Component,
  Text,
  View,
  StatusBar,
  StyleSheet,
  Navigator
} from 'react-native';

import {Actions, Scene, Router, TabBar} from 'react-native-router-flux';

StatusBar.setBarStyle('light-content');


class BankReact extends Component {

	render() {
		// Set up database
		//let realm = new Realm({ schema: [ AccountSchema, AccountMetaSchema, AccountAuthSchema, AccountTokenSchema, TransactionsSchema, ContactsSchema ], schemaVersion: 1 });
		// @TODO Apply Encryption
		//let realm = new Realm({ schema: [AccountSchema], encryptionKey: key });

        return <Router>
            <Scene key="root">
                <Scene key="loginRegister" component={LoginRegisterView} title="Bank"/>
                <Scene key="login" component={LoginView} title="Login"/>
                <Scene key="register" component={RegisterView} title="Register"/>
                <Scene key="createAuth" component={CreateAuthView} title="Register"/>
                <Scene key="main" component={MainAccountTabs} title="Tab Example"/>
                <Scene key="contact" component={ContactView} title="Contact"/>
                <Scene key="paymentCredit" component={MainPaymentCreditView} title="PaymentCredit"/>
                <Scene key="paymentDeposit" component={MainPaymentDepositView} title="PaymentDeposit"/>
            </Scene>
        </Router>
    }
}

var styles = require('./styles');
// Views
var LoginRegisterView = require('./LoginRegisterView');
var LoginView = require('./LoginView');
var RegisterView = require('./RegisterView');
var CreateAuthView = require('./CreateAuthView');
var MainAccountTabs = require('./MainAccountTabs');
var ContactView = require('./ContactView');
var MainPaymentCreditView = require('./MainPaymentCreditView');
var MainPaymentDepositView = require('./MainPaymentDepositView');

// DB
var db = require('./libs/RealmDB');
//console.log(db.path);

AppRegistry.registerComponent('BankReact', () => BankReact);
