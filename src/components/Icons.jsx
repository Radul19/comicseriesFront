import { View, Text, TouchableOpacity } from 'react-native'
import Svg, { Path, G, Defs, ClipPath, Rect } from 'react-native-svg';
import React, { useContext } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Context } from '../controllers/context';


/* Todos los icons son iguales, pueden o no tener:
    -- onPress: es la funcion que ejecutan al ser presionados, y si no tienen o no hacen nada, o tienen una por defecto
    -- color: es el color del icono
    -- style: si se quieren aplicar estilos especificos al componente
*/
export const ArrowLeft = ({ onPress }) => {
    const navigation = useNavigation()
    return (
        <TouchableOpacity onPress={onPress ? onPress : () => { navigation.goBack() }} >
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <Path d="M16.67 0L19.5 2.829L10.161 12.004L19.5 21.171L16.67 24L4.5 12.004L16.67 0Z" fill="#c65b2d" />
            </Svg>
        </TouchableOpacity>

    )
}

export const ArrowRight = ({ color, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress ? onPress : null} >
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <Path d="M12 0C5.373 0 0 5.373 0 12C0 18.627 5.373 24 12 24C18.627 24 24 18.627 24 12C24 5.373 18.627 0 12 0ZM10.782 19L9 17.25L14.25 12L9 6.75L10.782 5L17.75 12L10.782 19Z" fill={color} />
            </Svg>
        </TouchableOpacity>

    )
}

export const Bell = ({ onPress, style }) => {
    return (
        <TouchableOpacity onPress={onPress ? onPress : null} style={style}>
            <Svg onPress={onPress} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <Path d="M15.137 3.945C14.493 3.571 14.095 2.875 14.096 2.125V2.122C14.097 0.95 13.158 0 12 0C10.842 0 9.903 0.95 9.903 2.122V2.125C9.904 2.876 9.507 3.571 8.862 3.945C4.195 6.657 6.877 15.66 2 17.251V19H22V17.251C17.123 15.66 19.805 6.657 15.137 3.945ZM12 1C12.552 1 13 1.449 13 2C13 2.552 12.552 3 12 3C11.448 3 11 2.552 11 2C11 1.449 11.448 1 12 1ZM15 21C15 22.598 13.608 24 12.029 24C10.45 24 9 22.598 9 21H15Z" fill="#c65b2d" />
            </Svg>
        </TouchableOpacity>

    )
}

export const Bubble = ({ color, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress ? onPress : null} >
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <Path d="M12 1C5.662 1 0 5.226 0 11.007C0 13.057 0.739 15.07 2.047 16.632C2.102 18.462 1.024 21.088 0.054 23C2.656 22.53 6.355 21.492 8.032 20.464C17.268 22.711 24 17.059 24 11.007C24 5.195 18.299 1 12 1ZM7 12.5C6.171 12.5 5.5 11.829 5.5 11C5.5 10.171 6.171 9.5 7 9.5C7.829 9.5 8.5 10.171 8.5 11C8.5 11.829 7.829 12.5 7 12.5ZM12 12.5C11.171 12.5 10.5 11.829 10.5 11C10.5 10.171 11.171 9.5 12 9.5C12.829 9.5 13.5 10.171 13.5 11C13.5 11.829 12.829 12.5 12 12.5ZM17 12.5C16.172 12.5 15.5 11.829 15.5 11C15.5 10.171 16.172 9.5 17 9.5C17.829 9.5 18.5 10.171 18.5 11C18.5 11.829 17.829 12.5 17 12.5Z" fill={color} />
            </Svg>
        </TouchableOpacity>

    )
}

export const Gear = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress ? onPress : null} >
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <G clip-path="url(#clip0_64_612)">
                    <Path d="M24 14.187V9.813C21.852 9.047 21.274 9.011 20.973 8.284C20.67 7.555 21.056 7.115 22.032 5.061L18.939 1.968C16.913 2.931 16.451 3.332 15.715 3.027C14.988 2.725 14.947 2.138 14.188 0H9.813C9.049 2.144 9.013 2.725 8.284 3.027C7.532 3.34 7.081 2.927 5.061 1.968L1.968 5.061C2.945 7.116 3.33 7.554 3.027 8.285C2.725 9.012 2.146 9.049 0 9.813V14.188C2.139 14.948 2.725 14.988 3.027 15.716C3.331 16.45 2.946 16.883 1.968 18.939L5.061 22.032C7.06 21.082 7.531 20.659 8.284 20.973C9.012 21.275 9.048 21.853 9.813 24H14.187C14.945 21.869 14.986 21.277 15.724 20.969C16.469 20.661 16.91 21.068 18.939 22.031L22.032 18.938C21.057 16.888 20.67 16.446 20.973 15.715C21.273 14.989 21.853 14.952 24 14.187ZM19.125 14.951C18.548 16.345 19.057 17.409 19.613 18.529L18.529 19.613C17.436 19.07 16.368 18.537 14.956 19.123C13.56 19.704 13.166 20.816 12.768 22H11.234C10.836 20.815 10.443 19.703 9.051 19.125C7.632 18.537 6.544 19.08 5.472 19.613L4.389 18.529C4.946 17.411 5.455 16.349 4.876 14.949C4.297 13.558 3.185 13.165 2 12.767V11.234C3.185 10.836 4.297 10.443 4.875 9.05C5.453 7.656 4.943 6.591 4.387 5.471L5.471 4.387C6.553 4.925 7.633 5.464 9.051 4.875C10.443 4.298 10.836 3.185 11.234 2H12.768C13.166 3.185 13.56 4.297 14.952 4.875C16.371 5.463 17.458 4.92 18.531 4.387L19.615 5.471C19.059 6.592 18.55 7.658 19.127 9.051C19.704 10.442 20.816 10.835 22.002 11.234V12.768C20.814 13.166 19.7 13.559 19.125 14.951ZM12 9C13.654 9 15 10.346 15 12C15 13.654 13.654 15 12 15C10.346 15 9 13.654 9 12C9 10.346 10.346 9 12 9ZM12 7C9.238 7 7 9.238 7 12C7 14.762 9.238 17 12 17C14.762 17 17 14.762 17 12C17 9.238 14.762 7 12 7Z" fill="#c65b2d" />
                </G>
                <Defs>
                    <ClipPath id="clip0_64_612">
                        <Rect width="24" height="24" fill="white" />
                    </ClipPath>
                </Defs>
            </Svg>
        </TouchableOpacity>

    )
}

export const Pencil = ({ color, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress ? onPress : null} >
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <G clip-path="url(#clip0_64_617)">
                    <Path d="M14.078 7.061L16.939 9.923L6.14 20.721L2.556 21.444L3.28 17.859L14.078 7.061ZM14.078 4.232L1.438 16.872L0 24L7.127 22.562L19.769 9.922L14.078 4.232ZM21.183 8.509L24 5.689L18.309 0L15.493 2.817L21.183 8.509Z" fill={color ? color : "#c65b2d"} />
                </G>
                <Defs>
                    <ClipPath id="clip0_64_617">
                        <Rect width="24" height="24" fill="white" />
                    </ClipPath>
                </Defs>
            </Svg>
        </TouchableOpacity>

    )
}

export const Plus = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress ? onPress : null} >
            <Svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill='#c65b2d'>
                <Path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" />
            </Svg>
        </TouchableOpacity>

    )
}

export const ShareIcon = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress ? onPress : null} >
            <Svg xmlns="http://www.w3.org/2000/svg" fill='#c65b2d' width="24" height="24" viewBox="0 0 24 24"><Path d="M5 9c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm0-2c-2.762 0-5 2.239-5 5s2.238 5 5 5 5-2.239 5-5-2.238-5-5-5zm15 9c-1.165 0-2.204.506-2.935 1.301l-5.488-2.927c-.23.636-.549 1.229-.944 1.764l5.488 2.927c-.072.301-.121.611-.121.935 0 2.209 1.791 4 4 4s4-1.791 4-4-1.791-4-4-4zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2zm0-22c-2.209 0-4 1.791-4 4 0 .324.049.634.121.935l-5.488 2.927c.395.536.713 1.128.944 1.764l5.488-2.927c.731.795 1.77 1.301 2.935 1.301 2.209 0 4-1.791 4-4s-1.791-4-4-4zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2z" /></Svg>
        </TouchableOpacity>
    )
}

export const Star = ({ fill, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress ? onPress : null} >
            {
                fill ?
                    <Svg width="25" height="23" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <Path d="M9.52447 1.08156C9.67415 0.620903 10.3259 0.620905 10.4755 1.08156L11.9941 5.75532C12.1949 6.37336 12.7709 6.7918 13.4207 6.7918H18.335C18.8194 6.7918 19.0207 7.4116 18.6289 7.6963L14.6531 10.5848C14.1274 10.9668 13.9074 11.6439 14.1082 12.2619L15.6268 16.9357C15.7765 17.3963 15.2493 17.7794 14.8574 17.4947L10.8817 14.6061C10.3559 14.2242 9.64405 14.2242 9.11832 14.6061L5.14258 17.4947C4.75073 17.7794 4.22349 17.3963 4.37316 16.9357L5.89176 12.2619C6.09257 11.6439 5.87258 10.9668 5.34685 10.5848L1.37111 7.6963C0.979257 7.4116 1.18064 6.7918 1.66501 6.7918H6.57929C7.22913 6.7918 7.80506 6.37336 8.00587 5.75532L9.52447 1.08156Z" stroke="#c65b2d" />
                    </Svg>
                    :
                    <Svg width="25" height="23" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <Path d="M9.52447 1.08156C9.67415 0.620903 10.3259 0.620905 10.4755 1.08156L11.9941 5.75532C12.1949 6.37336 12.7709 6.7918 13.4207 6.7918H18.335C18.8194 6.7918 19.0207 7.4116 18.6289 7.6963L14.6531 10.5848C14.1274 10.9668 13.9074 11.6439 14.1082 12.2619L15.6268 16.9357C15.7765 17.3963 15.2493 17.7794 14.8574 17.4947L10.8817 14.6061C10.3559 14.2242 9.64405 14.2242 9.11832 14.6061L5.14258 17.4947C4.75073 17.7794 4.22349 17.3963 4.37316 16.9357L5.89176 12.2619C6.09257 11.6439 5.87258 10.9668 5.34685 10.5848L1.37111 7.6963C0.979257 7.4116 1.18064 6.7918 1.66501 6.7918H6.57929C7.22913 6.7918 7.80506 6.37336 8.00587 5.75532L9.52447 1.08156Z" fill="#c65b2d" stroke="#c65b2d" />
                    </Svg>

            }
        </TouchableOpacity>

    )
}

export const Cross = ({ onPress, style = null, color = '#c65b2d' }) => {
    return (
        <TouchableOpacity onPress={onPress} style={style} >
            <Svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <Path fill-rule="evenodd" clip-rule="evenodd" d="M7.87146 9.4143L1.5718 15.714L0.15759 14.2997L6.45725 8.00009L0.157504 1.70035L1.57172 0.286132L7.87146 6.58587L14.2997 0.157606L15.7139 1.57182L9.28567 8.00009L15.7139 14.4283L14.2996 15.8425L7.87146 9.4143Z" fill={color} />
            </Svg>
        </TouchableOpacity>
    )
}

export const Check = ({ onPress, style }) => {
    return (
        <TouchableOpacity onPress={onPress} style={style} >
            <Svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill='#4a9c3e' viewBox="0 0 24 24"><Path d="M9 21.035l-9-8.638 2.791-2.87 6.156 5.874 12.21-12.436 2.843 2.817z" /></Svg>
        </TouchableOpacity>
    )
}
export const Door = () => {
    const { setUser } = useContext(Context)
    const navigation = useNavigation();
    return (
        <TouchableOpacity onPress={() => {
            setUser({
                username: '',
                email: '',
                admin: false,
                id: ''
            })
            navigation.popToTop()
        }}  >
            <Svg width="24" fill={"#c65b2d"} height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><Path d="M11 21h8v-2l1-1v4h-9v2l-10-3v-18l10-3v2h9v5l-1-1v-3h-8v18zm10.053-9l-3.293-3.293.707-.707 4.5 4.5-4.5 4.5-.707-.707 3.293-3.293h-9.053v-1h9.053z" /></Svg>
        </TouchableOpacity>
    )
}