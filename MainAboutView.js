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
import Drawer from 'react-native-drawer'

let styles = require('./styles');
let BankClient = require('./libs/BankClient');
let bc = new BankClient();
let db = require('./libs/RealmDB');  
let dismissKeyboard = require('dismissKeyboard');

var MainAboutView = React.createClass({
    render: function() {
        return(
            <Image source={require('./assets/bg-blur.png')} style={styles.main.backgroundImage}>
            <View style={styles.global.container}>
                <View style={styles.landingPage.smallLogoWrap}>
                    <Image source={require('./assets/logo-sm.png')} style={styles.landingPage.smallLogo} />
                </View>
                  <View style={styles.global.wrap}>
                    <Text style={styles.global.heading}>ABOUT</Text>
                    <Text style={styles.global.aboutText}>BVNK is a project to build core banking infrastructure using modern standards. To find out more, go to https://bvnk.co.</Text>
                    <Text style={styles.global.aboutText}>All code is available on Github at https://github.com/BVNK</Text>
                    <Text style={styles.global.aboutText}>Feel free to get in touch at hello@bvnk.co</Text>
                  </View>
            </View>
            </Image>
        )
    }
});

module.exports = MainAboutView;

