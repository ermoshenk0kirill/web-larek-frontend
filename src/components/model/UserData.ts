import {IUserData} from '../../types/index'
import {IEvents} from '../base/events'

export class UserData implements IUserData {
  payment: 'cash' | 'card';
  address: string;
  phone: string;
  mail: string;

  private events: IEvents; 

  constructor(events: IEvents) {
    this.events = events;
    this.payment = 'cash';
    this.address = '';
    this.phone = '';
    this.mail = '';
  }

  // метод сохранения данных пользователя
  saveUserData(userData: IUserData): void {
    this.payment = userData.payment;
    this.address = userData.address;
    this.phone = userData.phone;
    this.mail = userData.mail;

    this.events.emit('user:save', this.getUserData());
  }

  // метод получения данных пользователя
  getUserData(): IUserData {
    return {
      payment: this.payment,
      address: this.address,
      phone: this.phone,
      mail: this.mail
    };
  }

  // метод валидации данных пользователя
  validateUserData(): boolean {
    const phoneRegex = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return (this.payment === 'cash' || this.payment === 'card') &&
    this.address.length > 0 &&
    phoneRegex.test(this.phone) &&
    emailRegex.test(this.mail);
  }
}