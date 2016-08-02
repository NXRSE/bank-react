'use strict';

import React, { StyleSheet, Dimensions } from 'react-native';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

module.exports = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
        backgroundColor: 'transparent',
        borderRadius: 15,
        borderWidth: 0,
        borderBottomColor: 'white',
        borderBottomWidth: 1,
        borderColor: 'transparent',
        paddingTop: 5,
        paddingBottom: 5,
        marginLeft: 40,
        marginRight: 40,
        marginTop: 10,
        marginBottom: 10,
    },
    desc: {
        textAlign: 'left',
        fontFamily: 'ArticulatCF-Light',
        fontSize: 20,
        color: 'white',
        marginLeft: 10,
        backgroundColor: 'transparent',
    },
    time: {
        textAlign: 'right',
        fontFamily: 'ArticulatCF-Light',
        fontSize: 10,
        color: 'white',
        backgroundColor: 'transparent',
        marginLeft: 0,
        paddingTop: 5,
        paddingBottom: 5,
    },
    map: {
        alignItems: 'center',
        height: 200,
        width: width,
        flex: 1,
    },
});
