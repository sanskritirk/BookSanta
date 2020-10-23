import * as React from 'react';
import {Text,View,StyleSheet,TouchableOpacity,TextInput, Alert} from 'react-native';
import MyHeader from '../components/Header';
import db from '../config';
import firebase from 'firebase';

export default class SettingScreen extends React.Component{
    constructor(){
        super()
        this.state={
            firstName:'',
            lastName:'',
            address:'',
            phoneNumber:'',
            emailId:'',
            docId:'',
        }
    }
    getUserDetails=()=>{
        var user = firebase.auth().currentUser()
        var email = user.email
        db.collection(users).where('username','==',email).get()
        .then(snapshoot => {
            snapshoot.forEach(doc =>{
                var data = doc.data()
                this.setState({
                    emailId:data.username,
                    firstName:data.first_name,
                    lastName:data.last_name,
                    address:data.address,
                    phoneNumber:data.mobile_number,
                    docId:doc.id
                })
            })
        })
    }
    componentDidMount(){
        this.getUserDetails()
    }
    updateUserDetails=()=>{
        db.collection('users').doc(this.state.docId).update({
            'first_name':this.state.firstName,
            'last_name':this.state.lastName,
            'address':this.state.address,
            'mobile_number':this.state.phoneNumber
        })
        Alert.alert('Profile Updated Successfully')
    }
    render(){
        return(
            <View style={styles.container}>
            <MyHeader title = 'Settings' navigation = {this.props.navigation}/>
            <View style={styles.formContainer}>
            <TextInput 
            style={styles.inputBox} placeholder ={'First Name'} maxLength={8}
            onChangeText={()=>{
                this.setState({
                    firstName:this.state.firstName
                })
            }} value={this.state.firstName}/>
            <TextInput 
            style={styles.inputBox} placeholder ={'Last Name'} maxLength={8}
            onChangeText={()=>{
                this.setState({
                    lastName:this.state.lastName
                })
            }} value={this.state.lastName}/>
            <TextInput 
            style={styles.inputBox} placeholder ={'Address'} maxLength={20}
            onChangeText={()=>{
                this.setState({
                    address:this.state.address
                })
            }} value={this.state.address}/>
            <TextInput 
            style={styles.inputBox} placeholder ={'Contact Number'} maxLength={10}
            onChangeText={()=>{
                this.setState({
                    phoneNumber:this.state.phoneNumber
                })
            }} value={this.state.phoneNumber}/>
            <TouchableOpacity style={styles.button} onPress={()=>{
                this.updateUserDetails
            }}>
            <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
     container:{
         flex:1,
         alignItems:'center',
         justifyContent:'center',
     },
     formContainer:{
         flex:1,
         width:'100%',
         alignItems:'center'
     },
     inputBox:{
         width:'75%',
         height:30,
         alignSelf:'center',
         borderColor:'black',
         borderRadius:10,
         borderWidth:1,
         marginTop:20,
         padding:10
     },
     button:{
         backgroundColor:'orange',
         width:75,
         height:50,
         borderRadius:10,
         alignContent:'center',
         justifyContent:'center',
         marginTop:20,
         marginLeft:10
     },
     buttonText:{
         color:'red',

         fontSize:20,
         fontWeight:'bold'
     }

})