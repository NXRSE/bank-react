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

var MainPaymentCreditView = React.createClass({
    getInitialState() {
        return {
            password: ''
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
            let userAccount = user.slice(0,1);
            let data = {User: userAccount.AccountNumber, Password: this.state.password};
            let res = bc.authCreate(data, function(res) {
                console.log("At the login");
                console.log(res);
            });
        }
    },

    render: function() {
        return (
            <View style={styles.global.container}>
              <View style={styles.global.wrap}>
                <Text>MAIN PAYMENTS CREDIT</Text>
                <TextInput
                    style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                    onChangeText={(password) => this.setState({password})}
                    value={this.state.password}
                    autoCorrect={false}
                    keyboardAppearance="dark"
                    autoCapitalize="none"
                    placeholder="Password"
                />
                <Button onPress={ this._doCreateAuth }>Create Login</Button>
              </View>
            </View>
        )
    }
});

module.exports = MainPaymentCreditView;
