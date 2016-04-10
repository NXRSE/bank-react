'use strict';

import React, { 
  AppRegistry,
  Component,
  Text,
  View,
  StatusBar,
  StyleSheet,
  TextInput,
  Alert
} from 'react-native';

import Button from 'react-native-button'
import {Scene, Router, TabBar, Modal, Schema, Actions, Reducer} from 'react-native-router-flux'

let styles = require('./styles');
let BankClient = require('./libs/BankClient');
let bc = new BankClient();
let db = require('./libs/RealmDB');  

var LoginView = React.createClass({
    getInitialState() {
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
            if (userAccount.Password != this.state.password) {
                Alert.alert('Auth Failure', 'Password incorrect');
                return;
            }

            // @TODO Maybe check and try to extend existing auth token?
            // For now we just delete and get a new one
            // Repeated logging in will fill up Redis with tokens
            let data = { User: userAccount.AccountNumber, Password: userAccount.Password };
            let res = bc.authLogin(data, function(res) {
                if (typeof res.error == 'undefined') {
                    // Delete tokens
                    db.write(() => {
                        let allTokens = db.objects('AccountToken');
                        db.delete(allTokens);
                    });
                    // Get token
                    let token = res.response;
                    db.write(() => {
                      db.create('AccountToken', { 
                          Token: token,
                          //Timestamp: Math.floor(Date.now())
                          Timestamp: 1
                        });
                    });
                    // Go to account landing view
                    Actions.main();
                } else {
                    // Show error
                    Alert.alert('Error', res.error);
                    return;
                }
            });
        } else {
            Actions.register();
        }
    },

    render: function() {
        return (
            <View style={styles.global.container}>
              <View style={styles.global.wrap}>
                <TextInput
                    style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                    onChangeText={(password) => this.setState({password})}
                    value={this.state.password}
                    autoCorrect={false}
                    keyboardAppearance="dark"
                    autoCapitalize="none"
                    placeholder="Password"
                />
                <Button onPress={ this._doLogin }>Click me</Button>
              </View>
            </View>
        )
    }
});

module.exports = LoginView;
