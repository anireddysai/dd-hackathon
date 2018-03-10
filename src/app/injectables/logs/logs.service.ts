import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';

import * as io from 'socket.io-client';
export interface Message {
	author: string,
	message: string
}
@Injectable()
export class LogsService {

	private socket: SocketIOClient.Socket;

  constructor() {
    // this.socket = io('http://localhost:8081',{
		// 	transports: ['websocket', 'xhr-polling']
		// });
		
  }

  // EMITTER
  sendMessage(msg: string) {
    //this.socket.emit('sendMessage', { message: msg });
	}
	

  // HANDLER
  onNewMessage() {
    // return Observable.create(observer => {
    //   this.socket.on('log', msg => {
    //     observer.next(msg);
    //   });
    // });
  }

}
