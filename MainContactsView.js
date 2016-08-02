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

var MainContactsView = React.createClass({

    getInitialState: function() {
        dismissKeyboard();
        let contacts = db.objects('Contacts');
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            dataSource: ds.cloneWithRows(contacts),
        };
    },

    componentDidMount: function() {
    },

    render: function() {
        return (
            <Image source={require('./assets/bg-blur.png')} style={styles.main.backgroundImage}>
            <View style={styles.global.container}>
                <View style={styles.landingPage.smallLogoWrap}>
                    <Image source={require('./assets/logo-sm.png')} style={styles.landingPage.smallLogo} />
                </View>
                  <View style={styles.global.wrap}>
                    <Text style={styles.global.heading}>CONTACTS</Text>
                    <Button containerStyle={styles.buttons.containerFilled} style={styles.buttons.base}
                    onPress={() => Actions.accountSearch() }>+</Button>
                    <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(rowData) => 
                    <View
                    style={styles.global.contactItem}>
                        <Text onPress={()=>Actions.contact({ data: rowData })} 
                        style={styles.global.contactItemText}>{rowData.ContactName}</Text>
                    </View>}
                    />
                  </View>
            </View>
            </Image>
        )
    }
});

module.exports = MainContactsView;
