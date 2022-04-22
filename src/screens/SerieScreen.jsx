import { View, Text, ScrollView, Image, FlatList, TouchableOpacity, TextInput, Modal } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'


import styles from '../sass/serieScreen.sass';
import { CapCard, CommentCard } from "../components/Card";
import { Pencil, Plus, ArrowLeft, ArrowRight } from '../components/Icons'
import { deleteCap, getSerie, createComment, deleteComment, editComment } from '../controllers/api';
import { Context } from '../controllers/context';
import { Msg } from '../components/Msg';


const thumbUri = "https://res.cloudinary.com/comicseries/image/upload/v1649827898/imgThumb_svogrq.png"


const SerieScreen = ({ navigation, route }) => {


  const [screenToggle, setScreenToggle] = useState(true)


  const { setMsg, user, setLoad } = useContext(Context)


  const [serieData, setSerieData] = useState({
    title: '',
    picture: thumbUri,
    description: '',
    caps: [{
      comments: [],
      images: [{
        public_id: '',
        url: thumbUri,
      }]
    }],
    picture_public_id: '',
    ownerId: ''
  })


  const [commentModal, setcommentModal] = useState({
    edit: false,
    visible: false,
    index: '',
    textEdit: ''
  })


  const [commentInput, setCommentInput] = useState('')


  const [commentCapIndex, setCommentCapIndex] = useState(0)



  useEffect(() => {


    (async () => {


      setLoad(true)


      const res = await getSerie(route.params.id)


      if (res.status === 200) {

        setLoad(false)


        setSerieData(res.data.data)


      } else {
        setLoad(false)
        setMsg({
          text: 'No se ha encotrado las serie que busca',
          display: true,
          type: false,
        })
      }
    })()
  }, [route])





  const [modalCap, setModalCap] = useState({
    index: '',
    visible: false,
    serieId: ''
  })


  const setModalDeleteTrue = (cap, serieId) => {
    setModalCap({
      cap,
      serieId,
      visible: true
    })
  }


  const removeCap = async () => {

    setLoad(true)

    const res = await deleteCap(modalCap.serieId, modalCap.cap)


    if (res.status === 200) {

      setLoad(false)
      setMsg({
        text: 'Se ha eliminado el elemento seleccionado',
        display: true,
        type: true,
      })

      setModalCap({
        index: '',
        visible: false,
        serieId: ''
      })

      setSerieData(res.data.data)


    } else {
      setLoad(false)
      setMsg({
        text: 'Ha ocurrido un error inesperado intente nuevamente',
        display: true,
        type: false,
      })
    }
  }


  const sendComment = async () => {

    setCommentInput('')


    const data = {
      id: serieData.picture_public_id,
      cap: commentCapIndex,
      text: commentInput,
      username: user.username,
      profile_pic: user.picture
    }


    setLoad(true)


    const res = await createComment(data)


    if (res.status === 200) {
      setLoad(false)
      setMsg({
        text: 'Comentario publicado con exito!',
        display: true,
        type: true,
      })

      setSerieData(res.data.data)


    } else {
      setLoad(false)
      setMsg({
        text: 'Ha ocurrido un error inesperado intente nuevamente',
        display: true,
        type: false,
      })
    }
  }



  const pressEditComment = async () => {

    if (commentModal.textEdit === serieData.caps[commentCapIndex].comments[commentModal.index].text) {
      setcommentModal(prev => ({ ...prev, visible: false }))
      return setMsg({
        text: 'Porfavor edite el comentario antes de continuar',
        display: true,
        type: false,
      })


    } else {


      const data = {
        id: serieData.picture_public_id,
        cap: commentCapIndex,
        index: commentModal.index,
        text: commentModal.textEdit
      }

      setLoad(true)
      const res = await editComment(data)


      if (res.status === 200) {

        setLoad(false)


        setcommentModal({
          edit: false,
          visible: false,
          index: commentModal.index,
          textEdit: ''
        })

        setMsg({
          text: 'Se ha editado el comentario satisfactoriamente!',
          display: true,
          type: true,
        })


        setSerieData(res.data.data)


      } else {
        setLoad(false)
        setMsg({
          text: 'No se ha podido editar el comentario, intente nuevamente',
          display: true,
          type: false,
        })
      }
    }

  }


  const pressDeleteComment = async () => {


    const data = {
      id: serieData.picture_public_id,
      cap: commentCapIndex,
      index: commentModal.index
    }

    setLoad(true)
    const res = await deleteComment(data)


    if (res.status === 200) {

      setLoad(false)


      setcommentModal({
        edit: false,
        visible: false,
        index: commentModal.index,
        textEdit: ''
      })

      setMsg({
        text: 'Se ha eliminado el comentario satisfactoriamente!',
        display: true,
        type: true,
      })


      setSerieData(res.data.data)



    } else {
      setLoad(false)
      setMsg({
        text: 'No se ha podido eliminar el comentario, intente nuevamente',
        display: true,
        type: false,
      })
    }
  }


  return (
    <View style={styles.g_container}>
      {/* Componentes de mensaje */}
      <Msg />
      {/* Modal para eliminar capitulo */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalCap.visible}
      >
        <View style={styles.modal_container}>
          <View style={styles.modal} >
            <View style={styles.modal_top} >
              <Text style={styles.modal_text} >Estas seguro que deseas eliminar el elemento seleccionado?</Text>
            </View>
            <View style={styles.modal_bottom} >
              <TouchableOpacity style={styles.modal_btn} onPress={removeCap} ><Text style={{ color: '#eee' }} >Eliminar</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.modal_btn, styles.modal_btn_primary]} onPress={() => { setModalCap({ ...modalCap, visible: false }) }} ><Text style={{ color: '#eee' }} >Cancelar</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para eliminar y editar comentarios */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={commentModal.visible}
      >
        <View style={styles.modalComment_container}>
          <View style={styles.modalComment} >
            <View style={styles.modalComment_top} >
              <Text style={styles.modalComment_text} >Seleccione una de las siguientes opciones: </Text>
            </View>
            <View style={styles.modalComment_middle} >
              <TouchableOpacity style={styles.modalComment_btn} onPress={() => {
                const text = serieData.caps[commentCapIndex].comments[commentModal.index].text
                setcommentModal(prev => ({ ...prev, edit: !commentModal.edit, textEdit: text }))
              }} ><Text style={{ color: '#eee' }} >Editar</Text></TouchableOpacity>
              <TouchableOpacity style={styles.modalComment_btn} onPress={pressDeleteComment} ><Text style={{ color: '#eee' }} >Eliminar</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.modalComment_btn, styles.modalComment_btn_primary]} onPress={() => { setcommentModal({ ...modalCap, visible: false }) }} ><Text style={{ color: '#eee' }} >Cancelar</Text></TouchableOpacity>
            </View>

            {/* Si se va a editar el comentario o no, renderiza lo siguiente */}
            {commentModal.edit ?
              <>
                <View style={styles.modalComment_bottom} >
                  <TextInput placeholder='Editar comentario...' style={styles.modalComment_input} onChangeText={(text) => {
                    setcommentModal(prev => ({ ...prev, textEdit: text }))
                  }} value={commentModal.textEdit} />
                  <ArrowRight color={'#c65b2d'} styles={styles.modalComment_input_btn} onPress={pressEditComment} />
                </View>
                <View style={styles.modalComment_bottom_line}></View>
              </>
              : null}
          </View>
        </View>
      </Modal>

      {/* Top Bar de la página */}
      <View style={styles.top_bar} >
        <View style={styles.top_bar_left} >
          <ArrowLeft onPress={() => {
            navigation.navigate('Search')
          }} />
        </View>
        <View style={styles.top_bar_right} >
          {serieData.ownerId === user.id || user.admin ?
            <>
              <Plus onPress={() => {
                console.log(serieData)
                navigation.navigate('AddCap', {
                  id: serieData.picture_public_id,
                  cap: serieData.caps.length
                })
              }} />
              <Pencil onPress={() => {
                const { title, description, picture, picture_public_id } = serieData
                navigation.navigate('AddSerie', {
                  prevData: { title, description, picture, picture_public_id },
                  edit: true
                })
              }} />
            </>
            : null}
        </View>
      </View>
      {/* CONTENT */}
      <ScrollView stickyHeaderIndices={[3]} style={styles.scrollContainer} >
        <Text style={styles.title} >{serieData.title}</Text>
        <View style={styles.image} >
          <Image source={{ uri: serieData.picture }} resizeMode='contain' style={styles.image2}  ></Image>
        </View>
        <Text style={styles.description} >{serieData.description}</Text>
        {/* TITLES SECTION */}
        <View style={styles.top_scrollbar_title} >
          <View style={styles.top_scrollbar_title_box} >
            <TouchableOpacity onPress={() => { setScreenToggle(true) }} style={styles.top_scrollbar_title_box_left} >
              <Text style={{ color: '#eee' }} >Lista de Capitulos</Text>
            </TouchableOpacity>
            {
              serieData.caps.length > 0 ?
                <TouchableOpacity onPress={() => { setScreenToggle(false) }} style={styles.top_scrollbar_title_box_right} >
                  <Text style={{ color: '#eee' }} >Comentarios</Text>
                </TouchableOpacity>

                : null
            }
          </View>
          <View style={[styles.space, { backgroundColor: (screenToggle ? '#b55829' : '#274861') }]} ></View>
        </View>
        {/* SCREEN LOGIC */}
        {

          screenToggle ?
            <View style={styles.top_scrollbar} >
              <View style={styles.cap_container} >
                {serieData.caps.map((item, index) => <CapCard key={item.images[0].public_id} set={setScreenToggle} navigation={navigation} valueSet={false} item={item} cap={index + 1} serieId={serieData.picture_public_id} modal={setModalDeleteTrue} setCommentCap={setCommentCapIndex} owner={serieData.ownerId}
                  color='#082032' />)}
              </View>
            </View> :

            <View style={styles.top_scrollbar} >
              <CapCard item={serieData.caps[commentCapIndex]} cap={commentCapIndex + 1} set={setScreenToggle} valueSet={true} hide={true} />
              {user.id !== '@guest' ?
                <View style={[styles.comment_input, { borderBottomColor: '#aa4c00', borderBottomWidth: 2 }]}>

                  <TextInput placeholder='Escribir comentario...' style={styles.input} onChangeText={setCommentInput} value={commentInput} />
                  <ArrowRight color={'#c65b2d'} styles={styles.btnComment} onPress={sendComment} />
                </View>
                : null}
              <View style={styles.comments_container} >
                {serieData.caps[commentCapIndex].comments.map((item, index) => <CommentCard comment={item} key={index} index={index} set={setcommentModal} />)}
              </View>
            </View>
        }

      </ScrollView>
    </View>
  )
}



export default SerieScreen