import { View, Text, TextInput, TouchableOpacity, FlatList, Image } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'

// Extraer componentes
import styles from '../sass/addCapScreen.sass';
import { ArrowLeft } from '../components/Icons'
import { Context } from '../controllers/context';
import { Msg } from '../components/Msg';
import { uploadCaps, editCap } from '../controllers/api';
import Load from '../components/Load'

// Componente principal
const AddCapScreen = ({ navigation, route }) => {


    // Extraer datos del Context
    const { setMsg, setLoad } = useContext(Context)


    // Estado para Imagenes
    const [images, setImages] = useState([])
    // Estado para el numero del capitulo
    const [capNum, setCapNum] = useState('0')
    // Estado para Cantidad de imagenes que tendra el capitulo
    const [amount, setAmount] = useState('3')
    // Id de la serie
    const [id, setId] = useState('')
    // Estado para evaluar si el cap se esta editando o no
    const [edit, setEdit] = useState(false)

    // Funcion regex para solo aceptar numeros en el input de Cantidad de capitulos
    const regexNumber = /^[0-9]*$/

    // funcion para cambiar la cantidad de capitulos y evaluar el Regex
    const changeAmount = (text) => {
        const num = parseInt(text)
        if (regexNumber.test(text)) {
            setAmount(text)
        } else {
            setMsg({
                text: 'Por favor inserte solo numeros',
                display: true,
                type: false,
            })
        }
    }

    // Funcion para ir a la pantalla de seleccion de imagenes
    const selectImages = () => {
        const num = parseInt(amount)
        if (num >= 1 && num <= 100) {
            // setImages([])
            navigation.navigate('ImageSelector', { amount, goTo: 'AddCap' })
        } else {
            setMsg({
                text: 'Por favor inserte un numero entre 1 y 100',
                display: true,
                type: false,
            })
        }
    }

    // useEffect para definir los estados dependiendo si existe o no los parametros en la ruta
    useEffect(() => {

        if (route.params.cap !== undefined) {
            setCapNum(route.params.cap + 1)
        }
        if (route.params.upload !== undefined) {
            setImages(route.params.upload)
        }
        if (route.params.id !== undefined) {
            setId(route.params.id)
        }
        if (route.params.edit !== undefined) {
            setEdit(true)
        }

    }, [route])


    // Boton para subir capitulos
    const btnUploadCap = async () => {

        // Mientras la cantidad de imagenes no sean iguales a 0
        if (images.length > 0) {

            // Activar pantalla de carga
            setLoad(true)

            // Si el capitulo se esta editanto
            if (edit) {

                // Peticion para editar
                const res = await editCap(id, images, capNum)

                // Si todo salio bien
                if (res.status === 200) {

                    // Desactivar pantalla de carga con mensaje y redireccionar a la serie
                    setLoad(false)
                    setMsg({
                        text: 'Capitulo editado satisfacctoriamente!',
                        display: true,
                        type: true,
                    })
                    navigation.navigate('Serie', { id })

                    // Caso de error
                } else {
                    setLoad(false)
                    setMsg({
                        text: 'Ha ocurrido un error al editar el capitulo, intentar nuevamente',
                        display: true,
                        type: false,
                    })
                }

                // Si el capitulo se sube por primera vez
            } else {

                // Peticion para subir cap
                const res = await uploadCaps(id, images)

                // Si todo salio bien
                if (res.status === 200) {
                    setLoad(false)
                    setMsg({
                        text: 'Capitulo creado satisfacctoriamente!',
                        display: true,
                        type: true,
                    })
                    navigation.navigate('Serie', { id })

                    // En caso de error
                } else {
                    setLoad(false)
                    setMsg({
                        text: 'Ha ocurrido un error al subir el capitulo, intentar nuevamente',
                        display: true,
                        type: false,
                    })
                }
            }
        }
    }

    return (
        <View style={styles.container_g} >
            {/* Componentes mensaje y load */}
            <Msg />
            <Load />
            <View style={styles.top_bar} >
                <View style={styles.back}>

                    {/* Componente arrowLeft para volver a la serie correspondiente del capitulo */}
                    <ArrowLeft onPress={() => {
                        setEdit(false)
                        navigation.navigate('Serie', { id })
                    }} />
                </View>
            </View>
            <View style={styles.top_content} >
                <Text style={styles.top_content_cap} >{edit ? 'Editar ' : null}Capitulo {capNum}</Text>
                <View style={styles.top_content_inputCtn} >
                    <Text style={{ color: "#eee" }} >Numero de paginas</Text>
                    <TextInput
                        style={styles.top_content_input}
                        placeholder='01'
                        value={amount}
                        keyboardType="numeric"
                        onChangeText={(text) => { changeAmount(text) }}
                    />
                </View>
                <View style={styles.top_content_btnCtn} >
                    <Text style={styles.top_content_prevtext} >Previsualizacion:</Text>
                    <TouchableOpacity style={styles.selectImages_btn} onPress={selectImages} >
                        <Text style={{ color: '#eee' }} >Seleccionar Imagenes</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.middle_content}>
                {/* Flatlist donde se muestran todas las imagenes seleccionadas */}
                <FlatList
                    numColumns={4}
                    data={images}
                    renderItem={({ item, index }) => <PreviewCard item={item} navigation={navigation} index={index} />}
                    keyExtractor={item => item.name}
                    columnWrapperStyle={{ flex: 1, justifyContent: "space-around" }}
                />
            </View>
            <View style={styles.bottom_content} >
                <TouchableOpacity style={styles.upload_btn} onPress={btnUploadCap} >
                    <Text style={{ color: '#eee', fontSize: 16 }} >{edit ? 'Editar ' : "Subir "}Capitulo</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}

const PreviewCard = ({ item, index }) => {
    return (
        <View style={styles.preview_card} >
            <Image
                resizeMode='contain'
                style={styles.preview_image}
                source={{ uri: item.uri }}
            />
            <Text style={styles.preview_text} >{index + 1}</Text>
        </View>
    )
}

export default AddCapScreen