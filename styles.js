'use strict';

import React, { StyleSheet } from 'react-native';

module.exports = {
    global: require('./style/global'),
    navbar: require('./style/navbar'),
    landingPage: require('./style/loginRegister'),
    buttons: require('./style/buttons'),
    forms: require('./style/forms'),
    main: require('./style/main'),
    tabs: require('./style/tabs'),
    controlPanel: require('./style/controlPanel'),
    transaction: require('./style/transaction'),
    notification: require('./style/notification'),
};

/*
let deviceLib = require('./libs/device');
// Get device
let deviceC = new deviceLib();
let device = deviceC.get();

if (device == "4s") {
    module.exports = {
        global: require('./style/global'),
        navbar: require('./style/navbar'),
        landingPage: require('./style/4s/loginRegister'),
        buttons: require('./style/buttons'),
        forms: require('./style/forms'),
        main: require('./style/main'),
        tabs: require('./style/tabs'),
        controlPanel: require('./style/controlPanel'),
        transaction: require('./style/transaction'),
    };
} else {
    module.exports = {
        global: require('./style/global'),
        navbar: require('./style/navbar'),
        landingPage: require('./style/loginRegister'),
        buttons: require('./style/buttons'),
        forms: require('./style/forms'),
        main: require('./style/main'),
        tabs: require('./style/tabs'),
        controlPanel: require('./style/controlPanel'),
        transaction: require('./style/transaction'),
    };
}
*/
