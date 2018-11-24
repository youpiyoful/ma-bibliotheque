import { BooksService } from '../../../services/books.service';
import { Book } from '../../../models/Book';
import { Camera } from '@ionic-native/camera';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { NavController, normalizeURL, ToastController } from 'ionic-angular';

@Component({
  selector: 'page-book-form',
  templateUrl: 'book-form.html',
})
export class BookFormPage implements OnInit {

  bookForm: FormGroup;
  imageUrl: string;


  constructor(private formBuilder:  FormBuilder,
              public  navCtrl:      NavController,
              private booksService: BooksService,
              private toastCtrl:    ToastController,
              private camera:       Camera) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.bookForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: this.formBuilder.array([])
    });
  }

  onSubmitForm() {
    let newBook = new Book(
      this.bookForm.get('name').value,
      this.imageUrl
    );
    for (let control of this.getDescriptionArray().controls) {
      newBook.description.push(control.value);
    }
    this.booksService.addBook(newBook);
    this.navCtrl.pop();
  }

  getDescriptionArray() {
    return this.bookForm.get('description') as FormArray;
  }

  onAddDescription() {
    let newControl = this.formBuilder.control('');
    this.getDescriptionArray().controls.push(newControl);
  }

  onRemoveDescription(index: number) {
    this.getDescriptionArray().removeAt(index);
  }

  onTakePhoto() {
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }).then(
      (data) => {
        if (data) {
          this.imageUrl = normalizeURL(data);
        }
      }
    ).catch(
      (error) => {
        this.toastCtrl.create({
          message: error.message,
          duration: 3000,
          position: 'bottom'
        }).present();
      }
    );
  }

}
