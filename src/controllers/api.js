import axios from 'axios';
import createPerformanceLogger from 'react-native/Libraries/Utilities/createPerformanceLogger';

// const url = "http://192.168.1.112:3000/"
const url = "https://comicseriesbackend.herokuapp.com/"


/// Funcion general para el catch error que se usa en TODAS las peticiones 
const catchError = async (err) => {
    /// Error  
    if (err.response) {
        console.log(err.response.data.msg)
        return err.response
        /// Error de mala conexion
    } else if (err.request) {
        // console.log(err.request)
        return { data: { msg: "No se ha contactado con el servidor, revise su conexion a internet y vuelva a intentarlo" } }
        /// Error inesperado
    } else {
        console.log("Error", err.message)
        return { data: { msg: "Ha ocurrido un error inesperado, intente nuevamente" } }
    }
}



/*
La logica es super sencilla en casi todos
Crea una variable "response" donde va a esperar de forma asincrona para la respuesta del ".then" luego de la peticion de axios

El "then catch" no tiene ciencia, si todo funciona bien guarda el "res" en "response" y caso contrario, 
se ejecuta el "catch" y "catchError" verifica el tipo de error y manda el mensaje

Todo se va a guardar en "response" y será retornado al componente que ejecuto la funcion para hacer el display del mensaje

*/


/// Logear usuario mediante Get
export const loginUser = async (data) => {
    let response

    //Extrae los datos
    const { username, password } = data

    // En las peticiones get() se envian los datos en el url  login/:username/:password
    await axios.get(`${url}login/${username}/${password}`)
        .then((res) => {
            response = res
        }).catch((err) => {
            response = catchError(err)
        })
    return response

}

// Registrar usuario
export const registerUser = async (data) => {

    let response

    // En las peticiones post se envian los datos en un Object aparte del url
    await axios.post(`${url}register`, { data }).then(res => {
        response = res
    }).catch(err => {
        response = catchError(err)
    })
    return response
}

// Añadir serie
export const addSerie = async (data) => {

    // Se extraen los datos y se envian en un FormData para poder procesar la imagen por Multer
    const { description, title, image, ownerId } = data
    let response
    // -- Multer recibe todos los datos enviados pero se debe especificar el nombre de la variable en la que se recibiran las imagenes,
    // -- en este caso es 'image'
    const formData = new FormData()
    formData.append('image', {
        name: image.name,
        uri: image.uri,
        type: image.type
    })

    // Axios tiene problemas para  enviar FormDatas asi que se usa una basica peticion Fetch, solo que lleva mas configuracion
    // -- Los datos tiene que ser recibidos como STRING porque si es un Object no se reconoce
    formData.append('data', JSON.stringify({ description, title, ownerId }))
    await fetch(`${url}addSerie`, {
        method: 'POST',
        body: formData
    })
        .then(res => {
            response = res
        }).catch(err => {
            response = catchError(err)
        })
    return response
}

// Peticion Get para los perfiles de usuario
export const getProfile = async (id) => {
    let response
    await axios.get(`${url}profile/${id}`).then(res => {
        response = res
    }).catch(err => {
        response = catchError(err)
    })
    return response
}

// Peticion Get para eliminar series por ID
export const deleteSerie = async (id) => {
    let response
    await axios.get(`${url}deleteSerie/${id}`).then(res => {
        response = res
    }).catch(err => {
        response = catchError(err)
    })
    return response
}

// Peticion Get para recibir series por ID
export const getSerie = async (id) => {
    let response
    await axios.get(`${url}getSerie/${id}`).then(res => {
        response = res
    }).catch(err => {
        response = catchError(err)
    })
    return response
}

// Peticion Post FormData para registrar capitulo con varias imagenes 
export const uploadCaps = async (id, images) => {
    console.log(images)
    let response
    const formData = new FormData()
    images.forEach(element => {
        formData.append("images", element)
    });
    formData.append('id', JSON.stringify(id))

    await fetch(`${url}addCap`, {
        method: 'POST',
        body: formData
    })
        .then(res => {
            response = res
        }).catch(err => {
            response = catchError(err)
        })
    return response
}


// Actualizar datos del usuario mediante Post FormData
export const updateProfile = async (data) => {
    const { picture, id, username } = data
    let response
    const formData = new FormData()
    formData.append('image', {
        name: 'picturename.jpg',
        uri: picture,
        type: 'image/jpeg'
    })
    formData.append('data', JSON.stringify({ id, username }))
    await fetch(`${url}updateProfile`, {
        method: 'POST',
        body: formData
    })
        .then(res => {
            response = res
        }).catch(err => {
            response = catchError(err)
        })
    return response
}

// Actualizar datos del usuario mediante Post FormData
export const editSerie = async (data) => {
    const { description, title, image, ownerId, id } = data
    let response
    const formData = new FormData()
    formData.append('image', {
        name: image.name,
        uri: image.uri,
        type: image.type
    })
    formData.append('data', JSON.stringify({ description, title, ownerId, id }))
    await fetch(`${url}editSerie`, {
        method: 'POST',
        body: formData
    })
        .then(res => {
            response = res
        }).catch(err => {
            response = catchError(err)
        })
    return response
}

// Peticion Get para recibir capitulo usando su ID y el index del capitulo
export const getCap = async (id, cap) => {
    let response
    await axios.get(`${url}getCap/${id}/${cap}`).then(res => {
        response = res
    }).catch(err => {
        response = catchError(err)
    })
    return response
}

//Peticion Get para eliminar capitulo usando su ID y el index del capitulo
export const deleteCap = async (id, cap) => {
    let response
    await axios.get(`${url}deleteCap/${id}/${cap}`).then(res => {
        response = res
    }).catch(err => {
        response = catchError(err)
    })
    return response
}

// Peticion Post FormData para editar capitulo
export const editCap = async (id, images, cap) => {
    let response
    const formData = new FormData()
    images.forEach(element => {
        formData.append("images", element)
    });
    formData.append('data', JSON.stringify({ id, cap }))

    await fetch(`${url}editCap`, {
        method: 'POST',
        body: formData
    })
        .then(res => {
            response = res
        }).catch(err => {
            response = catchError(err)
        })
    return response
}

// Peticion post para crear comentario
export const createComment = async (data) => {
    let response

    await axios.post(`${url}createComment`, data).then(res => {
        response = res
    }).catch(err => {
        response = catchError(err)
    })
    return response

    return response
}

// Peticion post para eliminar comentario
export const deleteComment = async (data) => {
    let response
    await axios.post(`${url}deleteComment`, data).then(res => {
        response = res
    }).catch(err => {
        response = catchError(err)
    })
    return response
}

// Peticion post para editar comentario
export const editComment = async (data) => {
    let response
    await axios.post(`${url}editComment`, data).then(res => {
        response = res
    }).catch(err => {
        response = catchError(err)
    })
    return response
}

// Peticion get para buscar series mediante el texto insertado
export const searchSeries = async (text) => {
    let response
    await axios.get(`${url}searchSeries/${text}`).then(res => {
        response = res
    }).catch(err => {
        response = catchError(err)
    })
    return response
}

