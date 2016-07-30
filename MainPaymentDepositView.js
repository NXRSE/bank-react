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

var MainPaymentDepositView = React.createClass({
    getInitialState() {
        dismissKeyboard();
        return {
            depositAmount: '',
            depositDesc: '',
            initialPosition: 'unknown', 
            lastPosition: 'unknown',
        }
    },

    componentDidMount: function() {
        navigator.geolocation.getCurrentPosition( 
            (position) => {    
                var initialPosition = JSON.stringify(position); 
                this.setState({initialPosition});
                console.log(initialPosition);
            }, 
            (error) => alert(error.message), 
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000} 
        ); 
        
        this.watchID = navigator.geolocation.watchPosition((position) => { 
            var lastPosition = JSON.stringify(position); this.setState({lastPosition}); 
            console.log("Last pos");
            console.log(lastPosition);
            console.log(lastPosition['coords']);
        });
    },

    componentWillUnmount: function() { 
        navigator.geolocation.clearWatch(this.watchID); 
    },

    _doDeposit: function() {
        let user = db.objects('Account');
        if (user.length > 0) {
            var userAccount = user.slice(0,1);
            userAccount = userAccount[0];
            let lastPos = JSON.parse(this.state.lastPosition)
            let data = {
                AccountDetails: userAccount.AccountNumber+'@'+userAccount.BankNumber,
                Amount: this.state.depositAmount,
                Lat: lastPos.coords.latitude,
                Lon: lastPos.coords.longitude,
                Desc: this.state.depositDesc
            };

            let res = bc.paymentDeposit(data, function(res) {
                console.log(res);
                if (typeof res.error == 'undefined') {
                    console.log('Go to main...');
                    dismissKeyboard();
                    // Can't switch to main view as it is the same level but a separate view
                    alert("Deposit successful");
                } else {
                    // Show error
                    dismissKeyboard();
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
                <TextInput
                    style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                    onChangeText={(depositDesc) => this.setState({depositDesc})}
                    value={this.state.depositDesc}
                    autoCorrect={false}
                    autoCapitalize="none"
                    placeholder="Description"
                />
                <Button onPress={ this._doDeposit }>Deposit</Button>
              </View>
            </View>
        )
    }
});

module.exports = MainPaymentDepositView;
