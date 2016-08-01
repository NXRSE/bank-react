'use strict';

import React, { 
  AppRegistry,
  Component,
  Text,
  View,
  StatusBar,
  StyleSheet,
  TextInput,
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

var MainPaymentDepositView = React.createClass({
    getInitialState() {
        dismissKeyboard();
        return {
            depositAmount: '',
            depositDesc: '',
            initialPosition: 'unknown', 
            lastPosition: 'unknown',
            drawerOpen: false,
        }
    },

    componentDidMount: function() {
        navigator.geolocation.getCurrentPosition( 
            (position) => {    
                var initialPosition = JSON.stringify(position); 
                this.setState({initialPosition});
            }, 
            (error) => alert(error.message), 
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000} 
        ); 
        
        this.watchID = navigator.geolocation.watchPosition((position) => { 
            var lastPosition = JSON.stringify(position); this.setState({lastPosition}); 
        });
    },

    componentWillUnmount: function() { 
        navigator.geolocation.clearWatch(this.watchID); 
    },

    _doDeposit: function() {
        let user = db.objects('Account');
        if (user.length > 0) {
            var userAccount = user.slice(0,1);
            userAccount = userAccount[0];
            let lastPos = JSON.parse(this.state.lastPosition)
            let data = {
                AccountDetails: userAccount.AccountNumber+'@'+userAccount.BankNumber,
                Amount: this.state.depositAmount,
                Lat: lastPos.coords.latitude,
                Lon: lastPos.coords.longitude,
                Desc: this.state.depositDesc
            };

            let res = bc.paymentDeposit(data, function(res) {
                console.log(res);
                if (typeof res.error == 'undefined') {
                    console.log('Go to main...');
                    dismissKeyboard();
                    // Can't switch to main view as it is the same level but a separate view
                    alert("Deposit successful");
                } else {
                    // Show error
                    dismissKeyboard();
                    Alert.alert('Error', res.error);
                    return;
                }
            });
        }
    },

    closeDrawer() {
        this._drawer.close()
    },

    openDrawer() {
        this._drawer.open()
    },

    render: function() {
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
            <Image source={require('./assets/bg-blur.png')} style={styles.main.backgroundImage}>
            <View style={styles.global.container}>
                <View style={styles.landingPage.smallLogoWrap}>
                    <Image source={require('./assets/logo-sm.png')} style={styles.landingPage.smallLogo} />
                </View>
                  <View style={styles.global.wrap}>
                    <TouchableOpacity style={styles.button} onPress={this.openDrawer}>
                        <Text>Open Drawer</Text>
                    </TouchableOpacity>
                    <Text>MAIN PAYMENTS DEPOSIT</Text>
                    <TextInput
                        style={styles.forms.inputText}
                        onChangeText={(depositAmount) => this.setState({depositAmount})}
                        value={this.state.depositAmount}
                        autoCorrect={false}
                        autoCapitalize="none"
                        keyboardType='decimal-pad'
                        placeholder="Deposit Amount"
                    />
                    <TextInput
                        style={styles.forms.inputText}
                        onChangeText={(depositDesc) => this.setState({depositDesc})}
                        value={this.state.depositDesc}
                        autoCorrect={false}
                        autoCapitalize="none"
                        placeholder="Description"
                    />
                    <Button containerStyle={styles.buttons.containerFilled} style={styles.buttons.base}
                    onPress={ this._doDeposit }>DEPOSIT</Button>
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

module.exports = MainPaymentDepositView;
