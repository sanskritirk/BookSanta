import * as React from 'react';
import {Text,View,StyleSheet,Dimensions} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import { ListItem } from 'react-native-elements';
import {SwipeListView} from 'react-native-swipe-list-view'


export default class SwipeableFlatList extends React.Component{
    constructor(props){
        super(props)
            this.state={
                allNotifications:this.props.allNotifications
            }
    } 
    onSwipeValueChange=(swipeData)=>{
        var allNotifications = this.state.allNotifications
        const {key,value} = swipeData
        if (value < -Dimensions.get('window').width){
            const newData = [...allNotifications]
            const prevIndex = allNotifications.findIndex(item=>item.key === key)
            this.updateMarkAsRead(allNotifications[prevIndex])
            newData.splice(prevIndex,1)
            this.setState({
                allNotifications:newData
            })
        }
        
    }
    updateMarkAsRead=(notifcation)=>{
         db.collection('all_notificatios').doc(notifcation.doc.id).update({
             'notification_status':'Read'
         })
    }
    renderItem=data=>(
        <ListItem 
        leftElement = {<Icon name='book' type = 'font-awesome' color = 'orange'/>}
        title = {data.item.book_name}
        style={{color:'black',fontWeight:'bold'}}
        subtitle = {data.item.message}
        bottomDivider/>
    )
    renderHiddenItem=()=>{
           <View style ={styles.rowBack}>
           <View style={[styles.backRightButton,styles.backRightButtonRight]}> 
           </View>
           </View>
    }
    render(){
        return(
            <View style ={styles.container}>
            <SwipeListView
            disableRightSwipe
            data={this.state.allNotifications}
            renderItem = {this.renderItem}
            renderHiddenItem = {this.renderHiddenItem}
            rightOpenValue = {-Dimensions.get('window').width}
            previewRowKey = {'0'}
            previewOpenValue = {-40}
            previewOpenDelay = {3000}
            onSwipeValueChange = {this.onSwipeValueChange()}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
   container:{
       flex:1
   }
})