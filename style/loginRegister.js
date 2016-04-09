'use strict';

import React, { StyleSheet } from 'react-native';

module.exports = StyleSheet.create({
    base: {
        flex: 1,
        backgroundColor: '#CCC'
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

