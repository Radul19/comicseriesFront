import { SafeAreaView, View, Text, Image, FlatList, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import styles from '../sass/searchScreen.sass';
import cover1 from '../assets/cover1.png'
import cover2 from '../assets/cover2.png'
import cover3 from '../assets/cover3.png'
import cover4 from '../assets/cover4.png'
import { useNavigation } from '@react-navigation/native';


export default function ResultCards({ data }) {
  const navigation = useNavigation()

  const arr = [{
    name: 'Black Clover',
    image: cover1,
    id: 1
  }, {
    name: 'Boku no Hero Academia',
    image: cover2,
    id: 2
  }, {
    name: 'Dr. Stone',
    image: cover3,
    id: 3
  }, {
    name: 'Jujutsu Kaisen',
    image: cover4,
    id: 4
  }, {
    name: 'Black Clover',
    image: cover1,
    id: 5
  }, {
    name: 'Boku no Hero Academia',
    image: cover2,
    id: 6
  }, {
    name: 'Dr. Stone',
    image: cover3,
    id: 7
  }, {
    name: 'Jujutsu Kaisen',
    image: cover4,
    id: 8
  }]

  return (
    <View style={styles.resultContainer} >
      {/* <ScrollView style={styles.scrollview} contentContainerStyle={styles.scrollview_container}>
        {arr.map(item =>
          <Card key={item.id} name={item.name} image={item.image} />
        )}
      </ScrollView> */}
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