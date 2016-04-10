import React, {View, Text, StyleSheet} from "react-native";
import Button from "react-native-button";
import {Actions} from "react-native-router-flux";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF",
    },
    welcome: {
        fontSize: 20,
        textAlign: "center",
        margin: 10,
    },
    instructions: {
        textAlign: "center",
        color: "#333333",
        marginBottom: 5,
    },
});


export default class TabView extends React.Component {
    render(){
        var {View, Text} = React;
        var Button = require("react-native-button");
        var Actions = require("react-native-router-flux").Actions;
        const drawer = this.context.drawer;
        return (
            <View style={[styles.container, this.props.sceneStyle]}>
                <Text>Tab {this.props.title}</Text>

                <Button onPress={Actions.pop}>Back</Button>
                <Button onPress={() => {drawer.close();Actions.mainAccount();}}>Switch to account</Button>
                <Button onPress={() => {drawer.close();Actions.mainContacts();}}>Switch to contacts</Button>
                <Button onPress={() => {drawer.close();Actions.mainCredit();}}>Switch to credit</Button>
                <Button onPress={() => {drawer.close();Actions.mainDeposit();}}>Switch to deposit</Button>
            </View>
        );
    }
}

TabView.contextTypes = {
    drawer: React.PropTypes.object
};
