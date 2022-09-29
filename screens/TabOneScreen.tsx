import { Button, TextInput,TouchableOpacity,StyleSheet ,Image} from 'react-native';
import React,{useState,useEffect} from 'react';
import { Text, View } from '../components/Themed';
import { Platform } from 'react-native';
import { RootTabScreenProps } from '../types';
import { BarCodeScanner } from 'expo-barcode-scanner';
import {Ionicons,AntDesign,MaterialCommunityIcons,Feather,MaterialIcons} from '@expo/vector-icons'
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';



export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [TemPermissao,setTemPermissao]=useState(null);
  const [scanner,setScanner]=useState(false);
  const [token,setToken]=useState();
  const [text,setText]=useState('')
  const [barcode,setbarcode]=useState(false);
  const [dados,setDados]=useState(null);
  const [nome,setNome]=useState('');
  const [pesquisa,setPesquisa]=useState('sdsd');
  const [valor,setValor]=useState('');
  const [tarifas,setTarifas]=useState(null)
  const [tarifasb,setTarifasb]=useState('dfdf')
  const askForCameraPermission =()=>{
    
    (async ()=>{
      console.log('pass')
     
      const {status}=await  BarCodeScanner.requestPermissionsAsync();
      setTemPermissao(status=='granted')
    })()
  }
const Obter_token=()=>{
(async ()=>{
    let result = await SecureStore.getItemAsync('token');
    setToken(result)
  })()

}
useEffect(()=>{
  Obter_token();
   
},)
  useEffect(()=>{
    askForCameraPermission();
    console.log('sd')
  }, []);
  const Barcode=()=>{
    setScanner(false)
    setbarcode(!barcode);
  }
  const Paga_Mpesa=()=>{
    axios({
      method:"POST",
      url:`https://2cf5-197-249-5-223.in.ngrok.io/web/paymethod/`,
      headers:{'Authorization':`token ${token}`,'Content-Type':'application/json' },
      data:{numero:dados.telefone,valor:valor}
  }).then(dat=>{ if(dat.status!==200){
      throw Error('Dados de acesso invalidos');  
          }
      
      return dat
   } ).then( d=>{ 
                 console.log(d.data)
                }
     ).catch(e=>{
      console.log(e.message) 
      console.log(token)
    })
    
  }
  const Step_tarif=()=>{
    axios({
      method:"POST",
      url:`https://2cf5-197-249-5-223.in.ngrok.io/web/step_tarif/`,
      headers:{'Authorization':`token ${token}`,'Content-Type':'application/json' },
      data:{contador:text,valor:valor,unidade:'Mzn'}
  }).then(dat=>{ if(dat.status!==200){
      throw Error('Dados de acesso invalidos');  
          }
      
      return dat
   } ).then( d=>{ 
                  console.log(d.data); 
                  setTarifas(d.data);      
                setTarifasb(null);
                }
     ).catch(e=>{
      console.log(e.message) 
      console.log(token)
    })
    
  }
  const Mhandler=()=>{
    Paga_Mpesa();
  }
  const Procura=()=>{
    axios({
      method:"get",
      url:`https://2cf5-197-249-5-223.in.ngrok.io/web/contador/`,
      headers:{'Authorization':`token ${token}`,'Content-Type':'application/json' },
      params:{contador:text}
  }).then(dat=>{ if(dat.status!==200){
      throw Error('Dados de acesso invalidos');  
          }
      
      return dat
   } ).then( d=>{ 
                  setDados(d.data)
                  setNome(d.data.nome)
                  console.log(d.data); 
                  setPesquisa(null);
                }
     ).catch(e=>{
      console.log(e.message) 
      console.log(token)
    })
      }
  const Handler=()=>{
    Procura()
  }
  const handlercodigo=({type,data})=>{
    setScanner(true)
    setText(data)
    setbarcode(!barcode)
    
  }
  const Handertarif=()=>{
    Step_tarif();
  }
  if(TemPermissao==null){
    return(
      <View style={styles.container}>
        <Text>Requesting camera permissio</Text>
    </View>    
    )
  
  }
  if(TemPermissao==false){
    return(
      <View style={styles.container}>
        <Text>No acess </Text>
        <Button title={'allow'} onPress={()=>askForCameraPermission()}/>
    </View>    
    )
  }
  return (
    
    <View style={styles.container}>
      <View style={styles.barcode}>
      <Text style={styles.word}>Numero de Contador</Text>
      {barcode ? <BarCodeScanner
                  onBarCodeScanned={scanner?undefined:handlercodigo}
        style={{height:100,width:'100%'}}/>:true }  
                 <View style={styles.action}>
                
                 
                 <TextInput placeholder='Digite o numero de contador' 
                 style={styles.TextInput}
                 autoCapitalize="none"
                 onChangeText={(val)=>setText(val)}

                 value={text}
                
                />
               
                <TouchableOpacity onPress={()=>Barcode()}>
                 {barcode ?<MaterialCommunityIcons name='barcode-off' 
                 size={20} 
                 color="#019d95"/>:<MaterialCommunityIcons name='barcode-scan' 
                 size={20} 
                 color="#019d95"/>} 
                  
          </TouchableOpacity>
         
                 </View>
              {pesquisa &&       <TouchableOpacity
                    style={styles.loginScreenButton}
                    underlayColor='#fff'>
          <Text style={styles.loginText} onPress={()=>Handler()}>Pesquisar</Text>
             </TouchableOpacity>
           }

             {dados &&       <View style={styles.infosa}>
              <Text style={styles.words}>Cliente associado ao contador</Text>
               
               <View style={styles.infos}>
               <Ionicons name='person' 
                 size={20} 
                 color="#fff"/>               
                      <TextInput value={nome}    style={styles.TextInputs}
              />
   
               </View>
               <View style={styles.infos}>
               <Text style={styles.words}>Valor da recarga</Text>

    <TextInput value={valor} onChangeText={(val)=>setValor(val) }
   style={styles.TextInputvalor}
              />
   
               </View>
       { tarifasb &&
               <TouchableOpacity
               style={styles.loginScreenButton}
               underlayColor='#fff'>
     <Text style={styles.loginText} onPress={()=>Handertarif()}>Comprar</Text>
        </TouchableOpacity>
    
       }
            {tarifas &&   <Text style={styles.words}>Taxas</Text>
            }
            
            {tarifas && <View>
              <View style={styles.infos}>
            
               <MaterialIcons name='money' 
                 size={20} 
                 color="#fff"/>               
            <Text style={styles.wordsa}>Iva:</Text>

                      <TextInput value={`${tarifas.iva} Mzn`}    style={styles.TextInputs}
              />
   
               </View>
               <View style={styles.infos}>
            
            <MaterialCommunityIcons name='fuel' 
              size={20} 
              color="#fff"/>               
         <Text style={styles.wordsa}>TSC:</Text>

                   <TextInput value={`${tarifas.tsc} Mzn`}    style={styles.TextInputs}
           />

            </View>
            <View style={styles.infos}>
            
            <MaterialCommunityIcons name='gas-cylinder' 
              size={20} 
              color="#fff"/>               
         <Text style={styles.wordsa}>metros cubicos:</Text>

                   <TextInput value={`${tarifas.m3} m3`}    style={styles.TextInputs}
           />

            </View>
            <View style={styles.infos}>
            
            <MaterialIcons name='money' 
              size={20} 
              color="#fff"/>               
         <Text style={styles.wordsa}>Total gas:</Text>

                   <TextInput value={`${tarifas.metical} Mzn`}    style={styles.TextInputs}
           />

            </View>
            <TouchableOpacity
                    style={styles.loginScreenButton}
                    underlayColor='#fff'>
          <Text style={styles.loginText} onPress={()=>Mhandler()}>Pagar</Text>
             </TouchableOpacity>
          
               </View>
            }

   
                 
             </View>   }

        
     
        </View>
        
               
         </View>
  );
}

const styles = StyleSheet.create({
  TextInputvalor:{
    marginTop: 22,
    height: '50%',
    width:'100%', 
    backgroundColor:'#fff',
  },
  image: {
    
    width: '5%',
    height: '200%',
},
  container: {
    flex: 1,
    backgroundColor:'#019d96',
    
  },infos:{
    backgroundColor:'#019d95',
  
    display: 'flex',
   flexDirection:'row',
  },
  infosa:{
    height: '50%',
    backgroundColor:'#019d95',
  
  }
  ,barcode:{
            flex:6 ,
        backgroundColor:'#fff',
        borderTopLeftRadius:30,
        borderTopRightRadius:30,
        paddingVertical:30,
        paddingHorizontal:20,
},
  title: {
    color:'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },  action:{
    flexDirection:'row',
    margin:10 ,
    borderBottomWidth:1,
    borderBottomColor:'#f2f2f2',
    paddingBottom:5,
},  word:{
  paddingTop:20,
},  loginScreenButton:{
 marginTop:10,
  paddingTop:10,
  paddingBottom:10,
  width:'100%' ,
  backgroundColor:'#019d95',
  borderRadius:10,
  borderWidth: 1,
  borderColor: '#fff'
},


  words:{
    color:'#fff',
  paddingTop:20,
},wordsa:{
  color:'#fff',
paddingTop:1,
},
loginText:{
    color:'#fff',
    textAlign:'center',
    paddingLeft : 10,
    paddingRight : 10
}
,  
TextInput:{
    flex:1 ,
    marginTop:Platform.OS=='ios' ? 0:-12,
    paddingLeft:10,
    color:'#019d95'
},
TextInputs:{
  flex:1 ,
  width: '10%',
  height: '100%',
  marginTop:'-0.3%',
  paddingLeft:10,
  backgroundColor:'#fff',
  color:'#019d95'
},


});
