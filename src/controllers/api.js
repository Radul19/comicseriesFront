import axios from 'axios';
import createPerformanceLogger from 'react-native/Libraries/Utilities/createPerformanceLogger';


const url = "https://res.cloudinary.com/comicseries/image/upload/v1649827898/imgThumb_svogrq.png"



const catchError = async (err) => {

    if (err.response) {
        console.log(err.response.data.msg)
        return err.response

    } else if (err.request) {

        return { data: { msg: "No se ha contactado con el servidor, revise su conexion a internet y vuelva a intentarlo" } }

    } else {
        console.log("Error", err.message)
        return { data: { msg: "Ha ocurrido un error inesperado, intente nuevamente" } }
    }
}







export const loginUser = async (data) => {
    let response


    const { username, password } = data


    await axios.get(`${url}login/${username}/${password}`)
        .then((res) => {
            response = res
        }).catch((err) => {
            response = catchError(err)
        })
    return response

}


export const registerUser = async (data) => {

    let response


    await axios.post(`${url}register`, { data }).then(res => {
        response = res
    }).catch(err => {
        response = catchError(err)
    })
    return response
}


export const addSerie = async (data) => {


    const { description, title, image, ownerId } = data
    let response


    const formData = new FormData()
    formData.append('image', {
        name: image.name,
        uri: image.uri,
        type: image.type
    })



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


export const getProfile = async (id) => {
    let response
    await axios.get(`${url}profile/${id}`).then(res => {
        response = res
    }).catch(err => {
        response = catchError(err)
    })
    return response
}


export const deleteSerie = async (id) => {
    let response
    await axios.get(`${url}deleteSerie/${id}`).then(res => {
        response = res
    }).catch(err => {
        response = catchError(err)
    })
    return response
}


export const getSerie = async (id) => {
    let response
    await axios.get(`${url}getSerie/${id}`).then(res => {
        response = res
    }).catch(err => {
        response = catchError(err)
    })
    return response
}


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
    }).then(res => res.json())
        .then(res => {
            response = res
        }).catch(err => {
            response = catchError(err)
        })
    return response
}


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


export const getCap = async (id, cap) => {
    let response
    await axios.get(`${url}getCap/${id}/${cap}`).then(res => {
        response = res
    }).catch(err => {
        response = catchError(err)
    })
    return response
}


export const deleteCap = async (id, cap) => {
    let response
    await axios.get(`${url}deleteCap/${id}/${cap}`).then(res => {
        response = res
    }).catch(err => {
        response = catchError(err)
    })
    return response
}


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


export const deleteComment = async (data) => {
    let response
    await axios.post(`${url}deleteComment`, data).then(res => {
        response = res
    }).catch(err => {
        response = catchError(err)
    })
    return response
}


export const editComment = async (data) => {
    let response
    await axios.post(`${url}editComment`, data).then(res => {
        response = res
    }).catch(err => {
        response = catchError(err)
    })
    return response
}


export const searchSeries = async (text) => {
    let response
    await axios.get(`${url}searchSeries/${text}`).then(res => {
        response = res
    }).catch(err => {
        response = catchError(err)
    })
    return response
}

