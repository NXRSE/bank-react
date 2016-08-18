'use strict';

import React, { Component } from 'react';
import { 
  AppRegistry,
  Text,
  View,
  StatusBar,
  StyleSheet,
  NavigatorIOS,
  TouchableOpacity,
  PushNotificationIOS,
  Image,
  PropTypes,
  AlertIOS
} from 'react-native';

import Button from 'react-native-button'
import {Scene, Router, TabBar, Modal, Schema, Actions, Reducer} from 'react-native-router-flux'
import Drawer from 'react-native-drawer'

import ControlPanel from './ControlPanel'
import DrawerView from './DrawerView'

var styles = require('./styles');

let dismissKeyboard = require('dismissKeyboard');
let db = require('./libs/RealmDB');

//class LoginRegisterView extends Component{
var LoginRegisterView = React.createClass({
    getInitialState() {
        return {
            drawerDisabled: true
        }
    },

	componentWillMount() {
		PushNotificationIOS.addEventListener('notification', this._onNotification);
	},

	componentWillUnmount() {
		PushNotificationIOS.removeEventListener('notification', this._onNotification);
	},

    _sendNotification() {
      require('RCTDeviceEventEmitter').emit('remoteNotificationReceived', {
        aps: {
          alert: 'Sample notification',
          badge: '+1',
          sound: 'default',
          category: 'REACT_NATIVE'
        },
      });
    },

    _onNotification(notification) {
      AlertIOS.alert(
        'Notification Received',
        'Alert message: ' + notification.getMessage(),
        [{
          text: 'Dismiss',
          onPress: null,
        }]
      );
    },

    loginOrRetrieve: function() {
        let userAccount = db.objects('Account');
        if (userAccount.length == 0) {
            // There is no account set up yet
            // Show fetch account screen
            Actions.accountFetch();
            return;
        }
        Actions.login();
    },

    render() {
        return (
            <View style={styles.global.container}>
                <Image source={require('./assets/bg.png')} style={styles.landingPage.backgroundImage}>
                    <View style={styles.landingPage.bigLogoWrap}>
                        <Image source={require('./assets/logo-bg.png')} style={styles.landingPage.bigLogo} />
                    </View>
                    <View style={styles.global.wrap}>
                        <Button onPress={this.loginOrRetrieve}
                        containerStyle={styles.buttons.containerFilled} style={styles.buttons.base}>SIGN IN</Button>
                        <Button onPress={()=>Actions.register()}
                        containerStyle={styles.buttons.containerBase} style={styles.buttons.base}>REGISTER</Button>
                    </View>
                </Image>
            </View>
        )
    }
});

module.exports = LoginRegisterView;
