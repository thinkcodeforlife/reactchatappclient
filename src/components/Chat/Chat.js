import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import './Chat.css';

import Infobar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import Users from '../Users/Users';

let socket;

const Chat = ({ location }) => {

    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const ENPOINT = 'https://loving-kirch-5d275f.netlify.com';

    useEffect(() => {
        const { name, room } = queryString.parse(location.search);
        
        socket = io(ENPOINT);
        
        setName(name);
        setRoom(room);

        socket.emit('join', { name, room }, () => {
            console.log("name, room", name, room);
        });

        return () => {
            socket.emit('disconnect');
            socket.off();
        }
        
    }, [ENPOINT, location.search]);
    
    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message]);
        });
        
        socket.on('roomData', ({ users }) => {
            setUsers(users);
        });

    }, [messages]);

    // function for sending messages
    const sendMessage = (event) => {
        event.preventDefault();
        if (message) {
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    }
    
    console.log("message", message, "messages", messages);
    console.log("users", users);

    return (
        <div className='outerContainer'>
            <div className='container'>
                <Infobar room={room} />
                <Messages messages={messages} name={name} />
                <Input setMessage={setMessage} sendMessage={sendMessage} message={message} />
            </div>
            <Users users={users} />
        </div>
    )
}

export default Chat;