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
let dismissKeyboard = require('dismissKeyboard');

var MainPaymentCreditView = React.createClass({
    getInitialState() {
        dismissKeyboard();
        return {
            paymentAmount: ''
        }
    },

    _doPayment: function() {
        let user = db.objects('Account');
        if (user.length > 0) {
            var userAccount = user.slice(0,1);
            userAccount = userAccount[0];
            let data = {
                SenderDetails: userAccount.AccountNumber+'@'+userAccount.BankNumber,
                RecipientDetails: this.props.data.ContactAccountNumer+'@'+this.props.data.ContactBankNumber,
                Amount: this.state.paymentAmount
            };

            let res = bc.paymentCredit(data, function(res) {
                console.log(res);
                if (typeof res.error == 'undefined') {
                    dismissKeyboard();
                    Actions.main({ type : "reset" });
                } else {
                    // Show error
                    Alert.alert('Error', res.error);
                    dismissKeyboard();
                    return;
                }
            });
        }
    },

    render: function() {
        return (
            <View style={styles.global.container}>
              <View style={styles.global.wrap}>
                <Text>MAIN PAYMENTS CREDIT</Text>
                <Text>Make payment to: {this.props.data.ContactName}</Text>
                <TextInput
                    style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                    onChangeText={(paymentAmount) => this.setState({paymentAmount})}
                    value={this.state.paymentAmount}
                    autoCorrect={false}
                    keyboardType='decimal-pad'
                    autoCapitalize="none"
                    placeholder="Payment Amount"
                />
                <Button onPress={ this._doPayment }>Make Payment</Button>
              </View>
            </View>
        )
    }
});

module.exports = MainPaymentCreditView;
