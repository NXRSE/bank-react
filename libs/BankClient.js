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
import {Scene, Router, Modal, Schema, Actions, Reducer} from 'react-native-router-flux'

// @TODO Local testing
//const url = 'https://bvnk.co:8443';
const url = 'https://thebankoftoday.com/';

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

    this._doCallFetchAccount = function(route, method, data, callback) {
		return fetch(url+route, {
		  method: method,
		  headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'X-IDNumber': data.AccountHolderIdentificationNumber,
			'X-GivenName': data.AccountHolderGivenName,
			'X-FamilyName': data.AccountHolderFamilyName,
			'X-EmailAddress': data.AccountHolderEmailAddress,
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

    this.authLogin = function (data, cb) {
		this._doCallNoAuth('/auth/login', 'POST', data, cb);
    },

	this.authCreate = function(data, cb) {
		this._doCallNoAuth('/auth/account', 'POST', data, cb);
	},

	this.fetchAccount = function(data, cb) {
		this._doCallFetchAccount('/accountRetrieve', 'GET', data, cb);
	},

	this.authExtend = function(token, cb) {
		this._doCallAuth('/auth', 'POST', {}, token, cb);
	},

	this.accountCreate = function(data, cb) {
        console.log(JSON.stringify(data));
		this._doCallNoAuth('/account', 'POST', data, cb);
	},

	this.paymentCredit = function(data, cb) {
        let token = this.getToken();
		this._doCallAuth('/transaction/credit', 'POST', data, token, cb);
	},

	this.paymentDeposit = function(data, cb) {
        let token = this.getToken();
		this._doCallAuth('/transaction/deposit', 'POST', data, token, cb);
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

	this.transactionsList = function(data, cb) {
        let token = this.getToken();
		this._doCallAuthGet('/transaction/list/'+data.perPage+'/'+data.page, 'GET', token, cb);
	},

	this.transactionsListAfterTimestamp = function(data, cb) {
        let token = this.getToken();
		this._doCallAuthGet('/transaction/list/'+data.perPage+'/'+data.page+'/'+data.timestamp, 'GET', token, cb);
	},

	this.accountSearch = function(data, cb) {
        let token = this.getToken();
		this._doCallAuth('/account/search', 'POST', data, token, cb);
	},

    // Token
    this.getToken = function() {
        let tokenResult = db.objects('AccountToken');
        if (tokenResult.length > 0) {
            let tokenDB = tokenResult.slice(0,1);
            let tokenObj = tokenDB[0];
            var token = tokenObj.Token;
            console.log("Get token");
            console.log(token);

            // Check token
            this.authExtend(token, this.extendTokenInBackground);
            // Return
            console.log("After extend: "+token);
            return token;
        }
    },

    this.extendTokenInBackground = function(res) {

        if (typeof res.error != 'undefined') {
            if (res.error == 'httpApiHandlers: Token invalid') {
                Actions.login({ type : "reset" });
                console.log("Token invalid, go to login");
                return;
                /*
                console.log("token invalid");
                let userAuth = db.objects('AccountAuth');
                if (userAuth.length > 0) {
                    var userAccount = userAuth.slice(0,1);
                    userAccount = userAccount[0];

                    console.log("User account in extend");
                    let data = { User: userAccount.AccountNumber, Password: userAccount.Password };
                    //@FIXME Missing context, cannot see "this" probably due to being passed as a callback
                    let res = this.authLogin(data, function(res) {
                        console.log("At second login: ");
                        console.log(res);
                        if (typeof res.error == 'undefined') {
                            // Get token
                            tokenRes = res.response;
                            console.log("New token: "+tokenRes);
                            db.write(() => {
                            // Delete tokens
                                let allTokens = db.objects('AccountToken');
                                db.delete(allTokens);

                                db.create('AccountToken', { 
                                   Token: tokenRes,
                                   //Timestamp: Math.floor(Date.now())
                                   Timestamp: 1
                                });
                            });
                            return tokenRes;
                        } else {
                            // Show error
                            Alert.alert('Error', res.error);
                            dismissKeyboard();
                            return;
                        }
                    });
                }
                */
            }
        }
    }
}

module.exports = BankClient;
