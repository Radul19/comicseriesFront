import { View, Text, TextInput, TouchableOpacity, FlatList, Image } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import styles from '../sass/addCapScreen.sass';
import { ArrowLeft } from '../components/Icons'
import { Context } from '../controllers/context';
import { Msg } from '../components/Msg';
import { uploadCaps, editCap } from '../controllers/api';
import Load from '../components/Load'


const AddCapScreen = ({ navigation, route }) => {

    const { setMsg, setLoad } = useContext(Context)

    const [images, setImages] = useState([])
    const [capNum, setCapNum] = useState('0')
    const [amount, setAmount] = useState('3')
    const [id, setId] = useState('')
    const [edit, setEdit] = useState(false)

    const regexNumber = /^[0-9]*$/
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

    const btnUploadCap = async () => {
        if (images.length > 0) {
            setLoad(true)
            if (edit) {
                const res = await editCap(id, images, capNum)
                if (res.status === 200) {
                    setLoad(false)
                    setMsg({
                        text: 'Capitulo editado satisfacctoriamente!',
                        display: true,
                        type: true,
                    })
                    navigation.navigate('Serie', { id })
                } else {
                    setLoad(false)
                    setMsg({
                        text: 'Ha ocurrido un error al editar el capitulo, intentar nuevamente',
                        display: true,
                        type: false,
                    })
                }
            } else {
                const res = await uploadCaps(id, images)
                if (res.status === 200) {
                    setLoad(false)
                    setMsg({
                        text: 'Capitulo creado satisfacctoriamente!',
                        display: true,
                        type: true,
                    })
                    navigation.navigate('Serie', { id })
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

    const arr = [{
        name: 'Black Clover',
        uri: 'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540radulito19%252Fcomicseries/ImageManipulator/1e110350-e30b-4a18-8664-7e7681f04700.jpg',
        id: 1
    }, {
        name: 'Boku no Hero Academia',
        uri: 'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540radulito19%252Fcomicseries/ImageManipulator/1e110350-e30b-4a18-8664-7e7681f04700.jpg',
        id: 2
    }, {
        name: 'Dr. Stone',
        uri: 'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540radulito19%252Fcomicseries/ImageManipulator/1e110350-e30b-4a18-8664-7e7681f04700.jpg',
        id: 3
    }, {
        name: 'Jujutsu Kaisen',
        uri: 'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540radulito19%252Fcomicseries/ImageManipulator/1e110350-e30b-4a18-8664-7e7681f04700.jpg',
        id: 4
    }, {
        name: 'Black Clover',
        uri: 'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540radulito19%252Fcomicseries/ImageManipulator/1e110350-e30b-4a18-8664-7e7681f04700.jpg',
        id: 5
    }, {
        name: 'Boku no Hero Academia',
        uri: 'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540radulito19%252Fcomicseries/ImageManipulator/1e110350-e30b-4a18-8664-7e7681f04700.jpg',
        id: 6
    }, {
        name: 'Dr. Stone',
        uri: 'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540radulito19%252Fcomicseries/ImageManipulator/1e110350-e30b-4a18-8664-7e7681f04700.jpg',
        id: 7
    }, {
        name: 'Jujutsu Kaisen',
        uri: 'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540radulito19%252Fcomicseries/ImageManipulator/1e110350-e30b-4a18-8664-7e7681f04700.jpg',
        id: 8
    }, {
        name: 'Black Clover',
        uri: 'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540radulito19%252Fcomicseries/ImageManipulator/1e110350-e30b-4a18-8664-7e7681f04700.jpg',
        id: 9
    }, {
        name: 'Boku no Hero Academia',
        uri: 'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540radulito19%252Fcomicseries/ImageManipulator/1e110350-e30b-4a18-8664-7e7681f04700.jpg',
        id: 10
    }, {
        name: 'Dr. Stone',
        uri: 'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540radulito19%252Fcomicseries/ImageManipulator/1e110350-e30b-4a18-8664-7e7681f04700.jpg',
        id: 11
    }, {
        name: 'Jujutsu Kaisen',
        uri: 'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540radulito19%252Fcomicseries/ImageManipulator/1e110350-e30b-4a18-8664-7e7681f04700.jpg',
        id: 12
    }, {
        name: 'Black Clover',
        image: 'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540radulito19%252Fcomicseries/ImageManipulator/1e110350-e30b-4a18-8664-7e7681f04700.jpg',
        id: 13
    }, {
        name: 'Boku no Hero Academia',
        uri: 'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540radulito19%252Fcomicseries/ImageManipulator/1e110350-e30b-4a18-8664-7e7681f04700.jpg',
        id: 14
    }, {
        name: 'Dr. Stone',
        uri: 'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540radulito19%252Fcomicseries/ImageManipulator/1e110350-e30b-4a18-8664-7e7681f04700.jpg',
        id: 15
    }, {
        name: 'Jujutsu Kaisen',
        uri: 'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540radulito19%252Fcomicseries/ImageManipulator/1e110350-e30b-4a18-8664-7e7681f04700.jpg',
        id: 16
    }]

    return (
        <View style={styles.container_g} >
            <Msg />
            <Load />
            <View style={styles.top_bar} >
                <View style={styles.back}>
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
            {/* <ScrollView style={styles.middle_content} >
                <View style={styles.preview_container} >
                    <View style={styles.preview_card} ></View>
                    <View style={styles.preview_card} ></View>
                    <View style={styles.preview_card} ></View>
                    <View style={styles.preview_card} ></View>
                    <View style={styles.preview_card} ></View>
                </View>
            </ScrollView> */}
            <View style={styles.middle_content}>
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