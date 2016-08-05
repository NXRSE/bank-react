'use strict';

import React, { 
  AppRegistry,
  Component,
  Text,
  TextInput,
  View,
  StatusBar,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Alert
} from 'react-native';

import Button from 'react-native-button'
import {Scene, Router, TabBar, Modal, Schema, Actions, Reducer} from 'react-native-router-flux'

var styles = require('./styles');
let BankClient = require('./libs/BankClient');
let bc = new BankClient();
let db = require('./libs/RealmDB');
let dismissKeyboard = require('dismissKeyboard');

var RegisterView = React.createClass({
    getInitialState() {
        dismissKeyboard();
        return {
            givenName: '',
            familyName: '',
            idNumber: '',
            email: ''
        }
    },

    _doRegister: function() {
        let data = {
            AccountHolderGivenName: this.state.givenName, 
            AccountHolderFamilyName: this.state.familyName,
            AccountHolderDateOfBirth: '',
            AccountHolderIdentificationNumber: this.state.idNumber,
            AccountHolderContactNumber1: '',
            AccountHolderContactNumber2: '',
            AccountHolderEmailAddress: this.state.email,
            AccountHolderAddressLine1: '',
            AccountHolderAddressLine2: '',
            AccountHolderAddressLine3: '',
            AccountHolderPostalCode: '',
        };
        let res = bc.accountCreate(data, function(res) {
            console.log("At register");
            console.log(res);
            console.log('One');
            console.log(res.response);
            console.log('Two');
            console.log(typeof res.response);
            console.log('Three');
            if (typeof res.response != 'undefined') {
                let accountId = res.response;
                console.log('AccountID: '+accountId);
                // Set in DB
                db.write(() => {
                    // Delete all other accounts for now
                    let accounts = db.objects('Account');
                    db.delete(accounts);
                    let contacts = db.objects('Contacts');
                    db.delete(contacts);
                    let transactions = db.objects('Transactions');
                    db.delete(transactions);
                    let auth = db.objects('AccountAuth');
                    db.delete(auth);
                    let authToken = db.objects('AccountToken');
                    db.delete(authToken);
                    let accountMeta = db.objects('AccountMeta');
                    db.delete(accountMeta);
                    let deviceToken = db.objects('DeviceToken');
                    db.delete(deviceToken);

                    db.create('Account', { 
                        AccountNumber: accountId,
                        BankNumber: '',
                        AccountHolderName: data.AccountHolderFamilyName+','+data.AccountHolderGivenName,
                        AccountBalance: 0,
                        Overdraft: 0,
                        AvailableBalance: 0,
                        //Timestamp: Math.floor(Date.now())
                        Timestamp: 1
                    });
                });
                console.log('Written');
                // Read the account value from DB
                let user = db.objects('Account');
                let userAccount = user.filtered('AccountNumber == $0', accountId);
                console.log('User?');
                console.log(userAccount);
                dismissKeyboard();
                if (userAccount.length == 1) {
                    console.log("Successfull")
                    console.log(userAccount[0]);
                    Actions.createAuth();
                }
                // Alert token value
                // Load new page
            } else if (typeof res.error != 'undefined') {
                dismissKeyboard();
                Alert.alert('Error', res.error);
                console.log('Error');
            }
        });
    },

    render() {
        return (
            <View style={styles.global.container}>
                <Image source={require('./assets/bg.png')} style={styles.landingPage.backgroundImage}>
                    <View style={styles.landingPage.smallLogoWrap}>
                        <Image source={require('./assets/logo-sm.png')} style={styles.landingPage.smallLogo} />
                    </View>
                  <KeyboardAvoidingView style={styles.global.wrap}>
                    <TextInput
                        style={styles.forms.inputText}
                        onChangeText={(givenName) => this.setState({givenName})}
                        value={this.state.givenName}
                        autoCorrect={false}
                        placeholder="Given Name"
                    />
                    <TextInput
                        style={styles.forms.inputText}
                        onChangeText={(familyName) => this.setState({familyName})}
                        value={this.state.familyName}
                        autoCorrect={false}
                        placeholder="Family Name"
                    />
                    <TextInput
                        style={styles.forms.inputText}
                        onChangeText={(idNumber) => this.setState({idNumber})}
                        value={this.state.idNumber}
                        autoCorrect={false}
                        keyboardType='number-pad'
                        placeholder="ID Number"
                    />
                    <TextInput
                        style={styles.forms.inputText}
                        onChangeText={(email) => this.setState({email})}
                        value={this.state.email}
                        autoCorrect={false}
                        autoCapitalize="none"
                        keyboardType='email-address'
                        placeholder="Email"
                    />
                    <Button containerStyle={styles.buttons.containerFilled} style={styles.buttons.base}
                    onPress={ this._doRegister }>REGISTER</Button>
                  </KeyboardAvoidingView>
              </Image>
            </View>
        )
    }
});

module.exports = RegisterView;
