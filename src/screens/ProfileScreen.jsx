import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Modal } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import styles from '../sass/profileScreen.sass';
import manga from '../assets/manga.png'
import profile from '../assets/Pumpkin.png'
import cover1 from '../assets/cover1.png'
import cover2 from '../assets/cover2.png'
import cover3 from '../assets/cover3.png'
import cover4 from '../assets/cover4.png'
import thumb from '../assets/imgThumb.png'

import { CapCard, SerieCard, CommentCard } from '../components/Card'

import { Pencil, Gear, Plus, ArrowLeft, Door } from '../components/Icons'
import { Context } from '../controllers/context';
import { deleteSerie, getProfile, getSerie, updateProfile } from '../controllers/api';
import { Msg } from '../components/Msg';
import Load from '../components/Load';

const ProfileScreen = ({ navigation, route }) => {

    const { user, setUser, setMsg, setLoad } = useContext(Context)
    // console.log(user);

    const [num, setNum] = useState(1)
    const [editData, setEditData] = useState({
        username: user.username,
        picture: 'https://res.cloudinary.com/comicseries/image/upload/v1649827898/imgThumb_svogrq.png'
    })
    const owner = true

    const [profileData, setProfileData] = useState({
        userData: {
            username: user.username,
            picture: 'https://res.cloudinary.com/comicseries/image/upload/v1649827898/imgThumb_svogrq.png',
        },
        series: [],
        follows: []
    })

    const arr = [{
        cap: 'Capitulo 1',
        image: manga,
    }, {
        cap: 'Capitulo 2',
        image: manga,
    }, {
        cap: 'Capitulo 3',
        image: manga,
    }, {
        cap: 'Capitulo 4',
        image: manga,
    }
        , {
        cap: 'Capitulo 5',
        image: manga,
    }, {
        cap: 'Capitulo 6',
        image: manga,
    }, {
        cap: 'Capitulo 7',
        image: manga,
    }, {
        cap: 'Capitulo 8',
        image: manga,
    }
    ]

    const comments = [{
        username: 'Username',
        profile_pic: profile,
        text: 'Lorem ipsum dolor sit amet',
        date: "xxx-xxx-xxx"
    }, {
        username: 'Username2',
        profile_pic: profile,
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        date: "xxx-xxx-xxx"
    }, {
        username: 'Username3',
        profile_pic: profile,
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit',
        date: "xxx-xxx-xxx"
    }, {
        username: 'Username4',
        profile_pic: profile,
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna',
        date: "xxx-xxx-xxx"
    }, {
        username: 'Username5',
        profile_pic: profile,
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis le',
        date: "xxx-xxx-xxx"
    }, {
        username: 'Username6',
        profile_pic: profile,
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non',
        date: "xxx-xxx-xxx"
    },

    ]

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
                    {/* {arr.map((item) => <CapCard key={item.cap} navigation={navigation} cap={item.cap} image={item.image} color='#082032' set={setNum} valueSet={2} />)} */}
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

    const btnEditProfile = async () => {
        setLoad(true)
        const res = await updateProfile({ ...editData, id: user.id })
        if (res.status === 200) {
            setLoad(false)
            console.log(res);
            setUser({ ...user, username: editData.username })
            // console.log(res.data.series)
            setProfileData({
                ...profileData,
                useData: { ...editData }
            })
            setEditData({ ...editData, picture: res.data })
            setMsg({
                text: 'Datos actualizados con exito!',
                display: true,
                type: true,
            })
            navigation.navigate('Search')
        } else {
            setLoad(false)
            setMsg({
                text: res.data.msg,
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
                    // console.log(route.params.upload[0].uri);
                    console.log('wtf');
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
                    console.log(res.data.userData)
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
            <Msg />
            <Load />
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
                    {owner ? <>
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
                    {owner && (user.username !== editData.username || editData.picture !== profileData.userData.picture) ?
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
                        {/* <TouchableOpacity onPress={() => { setNum(2) }} style={[styles.sb_title, { backgroundColor: '#b55829' }]} ><Text style={{ color: '#eee' }} >My Follows</Text></TouchableOpacity> */}
                        {/* <TouchableOpacity onPress={() => { setNum(3) }} style={[styles.sb_title,
                        { backgroundColor: num === 3 ? '#274861' : '#1e2e42' }]} ><Text style={{ color: '#eee' }} >Comments</Text></TouchableOpacity> */}
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