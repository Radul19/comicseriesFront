import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState, useContext } from 'react'
import styles from '../sass/imageSelector.sass';
// import ImagesPicker from '../components/ImagesPicker';
// import * as ImagePicker from 'expo-image-picker';

import * as ImageManipulator from 'expo-image-manipulator';
import ImageBrowser from '../components/TestMultiple/ImageBrowser';
import { Msg } from '../components/Msg';
import { Context } from '../controllers/context';

const ImageSelectorScreen = ({ navigation, route }) => {

    const { setMsg } = useContext(Context)

    const [count, setCount] = useState(0)
    const [upload, setUpload] = useState(null)

    const processImageAsync = async (uri) => {
        const file = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 1000 } }],
            { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
        );
        return file;
    };

    const imageCallback = (callback) => {
        callback.then(async (photos) => {
            const cPhotos = [];
            let num = 0
            for (let photo of photos) {
                const pPhoto = await processImageAsync(photo.uri);
                cPhotos.push({
                    uri: pPhoto.uri,
                    name: `${num}`,
                    type: 'image/jpg',
                })
                num++
            }
            // navigation.navigate('Main', { photos: cPhotos });
            setUpload(cPhotos)
            // console.log(cPhotos);
            // console.log('\\\\\\\\\\\\');
        })
            .catch((e) => console.log(e));
    }

    const onChangeImage = (num, onSubmit) => {
        // console.log(onSubmit());
        // console.log('//////////');
        setCount(num)
        if (num > 0) {
            setUpload(onSubmit)
        } else {
            setUpload(null)
        }
    }


    const done = () => {
        if (upload !== undefined) {
            if (route.params.amount == upload.length) {
                navigation.navigate(route.params.goTo, { upload })
            }
        } else {
            setMsg({
                text: 'Las imagenes se estan almacenando, intente nuevamente en unos segundos',
                display: true,
                type: false,
            })
        }
    }

    return (
        <View style={{ flex: 1 }} >
            <Msg />
            <View style={styles.header} >
                <Text style={{ color: "#eee" }} >Imagenes seleccionadas {count}</Text>
                <TouchableOpacity style={styles.header_done} onPress={done} >
                    <Text style={{ color: "#eee" }} >Listo</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.image_display} >
                <ImageBrowser
                    max={route.params.amount}
                    // onChange={(num, onSubmit) => {
                    //     console.log(num)
                    //     console.log(onSubmit())
                    // }}
                    onChange={onChangeImage}
                    callback={imageCallback}

                />
            </View>
        </View>
    )
}

export default ImageSelectorScreen