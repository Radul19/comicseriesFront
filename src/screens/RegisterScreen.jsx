import { View, Text, StyleSheet, ImageBackground, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useContext } from 'react'
import styles from '../sass/registerScreen.sass';
import image from '../assets/back2.png'
import { registerUser } from '../controllers/api'
import { Context } from '../controllers/context';
import { Msg } from '../components/Msg';




export default function RegisterScreen({ navigation }) {

    const { msg, setMsg, setLoad, setUser } = useContext(Context)

    const [inputs, setInputs] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        adminCode: ''
    })

    const [admin, setAdmin] = useState(false)

    const register = async () => {
        setLoad(true)
        if (inputs.username !== "" || inputs.email !== "" || inputs.password !== "" || inputs.confirmPassword !== "") {
            if (inputs.password !== inputs.confirmPassword) {
                setLoad(false)
                return setMsg({
                    text: 'Las contraseñas no coinciden',
                    display: true,
                    type: false,
                })
            } else if (inputs.adminCode !== '123' && admin) {
                setLoad(false)
                return setMsg({
                    text: 'El código de admin es incorrecto',
                    display: true,
                    type: false,
                })
            }
            const res = await registerUser(inputs)
            if (res.status === 200) {
                console.log(res.data)
                const { username, email, id, admin, picture } = res.data
                setUser({
                    username, email, admin, picture, id
                })
                setInputs({
                    username: '',
                    email: "",
                    password: "",
                    confirmPassword: "",
                    adminCode: ''
                })
                setLoad(false)
                setAdmin(false)
                setMsg({
                    text: 'Cuenta creada satisfactoriamente',
                    display: true,
                    type: true,
                })
                return navigation.navigate('Search')
            } else {
                setLoad(false)
                // console.log(res.status);
                return setMsg({
                    text: res.data.msg,
                    display: true,
                    type: false,
                })
            }
        } else {
            setLoad(false)
            return setMsg({
                text: 'Porfavor complete los datos antes de continuar',
                display: true,
                type: false,
            })
        }
    }

    const inputChange = (name, data) => setInputs({ ...inputs, [name]: data });

    return (
        <View style={styles.container} >
            <TouchableOpacity style={styles.admin_btn} onPress={() => { setAdmin(!admin) }}></TouchableOpacity>
            <Msg />
            <ImageBackground source={image} style={style.image}>
                <View style={styles.container_box}></View>
                <View style={styles.content}>
                    <TextInput
                        autoComplete='off'
                        placeholder='Username' style={styles.input}
                        value={inputs.username}
                        onChangeText={(text) => inputChange('username', text)} />
                    <TextInput
                        autoComplete='off'
                        placeholder='Email' style={styles.input}
                        value={inputs.email}
                        onChangeText={(text) => inputChange('email', text)} />
                    <TextInput
                        autoComplete='off'
                        placeholder='Password' style={styles.input}
                        secureTextEntry={true}
                        value={inputs.password}
                        onChangeText={(text) => inputChange('password', text)} />
                    <TextInput
                        autoComplete='off'
                        placeholder='Confirm password' style={styles.input}
                        secureTextEntry={true}
                        value={inputs.confirmPassword}
                        onChangeText={(text) => inputChange('confirmPassword', text)} />
                    {admin ? <View style={styles.admin_code_container}>
                        <Text style={{ color: '#eee' }} >Admin Code: </Text>
                        <TextInput
                            autoComplete='off'
                            placeholder='opcional' style={styles.admin_code_container_input}
                            secureTextEntry={true}
                            value={inputs.adminCode}
                            onChangeText={(text) => inputChange('adminCode', text)} />
                    </View> : null}
                    <TouchableOpacity style={styles.registerBtn} onPress={register} >
                        <Text style={{ fontSize: 16, color: '#eee' }} >Registrarse</Text>
                    </TouchableOpacity>
                    <Text style={styles.text} >Ya tienes una cuenta?</Text>
                    <TouchableOpacity onPress={() => { navigation.goBack(); setAdmin(false) }} style={styles.text_orange} >
                        <Text style={{ color: '#D35F2D' }} >Iniciar Sesion</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    )
}

const style = StyleSheet.create({
    image: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    }
});