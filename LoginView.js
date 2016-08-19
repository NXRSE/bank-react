'use strict';

import React, { Component } from 'react';
import { 
  AppRegistry,
  Text,
  View,
  StatusBar,
  StyleSheet,
  TextInput,
  Image,
  Alert
} from 'react-native';

import Button from 'react-native-button'
import {Scene, Router, TabBar, Modal, Schema, Actions, Reducer} from 'react-native-router-flux'

let styles = require('./styles');
let BankClient = require('./libs/BankClient');
let bc = new BankClient();
let db = require('./libs/RealmDB');  
let dismissKeyboard = require('dismissKeyboard');

let PushNotification = require('react-native-push-notification');

PushNotification.configure({

    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function(token) {
		let tokenString = token.token;
        console.log( 'TOKEN:', tokenString );

        if (typeof tokenString != undefined) {
            // Save in database
            db.write(() => {
                // Delete tokens
                let allTokens = db.objects('DeviceToken');
                db.delete(allTokens); 

                db.create('DeviceToken', { 
                   Token: tokenString,
                   Platform: "ios"
                });
            });
        }
    },

    // (required) Called when a remote or local notification is opened or received
    onNotification: function(notification) {
        console.log( 'NOTIFICATION:', notification );
        alert(notification.message);
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

var LoginView = React.createClass({
    getInitialState() {
        dismissKeyboard();
        this.addPushTokenInit();
        return {
            password: ''
        }
    },

    _doLogin: function() {
        // Check password
        let userAuth = db.objects('AccountAuth');
        if (userAuth.length > 0) {
            var userAccount = userAuth.slice(0,1);
            userAccount = userAccount[0];

            console.log(userAccount.Password);
            if (userAccount.Password != this.state.password) {
                Alert.alert('Auth Failure', 'Password incorrect');
                return;
            }

            // @TODO Maybe check and try to extend existing auth token?
            // For now we just delete and get a new one
            // Repeated logging in will fill up Redis with tokens
            let data = { User: userAccount.AccountNumber, Password: userAccount.Password };
            let res = bc.authLogin(data, function(res) {
                console.log(res);
                if (typeof res.error == 'undefined') {
                    // Get token
                    let token = res.response;
                    db.write(() => {
                    // Delete tokens
                        let allTokens = db.objects('AccountToken');
                        db.delete(allTokens);

                        db.create('AccountToken', { 
                           Token: token,
                           //Timestamp: Math.floor(Date.now())
                           Timestamp: 1
                        });
                    });
                    // Go to account landing view
                    dismissKeyboard();
                    Actions.main({type : "reset"});
                    //Actions.refresh({key: 'drawer', open: value => !value});
                } else {
                    // Show error
                    Alert.alert('Error', res.error);
                    dismissKeyboard();
                    return;
                }
            });
        } else {
            dismissKeyboard();
            // Check if an account exists
            let userAccount = db.objects('Account');
            if (userAccount.length == 0) {
                Actions.register();
                return;
            }
            // Send login
            let data = { User: userAccount[0].AccountNumber, Password: this.state.password };
            let res = bc.authLogin(data, function(res) {
                console.log(res);
                if (typeof res.error == 'undefined') {
                    // Get token
                    let token = res.response;
                    db.write(() => {
                    // Delete tokens
                        let allTokens = db.objects('AccountToken');
                        db.delete(allTokens);

                        db.create('AccountToken', { 
                           Token: token,
                           //Timestamp: Math.floor(Date.now())
                           Timestamp: 1
                        });
                    });
                    // Go to account landing view
                    dismissKeyboard();
                    Actions.main({type : "reset"});
                    //Actions.refresh({key: 'drawer', open: value => !value});
                } else {
                    // Show error
                    Alert.alert('Error', res.error);
                    dismissKeyboard();
                    return;
                }
            });
        }
    },

    checkAccount: function() {
        let userAccount = db.objects('Account');
        if (userAccount.length == 0) {
            // There is no account set up yet
            // Show fetch account screen
            Actions.accountFetch();
        }
    },

    addPushTokenInit: function() {
        // Testing
        /*
        let pushToken = "test-push-token-ios-2";
        let platform = "ios";
        let data = { PushToken: pushToken, Platform: platform };
        bc.addPushToken(data, () => {
            console.log("push token added");
        });
        */

        // Fetch token 
        // * @FIXME This is currently throwing "Error: Object type 'DeviceToken' not present in Realm"
        let pushTokenObj = db.objects('DeviceToken');
        console.log('Push token:');
        console.log(pushTokenObj);
        if (pushTokenObj.length > 0) {
            var pushTokenArr = pushTokenObj.slice(0,1);
            let pushToken = pushTokenArr[0];
            console.log(pushToken);
            let pToken = pushToken.Token;
            let platform = pushToken.Platform;
            let data = { PushToken: pToken, Platform: platform };
            console.log(data);
            bc.addPushToken(data, () => {
                console.log("push token added");
            });
        } else {
            console.log("No token, get the token");
            PushNotification.checkPermissions(function(res) {
                console.log(res);
            });
            PushNotification.abandonPermissions();
            PushNotification.requestPermissions();
        }
    },

    render: function() {
        return (
            <View style={styles.global.container}>
                <Image source={require('./assets/bg.png')} style={styles.landingPage.backgroundImage}>
                    <View style={styles.landingPage.smallLogoWrap}>
                        <Image source={require('./assets/logo-sm.png')} style={styles.landingPage.smallLogo} />
                    </View>
                      <View style={styles.global.wrap}>
                        <TextInput
                            style={styles.forms.inputText}
                            onChangeText={(password) => this.setState({password})}
                            value={this.state.password}
                            autoCorrect={false}
                            keyboardAppearance="dark"
                            secureTextEntry={true}
                            autoCapitalize="none"
                            placeholder="Password"
                        />
                        <Button containerStyle={styles.buttons.containerFilled} style={styles.buttons.base}
                        onPress={ this._doLogin }>SIGN IN</Button>
                      </View>
                  </Image>
            </View>
        )
    }
});

module.exports = LoginView;
