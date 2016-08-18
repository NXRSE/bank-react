'use strict';

import React, { Component } from 'react';
import { 
  AppRegistry,
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
import MapView from 'react-native-maps';

let styles = require('./styles');
let BankClient = require('./libs/BankClient');
let bc = new BankClient();
let db = require('./libs/RealmDB');  
let dismissKeyboard = require('dismissKeyboard');

var TransactionView = React.createClass({
    getInitialState() {
        dismissKeyboard();
        return {
            data: { },
            transaction: { },
        }
    },

	timeConverter: function(UNIX_timestamp) {
	  var a = new Date(UNIX_timestamp * 1000);
	  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	  var year = a.getFullYear();
	  var month = months[a.getMonth()];
	  var date = a.getDate();
	  var hour = a.getHours();
	  var min = a.getMinutes();
	  var sec = a.getSeconds();
	  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
	  return time;
	},

    checkTransactionDetails: function() {
			db.write(() => {
			// Check if transaction exists
			let trDB = db.objects('Transactions').filtered('Transaction == $0', this.props.data.Transaction);
            console.log("Check length of transaction");
            console.log(trDB.length);
            console.log(this.props.data);

			if ((trDB.length == 1) && (this.props.data.ReceiverName == "") && (this.props.data.SenderName == "")) {
                let transaction = trDB[0];
				var senderName = "";
				var receiverName = "";

				var contact = db.objects('Contacts').filtered('ContactAccountNumber == $0 && ContactBankNumber == $1', transaction.ReceiverAccountNumber, transaction.ReceiverBankNumber);
				if (contact.length > 0) {
					receiverName = contact[0].ContactName;
				}

				contact = db.objects('Contacts').filtered('ContactAccountNumber == $0 && ContactBankNumber == $1', transaction.SenderAccountNumber, transaction.SenderBankNumber);
				if (contact.length > 0) {
					senderName = contact[0].ContactName;
				}

				db.create('Transactions', { 
					Transaction: transaction.Transaction,
					Type: transaction.Type,
					SenderAccountNumber: transaction.SenderAccountNumber,
					SenderBankNumber: transaction.SenderBankNumber,
					ReceiverAccountNumber: transaction.ReceiverAccountNumber,
					ReceiverBankNumber: transaction.ReceiverBankNumber,
					TransactionAmount: transaction.TransactionAmount,
                    SenderName: senderName,
                    ReceiverName: receiverName,
					FeeAmount: transaction.FeeAmount,
					Lat: transaction.Lat,
					Lon: transaction.Lon,
					Desc: transaction.Desc,
					Status: transaction.Status,
					Timestamp: transaction.Timestamp,
				}, true);
			}
        });
    },

    updateStateListener: function() {
        let id = parseInt(this.props.data.Transaction);
		let trDB = db.objects('Transactions').filtered('Transaction == $0', id);
        var transArr = trDB.slice(0,1);
        let transaction = transArr[0];
        this.setState({ 'transaction' : transaction });
    },

	componentDidMount: function() {
        // Update transaction list
        this.checkTransactionDetails();
        this.updateStateListener();
		// Observe Realm Change Events
		db.addListener('change', this.updateStateListener);
	},

    componentWillUnmount: function() {
        // Remove the listener
		db.removeListener('change', this.updateStateListener);
    },

    render: function() {

        //let marker = { latitude: this.props.data.Lat, longitude: this.props.data.Lon };
        let marker = { latitude: 37.7749, longitude: -122.4194 };
        console.log(marker);

        return (
            <View style={styles.global.container}>
                <Image source={require('./assets/bg-blur.png')} style={styles.main.backgroundImage}>
                    <View style={styles.landingPage.smallLogoWrap}>
                        <Image source={require('./assets/logo-sm.png')} style={styles.landingPage.smallLogo} />
                    </View>
                      <View style={styles.global.wrap}>
                        <MapView
                        style={styles.transaction.map}
                        initialRegion={{
                            //latitude: this.props.data.Lat,
                            //longitude: this.props.data.Lon,
                            latitude: 37.7749,
                            longitude: -122.4194,
                            latitudeDelta: 0.0070,
                            longitudeDelta: 0.0035,
                        }}
                        >
                            <MapView.Marker
                                coordinate={marker}
                                title={this.props.data.TransactionAmount.toString()}
                                description=""
                            />
                        </MapView>
                        <Text style={styles.transaction.desc}>Sender: {this.props.data.SenderName}</Text>
                        <Text style={styles.transaction.desc}>Receipient: {this.props.data.ReceiverName}</Text>
                        <Text style={styles.transaction.desc}>{this.props.data.Desc}</Text>
                        <Text style={styles.transaction.desc}>Amount: {this.props.data.TransactionAmount.toFixed(4)}</Text>
                        <Text style={styles.transaction.desc}>Fee: {this.props.data.FeeAmount.toFixed(4)}</Text>
                        <Text style={styles.transaction.desc}>{this.timeConverter(this.props.data.Timestamp)}</Text>

                        <Button 
                        onPress={ ()=>Actions.main({ type: "reset" })}
                        containerStyle={styles.buttons.containerFilled} style={styles.buttons.base}>DONE</Button>
                      </View>
                </Image>
            </View>
        )
    }
});

module.exports = TransactionView;
