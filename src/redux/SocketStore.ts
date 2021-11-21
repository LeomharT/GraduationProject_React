import { io } from "socket.io-client";
import { MessageType } from "../components/HConsult/HConsult";

export default class SocketStore
{
    socketIo = io("ws://localhost:3066");//socket.io实例
    SocketSendStringMessage = (message: string, callBack: Function, room?: string, userId?: string) =>
    {
        if (room)
        {
            this.socketIo.send(message, room, userId);
        } else
        {
            this.socketIo.send(message);
        }
        callBack(message, MessageType.MyMessage);
    };
    private static _SingleInstance: SocketStore;
    static GetInstance()
    {
        if (this._SingleInstance) return this._SingleInstance;
        this._SingleInstance = new SocketStore();
        return this._SingleInstance;
    }
}
