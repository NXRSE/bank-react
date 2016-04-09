'use strict';

import React, { 
  AppRegistry,
  Component,
  Text,
  View,
  StatusBar,
  StyleSheet,
  NavigatorIOS
} from 'react-native';

var styles = require('./styles');

class LoginView extends Component{
    render() {
        return (
            <View style={styles.global.container}>
              <View style={styles.landingPage.base}>
                  <View style={styles.landingPage.buttonsLoginRegister}>
                    <Text style={styles.landingPage.buttonsLogin}>Register</Text>
                  </View>
              </View>
            </View>
        )
    }
};

module.exports = LoginView;
