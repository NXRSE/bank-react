'use strict';

import React, { Component } from 'react';
import { 
  AppRegistry,
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
import Drawer from 'react-native-drawer'

let styles = require('./styles');
let BankClient = require('./libs/BankClient');
let bc = new BankClient();
let db = require('./libs/RealmDB');  
let dismissKeyboard = require('dismissKeyboard');

var MainSettingsView = React.createClass({
    render: function() {
        return(
            <Image source={require('./assets/bg-blur.png')} style={styles.main.backgroundImage}>
            <View style={styles.global.container}>
                <View style={styles.landingPage.smallLogoWrap}>
                    <Image source={require('./assets/logo-sm.png')} style={styles.landingPage.smallLogo} />
                </View>
                  <View style={styles.global.wrap}>
                    <Text style={styles.global.heading}>SETTINGS</Text>
                  </View>
            </View>
            </Image>
        )
    }
});

module.exports = MainSettingsView;

