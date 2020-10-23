import * as React from 'react';
import {View,Text,TouchableOpacity,StyleSheet} from 'react-native';
import {DrawerItems} from 'react-navigation-drawer';
import firebase from 'firebase';
import {Avatar} from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import db from '../config';

export default class SideBarMenu extends React.Component{
    constructor(){
        super()
        this.state={
            image:'#',
            userId:firebase.auth().currentUser.email,
            name:''
        }
    }
    selectPicture=async()=>{
        const {cancelled,uri} = await ImagePicker.launchImageLibraryAsync({
            mediaTypes : ImagePicker.MediaTypeOptions.All,
            allowsEditing : true,
            aspect:[4,3],
            quality:1
        })
        if (! cancelled){
            this.setState({
                image:uri
            })
            this.uploadImage(uri,this.state.userId)
        }
    }
    uploadImage=async(uri,imageName)=>{
        var response = await fetch(uri)
        var blob = await response.blob()
        var ref = firebase
        .storage()
        .ref()
        .child('user_profiles/'+imageName)
        return ref.put(blob).then(response=>{
            this.fetchImage(imageName)
        })
    }
    fetchImage=(imageName)=>{
        var storageRef = firebase.storage().ref().child('user_profiles/'+imageName)
        storageRef.getDownloadURL()
        .then(url=>{
            this.setState({
                image:url
            })
            .catch(error=>{
                this.setState({
                    image:'#'
                })
            })
        })
    }
    getUserProfile(){
        db.collection('users').where('email_id','==',this.state.userId)
        .onSnapshot(snapshot=>{
            snapshot.forEach(doc=>{
                this.setState({
                    name:doc.data().first_name+' '+doc.data().last_name
                })
            })
        })
    }
    componentDidMount(){
        this.fetchImage(this.state.userId)
        this.getUserProfile()
    }
    render(){
        return(
            <View style ={{flex:1}}>
                <View style={{flex:0.5,alignItems:'center',backgroundColor:'orange'}}>
                    <Avatar 
                    rounded 
                    source = {{uri : this.state.image}}
                    size = 'medium'
                    onPress = {()=>{
                        this.selectPicture()
                    }}
                    showEditButton/>
                    <Text style={{fontWeight:'bold',fontSize:20,paddingTop:10}}>{this.state.name}</Text>
                </View>
            <View style = {styles.drawerContainer}>
            <DrawerItems {...this.props}/>
            <View style ={styles.logoutContainer}> 
            <TouchableOpacity style={styles.logoutButton} onPress = {()=>{
                 this.props.navigation.navigate('WelcomeScreen')
                 firebase.auth().signOut()
            }}>
            <Text style={styles.logoutText}>LogOut</Text>
            </TouchableOpacity>
            </View>
            </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    drawerContainer:{
        flex:0.8
    },
    logoutContainer:{
        flex:0.2,
        justifyContent:'flex-end',
        paddingBottom:20       
    },
    logoutButton:{
          height:30,
          width:'100%',
          justifyContent:'center',
          padding:10,
          backgroundColor:'orange'
    },
    logoutText:{
        color:'red',
        fontSize:15,
        fontWeight:'bold'
    }
})