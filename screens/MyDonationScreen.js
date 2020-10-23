import * as React from 'react';
import {View,StyleSheet,Text,FlatList} from 'react-native';
import {Card,ListItem,Icon} from 'react-native-elements';
import db from '../config';
import firebase from 'firebase';

export default class MyDonationScreen extends React.Component{
    constructor(){
        super()
        this.state={
            userId:firebase.auth().currentUser.email,
            allDonations:[],
        }
        this.requestRef = null
    }
    getAllDonation=()=>{
        this.requestRef=db.collection('all_donations').where('donor_id','==',this.state.userId)
        .onSnapshot(snapshot =>{
            var allDonations = snapshot.docs.map(document =>document.data())
                this.setState({
                    allDonations:allDonations
                })
        })
    }
    keyExtractor=(item,index)=>index.toString()
    renderItem=({item,i})=>{
        <List 
        key = {i}
        title = {item.book_name}
        subTitle = {'requested_by'+item.requested_by+item.request_status}
        leftelement={
            <Icon name='book' type = 'font-awesome' color = 'black'/>
        }
        titleStyle ={{color:'black',fontWeight:'bold'}}
        rightElement={
            <TouchableOpacity style ={styles.button} onPress ={
                ()=>this.sendBook(item)}>
            <Text>Send Book</Text>
            </TouchableOpacity>
        }
        />
    }
    sendNotification=(bookDetails,requestStatus)=>{
       var requestId = bookDetails.request_id
       var donorId = bookDetails.donor_id
       db.collection('all_notifications').where('request_id','==',requestId).where('donor_id','==',donorId).get()
       .then(snapshot=>{
           snapshot.forEach(doc=>{
               var message = ""
               if (request_status === 'Book Sent'){
                   message = this.state.donorName + "Book has Sent"
               }
               else{
                   message = this.state.donorName + "Has Shown Intrested in donating the book"
               }
               db.collection('all_notifications').update({
                   'message':message,
                    'notification_status':'unread',
                    'date':firebase.firestore.FieldValue.serverTimestamp(),
               })
           })
       })
    }
    sendBook=(bookDetails)=>{
         if (bookDetails.request_status === 'Book Sent'){
             var requestStatus = 'Donor intrested'
             db.collection('all_donations').doc(bookDetails.doc_id).update({
                 'request_status':'Book Sent'
             })
             this.sendNotification(bookDetails,request_status)
         }
    }
    render(){
        return(
            <View style = {{flex:1}}>
            <MyHeader navigation={this.props.navigation} title ="My Donations"/>  
            <View style = {{flex:1}}>
            {
                this.state.allDonations.length === 0
                ?(
                    <View style = {styles.subtitle}>
                    <Text style ={{fontSize:20}}>List of all Book Donations</Text>
                    </View>   
                )
                :(
                    <FlatList
                    keyExtractor={this.keyExtractor}
                    data={this.state.allDonations}
                    renderItem={this.renderItem}/>
                )
            }
            </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    subtitle:{
        fontSize:20
    },
    button:{
        backgroundColor:'orange',
        height:50,
        width:50,
        alignItems:'center',
        justifyContent:'center',
    }
})