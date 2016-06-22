'use strict';

import React, { 
  AppRegistry,
  Component,
  Text,
  View,
  StatusBar,
  StyleSheet,
  Navigator,
  Alert
} from 'react-native';

import {Actions, Scene, Router, TabBar} from 'react-native-router-flux';
let PushNotification = require('react-native-push-notification');

StatusBar.setBarStyle('light-content');

PushNotification.configure({

    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function(token) {
		let tokenString = token.token;
        console.log( 'TOKEN:', tokenString );
		Alert.alert('Token', tokenString);
/*
		// Save in database
		db.write(() => {
			// Delete tokens
			let allTokens = db.objects('DeviceToken');
			db.delete(allTokens); 

			db.create('DeviceToken', { 
			   Token: tokenString,
			});
		});
*/
    },

    // (required) Called when a remote or local notification is opened or received
    onNotification: function(notification) {
        console.log( 'NOTIFICATION:', notification );
    },

    // ANDROID ONLY: (optional) GCM Sender ID.
    senderID: "YOUR GCM SENDER ID",

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
        alert: true,
        badge: true,
        sound: true
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
      * IOS ONLY: (optional) default: true
      * - Specified if permissions will requested or not,
      * - if not, you must call PushNotificationsHandler.requestPermissions() later
      */
    requestPermissions: true,
});

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
                <Scene key="main" component={MainAccountTabs} title="Main Account"/>
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
