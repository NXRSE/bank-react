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

var AddContactView = React.createClass({
    getInitialState() {
        dismissKeyboard();
        let contacts = [];
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            search: '',
            message: '',
            dataSource: ds.cloneWithRows(contacts),
        }
    },

    componentDidMount: function() {
    },

    componentWillUnmount: function() { 
    },

    _doSearch: function() {
        let data = {
            Search: this.state.search,
        };

        var self = this;
        let res = bc.accountSearch(data, function(res) {
            console.log(res);
            if (typeof res.error == 'undefined') {
                if (res.response.length == 0) {
                    self.setState({ 'message' : 'No contacts found' });
                    self.setState({
                        dataSource: self.state.dataSource.cloneWithRows([])
                    })
                    return;
                }
                self.setState({ 'message' : '' });
                var newDs = res.response;
                self.setState({
                    dataSource: self.state.dataSource.cloneWithRows(newDs)
                })
                dismissKeyboard();
            } else {
                // Show error
                self.setState({ 'message' : res.error });
                dismissKeyboard();
                return;
            }
        });
    },

    addContact: function(data) {
        db.write(() => {
            // Check if contact exists
            var contactDB = db.objects('Contacts').filtered('ContactName == $0 && ContactAccountNumber == $1 && ContactBankNumber == $2', (data.FamilyName + ',' + data.GivenName), data.AccountNumber, data.BankNumber);

            if (contactDB.length == 0) {
                db.create('Contacts', { ContactName: (data.FamilyName+','+data.GivenName), ContactAccountNumber: data.AccountNumber, ContactBankNumber: data.BankNumber, ContactEmailAddress: data.EmailAddress });
                // Fetch contact
                contactDB = db.objects('Contacts').filtered('ContactName == $0 && ContactAccountNumber == $1 && ContactBankNumber == $2', (data.FamilyName + ',' + data.GivenName), data.AccountNumber, data.BankNumber);
            };

            Actions.contact({data: contactDB[0], type: 'reset'});
            return;
        });
    },

    render: function() {
        var notificationMessage;
        if (this.state.message != '') {
              notificationMessage = <Text style={styles.global.notification}>{this.state.message}</Text>;
        }         

        return (
            <Image source={require('./assets/bg-blur.png')} style={styles.main.backgroundImage}>
            <View style={styles.global.container}>
                <View style={styles.landingPage.smallLogoWrap}>
                    <Image source={require('./assets/logo-sm.png')} style={styles.landingPage.smallLogo} />
                </View>
                  <View style={styles.global.wrap}>
                    <Text style={styles.global.heading}>CONTACT SEARCH</Text>
                    <TextInput
                        style={styles.forms.inputText}
                        onChangeText={(search) => this.setState({search})}
                        value={this.state.search}
                        autoCorrect={false}
                        placeholder="Email, ID or Name"
                    />
                    <Button containerStyle={styles.buttons.containerFilled} style={styles.buttons.base}
                    onPress={ this._doSearch }>SEARCH</Button>
                    {notificationMessage}

                    <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(rowData) => 
                    <View
                    style={styles.global.contactItem}>
                        <Text onPress={()=>this.addContact(rowData)} 
                        style={styles.global.contactItemText}>{rowData.FamilyName}, {rowData.GivenName}</Text>
                    </View>}
                    />
                  </View>
            </View>
            </Image>
        )
    }
});

module.exports = AddContactView;
