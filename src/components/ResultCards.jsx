import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import styles from '../sass/searchScreen.sass';
import { useNavigation } from '@react-navigation/native';


export default function ResultCards({ data }) {

  // useNavigation nos permite acceder a la navegacion de ReactNavigation sin ser un componente principal
  const navigation = useNavigation()

  return (
    <View style={styles.resultContainer} >

      {/* FlatList con las series */}
      <FlatList
        numColumns={2}
        data={data}
        renderItem={({ item }) => <Card item={item} navigation={navigation} />}
        keyExtractor={item => item.id}
        columnWrapperStyle={{ flex: 1, justifyContent: "space-around" }}
      />
    </View>
  )
}

// Componente de tarjeta para cada serie 
const Card = ({ item, navigation }) => {
  return (
    <TouchableOpacity style={styles.resultCard} onPress={() => {
      navigation.navigate('Serie', { id: item.picture_public_id })
    }}  >
      <Image source={{ uri: item.picture }} style={styles.resultCard_image} />
      <Text style={[styles.resultCard_text, { color: '#eee' }]} >{item.title}</Text>
    </TouchableOpacity>
  )
}