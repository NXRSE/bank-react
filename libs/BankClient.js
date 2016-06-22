'use strict';

import React, { 
  AppRegistry,
  Component,
  Text,
  View,
  StatusBar,
  StyleSheet,
  TextInput,
  Alert
} from 'react-native';

let db = require('./RealmDB');  

// @TODO Local testing
const url = 'https://thebankoftoday.com:8443';
//const url = 'https://thebankoftoday.com/';

//var BankClient = React.createClass({
function BankClient() { 

    this._doCallNoAuthGet = function(route, method, callback) {
		fetch(url+route, {
		  method: method,
		  headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		  },
		})
		.then((response) => response.json())
		.then((responseText) => {
			console.log('Called: '+route);
			callback(responseText);
		})
		.catch((error) => {
			callback(error);
		});
    },

    this._doCallNoAuth = function(route, method, data, callback) {
		var formData = new FormData();
		for ( var key in data ) {
			formData.append(key, data[key]);
		}

		fetch(url+route, {
		  method: method,
		  headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		  },
		  //body: JSON.stringify(data)
		  body: formData
		})
		.then((response) => response.json())
		.then((responseText) => {
			console.log('Called: '+route);
			callback(responseText);
		})
		.catch((error) => {
			callback(error);
		});
    },

    this._doCallAuthGet = function(route, method, token, callback) {
		return fetch(url+route, {
		  method: method,
		  headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'X-Auth-Token': token
		  },
		})
		.then((response) => response.json())
		.then((responseText) => {
			callback(responseText);
		})
		.catch((error) => {
			callback(error);
		});
    },

    this._doCallAuth = function(route, method, data, token, callback) {
		var formData = new FormData();
		for ( var key in data ) {
			formData.append(key, data[key]);
		}

		return fetch(url+route, {
		  method: method,
		  headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'X-Auth-Token': token
		  },
		  body: formData
		})
		.then((response) => response.json())
		.then((responseText) => {
			callback(responseText);
		})
		.catch((error) => {
			callback(error);
		});
    },

    this.authLogin = function (data, cb) {
		this._doCallNoAuth('/auth/login', 'POST', data, cb);
    },

	this.authCreate = function(data, cb) {
		this._doCallNoAuth('/auth/account', 'POST', data, cb);
	},

	this.authExtend = function(data, cb) {
        let token = this.getToken();
		this._doCallAuth('/auth', 'POST', data, token, cb);
	},

	this.accountCreate = function(data, cb) {
        console.log(JSON.stringify(data));
		this._doCallNoAuth('/account', 'POST', data, cb);
	},

	this.paymentCredit = function(data, cb) {
        let token = this.getToken();
		this._doCallAuth('/payment/credit', 'POST', data, token, cb);
	},

	this.paymentDeposit = function(data, cb) {
        let token = this.getToken();
		this._doCallAuth('/payment/deposit', 'POST', data, token, cb);
	},

	this.accountGet = function(data, cb) {
        let token = this.getToken();
		this._doCallAuthGet('/account', 'GET', token, cb);
	},

	this.accountGetById = function(data, cb) {
        let token = this.getToken();
		this._doCallAuthGet('/account/'+data.accountID, 'GET', token, cb);
	},

	this.accountGetAll = function(data, cb) {
        let token = this.getToken();
		this._doCallAuthGet('/account/all', 'GET', token, cb);
	},

	this.authRemove = function(data, cb) {
        let token = this.getToken();
		this._doCallAuth('/auth/account', 'DELETE', data, token, cb);
	}

	this.addPushToken = function(data, cb) {
        let token = this.getToken();
		this._doCallAuth('/accountPushToken', 'POST', data, token, cb);
	}

	this.removePushToken = function(data, cb) {
        let token = this.getToken();
		this._doCallAuth('/accountPushToken', 'DELETE', data, token, cb);
	}

    // Token
    this.getToken = function() {
        let tokenResult = db.objects('AccountToken');
        if (tokenResult.length > 0) {
            var token = tokenResult.slice(0,1);
            token = token[0];

            // Check token
            // Update if necessary
            // Return
            return token.Token;
        }
    }

}

module.exports = BankClient;
