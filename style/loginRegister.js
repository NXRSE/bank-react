'use strict';

import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
//let deviceLib = require('./../libs/device');

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height
// Get device
//let deviceC = new deviceLib();
//let device = deviceC.get();

var buttonMarginOffset = (height < 1000) ? -150 : 0;
var logoMarginOffset = (height < 1000) ? -40 : 0;

module.exports = StyleSheet.create({
    base: {
        flex: 1,
        backgroundColor: '#CCC',
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        width: width,
        height: height,
    },
    bigLogoWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: buttonMarginOffset,
    },
    bigLogo: {
        resizeMode: 'contain',
        width: 150,
        marginTop: logoMarginOffset,
    },
    smallLogoWrap: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    smallLogo: {
        resizeMode: 'contain',
        marginTop: 5,
        width: 80,
    },
    buttonsLoginRegister: {
        paddingTop: 40,
        paddingBottom: 40,
        paddingLeft: 50,
        paddingRight: 50,
        flexDirection: 'column'
    },
    buttonsLogin: {
        flex: 1,
        borderColor: 'black',
        borderStyle: 'solid',
        borderWidth: 1,
        paddingTop: 10,
        paddingBottom: 10
    },
    buttonsRegister: {
        flex: 1,
        borderColor: 'black',
        borderStyle: 'solid',
        borderWidth: 1,
        paddingTop: 10,
        paddingBottom: 10
    },
    buttonText: {
        textAlign: 'center',
    }
});

