import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Modal } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import styles from '../sass/profileScreen.sass';


import { SerieCard, CommentCard } from '../components/Card'

import { Plus, ArrowLeft, Door } from '../components/Icons'
import { Context } from '../controllers/context';
import { deleteSerie, getProfile, updateProfile } from '../controllers/api';
import { Msg } from '../components/Msg';
import Load from '../components/Load';


const ProfileScreen = ({ navigation, route }) => {


    const { user, setUser, setMsg, setLoad } = useContext(Context)



    const [num, setNum] = useState(1)


    const [editData, setEditData] = useState({
        username: user.username,
        picture: 'https://res.cloudinary.com/comicseries/image/upload/v1649827898/imgThumb_svogrq.png'
    })


    const [profileData, setProfileData] = useState({
        userData: {
            id: '',
            username: user.username,
            picture: 'https://res.cloudinary.com/comicseries/image/upload/v1649827898/imgThumb_svogrq.png'
        },
        series: [],
        follows: []
    })


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

                {/* {arr.map((item) => <CapCard key={item.cap} navigation={navigation} cap={item.cap} image={item.image} color='#082032' set={setNum} valueSet={2} />)} */ }

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


    const btnEditProfile = async () => {


        setLoad(true)


        const res = await updateProfile({ ...editData, id: user.id })


        if (res.status === 200) {
            const picture = res.data

            setLoad(false)


            setUser({ ...user, username: editData.username, picture })


            setProfileData({
                ...profileData,
                useData: { ...editData, picture }
            })

            setEditData({ ...editData, picture })


            setMsg({
                text: 'Datos actualizados con exito!',
                display: true,
                type: true,
            })


            navigation.navigate('Search')


        } else {
            setLoad(false)
            setMsg({
                text: 'Error idk ',
                display: true,
                type: false,
            })
        }
    }



    useEffect(() => {


        (async () => {


            await loadAllData()


            if (typeof route.params === 'object') {


                if (route.params.upload !== undefined) {

                    setEditData({ ...editData, picture: route.params.upload[0].uri })
                }
            }
        })()
    }, [route])


    const [modal, setModal] = useState({
        name: '',
        id: '',
        visible: false
    })


    const setModalTrue = (name, id) => {
        setModal({
            id,
            name,
            visible: true
        })
    }


    const removeSerie = async () => {


        setModal({
            name: '',
            id: '',
            visible: false
        })


        const res = await deleteSerie(modal.id)


        if (res.status === 200) {


            setMsg({
                text: 'Se ha eliminado la serie exitosamente!',
                display: true,
                type: true,
            })
            await loadAllData()


        } else {
            setMsg({
                text: 'Ha ocurrido un error al intentar eliminar la serie, porfavor intentar nuevamente.',
                display: true,
                type: false,
            })
        }
    }



    const loadAllData = async () => {


        if (typeof route.params === 'object') {


            if (route.params.id !== undefined) {


                setLoad(true)


                const res = await getProfile(route.params.id)


                if (res.status === 200) {


                    setLoad(false)


                    setProfileData({
                        ...profileData,
                        series: res.data.series,
                        userData: res.data.userData
                    })

                    setEditData({
                        username: res.data.userData.username,
                        picture: res.data.userData.picture
                    })


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

                        :
                        <>
                            <Image source={{ uri: profileData.userData.picture }} style={styles.scroll_top_profile} ></Image>
                            <Text style={styles.scroll_top_username} >{user.username}</Text>
                        </>
                    }

                    {/* Si el usuario loggeado es dueño del perfil o es admin y ninguno de los campos de edicion estan vacios, muestra los botones para editar perfil */}
                    {(profileData.userData.id === user.id || user.admin) && (user.username !== editData.username || editData.picture !== profileData.userData.picture) ?
                        <View style={styles.edit_container} >
                            <TouchableOpacity style={styles.btn_edit} onPress={
                                () => { btnEditProfile() }
                            }  ><Text style={{ color: '#eee' }}  >Editar</Text></TouchableOpacity>
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