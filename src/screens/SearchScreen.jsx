import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'

// Componentes Extraidos
import styles from '../sass/searchScreen.sass';
import ResultCards from '../components/ResultCards';
import { Door } from '../components/Icons'
import { Msg } from '../components/Msg';
import { Context } from '../controllers/context';
import { searchSeries } from '../controllers/api.js'

// constante con el url de la previa para cualquier imagen
const thumbUri = "https://res.cloudinary.com/comicseries/image/upload/v1649827898/imgThumb_svogrq.png"


// Componente
export default function SearchScreen({ navigation }) {

    // Estado con el input de la SearchBar
    const [input, setInput] = useState('')

    // Extraer los datos del usuario logeado mediante el Context
    const { user, setMsg } = useContext(Context)

    // Datos con todas las series encontradas
    const [seriesData, setSeriesData] = useState([])


    // useEffect que es ejecutado cada vez que el input cambia
    useEffect(() => {

        // Se hace una funcion async 'fantasma' para poder ejecutar peticiones fetch y buscar datos en la BD
        (async () => {
            // Buscar series mediante el texto del input
            const res = await searchSeries(input)
            if (res.status === 200) {
                // Si se encuentran series insertarlas en el useState
                setSeriesData(res.data.data)
            } else {

                // -- Lanzar un mensaje de error si no se encuentra serie, pienso que es innecesario y lo comenté

                // setMsg({
                //     text: 'No se ha encotrado las serie que busca',
                //     display: true,
                //     type: false,
                // })
            }
        })()
    }, [input])

    // useEffect que se ejecuta cuando se carga el componente por primera vez
    useEffect(() => {

        // Funcion Fantasma async
        (async () => {
            // Se envia como texto '_' para poder buscar todas las series
            const res = await searchSeries("_")

            // Si se encuentran series guardalas en el useState
            if (res.status === 200) {
                setSeriesData(res.data.data)
            } else {
                // -- Lanzar un mensaje de error si no se encuentra serie, pienso que es innecesario y lo comenté

                // setMsg({
                //     text: 'No se ha encotrado las serie que busca',
                //     display: true,
                //     type: false,
                // })
            }
        })()
    }, [])





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


            <TextInput onChange={setInput} value={input} placeholder='Search something...' style={styles.search_bar} />
            <Text style={styles.result_text} >Results: </Text>

            {/* Componente con los resultados de busqueda */}
            <ResultCards data={seriesData} />
        </View>
    )
}