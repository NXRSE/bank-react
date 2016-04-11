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

var ContactView = React.createClass({
    getInitialState() {
        return {
            data: { ContactName: "nil" }
        }
    },

    render: function() {

        return (
            <View style={styles.global.container}>
              <View style={styles.global.wrap}>
                <Text>MAIN ACCOUNT</Text>
                <Text>Contact name: {this.props.data.ContactName}</Text>
                <Text>Contact Account Number: {this.props.data.ContactAccountNumber}</Text>
                <Text>Contact Bank Number: {this.props.data.ContactBankNumber}</Text>

                <Button onPress={Actions.paymentCredit}
                containerStyle={{padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: 'white'}}
                                   style={{fontSize: 20, color: 'green'}}>Make payment</Button>
              </View>
            </View>
        )
    }
});

module.exports = ContactView;
