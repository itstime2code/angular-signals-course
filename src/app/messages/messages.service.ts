import {Injectable, signal} from "@angular/core";
import {Message, MessageSeverity} from "../models/message.model";


@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  #messaage = signal<Message | null>(null);
  message = this.#messaage.asReadonly();

  showMessage(text: Message['text'], severity: MessageSeverity) {
    this.#messaage.set({ text, severity });
  }

  clear() {
    this.#messaage.set(null);
  }

}
