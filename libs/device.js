'use strict';

var Device = require('react-native-device');

function DeviceLib() { 

    this.get = function() {
        let deviceV = Device.deviceVersion;
        var device = "";

        switch(deviceV) {
            case "4,1":
                device = "4s";
                break;
            case "5,1":
            case "5,2":
                device = "5";
                break;
            case "5,3":
            case "5,4":
                device = "5c";
                break;
            case "6,1":
            case "6,2":
                device = "5s";
                break;
            case "7,1":
                device = "6+";
                break;
            case "7,2":
                device = "6";
                break;
            case "8,2":
                device = "6s+";
                break;
            case "8,1":
            default:
                device = "6s";
                break;
        }

        // TESTING
        device = "4s";
        return device;
    }
}

module.exports = DeviceLib;
