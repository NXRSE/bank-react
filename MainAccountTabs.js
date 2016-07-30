'use strict';

var React = require('react-native');
var {
  StyleSheet,
  TabBarIOS,
  Text,
  Image,
  View,
} = React;

var MainAccountView = require('./MainAccountView');
var MainContactsView = require('./MainContactsView');
var MainPaymentDepositView = require('./MainPaymentDepositView');
var MainSettingsView = require('./MainSettingsView');

let styles = require('./styles');
let db = require('./libs/RealmDB'); 
let BankClient = require('./libs/BankClient');
let bc = new BankClient();
let dismissKeyboard = require('dismissKeyboard');

var MainAccountTabs = React.createClass({
    statics: {
      title: '<TabBarIOS>',
      description: 'Tab-based navigation.',
    },

    displayName: 'TabBarExample',

    getInitialState: function() {
      // Update balance
      this._updateAccount();
      dismissKeyboard();
      return {
        selectedTab: 'account',
        notifCount: 0,
        presses: 0,
      };
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
                Alert.alert('Error', 'Could not update account details');
                dismissKeyboard();
                return;
            }
        });
    },

    render: function() {
      return (
        <Image source={require('./assets/bg-blur.png')} style={styles.main.backgroundImage}>
            <TabBarIOS
              tintColor="white"
              barTintColor="#031d2c">
              <TabBarIOS.Item
                systemIcon="favorites"
                title="Main"
                selected={this.state.selectedTab === 'account'}
                onPress={() => {
                  // Update balance
                  this._updateAccount();
                  this.setState({
                    selectedTab: 'account',
                  });
                }}>
                <MainAccountView />
              </TabBarIOS.Item>
              <TabBarIOS.Item
                systemIcon="contacts"
                title="Contacts"
                badge={this.state.notifCount > 0 ? this.state.notifCount : undefined}
                selected={this.state.selectedTab === 'contacts'}
                onPress={() => {
                  this.setState({
                    selectedTab: 'contacts',
                    notifCount: this.state.notifCount + 1,
                  });
                }}>
                <MainContactsView />
              </TabBarIOS.Item>
              <TabBarIOS.Item
                systemIcon="top-rated"
                title="Deposit"
                selected={this.state.selectedTab === 'paymentsDeposit'}
                onPress={() => {
                  this.setState({
                    selectedTab: 'paymentsDeposit',
                    presses: this.state.presses + 1
                  });
                }}>
                <MainPaymentDepositView />
              </TabBarIOS.Item>
              <TabBarIOS.Item
                systemIcon="bookmarks"
                title="Settings"
                selected={this.state.selectedTab === 'settings'}
                onPress={() => {
                  this.setState({
                    selectedTab: 'settings',
                    presses: this.state.presses + 1
                  });
                }}>
                <MainSettingsView />
              </TabBarIOS.Item>
            </TabBarIOS>
        </Image>
      );
    },

});

module.exports = MainAccountTabs;
