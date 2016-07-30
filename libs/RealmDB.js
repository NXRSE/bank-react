'use strict';

// Realm for a database - realm.io
// Encrypt database
var key = new Int8Array(64);
const Realm = require('realm');

// @TODO Move schemas into separate file
// Set up schemas
const AccountSchema = {
  name: 'Account',
  properties: {
    AccountNumber:  { type: 'string' , indexed: true },
    BankNumber: 'string',
    AccountHolderName: 'string',
    AccountBalance: 'float', // Decimal
    Overdraft: 'float',
    AvailableBalance: 'float',
    Timestamp: 'int',
  }
};
const AccountAuthSchema = {
  name: 'AccountAuth',
  properties: {
    AccountNumber:  { type: 'string', indexed: true },
    Password: 'string',
    Timestamp: 'int',
  }
};
const AccountTokenSchema = {
  name: 'AccountToken',
  properties: {
    Token:  'string',
    Timestamp: 'int',
  }
};
const DeviceTokenSchema = {
  name: 'DeviceToken',
  properties: {
    Token:  'string',
    Platform:  'string'
  }
};
const AccountMetaSchema = {
  name: 'AccountMeta',
  properties: {
    AccountHolderGivenName:  'string',
    AccountHolderFamilyName: 'string',
    AccountHolderDateOfBirth: 'string',
    AccountHolderIdentificationNumber: 'string',
    AccountHolderContactNumber1: 'string',
    AccountHolderContactNumber2: 'string',
    AccountHolderEmailAddress: 'string',
    AccountHolderAddressLine1: 'string',
    AccountHolderAddressLine2: 'string',
    AccountHolderAddressLine3: 'string',
    AccountHolderPostalCode: 'string',
  }
};
const TransactionsSchema = {
  name: 'Transactions',
  properties: {
    Transaction:  { type: 'string', indexed: true },
    Type: 'int',
    SenderAccountNumber: 'string',
    SenderBankNumber: 'string',
    ReceiverAccountNumber: 'string',
    ReceiverBankNumber: 'string',
    TransactionAmount: 'float',
    FeeAmount: 'float',
    Timestamp: 'int',
  }
};
const ContactsSchema = {
  name: 'Contacts',
  properties: {
    ContactName: { type: 'string', indexed: true },
    ContactAccountNumber: 'string',
    ContactBankNumber: 'string',
  }
};

let realm = new Realm({ schema: [ AccountSchema, AccountMetaSchema, AccountAuthSchema, AccountTokenSchema, DeviceTokenSchema, TransactionsSchema, ContactsSchema ], schemaVersion: 7 });

module.exports = realm;
