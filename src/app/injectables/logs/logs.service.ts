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
  }

  connect() {
    this.socket = io('http://ideal-cardinal.hackathon.venom360.com',{path:'/api/socket.io',
			transports: ['websocket', 'xhr-polling']
		});
  }

  close() {
    this.socket.disconnect();

  }

  // EMITTER
  // sendMessage(msg: string) {
  //   this.socket.emit('ping', { message: msg });
	// }
	

  // HANDLER
  onNewMessage() {
    return Observable.create(observer => {
      this.socket.on('log', msg => {
        observer.next(msg);
      });
    });
  }

}
