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

class LoginRegisterView extends Component{
    state={
        drawerOpen: false,
        drawerDisabled: false,
    };

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

    closeDrawer = () => {
        this._drawer.close()
    };

    openDrawer = () => {
        this._drawer.open()
    };

    render() {
        return (
      <Drawer
        ref={(ref) => this._drawer = ref}
        type="static"
        content={
          <ControlPanel closeDrawer={this.closeDrawer} />
        }
        acceptDoubleTap
        styles={drawerStyles}
        onOpen={() => {
          console.log('onopen')
          this.setState({drawerOpen: true})
        }}
        onClose={() => {
          console.log('onclose')
          this.setState({drawerOpen: false})
        }}
        captureGestures={false}
        tweenDuration={100}
        panThreshold={0.08}
        disabled={this.state.drawerDisabled}
        openDrawerOffset={(viewport) => {
          return 100
        }}
        closedDrawerOffset={() => 0}
        panOpenMask={0.2}
        negotiatePan
		>
            <View style={styles.global.container}>
                <Image source={require('./assets/bg.png')} style={styles.landingPage.backgroundImage}>
                    <View style={styles.landingPage.bigLogoWrap}>
                        <Image source={require('./assets/logo-bg.png')} style={styles.landingPage.bigLogo} />
                    </View>
                    <TouchableOpacity style={styles.button} onPress={this.openDrawer}>
                        <Text>Open Drawer</Text>
                    </TouchableOpacity>
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
		</Drawer>
        )
    }
};

var drawerStyles = {
    drawer: {
        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 0,
    }
}

module.exports = LoginRegisterView;
