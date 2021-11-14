import { io } from "socket.io-client";

export default class SocketStore
{
    socketIo = io("ws://localhost:3066");          //socket.io实例
    private static _SingleInstance: SocketStore;
    static GetInstance()
    {
        if (this._SingleInstance) return this._SingleInstance;
        this._SingleInstance = new SocketStore();
        return this._SingleInstance;
    }
}
