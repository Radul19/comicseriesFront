import React, { useState, useContext } from 'react'
import { Context } from '../controllers/context'
import { View, Text, TouchableOpacity } from 'react-native'
import styles from '../sass/msg.sass';
import { Check, Cross } from './Icons';

/// Componente Message
export const Msg = () => {

    /// Extraer del UserContext
    const { msg, setMsg } = useContext(Context)

    /// Funcion para ocultar el mensaje
    const hide = () => {
        setMsg({ ...msg, display: false })
    }

    return (
        <View style={[styles.container, { top: msg.display ? 20 : -200 }]} >
            <Text style={[styles.text, { color: '#eee' }]} >{msg.text}</Text>
            {msg.type ? <Check onPress={hide} style={styles.cross} /> : <Cross onPress={hide} style={styles.cross} />}
        </View >
    )
}