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
        backgroundColor: 'transparent',
        paddingTop: 17,
        paddingBottom: 20,
        marginTop: 15,
        marginBottom: 15,
        marginLeft: 50,
        marginRight: 50,
    },
    exitContainer: {
        padding:10, 
        height:60, 
        overflow:'hidden', 
        borderRadius: 20, 
        borderWidth: 0,
        backgroundColor: 'transparent',
        paddingTop: 17,
        paddingBottom: 20,
        marginTop: 40,
        marginBottom: 20,
        marginLeft: 50,
        marginRight: 50,
    },
    exit: {
        fontSize: 20,
        color: '#494949',
    },
    containerNotification: {
        backgroundColor: 'transparent',
    },
    base: {
        fontSize: 12, 
        color: 'white'
    },
});
