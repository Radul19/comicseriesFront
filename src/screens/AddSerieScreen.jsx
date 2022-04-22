import { View, Text, TouchableOpacity, TextInput, Image, ScrollView } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'


import styles from '../sass/addSerieScreen.sass';
import thumb from '../assets/imgThumb.png'
import { Msg } from '../components/Msg'
import { ArrowLeft } from '../components/Icons'
import { addSerie, editSerie } from '../controllers/api';
import { Context } from '../controllers/context';

const thumbUri = "https://res.cloudinary.com/comicseries/image/upload/v1649827898/imgThumb_svogrq.png"


const AddSerieScreen = ({ navigation, route }) => {


    const { user, setMsg, setLoad } = useContext(Context)



    const [inputs, setInputs] = useState({
        title: '',
        description: '',
        image: {
            name: 'randomname.jpg',
            uri: thumbUri,
            type: 'image/jpg'
        },
        ownerId: user.id
    })


    const [edit, setEdit] = useState(false)



    useEffect(() => {


        if (typeof route.params === 'object') {


            if (route.params.prevData !== undefined) {

                setEdit(true)
                const { title, description, picture, picture_public_id } = route.params.prevData
                setInputs({
                    ...inputs, title, description, image: {
                        name: 'randomname.jpg',
                        type: 'image/jpg',
                        uri: picture,
                    }, id: picture_public_id
                })
            }


            if (route.params.upload !== undefined) {
                setInputs({ ...inputs, image: route.params.upload[0] })
            }
        }
    }, [route])


    const inputChange = (name, data) => setInputs({ ...inputs, [name]: data });



    const btnAddSerie = async () => {

        if (inputs.image.uri === thumbUri || inputs.title === '' || inputs.description === '') {
            setMsg({
                text: 'Por favor complete todos los campos antes de continuar',
                display: true,
                type: false,
            })

        } else {


            if (edit) {

                setEdit(false)


                setLoad(true)


                const res = await editSerie({ ...inputs })


                if (res.status === 200) {
                    setLoad(false)
                    setMsg({
                        text: 'Serie editada con éxito!',
                        display: true,
                        type: true,
                    })
                    navigation.navigate('Profile', { id: user.id })


                } else {
                    setLoad(false)
                    console.log(res.status);
                    return setMsg({
                        text: res.data.msg,
                        display: true,
                        type: false,
                    })
                }


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


    const onPressBack = () => {
        setInputs({
            title: '',
            description: '',
            image: thumb,
        })
        navigation.goBack()
    }


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
                    placeholder="Title..."
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
                    <Text style={{ color: '#eee' }} >{edit ? "Editar " : 'Crear '}Serie</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}

export default AddSerieScreen