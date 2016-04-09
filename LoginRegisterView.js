'use strict';

import React, { 
  AppRegistry,
  Component,
  Text,
  View,
  StatusBar,
  StyleSheet,
  NavigatorIOS,
  TouchableOpacity
} from 'react-native';

import Button from 'react-native-button'
import {Scene, Router, TabBar, Modal, Schema, Actions, Reducer} from 'react-native-router-flux'

var styles = require('./styles');

class LoginRegisterView extends Component{
    render() {
        return (
            <View style={styles.global.container}>
                <View style={styles.global.wrap}>
                    <Button onPress={()=>Actions.login({data:"Custom data", title:'Custom title' })}
                    containerStyle={{padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: 'white'}}
                                       style={{fontSize: 20, color: 'green'}}>Go to Login page</Button>
                    <Button onPress={Actions.register}
                    containerStyle={{padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: 'white'}}
                                       style={{fontSize: 20, color: 'green'}}>Go to Register page</Button>
                </View>
            </View>
        )
    }
};

module.exports = LoginRegisterView;
