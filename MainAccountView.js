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
  ListView,
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
        // Update transaction list
        this._updateTransactions();
        dismissKeyboard();
        let transactions = db.objects('Transactions').sorted('Timestamp', 'reverse');
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            balance: "nil",
            balanceDecimal: "nil",
            dataSource: ds.cloneWithRows(transactions),
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
                    if (userAccountUpdate.length == 0) {
                        // @FIXME There are cases where the user stored in the accounts table and the user sent to log in 
                        // are two different users. Find the cause and fix. For now we throw an error and send the user out
                        alert("Account stored in database is not the same as login!");
                        actions.login({ type: "reset" });
                        return;
                    }
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
                Alert.alert('Error', 'Could not update account details: '+res.error);
                console.log(res);
                dismissKeyboard();
                return;
            }
        });
    },

    _updateTransactions: function() {
        console.log('updating transcations...');
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
        
        // We set up the data to fetch 5 records
        let data = {
            perPage : 5,
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

    updateStateListener: function() {
        // Fetch account
        let user = db.objects('Account');
        var userAccount = user.slice(0,1);
        userAccount = userAccount[0];
        var balance = Math.floor(userAccount.AccountBalance);
        let balanceDecimal = Math.round((userAccount.AccountBalance - balance) * 100);
        balance = this.numberWithCommas(balance);
        this.setState({ 'balance' : balance });
        this.setState({ 'balanceDecimal' : balanceDecimal });
    },

    updateTransactionListener: function() {
        // Fetch transactions
        let transactions = db.objects('Transactions');
    },

	componentDidMount: function() {
        // Update transaction list
        this._updateTransactions();
		// Observe Realm Change Events
		db.addListener('change', this.updateStateListener);
		db.addListener('change', this.updateTransactionListener);
	},

    componentWillUnmount: function() {
        // Remove the listener
		db.removeListener('change', this.updateStateListener);
		db.removeListener('change', this.updateTransactionListener);
    },

    numberWithCommas: function(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

    render: function() {
        var notificationMessage;
        if (typeof(this.props.message) != 'undefined') {
              notificationMessage = <Text style={styles.global.notification}>{this.props.message}</Text>;
        }         

        return (
            <Image source={require('./assets/bg-blur.png')} style={styles.main.backgroundImage}>
                <View style={styles.global.container}>
                    <View style={styles.landingPage.smallLogoWrap}>
                        <Image source={require('./assets/logo-sm.png')} style={styles.landingPage.smallLogo} />
                    </View>
                  <View style={styles.global.wrap}>
                    <Text style={styles.global.heading}>ACCOUNT</Text>
                    {notificationMessage}
                    <View style={styles.global.balanceContainerWrap}>
                        <View style={styles.global.balanceContainer}>
                            <Text style={styles.global.balance}>{this.state.balance}</Text>
                            <Text style={styles.global.balanceDecimal}> . {this.state.balanceDecimal}</Text>
                        </View>
                    </View>
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

module.exports = MainAccountView;
