'use strict';

import React, { 
  AppRegistry,
  Component,
  Text,
  View,
  StatusBar,
  StyleSheet,
  TextInput,
  ListView,
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

var MainTransactionsView = React.createClass({

    getInitialState: function() {
        dismissKeyboard();
        let transactions = db.objects('Transactions').sorted('Timestamp', 'reverse');
        // Limit to 100 transactions
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).slice(0, 100);
        return {
            dataSource: ds.cloneWithRows(transactions),
        };
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


    componentDidMount: function() {
        // Get latest transactions
        let transactionsRes = db.objects('Transactions');
        var transactionsResSorted = transactionsRes.sorted('Timestamp');
        var timestamp = 0
        if (transactionsResSorted.length > 0) {
            // Get latest
            let latestTransaction = transactionsResSorted.slice(transactionsResSorted.length - 1, transactionsResSorted.length);
            if (latestTransaction.length > 0) {
                timestamp = latestTransaction[0].Timestamp;
            }
        }
        
        // We set up the data to fetch 20 records
        // @TODO implement pagination/inifinte scrolling
        let data = {
            perPage : 20,
            page : 0,
            timestamp : timestamp
        };

        let res = bc.transactionsListAfterTimestamp(data, function(res) {
            if (typeof res.error == 'undefined') {
                let transactionList = res.response;
                db.write(() => {
                    transactionList.forEach(function(t) { 
                        // Check if transaction exists
                        let trDB = db.objects('Transactions').filtered('Transaction == $0', t.ID);

                        if (trDB.length == 0) {
                            var senderName = "";
                            var receiverName = "";

                            var contact = db.objects('Contacts').filtered('ContactAccountNumber == $0 && ContactBankNumber == $1', t.Receiver.AccountNumber, t.Receiver.BankNumber);
                            if (contact.length > 0) {
                                receiverName = contact[0].ContactName;
                            }

                            contact = db.objects('Contacts').filtered('ContactAccountNumber == $0 && ContactBankNumber == $1', t.Sender.AccountNumber, t.Sender.BankNumber);
                            if (contact.length > 0) {
                                senderName = contact[0].ContactName;
                            }
                            db.create('Transactions', { 
                                Transaction: t.ID,
                                Type: t.PainType,
                                SenderAccountNumber: t.Sender.AccountNumber,
                                SenderBankNumber: t.Sender.BankNumber,
                                ReceiverAccountNumber: t.Receiver.AccountNumber,
                                ReceiverBankNumber: t.Receiver.BankNumber,
                                TransactionAmount: t.Amount,
                                FeeAmount: t.Fee,
                                Lat: t.Geo[0],
                                Lon: t.Geo[1],
                                Desc: t.Desc,
                                Status: t.Status,
                                Timestamp: t.Timestamp,
                            });
                        }
                    });
                });
            } else {
                Alert.alert('Error', 'Could not update account details: '+res.error);
                console.log(res);
                dismissKeyboard();
                return;
            }
        });
    },

    render: function() {
        return (
            <Image source={require('./assets/bg-blur.png')} style={styles.main.backgroundImage}>
            <View style={styles.global.container}>
                <View style={styles.landingPage.smallLogoWrap}>
                    <Image source={require('./assets/logo-sm.png')} style={styles.landingPage.smallLogo} />
                </View>
                  <View style={styles.global.wrap}>
                    <Text style={styles.global.heading}>TRANSACTIONS</Text>
                    <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(rowData) => 
                    <View
                    style={styles.transaction.container}>
						<Text onPress={()=>Actions.transaction({ data: rowData })} style={styles.transaction.desc}>{rowData.Desc}</Text> 
						<Text onPress={()=>Actions.transaction({ data: rowData })} style={styles.transaction.time}>{this.timeConverter(rowData.Timestamp)}</Text>
                    </View>}
                    />
                  </View>
            </View>
            </Image>
        )
    }
});

module.exports = MainTransactionsView;
