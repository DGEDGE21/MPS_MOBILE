import { StyleSheet } from 'react-native';
import React,{useState,useEffect} from 'react';
import axios from 'axios';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import * as SecureStore from 'expo-secure-store';
import {Ionicons,AntDesign,MaterialCommunityIcons,Feather,MaterialIcons} from '@expo/vector-icons'
export default function TabTwoScreen() {
  const [text,setText]=useState('')
  const [token,setToken]=useState();
  const [dados,setDados]=useState(null);
  const Obter_token=()=>{
    (async ()=>{
        let result = await SecureStore.getItemAsync('token');
        setToken(result)
      })()
    
    }
    
    
  const Procura=()=>{
    axios({
      method:"post",
      url:`https://www.mapisis.com//web/TokensRecarga`,
      headers:{'Authorization':`token ${token}`,'Content-Type':'application/json' },
      data:{id:'42'}
  }).then(dat=>{ if(dat.status!==200){
      throw Error('Dados de acesso invalidos');  
          }
      
      return dat
   } ).then( d=>{ 
                  setDados(d.data)
                  console.log(d.data)
                }
     ).catch(e=>{
      console.log(e.message) 
      console.log(token)
    })
      }
      useEffect(()=>{
        Obter_token();
        Procura();
        },)
        
  return (
    <View style={styles.container}>
     <Text style={styles.word}>Tokens</Text>
      {dados && dados.map((item)=>{
        return(
          <View >
            <Text style={styles.token}>Token Recarga  <MaterialCommunityIcons name='file-pdf-box' 
              size={20} 
              color="#fff"/>               
        Data{item.data_de_compra}
        </Text>
          
          </View>
        )
      }) }
      
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 6,
    borderTopLeftRadius:30,
    borderTopRightRadius:30,
    paddingVertical:30,
    paddingHorizontal:20,

  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },  word:{
    paddingTop:20,
  },token:{
      marginTop:24,
      padding: 10,
      backgroundColor:'#019d95',
      fontSize:16,

  }
});
