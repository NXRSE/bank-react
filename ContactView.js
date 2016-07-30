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

var ContactView = React.createClass({
    getInitialState() {
        dismissKeyboard();
        return {
            data: { ContactName: "nil" }
        }
    },

    render: function() {

        return (
            <View style={styles.global.container}>
                <Image source={require('./assets/bg-blur.png')} style={styles.main.backgroundImage}>
                    <View style={styles.landingPage.smallLogoWrap}>
                        <Image source={require('./assets/logo-sm.png')} style={styles.landingPage.smallLogo} />
                    </View>
                      <View style={styles.global.wrap}>
                        <Text>MAIN CONTACT</Text>
                        <Text>Contact name: {this.props.data.ContactName}</Text>
                        <Text>Contact Account Number: {this.props.data.ContactAccountNumber}</Text>
                        <Text>Contact Bank Number: {this.props.data.ContactBankNumber}</Text>

                        <Button 
                        onPress={ ()=>Actions.paymentCredit({ data: this.props.data }) }
                        containerStyle={styles.buttons.containerFilled} style={styles.buttons.base}>MAKE PAYMENT</Button>
                      </View>
                </Image>
            </View>
        )
    }
});

module.exports = ContactView;
