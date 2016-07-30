'use strict';

import React, { StyleSheet } from 'react-native';

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
        borderColor: 'white',
        borderWidth: 1,
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
