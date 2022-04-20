import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './src/screens/LoginScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchScreen from './src/screens/SearchScreen';
import NotificationScreen from './src/screens/NotificationScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import SerieScreen from './src/screens/SerieScreen';
import CapScreen from './src/screens/CapScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AddCapScreen from './src/screens/AddCapScreen';
import AddSerieScreen from './src/screens/AddSerieScreen';
import ImageSelectorScreen from './src/screens/ImageSelectorScreen';

/// Importamos el context
import { Context } from './src/controllers/context';

// Stack de ReactNavigation
const Stack = createNativeStackNavigator();

// Aplicacion Principal
export default function App() {

  // Estado para administrar los mensajes
  // - text = texto
  // - display = si se muestra o no el mensaje
  // - type = Si es true un ganchito verde, si es false X roja
  const [msg, setMsg] = useState({
    text: 'Error',
    display: false,
    type: true,
  })

  // Estado con los datos del usuario 
  const [user, setUser] = useState({
    username: '',
    email: '',
    admin: false,
    id: '',
    profile_pic: ''
  })

  // Estado para mostrar o no la pantalla de carga
  const [load, setLoad] = useState(false)


  return (

    // En Context.Provider value= se envian todos los datos que se quieren acceder del context
    // En este caso se envian todos, y pueden ser accedidos en cualquier pantalla si se llama al hook useContext(Context)  src/controller/context.jsx
    <Context.Provider value={{
      msg,
      setMsg,
      user,
      setUser,
      load,
      setLoad
    }} >
      <NavigationContainer>
        <Stack.Navigator
          // Eliminar la abarra de estado del tlf (bateria,señal, notificaciones...)
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
          {/* Se elimino la pantalla de notificaciones por falta de tiempo */}
          <Stack.Screen name="Notify" component={NotificationScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Serie" component={SerieScreen} />
          <Stack.Screen name="Cap" component={CapScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="AddCap" component={AddCapScreen} />
          <Stack.Screen name="AddSerie" component={AddSerieScreen} />
          <Stack.Screen name="ImageSelector" component={ImageSelectorScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Context.Provider>
  )
}
