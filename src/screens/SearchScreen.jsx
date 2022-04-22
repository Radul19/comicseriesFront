import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'


import styles from '../sass/searchScreen.sass';
import ResultCards from '../components/ResultCards';
import { Door } from '../components/Icons'
import { Msg } from '../components/Msg';
import { Context } from '../controllers/context';
import { searchSeries } from '../controllers/api.js'


const thumbUri = "https://res.cloudinary.com/comicseries/image/upload/v1649827898/imgThumb_svogrq.png"



export default function SearchScreen({ navigation, route }) {


    const [input, setInput] = useState('')


    const { user, setMsg } = useContext(Context)


    const [seriesData, setSeriesData] = useState([])



    useEffect(() => {


        (async () => {

            let res
            if (input === "") {
                res = await searchSeries("_")
            } else {
                res = await searchSeries(input)
            }
            if (res.status === 200) {
                console.log(res.data.data);

                setSeriesData(res.data.data)
            }
        })()
    }, [input])


    useEffect(() => {


        (async () => {

            const res = await searchSeries("_")


            if (res.status === 200) {
                setSeriesData(res.data.data)
            }
        })()
    }, [route])

    return (
        <View style={styles.g_container} >
            <Msg />
            {/* TOP BAR */}
            <View style={styles.top_bar} >
                {/* Si el usuario es invitado solo muestra el icono para cerrar sesion */}
                {user.id !== '@guest' ?
                    <>
                        <TouchableOpacity style={styles.top_bar_user} onPress={() => { navigation.navigate('Profile', { id: user.id }) }} >
                            <Image
                                style={styles.image}
                                source={{ uri: user.picture }}
                            />
                            <Text style={styles.top_bar_user_text}>{user.username}</Text>
                        </TouchableOpacity>
                    </>
                    : <>
                        <View style={styles.blankSpace} ></View>
                        <Door />
                    </>}

            </View>


            <TextInput onChangeText={setInput} value={input} placeholder='Search something...' style={styles.search_bar} />
            <Text style={styles.result_text} >Results: </Text>

            {/* Componente con los resultados de busqueda */}
            <ResultCards data={seriesData} />
        </View>
    )
}