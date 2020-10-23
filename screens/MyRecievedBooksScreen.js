import * as React from 'react';
import {View,Text,StyleSheet,TouchableOpacity,FlatList} from 'react-native';
import {ListItem} from 'react-native-elements';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader';

export default class MyRecievedBooksScreen extends React.Component{
    constructor(){
        super()
        this.state={
            userId:firebase.auth().currentUser.email,
            recievedBooksList:[]
        }
        this.requestRef = null
    }
    getRecievedBooksList=()=>{
        this.requestRef=db.collection('requested_books')
        .where('user_id','==',this.state.userId)
        .where('book_status','==','received')
        .onSnapshot(snapshot=>{
            var recievedBooksList = snapshot.docs.map(doc=>doc.data())
            this.setState({
                recievedBooksList:recievedBooksList
            })
        })
    }
    componentDidMount(){
        this.getRecievedBooksList()
    }
    componentWillUnmount(){
        this.requestRef()
    }
    keyExtractor=(item,index)=>index.toString()
    renderItem=({item,i})=>{
      return(
          <ListItem
          key = {i}
          title={item.book_name}
          subtitle={item.book_status}
          bottomDivider/>
      )
    }
    render(){
        return(
            <View style={{flex:1}}>
            <View style={{flex:1}}>
            {
                this.state.recievedBooksList.len === 0
                ?
                (
                    <View>
                        <Text>
                            No recieve Books
                        </Text>
                        </View>

                )
                :(
                    <FlatList
                    keyExtractor = {this.keyExtractor}
                    data = {this.state.recievedBooksList}
                    renderItem={this.renderItem}/>
                )
            }
            </View>
            </View>
        )
    }
}

