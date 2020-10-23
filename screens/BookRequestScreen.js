import * as React from 'react';
import {View,Text,TouchableOpacity,StyleSheet,KeyboardAvoidingView,Alert,TextInput} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/Header';
import { ThemeColors } from 'react-navigation';
import { ScrollView } from 'react-native-gesture-handler';

export default class BookRequestScreen extends React.Component{
    constructor(){
        super()
        this.state={
          userId:firebase.auth().currentUser.email,
          bookName:'',
          reasonRequest:'',
          requestId:'',
          requestedBooksName:'',
          bookStatus:'',
          docId:'',
          isBookRequestActive:false
        }
    }
    createUniqueId(){
        return Math.random().toString(36).substring(7)
    }
    addRequest=async(bookName,reasonRequest)=>{
        var userId = this.state.userId
        var randomRequestId = this.createUniqueId()
        db.collection('requested_books').add({
            'user_id':userId,
            'book_name': bookName,
            'reason_request':reasonRequest,
            'request_id': randomRequestId,
            'book_status':'request',
            'date':firebase.firestore.FieldValue.serverTimestamp()
        })
        await this.getBookRequest()
        db.collection('users').where('email_id','==',userId).get()
        .then()
        .then(snapshot=>{
            snapshot.forEach(doc=>{
                db.collection('users').doc(doc.id).update({
                    'isBookRequestActive':true
                })
            })
        })
        this.setState({
            bookName:'',
            reasonRequest:'',
        })
        return Alert.alert('Book Request Successful')
    }
    getBookRequest=()=>{
        var bookRequest = db.collection('requested_books').where('user_id','==',this.state.userId).get()
        .then(snapshot=>{
            snapshot.forEach(doc=>{
                if (doc.data().book_status != 'received' ){
                    this.setState({
                        requestId:doc.data().request_id,
                        requestedBooksName:doc.data().book_name,
                        bookStatus:doc.data().book_status,
                        docId:doc.id
                    })
                }
            })
        })
    }
    getIsBookRequestActive=()=>{
        db.collection('users').where('email_id','==',this.state.userId)
        .onSnapshot(snapshot=>{
            snapshot.forEach(doc=>{
                this.setState({
                    isBookRequestActive:doc.data().isBookRequestActive,
                    docId:doc.id
                })
            })
        })

    }
    componentDidMount(){
        this.getBookRequest()
        this.getIsBookRequestActive()
    }
    updateBookRequestStatus=()=>{
        db.collection('requested_books').doc(this.state.docId).update({
            'book_status':'received'
        })
        db.collection('users').where('email_id','==',this.state.userId).get()
        .then(snapshot=>{
            snapshot.forEach(doc=>{
                db.collection('users').doc(doc.id).update({
                    'isBookRequestActive':false
                })
            })
        })
    }
    sendNotification=()=>{
        db.collection('users').where('email_id','==',this.state.userId).get()
        .then(snapshot=>{
            snapshot.forEach(doc=>{
                var Firstname = doc.data().first_name 
                var lastName = doc.data().last_name
                db.collection('all_notifications').where('request_id','==',this.state.requestId).get()
                .then(snapshot=>{
                    snapshot.forEach(doc=>{
                        var donorId = doc.data().donor_id
                        var bookName = doc.data().book_name
                        db.collection('all_notifications').add({
                            'targeted_user_id':donorId,
                            'message':firstName+' '+lastName+' received the book,'+bookName,
                            'book_name':bookName
                        })
                    })
                })
            })
        })
    }
    receivedBooks=(bookName)=>{
        var userId = this.state.userId
        var requestId = this.state.requestId
        db.collection('received_books').add({
            'user_id':userId,
            'book_name':bookName,
            'request_id':requestId,
            'book_status':'recieved'
        })
    }
    render(){
        if (this.state.isBookRequestActive === true){
            return(
                <View style={{fleex:1,justifyContent:'center'}}>
                    <View style={{borderColor:'black',borderWidth:2,justifyContent:'center',alignItems:'center'}}>
                     <Text>Book Name</Text>
                     <Text>{this.state.requestedBooksName}</Text>
                    </View>
                    <View style={{borderColor:'black',borderWidth:2,justifyContent:'center',alignItems:'center'}}>
                    <Text>Book Status</Text>
                    <Text>{this.state.bookStatus}</Text>
                    </View>
                    <TouchableOpacity style={styles.button} onPress={()=>{this.updateBookRequestStatus() 
                    this.sendNotification() 
                    this.receivedBooks(this.state.requestedBooksName)}}>
                    <Text style ={styles.buttonText}>Book Received</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        else{
        return(
            <View style={{flex:1}}>
            <MyHeader title='Request Book' navigation = {this.props.navigation}/>
            <KeyboardAvoidingView style={styles.keyboardView}>
            <TextInput style={styles.inputbox} placeholder={'Book Name'} onChangeText={(text)=>{
                this.setState({
                    bookName:text
                })
            }} value={this.state.bookName}/>
            <TextInput style={styles.inputbox} placeholder={'Reason'} multiline 
            numberOfLines={8} onChangeText={(text)=>{
                this.setState({
                    reasonRequest:text
                })
            }} value={this.state.reasonRequest}/>
            <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Request</Text>
            </TouchableOpacity>
            </KeyboardAvoidingView>
            </View>
        );
        }
    }
}

const styles = StyleSheet.create({
    keyboardView:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    inputbox:{
        width:'75%',
        height:35,
        alignSelf:'center',
        borderColor:'black',
        borderWidth:1,
        marginTop:20,
        padding:10
    },
    button:{
        backgroundColor:'orange',
        width:'75%',     
        height:30,
        shadowColor:'black',
        shadowOffset:{
            width:0,
            height:8
        },
        shadowOpacity:0.44,
        alignContent:'center',
        justifyContent:'center',
        shadowRadius:10.32,
        elevation:16,
        marginTop:20
    },
    buttonText:{
        color:'black',
        fontSize:20,
        fontWeight:'bold'
    }
})