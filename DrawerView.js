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
import {Scene, Router, TabBar, Modal, Schema, Actions, Reducer, DefaultRenderer} from 'react-native-router-flux'
import Drawer from 'react-native-drawer'

import ControlPanel from './ControlPanel'

var styles = require('./styles');
let dismissKeyboard = require('dismissKeyboard');

class DrawerView extends Component {
	state = {
		drawerOpen: false,
		drawerDisabled: false,
	};

	closeDrawer = () => {
		this._drawer.close()
	};

	openDrawer = () => {
		this._drawer.open()
	};	

    render() {
        const state = this.props.navigationState;
        const children = state.children;

        return (
		  <Drawer
			ref={(ref) => this._drawer = ref}
			type="static"
			open={state.open}
			content={
			  <ControlPanel closeDrawer={this.closeDrawer} />
			}
			acceptDoubleTap
			styles={drawerStyles}
			onOpen={() => {
			  console.log('onopen')
			  //this.setState({drawerOpen: true})
			}}
			onClose={() => {
			  console.log('onclose')
			  //this.setState({drawerOpen: false})
			}}
			captureGestures={false}
			tweenDuration={100}
			panThreshold={0.08}
			disabled={true}
			openDrawerOffset={(viewport) => {
			  return 0
			}}
			closedDrawerOffset={() => 0}
			panOpenMask={0.2}
            tweenHandler={(ratio) => ({
                mainOverlay: { opacity:(2-ratio)/2 }
            })}
			negotiatePan
			>
				<DefaultRenderer navigationState={children[0]} onNavigate={this.props.onNavigate} />
			</Drawer>
        )
    }
};

/*
class DrawerView extends Component {

	closeDrawer = () => {
		this._drawer.close()
	};

	openDrawer = () => {
		this._drawer.open()
	};	

	render(){
        const state = this.props.navigationState;
        const children = state.children;
        return (
            <Drawer
                ref="navigation"
                open={state.open}
                onOpen={()=>Actions.refresh({key:state.key, open: true})}
                onClose={()=>Actions.refresh({key:state.key, open: false})}
                type="displace"
                content={<ControlPanel />}
                tapToClose={true}
                openDrawerOffset={0.2}
                panCloseMask={0.2}
                negotiatePan={true}
                tweenHandler={(ratio) => ({
                 main: { opacity:Math.max(0.54,1-ratio) }
            })}>
                <DefaultRenderer navigationState={children[0]} onNavigate={this.props.onNavigate} />
            </Drawer>
        );
    }
}
*/

var drawerStyles = {
    drawer: {
        shadowColor: "#000000",
        shadowOpacity: 0.2,
        shadowRadius: 0,
    },
    
    main: {
        shadowColor: "#000000",
        shadowOpacity: 0.2,
        shadowRadius: 0,
    },

    mainOverlay: {
    }
}

module.exports = DrawerView;
