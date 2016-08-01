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

var CreateAuthView = React.createClass({
    getInitialState() {
        dismissKeyboard();
        return {
            password: ''
        }
    },

    doLogin: function() {
        console.log('Do login called');
        let userAuth = db.objects('AccountAuth');
        if (userAuth.length > 0) {
            var userAccount = userAuth.slice(0,1);
            userAccount = userAccount[0];

            let data = { User: userAccount.AccountNumber, Password: userAccount.Password };
            let res = bc.authLogin(data, function(res) {
                if (typeof res.error == 'undefined') {
                    console.log(res);
                    console.log(res.response);
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
        }
    },

    _doCreateAuth: function() {
        //Alert.alert('Password', this.state.password);
        // Get user account number
        let user = db.objects('Account');
        // Check if there is a result
        if (user.length > 0)
        {
            // Get first user account
            var userAccount = user.slice(0,1);
            userAccount = userAccount[0];
            let data = {User: userAccount.AccountNumber, Password: this.state.password};
            let res = bc.authCreate(data, this.authCreateCallback);
        }
    },

    authCreateCallback: function(res) {
        let user = db.objects('Account');
        // Check if there is a result
        if (user.length > 0)
        {
            // Get first user account
            var userAccount = user.slice(0,1);
            userAccount = userAccount[0];
            let data = {User: userAccount.AccountNumber, Password: this.state.password};
            console.log(res);
            if (typeof res.error == 'undefined') {
                console.log('before insert');
                // Save account auth details
                db.write(() => {
                    let auth = db.objects('AccountAuth');
                    db.delete(auth);

                    db.create('AccountAuth', { 
                       AccountNumber: data.User,
                       Password: data.Password,
                       //Timestamp: Math.floor(Date.now())
                       Timestamp: 1
                    });
                });
                // Log user in
                console.log('after insert');
                this.doLogin();
            } else if (res.error == 'appauth.CreateUserPassword: Account already exists'){
                // Log user in
                console.log('at error, show login');
                this.doLogin();
            } else {
                // Show error
                Alert.alert('Error', res.error);
                return;
            }
        }
    },

    render: function() {
        return (
            <Image source={require('./assets/bg-blur.png')} style={styles.main.backgroundImage}>
                <View style={styles.global.container}>
                    <View style={styles.landingPage.smallLogoWrap}>
                        <Image source={require('./assets/logo-sm.png')} style={styles.landingPage.smallLogo} />
                    </View>
                    <View style={styles.global.container}>
                      <View style={styles.global.wrap}>
                        <TextInput
                            style={styles.forms.inputText}
                            onChangeText={(password) => this.setState({password})}
                            value={this.state.password}
                            autoCorrect={false}
                            keyboardAppearance="dark"
                            autoCapitalize="none"
                            secureTextEntry={true}
                            placeholder="Password"
                        />
                        <Button containerStyle={styles.buttons.containerFilled} style={styles.buttons.base}
                        onPress={ this._doCreateAuth }>CREATE LOGIN</Button>
                      </View>
                    </View>
                </View>
            </Image>
        )
    }
});

module.exports = CreateAuthView;
