#! /bin/bash

sed -i -e 's/React\/RCTComponent.h/RCTComponent.h/g' ./node_modules/react-native-maps/ios/AirMaps/AIRMap.h
sed -i -e 's/React\/RCTView.h/RCTView.h/g' ./node_modules/react-native-maps/ios/AirMaps/AIRMapCallout.h
