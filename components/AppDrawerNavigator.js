import * as React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {View,Text,StyleSheet} from 'react-native';
import {AppTabNavigator} from './AppTabNavigator';
import SideBarMenu from './SideBarMenu';
import SettingScreen from '../screens/SettingScreen';
import MyDonationScreen from '../screens/MyDonationScreen';
import NotificationScreen from '../screens/NotificationScreen';

export const AppDrawerNavigator = createDrawerNavigator({
    Home : {
        screen:AppTabNavigator,
        
    },
    Mydonation:{
        screen:MyDonationScreen
    },
    Setting:{
        screen:SettingScreen,
    },
    Notification:{
        screen:NotificationScreen
    }
},
{
    contentComponent : SideBarMenu
},
{
    initialRouteName : 'Home'
})