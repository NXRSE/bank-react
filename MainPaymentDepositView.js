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

var MainPaymentDepositView = React.createClass({
    getInitialState() {
        return {
            depositAmount: ''
        }
    },

    _doDeposit: function() {
        let user = db.objects('Account');
        if (user.length > 0) {
            var userAccount = user.slice(0,1);
            userAccount = userAccount[0];
            let data = {
                AccountDetails: userAccount.AccountNumber+'@'+userAccount.BankNumber,
                Amount: this.state.depositAmount
            };

            let res = bc.paymentDeposit(data, function(res) {
                console.log(res);
                if (typeof res.error == 'undefined') {
                    console.log('Go to main...');
                    Actions.main({ selectedTab: 'account' });
                } else {
                    // Show error
                    Alert.alert('Error', res.error);
                    return;
                }
            });
        }
    },

    render: function() {
        return (
            <View style={styles.global.container}>
              <View style={styles.global.wrap}>
                <Text>MAIN PAYMENTS DEPOSIT</Text>
                <TextInput
                    style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                    onChangeText={(depositAmount) => this.setState({depositAmount})}
                    value={this.state.depositAmount}
                    autoCorrect={false}
                    autoCapitalize="none"
                    keyboardType='decimal-pad'
                    placeholder="Deposit Amount"
                />
                <Button onPress={ this._doDeposit }>Deposit</Button>
              </View>
            </View>
        )
    }
});

module.exports = MainPaymentDepositView;
