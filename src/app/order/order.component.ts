import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../services/data.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { FormBuilder } from '@angular/forms';
import { NotifierService } from 'angular-notifier';

@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

    private products: any;

    private selectedproducts: any;

    private isLoading = true;
    private isDataLoading = true;
    private isModalLoading = false;

    private product = {};
    private selectedproduct = {};

    private modalname = "";
    private imagepath = "";
    private productprice = "";
    private productQty = 1;
    total = 0;

    private isEditing = false;

    private amount: any;

    constructor(private http: HttpClient,
        private dataService: DataService,
        private ngxSmartModalService: NgxSmartModalService,
        private formBuilder: FormBuilder) {
    }

    ngOnInit() {

        this.isDataLoading = true;
        this.selectedproducts = [];
        this.getSelectedProducts();
        this.getTotalAmount();
    }

    getProducts() {
        this.dataService.getProducts().subscribe(
            data => this.products = data,
            error => console.log(error),
            () => this.isLoading = false
        );
    }


    getSelectedProducts() {
        this.dataService.getSelectedProducts().subscribe(
            data => {
                this.selectedproducts = data;
                console.log('Here',this.selectedproducts);
                this.selectedproducts.map(item => {
                    if (item.info) {
                        this.total += (item.p_quantity * item.info.price);
                        console.log("total sub price", this.total);
                    }
                })
            }
            ,
            error => console.log(error),
            () => this.isDataLoading = false
        );
    }
    loadProduct(product) {
        this.ngxSmartModalService.getModal('myModal').open();
        this.productQty = product.p_quantity;
        this.modalname = product.info.name;
        this.imagepath = product.info.image;
        this.productprice = product.info.price;
        this.product = product;
    }
    editProduct(prod) {
        this.selectedproduct = { p_id: prod.p_id, old_p_quantity: prod.p_quantity, new_p_quantity: this.productQty };
        this.dataService.editProduct(this.selectedproduct).subscribe(
            res => {
                this.productQty = 1;
                this.getSelectedProducts();
                this.getTotalAmount();
            },
            error => console.log(error)
        );
        this.dataService.notify('success', 'Item Updated Successfully');
        this.getSelectedProducts();
        this.getTotalAmount();
    }


    checkout(prod, index) {
        if (window.confirm("Are you sure you want to perform this action?")) {
            console.log(this.selectedproducts)
            this.selectedproducts.splice();
            this.selectedproduct = { p_id: prod.p_id, p_quantity: prod.p_quantity };
            this.dataService.deleteProduct(this.selectedproduct).subscribe(
                res => {
                    this.getSelectedProducts();
                    this.getTotalAmount();
                },
                error => console.log(error)
            );
        }
        this.dataService.notify('warning', 'Item isdeleted successfully');
    }
    deleteProduct(prod, index) {
        if (window.confirm("Are you sure you want to perform this action?")) {
            console.log(this.selectedproducts)
            this.selectedproducts.splice(index, 1);
            this.selectedproduct = { p_id: prod.p_id, p_quantity: prod.p_quantity };
            this.dataService.deleteProduct(this.selectedproduct).subscribe(
                res => {
                    this.getSelectedProducts();
                    this.getTotalAmount();
                },
                error => console.log(error)
            );
        }
        this.getSelectedProducts();
        this.dataService.notify('warning', 'Item isdeleted successfully');
    }


    closeModal() {
        this.ngxSmartModalService.getModal('myModal').close();
    }

    getTotalAmount() {

        this.dataService.getTotal().subscribe(
            (data: any) => {
                this.amount = data;
                console.log(this.amount);
                console.log(data);
            },
            error => console.log(error),
            () => this.isLoading = false
        );
    }

}
