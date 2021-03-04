import React, {useContext} from 'react';
import { io } from 'socket.io-client';
import {SafeAreaFrameContext} from "react-native-safe-area-context";
import {useDispatch} from "react-redux";
import {PrivateChatCreated, UpdateChatList} from "../store/actions/chat";

const SocketConnectionContext = React.createContext({socket: undefined});

export const SocketConnectionProvider = ({children}) => {
    const socket = io('https://api.xenous.ru/', {path: '/socket', query: {token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDNiYzAzNzhiNjA0YTAwMmE0ZWUxYTQiLCJpYXQiOjE2MTQ1Mjg1Njd9.TcfvZyU_WhxV_W2f_ZyB5S4MSjW2Nm3lLa9_QcsvDDU'}});
    const dispatch = useDispatch();

    socket.on('connect', () => console.log('Connection established'));

    return <SafeAreaFrameContext value={{socket}}>{children}</SafeAreaFrameContext>
};

const setUpSocketChatListeners = (socket, dispatch) => {
    socket.on('chat:created:private', (res) => {
        console.log(res);
        dispatch(PrivateChatCreated(res))
    });
    socket.on('chat:got:chats', (res) => {
        console.log(res);
        dispatch(UpdateChatList)
    });
    socket.on('chat:message:connected', res => {
        console.log(res);
        dispatch();
    });
    socket.on('chat:connected', res => {
        console.log(res);
        dispatch();
    });
    socket.on('chat:message:connected', res => {
        console.log(res);
        dispatch();
    });
    socket.on('chat:disconnected', res => {
        console.log(res);
    });
    socket.on('chat:got:messages', res => {
        console.log(res);
        socket.on()
    });
    socket.on('chat:sent:message', res => {
        console.log(res);
        dispatch()
    });
};

export const useChatConnection = () => {
    const { socket } = useContext(SocketConnectionContext);

    return {
        createPrivateChat: ({users}) => {
            socket.emit('chat:create:private', {users});
        },
        getChats: () => {
            socket.emit('chat:get:chats', {});
        },
        connectChatMessage: () => {
            socket.emit('chat:message:connect', {});
        },
        disconnectChatMessage: () => {
            socket.emit('chat:message:disconnect', {});
        },
        connectChat: ({id}) => {
            socket.emit('chat:connect', {chatId: id});
        },
        disconnectChat: () => {
            socket.emit('chat:disconnect', {});
        },
        getChatMessages: ({id}) => {
            socket.emit('chat:get:messages', {chatId: id});
        },
        sendMessage: ({message, id}) => {
            socket.emit('chat:send:message', {message, chatId: id, type: 'string'});
        }
    }
};