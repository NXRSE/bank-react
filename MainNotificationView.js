'use strict';

import React, { Component } from 'react';
import { 
  AppRegistry,
  ScrollView,
  Text,
  View,
  StatusBar,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ListView,
  Alert
} from 'react-native';

import Button from 'react-native-button'
import {Scene, Router, TabBar, Modal, Schema, Actions, Reducer} from 'react-native-router-flux'

let styles = require('./styles');
let BankClient = require('./libs/BankClient');
let bc = new BankClient();
let db = require('./libs/RealmDB');  
let dismissKeyboard = require('dismissKeyboard');

let PushNotification = require('react-native-push-notification');

var MainNotificationView = React.createClass({
    getInitialState() {
        dismissKeyboard();
        let notifications = db.objects('Notifications').sorted('Timestamp', 'reverse').slice(0, 20);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            dataSource: ds.cloneWithRows(notifications),
        }
    },

    updateNotificationListener: function() {
        // Fetch notifications 
        let notifications = db.objects('Notifications').sorted('Timestamp', 'reverse').slice(0, 20);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({ dataSource: ds.cloneWithRows(notifications) });
    },

	componentWillMount: function() {
        // Clear notification count
        PushNotification.setApplicationIconBadgeNumber(0);
    },

	componentDidMount: function() {
		// Observe Realm Change Events
		db.addListener('change', this.updateNotificationListener);
	},

    componentWillUnmount: function() {
        // Change all unread to read
        db.write(() => {
            // Update Main Account
            let notificationUpdate = db.objects('Notifications');
            var notifications = notificationUpdate.filtered('Status == 'unread'');
            //var userAccountUpdate = userUpdate.slice(0,1).first;

            notifications.forEach(function(n) {
                n.Status = 'read';
            });
        });
        // Remove the listener
		db.removeListener('change', this.updateNotificationListener);
    },

    numberWithCommas: function(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
        return (
            <Image source={require('./assets/bg-blur.png')} style={styles.main.backgroundImage}>
                <View style={styles.global.container}>
                    <View style={styles.landingPage.smallLogoWrap}>
                        <Image source={require('./assets/logo-sm.png')} style={styles.landingPage.smallLogo} />
                    </View>
                  <View style={styles.global.wrap}>
                    <Text style={styles.global.heading}>NOTIFICATIONS</Text>
                    <ScrollView>
                        <ListView
                        dataSource={this.state.dataSource}
                        style={styles.notification.list}
                        enableEmptySections={true}
                        renderRow={(rowData) => 
                        <View
                        style={styles.notification.container}>
                            <Text style={styles.notification.desc}>{rowData.Status}: {rowData.Message}</Text> 
                            <Text style={styles.notification.time}>{this.timeConverter(rowData.Timestamp)}</Text>
                        </View>}
                        />
                        </ScrollView>
                    </View>
                </View>
            </Image>
        )
    }
});

module.exports = MainNotificationView;
