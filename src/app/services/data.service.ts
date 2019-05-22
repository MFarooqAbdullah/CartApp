import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NotifierService } from 'angular-notifier';

@Injectable()
export class DataService {
  private headers = new HttpHeaders({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
  private options = { headers: this.headers };
  url ='http://localhost:8080';
  private readonly notifier: NotifierService;

  constructor(private http: HttpClient,notifierService: NotifierService) {
    this.notifier = notifierService;
   }

    
    getProducts() {
        return this.http.get(this.url + '/products');
    }  

	getProductById(p_id) {
		return this.http.get(this.url + '/products/${p_id}');
	}

    getSelectedProducts() {
        return this.http.get(this.url + '/selectedproducts');
    }  
 
    addProduct(product) {
        return this.http.post(this.url +"/selectedproducts", JSON.stringify(product), this.options);
    }

    editProduct(product) {
        return this.http.post(this.url +"/updateselectedproducts", JSON.stringify(product), this.options);
    }

    deleteProduct(product) {
        return this.http.post(this.url +"/deleteselectedproducts", JSON.stringify(product), this.options);
    }

    getTotal() {
        return this.http.get(this.url + '/calculateTotal');
    } 
    notify(type,message){
    this.notifier.notify(type, message);
    }
}
