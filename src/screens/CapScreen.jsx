import { View, Text, TouchableOpacity, Image, Dimensions, Share } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import styles from '../sass/capScreen.sass';
import thumb from '../assets/imgThumb.png'
import manga from '../assets/manga.png'
import ImageZoom from 'react-native-image-pan-zoom';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import Swipeable from 'react-native-gesture-handler/Swipeable';

const thumbUri = "https://res.cloudinary.com/comicseries/image/upload/v1649827898/imgThumb_svogrq.png"

import { Gear, Star, ShareIcon, ArrowLeft, ArrowRight } from '../components/Icons'
import { Context } from '../controllers/context';
import { getCap } from '../controllers/api';
import Load from '../components/Load';
import { Msg } from '../components/Msg';



const CapScreen = ({ navigation, route }) => {

    const { user, setLoad, setMsg } = useContext(Context)

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

    const [star, setStar] = useState(false)
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
    const [index, setIndex] = useState(0)

    // console.log(route.params.item);

    useEffect(() => {
        (async () => {
            if (route.params.serieId !== undefined && route.params.cap !== undefined) {
                setLoad(true)
                // console.log(route.params);   
                const res = await getCap(route.params.serieId, route.params.cap)
                if (res.status === 200) {
                    setLoad(false)
                    setIndex(route.params.index)
                    await storeCapMemory(index + 1)
                    console.log(res.data);
                    setCapData({ images: res.data.images, cap: route.params.cap, title: res.data.title })
                } else {
                    setLoad(false)
                    setMsg({
                        text: res.data.msg,
                        display: true,
                        type: false,
                    })
                }
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

    const nextPage = async () => {
        if (capData.images.length > index + 1) {
            await storeCapMemory(index + 1)
            setIndex(prev => prev + 1)
        }
    }
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

    const storeCapMemory = async (page) => {
        try {
            console.log(page);
            const jsonValue = JSON.stringify({ serieId: route.params.serieId, cap: route.params.cap, index: page })
            await AsyncStorage.setItem(`@user:${user.id}_capMemory`, jsonValue)
        } catch (e) {
            // saving error
        }
    }

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
                    {/* <Gear onPress={() => { console.log(capData) }} /> */}
                    <ShareIcon onPress={onShare} />
                </View>
            </View>
            <View style={styles.content} >
                {/* <Image source={thumb} style={styles.content_image} /> */}

                <ImageZoom cropWidth={(Dimensions.get('window').width * 1)}
                    cropHeight={(Dimensions.get('window').height * 0.75)}
                    imageWidth={(Dimensions.get('window').width * 0.7)}
                    imageHeight={(Dimensions.get('window').width * 1)}>
                    <Image style={styles.content_image}
                        source={{ uri: capData.images[index] === undefined ? thumbUri : capData.images[index].url }} />
                    {/* source={{ uri: '' }} /> */}
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