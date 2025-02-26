import {Form} from "./Form";
import {IContactInfo} from "../../types";
import { IEvents } from "../base/events"; 

export class UserInfo extends Form<IContactInfo> {
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
  }

  set phone (value: string) {
    (this.container.elemnts.namedItem('phone') as HTMLInputElement).value = value;
  }

  set email (value: string) {
    (this.container.elemnts.namedItem('email') as HTMLInputElement).value = value;
  }
}