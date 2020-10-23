import * as React from 'react';
import {View,Text,TouchableOpacity,StyleSheet} from 'react-native';
import db from '../config';
import firebase, { auth } from 'firebase';

export default class ReceiverDetailsScreen extends React.Component{
    constructor(props){
        super(props)
        this.state ={
          userId:firebase.auth().currentUser.email,
          receiverId:this.props.navigation.getParam('details')['user_id'],
          requestId:this.props.navigation.getParam('details')['request_id'],
          bookName:this.props.navigation.getParam('details')['book_name'],
          reasonForRequesting:this.props.navigation.getParam('details')['request_reason'],
          receiverName:'',
          receiverContact:'',
          receiverAddress:'',
          receiverRequestDocId:'',
          userName:''
        }
    }
    getRecieverDetails=()=>{
        db.collection('users').where('email_id','==',this.state.receiverId).get()
        .then(snapshot => {
             snapshot.forEach(doc =>{
                this.setState({
                    receiverRequestDocId:doc.id
                })
             })
        })
    }
    updateBookStatus=()=>{
        db.collection('all_donations').add({
            book_name:this.state.bookName,
            request_id:this.state.requestId,
            requested_by:this.state.receiverName,
            donor_id:this.state.userId,
            request_status:'Donor Interested'
        })
    }
    addNotification=()=>{
        var message = this.state.userName + "has shown intreset in donating the book"
        db.collection('all_notifications').add({
            'targeted_user_id':this.state.receiverId,
            'donor_id':this.state.userId,
            'request_id':this.state.requestId,
            'book_name':this.state.bookName,
            'date':firebase.firestore.FieldValue.serverTimestamp(),
            'notification_status':'unread',
            'message':message,
        })
    }
    componentDidMount(){
            this.getRecieverDetails()
            this.getUserDetails()
    }
    getUserDetails=(userId)=>{
          db.collection('users').where('email_id','==',this.state.receiverId).get()
          .then(snapshot=>{
              snapshot.forEach(doc=>{
                this.setState({
                    receiverName:doc.data().first_name,
                    receiverContact:doc.data().mobile_number,
                    receiverAddress:doc.data().address,    
                })
            })
          })

          db.collection('requested_books').where('request_id','==',this.state.requestId).get()
          .then(snapshot=>{
              snapshot.forEach(doc=>{
                   this.setState({
                       username:doc.data().first_name + " "+doc.data().last_name,
                   })
              })
          })
    }
    render(){
        return(
            <View style ={styles.conatiner}>
            <Card>
                <Text style={{fontWeight:'bold'}}>
                NAME:{this.state.receiverName}
                </Text>
            </Card>
            <Card>
                <Text style={{fontWeight:'bold'}}>
                CONTACT:{this.state.receiverContact}
                </Text>
            </Card>
            <Card>
                <Text style={{fontWeight:'bold'}}>
                ADDRESS:{this.state.receiverAddress}
                </Text>
            </Card>
            <View style = {styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={()=>{this.updateBookStatus() 
            this.addNotification()
            this.props.navigation.navigate('My Donations')
            }}>
            <Text style={styles.buttonText}>DONATE</Text>
            </TouchableOpacity>
            </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
 conatiner:{},
 buttonContainer:{},
 button:{},
 buttonText:{}
})