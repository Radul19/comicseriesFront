import { View, Text, StyleSheet, ImageBackground, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useContext } from 'react'

// Componentes extraidos
import styles from '../sass/registerScreen.sass';
import image from '../assets/back2.png'
import { registerUser } from '../controllers/api'
import { Context } from '../controllers/context';
import { Msg } from '../components/Msg';



// Componente
export default function RegisterScreen({ navigation }) {

    // Extraer datos del Context
    const { setMsg, setLoad, setUser } = useContext(Context)

    // Input del formulario del registro
    const [inputs, setInputs] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        adminCode: ''
    })

    // Estado para mostrar u ocultar el input con el AdminCode
    const [admin, setAdmin] = useState(false)


    // Funcion al presionar el boton de registro
    const register = async () => {
        // Activar la pantalla de carga
        setLoad(true)

        // Si ninguno de los inputs esta vacio, continua
        if (inputs.username !== "" || inputs.email !== "" || inputs.password !== "" || inputs.confirmPassword !== "") {

            // Si las contraseñas no coinciden lanza error
            if (inputs.password !== inputs.confirmPassword) {
                setLoad(false)
                return setMsg({
                    text: 'Las contraseñas no coinciden',
                    display: true,
                    type: false,
                })
                // Si el codigo de el admin es incorrecto lanza error
            } else if (inputs.adminCode !== '123' && admin) {
                setLoad(false)
                return setMsg({
                    text: 'El código de admin es incorrecto',
                    display: true,
                    type: false,
                })
            }

            // Funcion fetch para registrar usuario
            const res = await registerUser(inputs)

            // Si se completó el registro contunua
            if (res.status === 200) {
                // Extraer los datos recibidos del registro para ser almacenados en el setUser del Context
                const { username, email, id, admin, picture } = res.data
                setUser({
                    username, email, admin, picture, id
                })

                // Vaciar los inputs del formulario
                setInputs({
                    username: '',
                    email: "",
                    password: "",
                    confirmPassword: "",
                    adminCode: ''
                })
                // Desactivar el input AdminCode y la pantalla de carga
                setLoad(false)
                setAdmin(false)

                // Mensaje de exito
                setMsg({
                    text: 'Cuenta creada satisfactoriamente',
                    display: true,
                    type: true,
                })
                return navigation.navigate('Search')

                // Si ocurrio un error
            } else {
                setLoad(false)
                // console.log(res.status);
                return setMsg({
                    text: res.data.msg,
                    display: true,
                    type: false,
                })
            }

            // Si alguno de los inputs esta vacio lanza el error
        } else {
            setLoad(false)
            return setMsg({
                text: 'Porfavor complete los datos antes de continuar',
                display: true,
                type: false,
            })
        }
    }

    // Funcion para almacenar los datos en el estado dependiendo de el input en el que se escriba
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

                    {/* Si el estado Admin es true muestra el input AdminCode */}
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

// Estilo para la imagen de fondo
const style = StyleSheet.create({
    image: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    }
});