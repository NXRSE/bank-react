'use strict';

import React, { StyleSheet, Dimensions } from 'react-native';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

module.exports = StyleSheet.create({
    base: {
        flex: 1,
        backgroundColor: '#CCC',
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        width: width
    },
    bigLogoWrap: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    bigLogo: {
        resizeMode: 'contain',
        width: 150,
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

