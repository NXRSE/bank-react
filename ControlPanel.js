import React, {
  Component,
  PropTypes,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import Button from 'react-native-button'
import {Scene, Router, TabBar, Modal, Schema, Actions, Reducer} from 'react-native-router-flux'

export default class ControlPanel extends Component {
  static propTypes = {
    closeDrawer: PropTypes.func.isRequired
  };

  render() {
    let {closeDrawer} = this.props
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.controlText}>Control Panel</Text>
        <TouchableOpacity style={styles.button} onPress={closeDrawer}>
          <Text>Close Drawer</Text>
        </TouchableOpacity>

        <Button style={styles.button} onPress={()=>Actions.main({type : "reset", open: false})}>Main</Button>
        <Button style={styles.button} onPress={()=>Actions.paymentContactsList({type : "reset"})}>Credit</Button>
        <Button style={styles.button} onPress={()=>Actions.paymentDeposit({type : "reset"})}>Deposit</Button>
        <Button style={styles.button} onPress={()=>Actions.settings({type : "reset", open: false})}>Settings</Button>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black',
  },
  controlText: {
    color: 'white',
  },
  button: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
  }
})

