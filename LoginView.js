'use strict';

import React, { 
  AppRegistry,
  Component,
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
                } else {
                    // Show error
                    Alert.alert('Error', res.error);
                    dismissKeyboard();
                    return;
                }
            });
        } else {
            dismissKeyboard();
            Actions.register();
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
        if (pushTokenObj.length > 0) {
            var pushTokenArr = pushTokenObj.slice(0,1);
            pushToken = pushTokenArr[0];
            console.log(pushToken);
            let pushToken = pushToken.Token;
            let platform = pushToken.Platform;
            let data = { Token: pushToken, Platform: platform };
            bc.addPushToken(data, () => {
                console.log("push token added");
            });
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
