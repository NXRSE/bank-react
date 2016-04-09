'use strict';

import React, { 
  AppRegistry,
  Component,
  Text,
  View,
  StatusBar,
  StyleSheet,
  TextInput,
  Alert
} from 'react-native';

import Button from 'react-native-button'

let styles = require('./styles');
let BankClient = require('./libs/BankClient');
let bc = new BankClient();

var LoginView = React.createClass({
    getInitialState() {
        return {
            password: ''
        }
    },

    _doLogin: function() {
        //Alert.alert('Password', this.state.password);
        let data = {User: 'userid', Password: this.state.password};
        let res = bc.login(data, function(res) {
            console.log("At the login");
            console.log(res);
        });
    },

    render: function() {
        return (
            <View style={styles.global.container}>
              <View style={styles.global.wrap}>
                <TextInput
                    style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                    onChangeText={(password) => this.setState({password})}
                    value={this.state.password}
                    placeholder="Password"
                />
                <Button onPress={ this._doLogin }>Click me</Button>
              </View>
            </View>
        )
    }
});

module.exports = LoginView;
