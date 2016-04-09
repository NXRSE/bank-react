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

// @TODO Local testing
const url = 'https://thebankoftoday.com:8443';
//const url = 'https://thebankoftoday.com/';

//var BankClient = React.createClass({
function BankClient() { 

    this._doCallNoAuth = function(route, method, data) {
		fetch(url+route, {
		  method: method,
		  headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		  },
		  body: JSON.stringify(data)
		})
		.then((response) => response.text())
		.then((responseText) => {
		  console.log(responseText);
		})
		.catch((error) => {
			console.log('test after failure');
		  console.warn(error);
		});
    },

    this._doCallAuth = function(route, method, data, token, callback) {
		return fetch(url+route, {
		  method: method,
		  headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'X-Auth-Token': token
		  },
		  body: JSON.stringify(data)
		})
		.then((response) => response.json())
		.then((responseText) => {
			callback(responseText);
		})
		.catch((error) => {
			console.log('test after failure');
		  console.warn(error);
		});
    },

    this.authLogin = function (data, cb) {
		this._doCallNoAuth('/auth/login', 'POST', data, cb);
    },

	this.authCreate = function(data, cb) {
		this._doCallNoAuth('/auth/account', 'POST', data, cb);
	},

	this.authExtend = function(data, cb) {
		this._doCallAuth('/auth', 'POST', data, token, cb);
	},

	this.accountCreate = function(data, cb) {
		this._doCallNoAuth('/account', 'POST', data, cb);
	},

	this.paymentCredit = function(data, cb) {
		this._doCallAuth('/payment/credit', 'POST', data, token, cb);
	},

	this.paymentDeposit = function(data, cb) {
		this._doCallAuth('/payment/deposit', 'POST', data, token, cb);
	},

	this.accountGet = function(data, cb) {
		this._doCallAuth('/account', 'GET', data, token, cb);
	},

	this.accountGetById = function(data, cb) {
		this._doCallAuth('/account/'+data.accountID, 'GET', {}, token, cb);
	},

	this.accountGetAll = function(data, cb) {
		this._doCallAuth('/account/all', 'GET', {}, token, cb);
	},

	this.authRemove = function(data, cb) {
		this._doCallAuth('/auth/account', 'DELETE', data, token, cb);
	}

}

module.exports = BankClient;
