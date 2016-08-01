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

var styles = require('./styles');
let dismissKeyboard = require('dismissKeyboard');

var DrawerView = React.createClass({

	getDefaultProps() {
		return {
			view: <View />,
		};
	},

	getInitialState() {
		return {
			view: this.props.view,
		}
	},

    closeDrawer() {
        this._drawer.close()
    },

    openDrawer() {
        this._drawer.open()
    },

    render() {
        return (
      <Drawer
        ref={(ref) => this._drawer = ref}
        type="static"
        content={
          <ControlPanel closeDrawer={this.closeDrawer} />
        }
        acceptDoubleTap
        styles={{main: {shadowColor: '#000000', shadowOpacity: 0.3, shadowRadius: 15}}}
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
            {this.props.view}
		</Drawer>
        )
    }
});

module.exports = DrawerView;

