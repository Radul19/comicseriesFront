import React, { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './src/screens/LoginScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchScreen from './src/screens/SearchScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import SerieScreen from './src/screens/SerieScreen';
import CapScreen from './src/screens/CapScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AddCapScreen from './src/screens/AddCapScreen';
import AddSerieScreen from './src/screens/AddSerieScreen';
import ImageSelectorScreen from './src/screens/ImageSelectorScreen';


import { Context } from './src/controllers/context';


const Stack = createNativeStackNavigator();


export default function App() {
  const [msg, setMsg] = useState({
    text: 'Error',
    display: false,
    type: true,
  })


  const [user, setUser] = useState({
    username: '',
    email: '',
    admin: false,
    id: '',
    profile_pic: ''
  })


  const [load, setLoad] = useState(false)


  return (



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

          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
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
