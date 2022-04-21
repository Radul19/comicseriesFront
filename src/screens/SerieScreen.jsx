import { View, Text, ScrollView, Image, FlatList, TouchableOpacity, TextInput, Modal } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'

// Componentes Extraidos
import styles from '../sass/serieScreen.sass';
import { CapCard, CommentCard } from "../components/Card";
import { Pencil, Plus, ArrowLeft, ArrowRight } from '../components/Icons'
import { deleteCap, getSerie, createComment, deleteComment, editComment } from '../controllers/api';
import { Context } from '../controllers/context';
import { Msg } from '../components/Msg';

// Url con la imagen previa en cloudinary
const thumbUri = "https://res.cloudinary.com/comicseries/image/upload/v1649827898/imgThumb_svogrq.png"

// Componente
const SerieScreen = ({ navigation, route }) => {

  // Estado para alternar entre series y capitulos 
  const [screenToggle, setScreenToggle] = useState(true)

  // Extraer datos del Context
  const { setMsg, user, setLoad } = useContext(Context)

  // Todos los datos de la serie van en este State
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

  // Estado con los datos del Modal para eliminar/editar comentarios
  const [commentModal, setcommentModal] = useState({
    edit: false,
    visible: false,
    index: '',
    textEdit: ''
  })

  // Estado con los datos del input del comentario escrito
  const [commentInput, setCommentInput] = useState('')

  // Index del capitulo en el que se visualizan los comentarios
  const [commentCapIndex, setCommentCapIndex] = useState(0)


  // useEffect que se ejecuta cada vez que la ruta cambia (Cuando se cambia de pagina o de serie)
  useEffect(() => {

    // Funcion fantasma
    (async () => {

      // Activar pantalla de carga
      setLoad(true)

      // Hacer peticion para buscar la serie mediante ID en route.params.id
      const res = await getSerie(route.params.id)

      // Si se consiguió la serie
      if (res.status === 200) {
        // Desactiva la pantalla de carga
        setLoad(false)

        // Inserta los datos en el useState correspondiente
        setSerieData(res.data.data)

        // En caso de no encontrar la serie ,descactiva la pantalla de carga y lanza error
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

  // Datos de la pantalla modal para eliminar capitulo o eliminar/editar comentario
  // - index = numero del capitulo
  // - visible = para habilitar el Modal
  // - serieID = almacenar el id de la serie
  const [modalCap, setModalCap] = useState({
    index: '',
    visible: false,
    serieId: ''
  })

  // Abrir Modal para eliminar capitulo
  const setModalDeleteTrue = (cap, serieId) => {
    setModalCap({
      cap,
      serieId,
      visible: true
    })
  }

  // Eliminar capitulo
  const removeCap = async () => {

    setLoad(true)
    // Enviar datos a la respectiva funcion 
    const res = await deleteCap(modalCap.serieId, modalCap.cap)

    // Si todo salio bien
    if (res.status === 200) {
      // Cerrar pantalla de carga con mensaje de exito
      setLoad(false)
      setMsg({
        text: 'Se ha eliminado el elemento seleccionado',
        display: true,
        type: true,
      })
      // Vaciar los datos del Modal
      setModalCap({
        index: '',
        visible: false,
        serieId: ''
      })
      // Volver a cargar los datos de la serie con la informacion recibida luego de borrar el capitulo
      setSerieData(res.data.data)

      // En caso de error
    } else {
      setLoad(false)
      setMsg({
        text: 'Ha ocurrido un error inesperado intente nuevamente',
        display: true,
        type: false,
      })
    }
  }

  // Funcion para enviar comentario 
  const sendComment = async () => {
    // Se vacia el estado con el texto
    setCommentInput('')

    // Hacemos una constante data para organizar bien los datos que se van a enviar
    const data = {
      id: serieData.picture_public_id,
      cap: commentCapIndex,
      text: commentInput,
      username: user.username,
      profile_pic: user.picture
    }

    // Activamos la pantalla de carga
    setLoad(true)

    // Se envian los datos al Backend para almacenar el comentario
    const res = await createComment(data)

    // Si todo salio bien lanza mensaje de exito
    if (res.status === 200) {
      setLoad(false)
      setMsg({
        text: 'Comentario publicado con exito!',
        display: true,
        type: true,
      })
      // Actualiza los datos de la serie con el nuevo comentario
      setSerieData(res.data.data)

      // Caso de error 
    } else {
      setLoad(false)
      setMsg({
        text: 'Ha ocurrido un error inesperado intente nuevamente',
        display: true,
        type: false,
      })
    }
  }


  // Funcion para editar un comentario
  const pressEditComment = async () => {
    // Si el comentario tiene el mismo texto lanza error
    if (commentModal.textEdit === serieData.caps[commentCapIndex].comments[commentModal.index].text) {
      setcommentModal(prev => ({ ...prev, visible: false }))
      return setMsg({
        text: 'Porfavor edite el comentario antes de continuar',
        display: true,
        type: false,
      })

      // Si el comentario no tiene el mismo texto continua
    } else {

      // Creamos una constante data para organizar los valores que se van a enviar
      const data = {
        id: serieData.picture_public_id,
        cap: commentCapIndex,
        index: commentModal.index,
        text: commentModal.textEdit
      }

      // Activamos la pantalla de carga
      setLoad(true)


      // Enviamos los datos al Backend
      const res = await editComment(data)

      // Si todo salio bien
      if (res.status === 200) {
        // Cerrar pantalla de carga
        setLoad(false)

        // Resetear los datos del CommentModal
        setcommentModal({
          edit: false,
          visible: false,
          index: commentModal.index,
          textEdit: ''
        })
        // Mensaje de exito
        setMsg({
          text: 'Se ha editado el comentario satisfactoriamente!',
          display: true,
          type: true,
        })

        // Insertar los datos de la serie con el comentario editado
        setSerieData(res.data.data)

        // Caso de error
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

  // Funcion para eliminar comentario
  const pressDeleteComment = async () => {

    // Constante data para organizar valores
    const data = {
      id: serieData.picture_public_id,
      cap: commentCapIndex,
      index: commentModal.index
    }
    // Activar pantalla de carga
    setLoad(true)

    // Enviar datos al Backend
    const res = await deleteComment(data)

    // En caso de que todo salga bien
    if (res.status === 200) {
      // Cerrar pantalla de carga
      setLoad(false)

      // Reiniciar valores del CommentModal
      setcommentModal({
        edit: false,
        visible: false,
        index: commentModal.index,
        textEdit: ''
      })
      // Mensaje de exito
      setMsg({
        text: 'Se ha eliminado el comentario satisfactoriamente!',
        display: true,
        type: true,
      })

      // Insertar los datos de la serie con el comentario editado
      setSerieData(res.data.data)


      // En caso de error
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
          {/* Si el usuario es dueño de la serie o el usuario es admin puede editar o añadir capitulos a la serie */}
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
            <TouchableOpacity onPress={() => { setScreenToggle(false) }} style={styles.top_scrollbar_title_box_right} >
              <Text style={{ color: '#eee' }} >Comentarios</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.space, { backgroundColor: (screenToggle ? '#b55829' : '#274861') }]} ></View>
        </View>
        {/* SCREEN LOGIC */}
        {
          // HERE COMES THE CAPS
          screenToggle ?
            <View style={styles.top_scrollbar} >
              <View style={styles.cap_container} >
                {serieData.caps.map((item, index) => <CapCard key={item.images[0].public_id} set={setScreenToggle} navigation={navigation} valueSet={false} item={item} cap={index + 1} serieId={serieData.picture_public_id} modal={setModalDeleteTrue} setCommentCap={setCommentCapIndex} owner={serieData.ownerId}
                  color='#082032' />)}
              </View>
            </View> :
            // HERE COMES THE COMMENTS
            <View style={styles.top_scrollbar} >
              <CapCard item={serieData.caps[commentCapIndex]} cap={commentCapIndex + 1} set={setScreenToggle} valueSet={true} hide={true} />
              {serieData.ownerId === user.id || user.admin ?
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