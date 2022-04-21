import { View, Text, TouchableOpacity, Image, Dimensions, Share } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import styles from '../sass/capScreen.sass';
import ImageZoom from 'react-native-image-pan-zoom';
import AsyncStorage from '@react-native-async-storage/async-storage';


// Extraer Componente
import { Star, ShareIcon, ArrowLeft, ArrowRight } from '../components/Icons'
import { Context } from '../controllers/context';
import { getCap } from '../controllers/api';
import Load from '../components/Load';
import { Msg } from '../components/Msg';


const thumbUri = "https://res.cloudinary.com/comicseries/image/upload/v1649827898/imgThumb_svogrq.png"

// Componente principal
const CapScreen = ({ navigation, route }) => {

    // Extraer de Contex
    const { user, setLoad, setMsg } = useContext(Context)

    // Btn de compartir, solo el mensaje que se envia a cualquier red social o app, y se incluye el URL de la imagen del capitulo que se esta viendo
    const onShare = async () => {
        try {
            const result = await Share.share({
                message: `Mira el capitulo ${capData.cap} de ${capData.title} desde ComicSeries!!! ${capData.images[index].url} `,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };

    // Estado para alternar la estrella pero sin uso
    const [star, setStar] = useState(false)

    // Datos del capitulo
    const [capData, setCapData] = useState({
        cap: 0,
        title: '',
        images: [
            [{
                url: ''
            }]
        ],
        comments: {},
    })

    // Index de la imagen del capitulo
    const [index, setIndex] = useState(0)

    // useEffect que se ejecuta cada que cambia la ruta
    useEffect(() => {

        // Funcion fantasma async
        (async () => {

            // Si se encuentra un ID de serie y Cap en el Route.Params continua
            if (route.params.serieId !== undefined && route.params.cap !== undefined) {
                // Pantalla de carga
                setLoad(true)

                // Pide el capitulo con el ID y el numero del Cap
                const res = await getCap(route.params.serieId, route.params.cap)

                // Si se encontró el capitulo
                if (res.status === 200) {
                    // Desactivar la pantalla de carga
                    setLoad(false)

                    // Coloca el index de la pagina
                    setIndex(route.params.index)

                    // Almacena el capitulo en el LocalStorage
                    await storeCapMemory(index + 1)


                    setCapData({ images: res.data.images, cap: route.params.cap, title: res.data.title })

                    // Caso contrario
                } else {
                    setLoad(false)
                    setMsg({
                        text: res.data.msg,
                        display: true,
                        type: false,
                    })
                }

                // Si no , lanza error
            } else {
                setLoad(false)
                setMsg({
                    text: 'No se reconoce el capitulo al que intenta acceder.',
                    display: true,
                    type: false,
                })
            }


        })()


    }, [route])


    // Funcion/Boton para cambiar de pagina
    const nextPage = async () => {
        if (capData.images.length > index + 1) {
            await storeCapMemory(index + 1)
            setIndex(prev => prev + 1)
        }
    }

    // Funcion/Boton para cambiar de pagina
    const prevPage = async () => {
        if (index > 0) {
            await storeCapMemory(index - 1)
            setIndex(prev => prev - 1)
            try {
                const value = await AsyncStorage.getItem(`@user:${user.id}_capMemory`)
                if (value !== null) {
                    console.log(value);
                }
            } catch (e) {
                // error reading value
            }
        }
    }

    // Funcion para almacenar en el LocalStorage el capitulo en el que se quedó
    // -- Tomar en cuenta que el usuario que se registrará sera @guest en caso de ser invitado
    const storeCapMemory = async (page) => {
        try {
            // Almacena la informacion como String
            const jsonValue = JSON.stringify({ serieId: route.params.serieId, cap: route.params.cap, index: page })
            await AsyncStorage.setItem(`@user:${user.id}_capMemory`, jsonValue)
        } catch (e) {
            console.log(e)
        }
    }

    // Si se sale del capitulo de forma normal, la info en el LocalStorage queda vacio
    const cleanCapMemory = async () => {
        try {
            const jsonValue = JSON.stringify({ serieId: '', cap: '', index: '' })
            await AsyncStorage.setItem(`@user:${user.id}_capMemory`, jsonValue)
            navigation.navigate('Serie', { id: route.params.serieId })
        } catch (e) {
            // saving error
        }
    }

    return (
        <View style={styles.g_container} >
            <Msg />
            <Load />
            <View style={styles.top_bar} >
                <View style={styles.top_bar_left} >
                    <ArrowLeft onPress={cleanCapMemory} />
                </View>
                <View style={styles.top_bar_center} >
                    <Text style={{ fontSize: 16, color: '#eee' }} >Capitulo {`${JSON.stringify(capData.cap)}`}</Text>
                </View>
                <View style={styles.top_bar_right} >
                    {user.id !== '@guest' || user.admin ?
                        <Star fill={star} onPress={() => {
                            console.log(capData)
                            setStar(!star)
                        }} />
                        : null}
                    <ShareIcon onPress={onShare} />
                </View>
            </View>
            <View style={styles.content} >

                <ImageZoom cropWidth={(Dimensions.get('window').width * 1)}
                    cropHeight={(Dimensions.get('window').height * 0.75)}
                    imageWidth={(Dimensions.get('window').width * 0.7)}
                    imageHeight={(Dimensions.get('window').width * 1)}>
                    <Image style={styles.content_image}
                        source={{ uri: capData.images[index] === undefined ? thumbUri : capData.images[index].url }} />

                </ImageZoom>

            </View>
            <View style={styles.bottom_bar} >
                <View style={styles.bottom_bar_left} >
                    <ArrowRight color='#b55829' onPress={prevPage} />
                </View>
                <View style={styles.bottom_bar_center} >
                    <Text style={{ fontSize: 20, color: '#eee' }} >{index + 1}</Text>
                    <Text style={{ color: '#ffffff95' }} >Page Number</Text>
                </View>
                <View style={styles.bottom_bar_right} >
                    <ArrowRight color='#b55829' onPress={nextPage} />
                </View>
            </View>
        </View>
    )
}

export default CapScreen