import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrderComponent } from './order/order.component';
// import { ToastComponent } from './toast/toast.component';
import { TitlecasePipe } from './services/titlecase.pipe';
import { DataService } from './services/data.service';
import { NgxSmartModalModule} from 'ngx-smart-modal';
import { NotifierModule } from 'angular-notifier';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    OrderComponent,
    // ToastComponent,
    TitlecasePipe
  ],
  imports: [
    BrowserModule,
    NgxSmartModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    NotifierModule
  ],
  providers: [ DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
