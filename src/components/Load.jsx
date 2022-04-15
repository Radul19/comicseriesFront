import { View, Text, Modal } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { Context } from '../controllers/context'
import styles from '../sass/loadModal.sass';
import { Cross } from './Icons';

const Load = () => {

    const { load, setLoad } = useContext(Context)

    const [count, setCount] = useState(1)
    const [text, setText] = useState(`Cargando...`)




    // useEffect(() => {

    // }, [])

    // useEffect(() => {
    // const interval = setInterval(() => {
    //     setCount(prev => prev + 1)
    //     console.log('This will run every 5 second!');
    //     if (count > 3) {
    //         setCount(1)
    //         console.log(count);
    //     }
    //     if (count == 1) setText('Cargando.')
    //     if (count == 2) setText('Cargando..')
    //     if (count == 3) setText('Cargando...')
    // }, 5000);
    // return () => clearInterval(interval);
    // }, []);



    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={load}
        >
            <View style={styles.container_g} >
                {/* <Cross style={styles.cross} onPress={() => { setLoad(false) }} /> */}
                <View style={styles.modal} >
                    <Text style={styles.text} >{text}</Text>
                </View>
            </View>
        </Modal>
    )
}

export default Load