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
        // Update balance
        this._updateAccount();
        dismissKeyboard();
        return {
            balance: "nil",
        }
    },

    _updateAccount: function() {
        console.log('updating account...');
        // Get latest balances
        let data = {};
        let res = bc.accountGet(data, function(res) {
            if (typeof res.error == 'undefined') {
                console.log(res.response);
                let userAccountDetails = JSON.parse(res.response);

                db.write(() => {
                    console.log('Writing');
                    console.log(userAccountDetails.AccountNumber);
                    // Update Main Account
                    let userUpdate = db.objects('Account');
                    var userAccountUpdate = userUpdate.filtered('AccountNumber == $0', userAccountDetails.AccountNumber);
                    //var userAccountUpdate = userUpdate.slice(0,1).first;
                    userAccountUpdate = userAccountUpdate[0];
                    console.log(userAccountUpdate);

                    userAccountUpdate.AccountHolderName = userAccountDetails.AccountHolderName;
                    userAccountUpdate.Overdraft = userAccountDetails.Overdraft;
                    userAccountUpdate.AvailableBalance = userAccountDetails.AvailableBalance;
                    userAccountUpdate.AccountBalance = userAccountDetails.AccountBalance;

                    console.log('After the write');
                    console.log(userAccountUpdate);
                });
            } else {
                Alert.alert('Error', 'Could not update account details');
                dismissKeyboard();
                return;
            }
        });
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
        var notificationMessage;
        if (typeof(this.props.message) != 'undefined') {
              notificationMessage = <Text>Message: {this.props.message}</Text>;
        }         

        return (
            <Image source={require('./assets/bg-blur.png')} style={styles.main.backgroundImage}>
                <View style={styles.global.container}>
                    <View style={styles.landingPage.smallLogoWrap}>
                        <Image source={require('./assets/logo-sm.png')} style={styles.landingPage.smallLogo} />
                    </View>
                  <View style={styles.global.wrap}>
                    <Text>MAIN ACCOUNT</Text>
                    {notificationMessage}
                    <Text>{this.state.balance}</Text>
                  </View>
                </View>
            </Image>
        )
    }
});

module.exports = MainAccountView;
