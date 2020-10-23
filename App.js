import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import WelcomeScreen from './screens/WelcomeScreen';
import AppTabNavigator from './components/AppTabNavigator';
import {createAppContainer,createSwitchNavigator} from 'react-navigation';
import AppDrawerNavigator from './components/AppDrawerNavigator';

export default class App extends React.Component {
  render(){  
  return (
    <AppContainer/>
  );
}
}

const switchNavigator = createSwitchNavigator({
  WelcomeScreen:{screen:WelcomeScreen},
  Drawer : {screen:AppDrawerNavigator}
})

const AppContainer = createAppContainer(switchNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
