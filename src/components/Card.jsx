import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import styles from '../sass/Card.sass';


import { Pencil, Bubble, Cross } from './Icons'
import { Context } from '../controllers/context';

// Componentes para capitulos
export const CapCard = ({ cap, item, hide, set, navigation, color, valueSet, serieId, modal, setCommentCap, owner }) => {

    // Extraer datos del usuario
    const { user } = useContext(Context)


    return (
        <View style={styles.cap_card} >
            {/* El valor ´hide´ sirve para diferenciar los capitulos a los que se imprimen en la lista de series
            Y el capitulo que se imprime en la pestaña de comentarios, a este no se le puede hacer "click" */}
            {!hide ? <TouchableOpacity onPress={() => { navigation.navigate('Cap', { serieId, cap, index: 0 }) }} style={styles.cap_card_left} >
                <Image source={{ uri: item.images[0].url }} style={styles.cap_card_left_image} ></Image>
                <Text style={styles.cap_card_left_text} >{`Capitulo ${cap}`}</Text>
            </TouchableOpacity> :
                <View style={styles.cap_card_left} >
                    <Image source={{ uri: item.images[0].url }} style={styles.cap_card_left_image} ></Image>
                    <Text style={styles.cap_card_left_text} >{`Capitulo ${cap}`}</Text>
                </View>
            }
            <View style={styles.cap_card_right} >
                {/* Hide para saber si es Capitulo/serie o Capitulo/comentario */}
                {!hide ?
                    <>{
                        // Verificacion si el dueño es el usuario loggeado o si el usuario es admin
                        owner === user.id || user.admin ?
                            <>
                                <Cross color={color} onPress={() => { modal(cap, serieId) }} />
                                <Pencil color={color} onPress={() => {
                                    navigation.navigate('AddCap', {
                                        id: serieId,
                                        cap: cap - 1,
                                        edit: true,
                                    })
                                }} />
                            </>
                            : null
                    }
                        {/* Burbuja para contestar el comentario */}
                        <Bubble color={color} onPress={set ? () => {
                            setCommentCap(cap - 1)
                            set(valueSet)
                        } : null} />
                    </>
                    : null}
            </View>
        </View>
    )
}

// Componente para la tarjeta de series
export const SerieCard = ({ title, image, hide, set, navigation, color, valueSet, modal, id }) => {

    return (
        <View style={styles.cap_card} >
            <TouchableOpacity onPress={() => { navigation.navigate('Serie', { id }) }} style={styles.cap_card_left} >
                <Image source={{ uri: image }} style={styles.cap_card_left_image}  ></Image>
                <Text style={styles.cap_card_left_text} >{`${title}`}</Text>
            </TouchableOpacity>
            <View style={styles.cap_card_right} >
                {/* Hide para saber si es dueño de la serie o no, y asi eliminarla */}
                {!hide ?
                    <>
                        <Cross color={color} onPress={() => { modal(title, id) }} />
                    </>
                    : null}
            </View>
        </View>
    )
}

// Tarjeta Comentario
export const CommentCard = ({ comment, index, set }) => {

    // Datos del comentario
    const { date, username, profile_pic, text } = comment

    // Usuario loggeado
    const { user } = useContext(Context)

    // Funcion para enviar datos al Modal y asi eliminar o editar comentario
    const onPressOwner = () => {
        set(prev => (
            {
                ...prev,
                visible: true,
                index
            }
        ))
    }

    return (
        // OnPress tiene la verificacion para saber si el usuario es el dueño del comentario o el usuario es admin
        <TouchableOpacity style={styles.comment_general} onPress={user.picture === profile_pic || user.admin ? onPressOwner : null}>
            <View style={styles.comment_left} >
                <Image source={profile_pic ? { uri: profile_pic } : { uri: '_' }} style={styles.comment_left_image} />
            </View>
            <View style={styles.comment_right} >
                <View style={styles.comment_upperText} >
                    <Text style={{ color: '#eee' }} >{username ? username : ''}</Text>
                    <Text style={{ color: "#ffffffb4" }} >{date ? date : ''}</Text>
                </View>
                <View style={styles.comment_bottomText} >
                    <Text style={{ fontSize: 12, color: '#eee' }} >{text ? text : ''}</Text>
                </View>
            </View>

        </TouchableOpacity>
    )
}