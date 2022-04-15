import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import styles from '../sass/Card.sass';


import { Pencil, Bubble, Cross } from './Icons'
import { Context } from '../controllers/context';

export const CapCard = ({ cap, item, hide, set, navigation, color, valueSet, serieId, modal, setCommentCap, owner }) => {

    const { user } = useContext(Context)


    return (
        <View style={styles.cap_card} >
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
                {!hide ?
                    <>{
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

export const SerieCard = ({ title, image, hide, set, navigation, color, valueSet, modal, id }) => {

    return (
        <View style={styles.cap_card} >
            <TouchableOpacity onPress={() => { navigation.navigate('Serie', { id }) }} style={styles.cap_card_left} >
                <Image source={{ uri: image }} style={styles.cap_card_left_image}  ></Image>
                <Text style={styles.cap_card_left_text} >{`${title}`}</Text>
            </TouchableOpacity>
            <View style={styles.cap_card_right} >
                {!hide ?
                    <>
                        <Cross color={color} onPress={() => { modal(title, id) }} />
                        {/* <Bubble color={color} onPress={set ? () => { set(valueSet) } : null} /> */}
                    </>
                    : null}
            </View>
        </View>
    )
}

export const CommentCard = ({ comment, index, set }) => {
    const { date, username, profile_pic, text } = comment

    const { user } = useContext(Context)

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