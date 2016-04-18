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
                <View style={styles.global.wrap}>
                    <Button onPress={()=>Actions.login({title:'Login' })}
                    containerStyle={{padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: 'white'}}
                                       style={{fontSize: 20, color: 'green'}}>Login</Button>
                    <Button onPress={Actions.register({title: 'Register'})}
                    containerStyle={{padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: 'white'}}
                                       style={{fontSize: 20, color: 'green'}}>Register</Button>
					<Button
					containerStyle={{padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: 'white'}}
                                       style={{fontSize: 20, color: 'green'}}	
						onPress={this._sendNotification}
						label="Send fake notification"
					>Notification</Button>
                </View>
            </View>
        )
    }
};

module.exports = LoginRegisterView;
