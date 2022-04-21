import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Modal } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import styles from '../sass/profileScreen.sass';
import manga from '../assets/manga.png'
import profile from '../assets/Pumpkin.png'

import { SerieCard, CommentCard } from '../components/Card'

import { Plus, ArrowLeft, Door } from '../components/Icons'
import { Context } from '../controllers/context';
import { deleteSerie, getProfile, updateProfile } from '../controllers/api';
import { Msg } from '../components/Msg';
import Load from '../components/Load';

// Componente Principal
const ProfileScreen = ({ navigation, route }) => {

    // Extraer datos de Context
    const { user, setUser, setMsg, setLoad } = useContext(Context)

    // Numeros para alternar el display entre series propias, seguidas y comentarios
    // -- No se completó la logica 
    const [num, setNum] = useState(1)

    // En caso de editar los datos aqui se almacenaran dicha informacion
    const [editData, setEditData] = useState({
        username: user.username,
        picture: 'https://res.cloudinary.com/comicseries/image/upload/v1649827898/imgThumb_svogrq.png'
    })

    // Datos del usuario
    const [profileData, setProfileData] = useState({
        userData: {
            id: '',
            username: user.username,
            picture: 'https://res.cloudinary.com/comicseries/image/upload/v1649827898/imgThumb_svogrq.png',
        },
        series: [],
        follows: []
    })

    // Display para alternar entre series propias, seguidas y comentarios
    const display = () => {
        if (num === 1) {
            return (
                <View style={styles.items_container2} >
                    {profileData.series.map((item) => <SerieCard key={item.title} navigation={navigation} title={item.title} image={item.picture} color='#D35F2D' set={setNum} valueSet={3} modal={setModalTrue} id={item.picture_public_id} />)}
                </View>
            )
        }
        if (num === 2) {
            return (
                // <View style={styles.items_container1} >
                {/* {arr.map((item) => <CapCard key={item.cap} navigation={navigation} cap={item.cap} image={item.image} color='#082032' set={setNum} valueSet={2} />)} */ }
                // </View>
            )
        }
        if (num === 3) {
            return (
                <View style={styles.items_container2} >
                    {comments.map((item) => <CommentCard comment={item} key={item.username} />)}
                </View>
            )
        }
    }

    // Logica de boton para editar los datos del perfil
    const btnEditProfile = async () => {

        // Activar pantalla de carga
        setLoad(true)

        // Peticion para actualizar datos
        const res = await updateProfile({ ...editData, id: user.id })

        // Si se actualizo correctamente
        if (res.status === 200) {

            // Desactiva la pantalla de carga
            setLoad(false)

            // Actualiza el username del usuario en el Context
            setUser({ ...user, username: editData.username })

            // Actualiza los datos del usuario
            setProfileData({
                ...profileData,
                useData: { ...editData }
            })

            // Actualiza los datos del estado para editar los datos
            setEditData({ ...editData, picture: res.data })

            // Mensaje de exito
            setMsg({
                text: 'Datos actualizados con exito!',
                display: true,
                type: true,
            })

            // Viaja la pantalla de busqueda para reiniciar todo
            navigation.navigate('Search')

            // En caso de error
        } else {
            setLoad(false)
            setMsg({
                text: res.data.msg,
                display: true,
                type: false,
            })
        }
    }


    // useEffect al cambiar la ruta
    useEffect(() => {

        // Funcion fantasma
        (async () => {

            // Cargar todos los datos del usuario
            await loadAllData()

            // Si se encontraron datos en el route.params
            if (typeof route.params === 'object') {

                // y Uploads no esta vacio
                if (route.params.upload !== undefined) {
                    // Actualiza la imagen de perfil momentaneamente (Se almacena en el estado de EDIT)
                    setEditData({ ...editData, picture: route.params.upload[0].uri })
                }
            }
        })()
    }, [route])

    // Estado para almacenar los datos de la serie a liminar
    const [modal, setModal] = useState({
        name: '',
        id: '',
        visible: false
    })

    // Funcion para activar Modal
    const setModalTrue = (name, id) => {
        setModal({
            id,
            name,
            visible: true
        })
    }

    // Funcion para eliminar serie
    const removeSerie = async () => {

        // Se borran los datos del modal y se cierra
        setModal({
            name: '',
            id: '',
            visible: false
        })

        // Peticion para eliminar serie por ID
        const res = await deleteSerie(modal.id)

        // Si todo salio bien
        if (res.status === 200) {

            // Mensaje de exito y carga toda la data otra vez
            setMsg({
                text: 'Se ha eliminado la serie exitosamente!',
                display: true,
                type: true,
            })
            await loadAllData()

            // En caso de error
        } else {
            setMsg({
                text: 'Ha ocurrido un error al intentar eliminar la serie, porfavor intentar nuevamente.',
                display: true,
                type: false,
            })
        }
    }


    // Funcion para cargar todos los datos
    const loadAllData = async () => {

        // En caso de que el route.params tenga informacion continua
        if (typeof route.params === 'object') {

            // En caso de que route.params.id no este vacio
            if (route.params.id !== undefined) {

                // Activa pantalla de carga
                setLoad(true)

                // Peticion fetch para buscar el perfil por ID
                const res = await getProfile(route.params.id)

                // Si todo salio bien
                if (res.status === 200) {

                    // Desactiva pantalla de carga
                    setLoad(false)

                    // Guarda los datos del perfil en su respectivo estado
                    setProfileData({
                        ...profileData,
                        series: res.data.series,
                        userData: res.data.userData
                    })
                    // Guarda los datos del perfil en el estado de Edit por si se cancela la edicion de este
                    setEditData({
                        username: res.data.userData.username,
                        picture: res.data.userData.picture
                    })

                    // En caso de error
                } else {
                    setLoad(false)
                    setMsg({
                        text: res.data.msg,
                        display: true,
                        type: false,
                    })
                }
            }
        }
    }


    // Funcion para navegar a la seleccion de imagenes y editar perfil
    const changeProfilePic = () => {
        navigation.navigate('ImageSelector', { amount: 1, goTo: 'Profile' })
    }


    return (
        <View style={styles.g_container} >

            {/* Componentes Msg y Pantalla de carga */}
            <Msg />
            <Load />

            {/* Modal para confirmar si eliminar la serie seleccionada  */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modal.visible}
            >
                <View style={styles.modal_container}>
                    <View style={styles.modal} >
                        <View style={styles.modal_top} >
                            <Text style={styles.modal_text} >Estas seguro que deseas eliminar  "{modal.name}"  de tus series personales?</Text>
                        </View>
                        <View style={styles.modal_bottom} >
                            <TouchableOpacity style={styles.modal_btn} onPress={removeSerie} ><Text style={{ color: '#eee' }} >Eliminar</Text></TouchableOpacity>
                            <TouchableOpacity style={[styles.modal_btn, styles.modal_btn_primary]} onPress={() => { setModal({ ...modal, visible: false }) }} ><Text style={{ color: '#eee' }} >Cancelar</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* TopBar */}
            <View style={styles.top_bar} >
                <View style={styles.top_bar_left} >
                    <ArrowLeft />
                </View>
                <View style={styles.top_bar_center} >
                </View>
                <View style={styles.top_bar_right} >
                    <Plus onPress={() => { navigation.navigate('AddSerie') }} />
                    <Door />
                </View>
            </View>

            {/* ScrollView donde esta toda la informacion del perfil, las series y los comentarios */}
            <ScrollView style={styles.scroll_container} >
                <View style={styles.scroll_top} >
                    {/* Si el usuario loggeado es dueño del perfil o es admin */}
                    {profileData.userData.id === user.id || user.admin ? <>
                        <TouchableOpacity onPress={changeProfilePic} >
                            <Image source={{ uri: editData.picture }} style={styles.scroll_top_profile} ></Image>
                        </TouchableOpacity>
                        <TextInput style={styles.scroll_top_username}
                            value={editData.username}
                            onChangeText={(text) => { setEditData({ ...editData, username: text }) }}
                        />
                    </>
                        // En caso de ser un visitante
                        :
                        <>
                            <Image source={{ uri: profileData.userData.picture }} style={styles.scroll_top_profile} ></Image>
                            <Text style={styles.scroll_top_username} >{user.username}</Text>
                        </>
                    }

                    {/* Si el usuario loggeado es dueño del perfil o es admin y ninguno de los campos de edicion estan vacios, muestra los botones para editar perfil */}
                    {profileData.userData.id === user.id || user.admin && (user.username !== editData.username || editData.picture !== profileData.userData.picture) ?
                        <View style={styles.edit_container} >
                            <TouchableOpacity style={styles.btn_edit} onPress={btnEditProfile}  ><Text style={{ color: '#eee' }}  >Editar</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.btn_edit_cancel}
                                onPress={() => {
                                    setEditData({
                                        username: user.username,
                                        picture: profileData.userData.picture
                                    })
                                }}
                            ><Text style={{ color: '#eee' }}  >Cancelar</Text></TouchableOpacity>
                        </View>
                        : null}
                </View>
                <View style={styles.scroll_bottom} >
                    <View style={styles.sb_titles_container} >
                        <TouchableOpacity onPress={() => { setNum(1) }} style={[styles.sb_title,
                        { backgroundColor: num === 1 ? '#274861' : '#1e2e42' }]} ><Text style={{ color: '#eee' }} >My Series</Text></TouchableOpacity>
                    </View>
                    <View style={num === 2 ? styles.sb_space : styles.sb_space2} ></View>
                </View>

                {/* ITEM DISPLAY LOGIC */}
                {display()}
            </ScrollView>
        </View>
    )
}

export default ProfileScreen