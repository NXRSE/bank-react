'use strict';

var React = require('react-native');
var {
  StyleSheet,
  TabBarIOS,
  Text,
  View,
} = React;

var MainAccountView = require('./MainAccountView');
var MainContactsView = require('./MainContactsView');
var MainPaymentCreditView = require('./MainPaymentCreditView');
var MainPaymentDepositView = require('./MainPaymentDepositView');

var MainAccountTabs = React.createClass({
  statics: {
    title: '<TabBarIOS>',
    description: 'Tab-based navigation.',
  },

  displayName: 'TabBarExample',

  getInitialState: function() {
    return {
      selectedTab: 'account',
      notifCount: 0,
      presses: 0,
    };
  },

  render: function() {
    return (
      <TabBarIOS
        tintColor="white"
        barTintColor="darkslateblue">
        <TabBarIOS.Item
          systemIcon="favorites"
          title="Main Account"
          selected={this.state.selectedTab === 'account'}
          onPress={() => {
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
          systemIcon="bookmarks"
          title="Credit"
          selected={this.state.selectedTab === 'paymentsCredit'}
          onPress={() => {
            this.setState({
              selectedTab: 'paymentsCredit',
              presses: this.state.presses + 1
            });
          }}>
		<MainPaymentCreditView />
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
      </TabBarIOS>
    );
  },

});

var styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    color: 'white',
    margin: 50,
  },
});

module.exports = MainAccountTabs;
