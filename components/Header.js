import * as React from 'react';
import {Header,Icon,Badge} from 'react-native-elements';
import {View,Text,StyleSheet,Alert} from 'react-native';
import db from '../config';
import firebase from 'firebase';

export default class MyHeader extends React.Component{
    constructor(props){
        super(props)
        this.state={
            value:''
        }
    }
    getNumberofNotifications(){
        db.collection('all_notifications').where('notification_status','==','Unread')
        .onSnapshot(snapshot=>{
            var unreadNotifications = snapshot.docs.map(doc=>doc.data())
            this.setState({
                value:unreadNotifications.length
            })
        })
    }
    componentDidMount(){
        this.getNumberofNotifications()
    }
    render(){
        return(
            <View>
                <Header
        leftComponent = {
            <Icon name = 'bars' type = 'font-awesome' color = 'black' onPress ={()=>{props.navigation.toggleDrawer()}}/>
        }
        centerComponent = {{text:props.title,style:{color:'black',fontSize:20,fontWeight:'bold'}}}
        rightComponent={
            <BellIconWithBadge {...props}/>
        }
        backgroundColor= 'orange'/>
            </View>
        )
    }
}

const BellIconWithBadge =(props) =>{
    return(
        <View>
            <Icon name = 'bell' type='font-awesome' color='black' size={25} onPress={()=>{props.navigation.navigate('Notification')}}/>
            <Badge value = {this.state.unreadNotifications} containerStyle = {{position:'absolute',top:-4,right:-4}}/>
        </View>
    )
       
}

