import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private products: any;

  private isLoading = true;

  private product = {};
  private selectedproduct = {};
  private modalname = "";
  private imagepath = "";
  private productprice = "";
  private productQty = 1;

  private isEditing = false;
  constructor(private http: HttpClient,
    private dataService: DataService,
    private ngxSmartModalService: NgxSmartModalService,
    private formBuilder: FormBuilder) {
    console.log(dataService)
  }
  ngOnInit() {
    this.getProducts();
  }


  getProducts() {
    this.dataService.getProducts().subscribe(
      data => this.products = data,
      error => console.log(error),
      () => this.isLoading = false
    );
  }


  loadProduct(product) {
    this.productQty = 1;
    this.modalname = product.name;
    this.imagepath = product.image;
    this.productprice = product.price;
    this.product = product;
  }

  addProduct(prod) {
    console.log('Client Prod::::', prod);
    this.selectedproduct = { _id: prod._id, p_quantity: this.productQty };

    this.dataService.addProduct(this.selectedproduct).subscribe(
      res => {
        this.productQty = 1;
      },
      error => console.log(error)
    );
    this.dataService.notify('success', 'Item is successfully Added to cart');
  }

  addToCart(product) {
    console.log('clicked')
    this.ngxSmartModalService.getModal('myModal').open();
    console.log('clicked')
    this.loadProduct(product);
  }
  preview(product) {
    console.log('clicked')
    this.ngxSmartModalService.getModal('previewModal').open();
    this.loadProduct(product);
  }
  closeModal() {
    this.ngxSmartModalService.getModal('myModal').close();
  }

}
