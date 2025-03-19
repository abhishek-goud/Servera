/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { io, Socket } from 'socket.io-client';

let socketInstance: Socket | null = null;

export const initializeSocket = (projectId : string): Socket => {
    socketInstance = io(import.meta.env.VITE_API_URL as string, {
        auth: {
            token: localStorage.getItem('token'),
        },
        query:{
            projectId
        }
    });

    return socketInstance;
};

export const receiveMessage = (eventName: string, cb: (...args: any[]) => void): void => {
    if (socketInstance) {
        socketInstance.on(eventName, cb);
    }
};

export const sendMessage = (eventName: string, data: any): void => {
    if (socketInstance) {
        socketInstance.emit(eventName, data);
    }
};
