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
import ControlPanel from './ControlPanel'

let styles = require('./styles');
let BankClient = require('./libs/BankClient');
let bc = new BankClient();
let db = require('./libs/RealmDB');  
let dismissKeyboard = require('dismissKeyboard');

var MainSettingsView = React.createClass({
    getInitialState() {
        return {
            drawerOpen: false,
        }
    },

    closeDrawer() {
        this._drawer.close()
    },

    openDrawer() {
        this._drawer.open()
    },

    render: function() {
        return(
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
            <Image source={require('./assets/bg-blur.png')} style={styles.main.backgroundImage}>
            <View style={styles.global.container}>
                <View style={styles.landingPage.smallLogoWrap}>
                    <Image source={require('./assets/logo-sm.png')} style={styles.landingPage.smallLogo} />
                </View>
                    <TouchableOpacity style={styles.button} onPress={this.openDrawer}>
                        <Text>Open Drawer</Text>
                    </TouchableOpacity>
                  <View style={styles.global.wrap}>
                    <Text>MAIN SETTINGS</Text>
                  </View>
            </View>
            </Image>
        </Drawer>
        )
    }
});

var drawerStyles = {
    drawer: {
        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 0,
    }
}

module.exports = MainSettingsView;

