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

var MainPaymentCreditView = React.createClass({
    getInitialState() {
        dismissKeyboard();
        return {
            paymentAmount: '',
            paymentDesc: '',
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

    _doPayment: function() {
        let user = db.objects('Account');
        if (user.length > 0) {
            var userAccount = user.slice(0,1);
            userAccount = userAccount[0];
            let lastPos = JSON.parse(this.state.lastPosition)
            let data = {
                SenderDetails: userAccount.AccountNumber+'@'+userAccount.BankNumber,
                RecipientDetails: this.props.data.ContactAccountNumber+'@'+this.props.data.ContactBankNumber,
                Amount: this.state.paymentAmount,
                Lat: lastPos.coords.latitude,
                Lon: lastPos.coords.longitude,
                Desc: this.state.paymentDesc
            };

            let res = bc.paymentCredit(data, function(res) {
                console.log(res);
                if (typeof res.error == 'undefined') {
                    dismissKeyboard();
                    Actions.main({ type : "reset" });
                } else {
                    // Show error
                    Alert.alert('Error', res.error);
                    dismissKeyboard();
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
                    <Text>MAIN PAYMENTS CREDIT</Text>
                    <Text>Make payment to: {this.props.data.ContactName}</Text>
                    <TextInput
                        style={styles.forms.inputText}
                        onChangeText={(paymentAmount) => this.setState({paymentAmount})}
                        value={this.state.paymentAmount}
                        autoCorrect={false}
                        keyboardType='decimal-pad'
                        autoCapitalize="none"
                        placeholder="Payment Amount"
                    />
                    <TextInput
                        style={styles.forms.inputText}
                        onChangeText={(paymentDesc) => this.setState({paymentDesc})}
                        value={this.state.paymentDesc}
                        autoCorrect={false}
                        autoCapitalize="none"
                        placeholder="Description"
                    />
                    <Button containerStyle={styles.buttons.containerFilled} style={styles.buttons.base}
                    onPress={ this._doPayment }>Make Payment</Button>
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

module.exports = MainPaymentCreditView;
