import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, TextInput, StatusBar } from 'react-native'
import React, { useState, useContext } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';


import image from '../assets/back1.png'
import { loginUser } from '../controllers/api'
import { Msg } from '../components/Msg';
import { Context } from '../controllers/context'
import Load from '../components/Load';




import styles from '../sass/loginScreen.sass';

export default function LoginScreen({ navigation }) {


  const { msg, setMsg, setUser, setLoad } = useContext(Context)


  const [inputs, setInputs] = useState({
    username: '',
    password: '',
  })


  const loginPress = async () => {

    setLoad(true)

    const res = await loginUser(inputs)


    if (res.status === 200) {


      setLoad(false)


      setInputs({
        username: '',
        password: '',
      })


      setUser(res.data)



      const value = await AsyncStorage.getItem(`@user:${res.data.id}_capMemory`)

      if (value !== null) {

        const { cap, serieId, index } = JSON.parse(value)

        if (serieId !== '') {
          return navigation.navigate('Cap', { serieId, cap, index })
        } else {
          return navigation.navigate('Search')
        }
      } else {
        return navigation.navigate('Search')
      }


    } else {
      setLoad(false)
      setMsg({
        text: res.data.msg,
        display: true,
        type: false,
      })
    }
  }


  const inputChange = (name, data) => setInputs({ ...inputs, [name]: data });


  const onPressGuest = async () => {
    setUser({
      username: 'guest',
      email: 'guest',
      admin: false,
      id: '@guest',
      profile_pic: 'guest'
    })


    const value = await AsyncStorage.getItem(`@user:@guest_capMemory`)
    if (value !== null) {
      const { cap, serieId, index } = JSON.parse(value)


      if (serieId !== '') {
        return navigation.navigate('Cap', { serieId, cap, index })
      } else {
        return navigation.navigate('Search')
      }
    } else {
      return navigation.navigate('Search')
    }
    return navigation.navigate('Search')
  }


  return (
    <View style={styles.container}>

      {/* Componente Mensaje y Load  */}
      <Msg />
      <Load />

      {/* StatusBar hidden=true para desabilitar la TopBarNavigation de ReactNavigation */}
      <StatusBar
        hidden={true} />
      <ImageBackground source={image} style={style.image}>
        <TextInput
          value={inputs.username}
          onChangeText={(text) => inputChange('username', text)}
          placeholder='Username' style={[styles.input, styles.username]} ></TextInput>
        <TextInput
          value={inputs.password}
          secureTextEntry={true}
          onChangeText={(text) => inputChange('password', text)}
          placeholder='Password' style={[styles.input, styles.password]} ></TextInput>
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={loginPress}
          title="Login"
        ><Text style={{ color: '#eee' }} >Login</Text></TouchableOpacity>
        <TouchableOpacity style={styles.registerBtn} onPress={() => {
          navigation.navigate('Register')
        }} >
          <Text style={{ color: '#eee' }} >Registrarse</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.forgetPassword} onPress={onPressGuest} ><Text style={{ color: '#eee' }}>Continuar como invitado</Text></TouchableOpacity>
      </ImageBackground>
    </View>
  )
}


const style = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  }
});