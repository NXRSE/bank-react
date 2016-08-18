'use strict';

// Realm for a database - realm.io
// Encrypt database
var key = new Int8Array(64);
const Realm = require('realm');
//Realm.defaultPath = "/Users/ksred/Documents/Projects/Bank/ReactNative/BankReact/realm/default.realm";

// @TODO Move schemas into separate file
// Set up schemas
const AccountSchema = {
  name: 'Account',
  properties: {
    AccountNumber:  { type: 'string' , indexed: true },
    BankNumber: 'string',
    AccountHolderName: 'string',
    AccountBalance: { type: 'float', optional: true, default: 0 }, // Decimal
    Overdraft: { type: 'float', optional: true, default: 0 },
    AvailableBalance: { type: 'float', optional: true, default: 0 },
    Timestamp: { type: 'int', optional: true, default: 0 },
  }
};
const AccountAuthSchema = {
  name: 'AccountAuth',
  properties: {
    AccountNumber:  { type: 'string', indexed: true },
    Password: { type: 'string', optional: true, default: '' },
    Timestamp: { type: 'int', optional: true, default: '' },
  }
};
const AccountTokenSchema = {
  name: 'AccountToken',
  properties: {
    Token:  { type: 'string', optional: true, default: '' },
    Timestamp: { type: 'int', optional: true, default: '' },
  }
};
const DeviceTokenSchema = {
  name: 'DeviceToken',
  properties: {
    Token:  { type: 'string', optional: true, default: '' },
    Platform: { type: 'string', optional: true, default: '' } 
  }
};
const AccountMetaSchema = {
  name: 'AccountMeta',
  properties: {
    AccountHolderGivenName:  { type: 'string', optional: true, default: '' },
    AccountHolderFamilyName: { type: 'string', optional: true, default: '' },
    AccountHolderDateOfBirth: { type: 'string', optional: true, default: '' },
    AccountHolderIdentificationNumber: { type: 'string', optional: true, default: '' },
    AccountHolderContactNumber1: { type: 'string', optional: true, default: '' },
    AccountHolderContactNumber2: { type: 'string', optional: true, default: '' },
    AccountHolderEmailAddress: { type: 'string', optional: true, default: '' },
    AccountHolderAddressLine1: { type: 'string', optional: true, default: '' },
    AccountHolderAddressLine2: { type: 'string', optional: true, default: '' },
    AccountHolderAddressLine3: { type: 'string', optional: true, default: '' },
    AccountHolderPostalCode: { type: 'string', optional: true, default: '' },
  }
};
const TransactionsSchema = {
  name: 'Transactions',
  primaryKey: 'Transaction',
  properties: {
    Transaction:  { type: 'int', indexed: true },
    Type: { type: 'int', optional: true, default: '' },
    SenderAccountNumber: { type: 'string', optional: true, default: '' },
    SenderBankNumber: { type: 'string', optional: true, default: '' },
    ReceiverAccountNumber: { type: 'string', optional: true, default: '' },
    ReceiverBankNumber: { type: 'string', optional: true, default: '' },
    TransactionAmount: 'float',
    SenderName: { type: 'string', optional: true, default: '' },
    ReceiverName: { type: 'string', optional: true, default: '' },
    FeeAmount: { type: 'float', optional: true, default: '' },
    Lat: { type: 'float', optional: true, default: 0 },
    Lon: { type: 'float', optional: true, default: 0 },
    Desc: { type: 'string', optional: true, default: '' },
    Status: { type: 'string', optional: true, default: '' },
    Timestamp: { type: 'int', optional: true, default: 0 },
  }
};
const ContactsSchema = {
  name: 'Contacts',
  properties: {
    ContactName: { type: 'string', indexed: true },
    ContactAccountNumber: { type: 'string', optional: true, default: '' },
    ContactBankNumber: { type: 'string', optional: true, default: '' },
    ContactEmailAddress: { type: 'string', optional: true, default: '' },
  }
};

let realm = new Realm({ schema: [ AccountSchema, AccountMetaSchema, AccountAuthSchema, AccountTokenSchema, DeviceTokenSchema, TransactionsSchema, ContactsSchema ], schemaVersion: 18 });

module.exports = realm;
