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
            }, 
            (error) => alert(error.message), 
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000} 
        ); 
        
        this.watchID = navigator.geolocation.watchPosition((position) => { 
            var lastPosition = JSON.stringify(position); this.setState({lastPosition}); 
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
            var lat = 0;
            var lon = 0;
            let lastPosState = this.state.lastPosition;
            if (lastPosState != 'unknown') {
                let lastPos = JSON.parse(this.state.lastPosition);
                lat = lastPos.coords.latitude;
                lon = lastPos.coords.longitude;
            }
            let data = {
                AccountDetails: userAccount.AccountNumber+'@'+userAccount.BankNumber,
                Amount: this.state.depositAmount,
                Lat: lat,
                Lon: lon,
                Desc: this.state.depositDesc
            };

            let res = bc.paymentDeposit(data, function(res) {
                console.log(res);
                if (typeof res.error == 'undefined') {
                    console.log('Go to main...');
                    dismissKeyboard();
                    Actions.main({ type: "reset", message: "🎉 Deposit successful"});
                } else {
                    // Show error
                    dismissKeyboard();
                    Actions.main({ type : "reset",  message: "❌ Error: "+res.error });
                }
            });
        }
    },

    render: function() {
        return (
            <Image source={require('./assets/bg-blur.png')} style={styles.main.backgroundImage}>
            <View style={styles.global.container}>
                <View style={styles.landingPage.smallLogoWrap}>
                    <Image source={require('./assets/logo-sm.png')} style={styles.landingPage.smallLogo} />
                </View>
                  <View style={styles.global.wrap}>
                    <Text style={styles.global.heading}>DEPOSIT PAYMENT</Text>
                    <TextInput
                        style={styles.forms.inputText}
                        onChangeText={(depositAmount) => this.setState({depositAmount})}
                        value={this.state.depositAmount}
                        autoCorrect={false}
                        autoCapitalize="none"
                        keyboardType='decimal-pad'
                        placeholder="Deposit Amount"
                    />
                    <TextInput
                        style={styles.forms.inputText}
                        onChangeText={(depositDesc) => this.setState({depositDesc})}
                        value={this.state.depositDesc}
                        autoCorrect={false}
                        autoCapitalize="none"
                        placeholder="Description"
                    />
                    <Button containerStyle={styles.buttons.containerFilled} style={styles.buttons.base}
                    onPress={ this._doDeposit }>DEPOSIT</Button>
                  </View>
            </View>
            </Image>
        )
    }
});

module.exports = MainPaymentDepositView;
