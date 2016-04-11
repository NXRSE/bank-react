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
  Alert
} from 'react-native';

import Button from 'react-native-button'
import {Scene, Router, TabBar, Modal, Schema, Actions, Reducer} from 'react-native-router-flux'

let styles = require('./styles');
let BankClient = require('./libs/BankClient');
let bc = new BankClient();
let db = require('./libs/RealmDB');  
let dismissKeyboard = require('dismissKeyboard');

var MainSettingsView = React.createClass({

    render: function() {
        return (
            <View style={styles.global.container}>
              <View style={styles.global.wrap}>
                <Text>MAIN SETTINGS</Text>
              </View>
            </View>
        )
    }
});

module.exports = MainSettingsView;

