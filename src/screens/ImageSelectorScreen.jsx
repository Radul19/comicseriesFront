import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState, useContext } from 'react'
import styles from '../sass/imageSelector.sass';


import * as ImageManipulator from 'expo-image-manipulator';
import ImageBrowser from '../components/TestMultiple/ImageBrowser';
import { Msg } from '../components/Msg';
import { Context } from '../controllers/context';

const ImageSelectorScreen = ({ navigation, route }) => {


    // Funciones nativas del componente
    // - Compresor de imagen
    const processImageAsync = async (uri) => {
        const file = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 1000 } }],
            { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
        );
        return file;
    };
    // - Callback para almacenar cada imagen seleccionada en una variable
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
            setUpload(cPhotos)
        })
            .catch((e) => console.log(e));
    }

    // Extraer de context
    const { setMsg } = useContext(Context)

    // Contador de imagenes seleccioandas
    const [count, setCount] = useState(0)

    // Estado con todas las imagenes seleccionadas
    const [upload, setUpload] = useState(null)


    // funcion para subir imagenes al State
    const onChangeImage = (num, onSubmit) => {
        setCount(num)
        if (num > 0) {
            setUpload(onSubmit)
        } else {
            setUpload(null)
        }
    }


    // Funcion de btn para enviar las imagenes seleccionadas a la pagina correspondiente
    const done = () => {

        // Si uploads es undefined , las imagenes o se estan subiendo o no se han subido
        if (upload !== undefined) {
            if (route.params.amount == upload.length) {
                navigation.navigate(route.params.goTo, { upload })
            }

            // Lanza error
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
                {/* TopBar */}
                <Text style={{ color: "#eee" }} >Imagenes seleccionadas {count}</Text>
                <TouchableOpacity style={styles.header_done} onPress={done} >
                    <Text style={{ color: "#eee" }} >Listo</Text>
                </TouchableOpacity>
            </View>

            {/* Componente Image Browser */}
            <View style={styles.image_display} >
                <ImageBrowser
                    max={route.params.amount}
                    onChange={onChangeImage}
                    callback={imageCallback}

                />
            </View>
        </View>
    )
}

export default ImageSelectorScreen