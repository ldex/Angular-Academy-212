import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, delay, shareReplay, tap } from 'rxjs/operators';
import { Product } from './product.interface';
import { ProductsModule } from './products.module';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'https://storerestservice.azurewebsites.net/api/products/';
  private products = new BehaviorSubject<Product[]>([]);
  products$: Observable<Product[]> = this.products.asObservable();
  productsTotalNumber$: Observable<number>;

  constructor(private http: HttpClient) { 
    this.initProducts();
    this.initProductsTotalNumber();
  }

  initProductsTotalNumber() {
    this.productsTotalNumber$ = this
                                .http
                                .get<number>(this.baseUrl + "count")
                                .pipe(
                                  shareReplay()
                                );
  }

  initProducts(skip: number = 0, take: number = 10) {
    let url = this.baseUrl + `?$skip=${skip}&$top=${take}&$orderby=ModifiedDate%20desc`;

    this
      .http
      .get<Product[]>(url)
      .pipe(
        delay(1500),
        tap(console.table),
        shareReplay()
      )
      .subscribe(
        productsFromServer => {
          let currentProducts = this.products.value;
          let mergedProducts = currentProducts.concat(productsFromServer);

          this.products.next(mergedProducts);
        }
      );
  }

  insertProduct(newProduct: Product): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, newProduct).pipe(delay(2000));
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(this.baseUrl + id);           
  }
}
