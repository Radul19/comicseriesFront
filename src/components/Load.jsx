import { View, Text, Modal } from 'react-native'
import React, { useContext, useState } from 'react'
import { Context } from '../controllers/context'
import styles from '../sass/loadModal.sass';

// Pantalla de carga
const Load = () => {

    const { load } = useContext(Context)

    const [text, setText] = useState(`Cargando...`)


    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={load}
        >
            <View style={styles.container_g} >
                <View style={styles.modal} >
                    <Text style={styles.text} >{text}</Text>
                </View>
            </View>
        </Modal>
    )
}

export default Load