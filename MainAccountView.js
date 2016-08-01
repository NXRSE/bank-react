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
  TouchableOpacity,
  Alert
} from 'react-native';

import Button from 'react-native-button'
import {Scene, Router, TabBar, Modal, Schema, Actions, Reducer} from 'react-native-router-flux'

let styles = require('./styles');
let BankClient = require('./libs/BankClient');
let bc = new BankClient();
let db = require('./libs/RealmDB');  
let dismissKeyboard = require('dismissKeyboard');

var MainAccountView = React.createClass({
    getInitialState() {
        dismissKeyboard();
        return {
            balance: "nil",
        }
    },

    updateStateListener: function() {
        // Fetch account
        let user = db.objects('Account');
        var userAccount = user.slice(0,1);
        userAccount = userAccount[0];
        console.log(userAccount.AccountBalance);
        this.setState({ 'balance' : userAccount.AccountBalance });
    },

	componentDidMount: function() {
		// Observe Realm Change Events
		db.addListener('change', this.updateStateListener);
	},

    componentWillUnmount: function() {
        // Remove the listener
		db.removeListener('change', this.updateStateListener);
    },

    render: function() {
        return (
            <Image source={require('./assets/bg-blur.png')} style={styles.main.backgroundImage}>
                <View style={styles.global.container}>
                    <View style={styles.landingPage.smallLogoWrap}>
                        <Image source={require('./assets/logo-sm.png')} style={styles.landingPage.smallLogo} />
                    </View>
                  <View style={styles.global.wrap}>
                    <Text>MAIN ACCOUNT</Text>
                    <Text>{this.state.balance}</Text>
                  </View>
                </View>
            </Image>
        )
    }
});

module.exports = MainAccountView;
