'use strict';

import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';

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
});

