import { View, Text, TouchableOpacity, TextInput, Image, ScrollView } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'

// Extraer componentes
import styles from '../sass/addSerieScreen.sass';
import thumb from '../assets/imgThumb.png'
import { Msg } from '../components/Msg'
import { ArrowLeft } from '../components/Icons'
import { addSerie, editSerie } from '../controllers/api';
import { Context } from '../controllers/context';

const thumbUri = "https://res.cloudinary.com/comicseries/image/upload/v1649827898/imgThumb_svogrq.png"

// Componente principal
const AddSerieScreen = ({ navigation, route }) => {

    // Extraer contenido del Context
    const { user, setMsg, setLoad } = useContext(Context)


    // Estado con los datos de la serie que se añadirá
    const [inputs, setInputs] = useState({
        title: 'titleee',
        description: 'desc',
        image: {
            name: 'randomname.jpg',
            uri: thumbUri,
            type: 'image/jpg'
        },
        ownerId: user.id
    })

    // Estado para saber si se esta editando la serie o no
    const [edit, setEdit] = useState(false)


    // useEffect que se ejecuta cada vez que el route cambia
    useEffect(() => {

        // Si el route.params no esta vacio, continua
        if (typeof route.params === 'object') {

            // Si route.params tiene data previa (se esta editando) continua
            if (route.params.prevData !== undefined) {

                // El estado para reconocer que se esta editando la serie
                setEdit(true)

                // Extraer los datos de la serie y copiarlos en el estado correspondiente 
                const { title, description, picture, picture_public_id } = route.params.prevData
                setInputs({
                    ...inputs, title, description, image: {
                        name: 'randomname.jpg',
                        type: 'image/jpg',
                        uri: picture,
                    }, id: picture_public_id
                })
            }

            // Si params.upload tiene una imagen, guardala en su respectivo estado
            if (route.params.upload !== undefined) {
                setInputs({ ...inputs, image: route.params.upload[0] })
            }
        }
    }, [route])

    // Funcion para administrar el input
    const inputChange = (name, data) => setInputs({ ...inputs, [name]: data });


    // Funcion para crear o editar serie
    const btnAddSerie = async () => {
        // Si alguno de los campos esta vacion lanza mensaje
        if (inputs.image.uri === thumbUri || inputs.title === '' || inputs.description === '') {
            setMsg({
                text: 'Por favor complete todos los campos antes de continuar',
                display: true,
                type: false,
            })
            // Si los campos estan completos continua
        } else {

            // Si se esta editando la serie
            if (edit) {
                // Coloca la variable edit en falso
                setEdit(false)

                // Desactiva la pantalla de carga
                setLoad(true)

                // Peticion para editar serie
                const res = await editSerie({ ...inputs })

                // Si todo salio bien
                if (res.status === 200) {
                    setLoad(false)
                    setMsg({
                        text: 'Serie editada con éxito!',
                        display: true,
                        type: true,
                    })
                    navigation.navigate('Profile', { id: user.id })

                    // En caso de error
                } else {
                    setLoad(false)
                    console.log(res.status);
                    return setMsg({
                        text: res.data.msg,
                        display: true,
                        type: false,
                    })
                }

                // En caso de que la serie no se este editando
            } else {
                setLoad(true)
                const res = await addSerie(inputs)
                if (res.status === 200) {
                    setLoad(false)
                    setMsg({
                        text: 'Serie creada con éxito!',
                        display: true,
                        type: true,
                    })
                    navigation.navigate('Profile', { id: user.id })
                } else {
                    setLoad(false)
                    return setMsg({
                        text: res.data.msg,
                        display: true,
                        type: false,
                    })
                }
            }
        }

    }

    // Funcion para regresar y borrar los datos de inputs
    const onPressBack = () => {
        setInputs({
            title: '',
            description: '',
            image: thumb,
        })
        navigation.goBack()
    }

    // Funcion para ir a seleccionar las imagenes
    const selectImage = () => {
        navigation.navigate('ImageSelector', { amount: 1, goTo: 'AddSerie' })
    }

    return (
        <View style={styles.container_g} >
            <Msg />
            <View style={styles.top_bar} >
                <ArrowLeft onPress={onPressBack} />
            </View>
            <ScrollView style={styles.content} >
                <TextInput
                    style={styles.content_title}
                    onChangeText={(text) => { inputChange('title', text) }}
                    value={inputs.title}
                    placeholder="Titulo..."
                    placeholderTextColor="#c4c4c4"
                />
                <View style={styles.borderbottom} ></View>
                <TouchableOpacity onPress={selectImage} style={styles.content_image_container}>
                    <Image
                        resizeMode='contain'
                        style={styles.content_image}
                        source={{ uri: inputs.image.uri }}
                    />
                </TouchableOpacity>
                <TextInput
                    multiline={true}
                    style={styles.content_description}
                    placeholder='Description...'
                    placeholderTextColor='#c4c4c4'
                    value={inputs.description}
                    onChangeText={(text) => { inputChange('description', text) }}
                />
                <View style={styles.borderbottom} ></View>
                <TouchableOpacity style={styles.content_btn} onPress={btnAddSerie} >
                    <Text style={{ color: '#eee' }} >Create Serie</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}

export default AddSerieScreen