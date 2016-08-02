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
  Alert
} from 'react-native';

import Button from 'react-native-button'
import {Scene, Router, TabBar, Modal, Schema, Actions, Reducer} from 'react-native-router-flux'
import MapView from 'react-native-maps';

let styles = require('./styles');
let BankClient = require('./libs/BankClient');
let bc = new BankClient();
let db = require('./libs/RealmDB');  
let dismissKeyboard = require('dismissKeyboard');

var TransactionView = React.createClass({
    getInitialState() {
        dismissKeyboard();
        return {
            data: { },
        }
    },

	timeConverter: function(UNIX_timestamp) {
	  var a = new Date(UNIX_timestamp * 1000);
	  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	  var year = a.getFullYear();
	  var month = months[a.getMonth()];
	  var date = a.getDate();
	  var hour = a.getHours();
	  var min = a.getMinutes();
	  var sec = a.getSeconds();
	  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
	  return time;
	},

    render: function() {

        let marker = { latitude: this.props.data.Lat, longitude: this.props.data.Lon };
        console.log(marker);

        return (
            <View style={styles.global.container}>
                <Image source={require('./assets/bg-blur.png')} style={styles.main.backgroundImage}>
                    <View style={styles.landingPage.smallLogoWrap}>
                        <Image source={require('./assets/logo-sm.png')} style={styles.landingPage.smallLogo} />
                    </View>
                      <View style={styles.global.wrap}>
                        <MapView
                        style={styles.transaction.map}
                        initialRegion={{
                            latitude: this.props.data.Lat,
                            longitude: this.props.data.Lon,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                        >
                            <MapView.Marker
                                coordinate={marker}
                                title={this.props.data.TransactionAmount.toString()}
                                description=""
                            />
                        </MapView>
                        <Text style={styles.transaction.desc}>{this.props.data.SenderAccountNumber}</Text>
                        <Text style={styles.transaction.desc}>{this.props.data.SenderBankNumber}</Text>
                        <Text style={styles.transaction.desc}>{this.props.data.ReceiverAccountNumber}</Text>
                        <Text style={styles.transaction.desc}>{this.props.data.ReceiverBankNumber}</Text>
                        <Text style={styles.transaction.desc}>{this.props.data.TransactionAmount}</Text>
                        <Text style={styles.transaction.desc}>{this.props.data.FeeAmount}</Text>
                        <Text style={styles.transaction.desc}>{this.props.data.Desc}</Text>
                        <Text style={styles.transaction.desc}>{this.props.data.Status}</Text>
                        <Text style={styles.transaction.desc}>{this.timeConverter(this.props.data.Timestamp)}</Text>

                        <Button 
                        onPress={ ()=>Actions.main({ type: "reset" })}
                        containerStyle={styles.buttons.containerFilled} style={styles.buttons.base}>DONE</Button>
                      </View>
                </Image>
            </View>
        )
    }
});

module.exports = TransactionView;
