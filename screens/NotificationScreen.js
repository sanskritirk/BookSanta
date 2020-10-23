import * as React from 'react';
import {Text,View,StyleSheet,FlatList} from 'react-native';
import firebase from 'firebase';
import db from '../config';
import { Icon } from 'react-native-elements';
import MyHeader from '../components/Header';
import SwipeableFlatList from '../components/SwipeableFlatList';

export default class NotificationScreen extends React.Component{
    constructor(){
        super()
        this.state={
            userId:firebase.auth().currentUser.email,
            allNotifications:[],
        }
        this.notificationRef = null
    }
    getNotifications=()=>{
        this.notificationRef = db.collection('all_notifications')
        .where('notification_status','==','Unread').where('targeted_user_id','==',this.state.userId)
        .onSnapshot(snapshot=>{
            var allNotifications = []
            snapshot.docs.map(doc=>{
                var notification = doc.data()
                notification['doc_id'] = doc.id
                allNotifications.push(notification)
            })
            this.setState({
                allNotifications:allNotifications
            })
        })
    }
    componentDidMount(){
        this.getNotifications()
    }
    componentWillUnmount(){
        this.notificationRef()
    }
    keyExtractor=(item,index)=>index.toString()
    renderItem=({item,index})=>{
           return(
               <ListItem
               key = {index}
               leftelement={
                   <Icon name = 'book' type='font-awesome' color = 'red'/>
               }
               title = {Icon.book_nam}
               subTitle = {item.messge}
               bottomDivide/>
           )
    }
    render(){
        return(
            <View style ={styles.container}>
            <View style={{flex:0.1}}>
            <MyHeader title = {'Notifications'} navigation={this.props.navigation}/>
            </View>
            <View style={{flex:0.9}}>
            {
                this.state.allNotifications.length === 0
                ?(
                  <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                  <Text style={{fontSize:30}}>You have no notification</Text>
                  </View>   
                )
                :(
                    <SwipeableFlatList
                    allNotifications = {this.state.allNotifications}/>
                )
            }
            </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1
    },
})