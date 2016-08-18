'use strict';

import React from 'react';
import { StyleSheet } from 'react-native';

module.exports = StyleSheet.create({
    containerFilled: {
        padding:10, 
        height:45, 
        borderRadius: 20, 
        overflow:'hidden', 
        backgroundColor: '#031d2c',
        paddingTop: 17,
        paddingBottom: 20,
        marginTop: 15,
        marginBottom: 15,
        marginLeft: 50,
        marginRight: 50,
    },
    containerBase: {
        padding:10, 
        height:45, 
        overflow:'hidden', 
        borderRadius: 20, 
        borderColor: '#515152',
        borderWidth: 1,
        backgroundColor: 'transparent',
        paddingTop: 13,
        paddingBottom: 20,
        marginTop: 15,
        marginBottom: 15,
        marginLeft: 50,
        marginRight: 50,
    },
    containerBaseNoBorder: {
        padding:10, 
        height:45, 
        overflow:'hidden', 
        borderRadius: 20, 
        borderWidth: 0,
        backgroundColor: 'transparent',
        paddingTop: 17,
        paddingBottom: 20,
        marginTop: 15,
        marginBottom: 15,
        marginLeft: 50,
        marginRight: 50,
    },
    containerNotification: {
        backgroundColor: 'transparent',
    },
    base: {
        fontSize: 12, 
        color: 'white'
    },
});
