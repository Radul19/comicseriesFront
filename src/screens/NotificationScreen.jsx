import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import styles from '../sass/notifyScreen.sass';
import { Cross } from '../components/Icons'
import cover1 from '../assets/cover1.png'
import cover2 from '../assets/cover2.png'
import cover3 from '../assets/cover3.png'
import cover4 from '../assets/cover4.png'


export default function NotificationScreen({ navigation }) {

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
    }
        , {
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
    }
    ]

    return (
        <View style={styles.g_container} >
            <View style={styles.top}>
                <Text style={styles.top_text} >Notifications</Text>
                <Cross onPress={() => { navigation.goBack() }} />
            </View>
            <View style={styles.notify_container} >
                <FlatList
                    data={arr}
                    renderItem={NotifyCard}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.flat_list}
                />
            </View>
        </View>
    )
}

const NotifyCard = ({ item }) => {

    return (
        <View style={styles.notify_card} >
            <Image source={item.image} style={styles.notify_card_image}></Image>
            <View style={styles.text_container}>
                <Text style={styles.text_container_date} >xxx-xxx-xxx</Text>
                <Text style={styles.text_container_text} >{item.name} ha subido un nuevo capitulo!</Text>

            </View>
        </View>
    )
}