import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, TextInput, StatusBar } from 'react-native'
import React, { useState, useContext } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

// Componentes Extraidos
import image from '../assets/back1.png'
import { loginUser } from '../controllers/api'
import { Msg } from '../components/Msg';
import { Context } from '../controllers/context'
import Load from '../components/Load';


// Se extraen las clases del LoginScreen.sass como un objecto
// -- styles.claseConStilo
import styles from '../sass/loginScreen.sass';

export default function LoginScreen({ navigation }) {

  // Extraer datos del Context
  const { msg, setMsg, setUser, setLoad } = useContext(Context)

  // Estados para los inputs del formulario
  const [inputs, setInputs] = useState({
    username: '',
    password: '',
  })

  // Funcion para iniciar sesion
  const loginPress = async () => {
    // Activar pantalla de carga
    setLoad(true)
    // Peticion loginUser enviando los datos del input
    const res = await loginUser(inputs)

    // Si se encuentra un usuario
    if (res.status === 200) {

      // Desactiva la pantalla de carga
      setLoad(false)

      // Vacía el estado de los inputs
      setInputs({
        username: '',
        password: '',
      })

      // Inserta en el Context.user los datos del usuarios para ser usados en toda la app
      setUser(res.data)

      // Si se encuentra en el LocalStorage una variable con el ultimo capitulo visto , ve hacia él 
      // Caso contrario continua a la pagina Search
      const value = await AsyncStorage.getItem(`@user:${res.data.id}_capMemory`)

      if (value !== null) {
        // Extrae los datos del capitulo de la variable de en LocalStorage
        const { cap, serieId, index } = JSON.parse(value)
        // Si la serie no ha sido borrada, continua al capitulo
        if (serieId !== '') {
          return navigation.navigate('Cap', { serieId, cap, index })
        } else {
          return navigation.navigate('Search')
        }
      } else {
        return navigation.navigate('Search')
      }

      // Si no se encuentra un usuario
    } else {
      setLoad(false)
      setMsg({
        text: res.data.msg,
        display: true,
        type: false,
      })
    }
  }

  // Funcion para reconocer el input que se esta cambiando y registrar dicho cambio en el setInputs
  const inputChange = (name, data) => setInputs({ ...inputs, [name]: data });

  // En caso de acceder como invitado, todo el Context.user sera almacenado como ´guest´ para diferenciarlo de un usuario normal
  const onPressGuest = async () => {
    setUser({
      username: 'guest',
      email: 'guest',
      admin: false,
      id: '@guest',
      profile_pic: 'guest'
    })

    // Si en el localStorage hay una variable con el user invitado (Guest) ve hacia el capitulo
    const value = await AsyncStorage.getItem(`@user:@guest_capMemory`)
    if (value !== null) {
      const { cap, serieId, index } = JSON.parse(value)

      // Si la serie no ha sido borrada, continua al capitulo
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
          onChangeText={(text) => inputChange('password', text)}
          placeholder='Password' style={[styles.input, styles.password]} ></TextInput>
        {/* <View style={styles.subcontainer} ></View> */}
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

// Estilo para la imagen de fondo del LoginScreen
const style = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  }
});