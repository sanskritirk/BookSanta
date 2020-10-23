import * as React from 'react';
import {View,Text,TouchableOpacity,StyleSheet,FlatList} from 'react-native';
import firebase from 'firebase';
import db from '../config';
import MyHeader from '../components/Header';
import {ListItem} from 'react-native-elements';

export default class BookDonateScreen extends React.Component{
    constructor(){
        super()
        this.state={
           requestedBooksList:[],
        }
        this.requestRef = null
    }
    getRequestedBooksList=()=>{
        this.requestRef = db.collection('requested_books')
        .onSnapshot(snapshot => {
            var requestedBooksList = snapshot.docs.map(document => document.data())
            this.setState({
                requestedBooksList:requestedBooksList
            })
        })
    }
    keyExtractor = (item,index)=>index.toString()
    renderItem =({item,i})=>{
        return (
            <ListItem 
            key = {i}
            title = {item.book_name}
            subtitle = {item.reason_request}
            titleStyle = {{color:'black',fontWeight:'bold'}}
            rightElement = {
                <TouchableOpacity style ={styles.button} onPress = {()=>{
                    this.props.navigation.navigate('ReceiverDetails',{
                        'details':item
                    })
                }}>
                <Text style={{color:'black'}}>View</Text>
                </TouchableOpacity>
            }
            bottomDivider/>
        )
    }
    render(){
        return(
            <View style={{flex:1}}>
            <MyHeader title = 'Donate Books'/>
            <View style ={{flex:1}}>
            {this.state.requestedBooksList.length === 0  ? (
                <View style={styles.subContainer}>
                <Text>List of Requested Books</Text>
                </View>
            ):
            (
                <FlatList 
                keyExtractor = {this.keyExtractor}
                data = {this.state.requestedBooksList}
                renderItem = {this.renderItem}/>
            )}
            </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    subContainer:{
        flex:1,
        fontSize:20,
        justifyContent:'center',
        alignItems:'center'
    },
    button:{
        width:100,
        height:30,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'orange',
        shadowColor:'black',
        shadowOffset:{
            width:0,
            height:8
        }
    }
})