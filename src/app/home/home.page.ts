import { Component, ViewChild, ComponentRef } from '@angular/core';
import * as firebase from 'firebase/app'; 
import 'firebase/firestore';
import { FormControl } from '@angular/forms';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public messageListRef: firebase.firestore.CollectionReference;
  public messages = [];
  public newMessage: FormControl = new FormControl('');
  public color: string;

  @ViewChild(IonContent, {static: false}) content: IonContent;

  constructor() {
    this.messages = [];
    var db = firebase.firestore();
    // db.collection('messages').get().then((querySnapshot) => {
    //   querySnapshot.forEach((doc) => {
    //     this.messages.push({ 'name': doc.data().name, 'message': doc.data().message })
    //   })
    // })

    db.collection('messages').orderBy('date').onSnapshot(snapshot => {
      var snap = snapshot.docChanges();
      snap.forEach((doc) => {
        let slot: string;
        let justify: string;
        let color: string;
        if (doc.doc.data().name == firebase.auth().currentUser.email) {
           slot = 'end';
           justify = 'ion-text-end';
           color = 'primary';
          }
        else {
           slot = 'start';
           justify = 'ion-text-start';
           color = 'tertiary';
          }
        let time = doc.doc.data().date.toDate().getHours() + ":" + doc.doc.data().date.toDate().getMinutes()
        this.messages.push({ 'name': doc.doc.data().name, 'message': doc.doc.data().message, 'date': time, 'color': color, 'justify': justify, 'slot': slot });
      });
    });
  }

  callFunction() {
    this.content.scrollToBottom(0);
  }

  sendMessage() {
    var db = firebase.firestore();
    db.collection('messages').doc().set({
      name: firebase.auth().currentUser.email,
      message: this.newMessage.value,
      date: firebase.firestore.Timestamp.now(),
    });

    this.newMessage.setValue('');
  }

}
