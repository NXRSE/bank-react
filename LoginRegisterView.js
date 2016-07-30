'use strict';

import React, { 
  AppRegistry,
  Component,
  Text,
  View,
  StatusBar,
  StyleSheet,
  NavigatorIOS,
  TouchableOpacity,
  PushNotificationIOS,
  Image,
  AlertIOS
} from 'react-native';

import Button from 'react-native-button'
import {Scene, Router, TabBar, Modal, Schema, Actions, Reducer} from 'react-native-router-flux'

var styles = require('./styles');
let dismissKeyboard = require('dismissKeyboard');

class LoginRegisterView extends Component{
	componentWillMount() {
		PushNotificationIOS.addEventListener('notification', this._onNotification);
	}

	componentWillUnmount() {
		PushNotificationIOS.removeEventListener('notification', this._onNotification);
	}

    _sendNotification() {
      require('RCTDeviceEventEmitter').emit('remoteNotificationReceived', {
        aps: {
          alert: 'Sample notification',
          badge: '+1',
          sound: 'default',
          category: 'REACT_NATIVE'
        },
      });
    }

    _onNotification(notification) {
      AlertIOS.alert(
        'Notification Received',
        'Alert message: ' + notification.getMessage(),
        [{
          text: 'Dismiss',
          onPress: null,
        }]
      );
    }

    render() {
        return (
            <View style={styles.global.container}>
                <Image source={require('./assets/bg.png')} style={styles.landingPage.backgroundImage}>
                    <View style={styles.landingPage.bigLogoWrap}>
                        <Image source={require('./assets/logo-bg.png')} style={styles.landingPage.bigLogo} />
                    </View>
                    <View style={styles.global.wrap}>
                        <Button onPress={()=>Actions.login()}
                        containerStyle={styles.buttons.containerFilled} style={styles.buttons.base}>SIGN IN</Button>
                        <Button onPress={()=>Actions.register()}
                        containerStyle={styles.buttons.containerBase} style={styles.buttons.base}>REGISTER</Button>
                        <Button
                        containerStyle={styles.buttons.containerNotification} style={styles.buttons.base}	
                            onPress={this._sendNotification}
                            label="Send fake notification"
                        >Notification</Button>
                    </View>
                </Image>
            </View>
        )
    }
};

module.exports = LoginRegisterView;
