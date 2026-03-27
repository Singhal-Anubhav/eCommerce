import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../models/product';
import { ProductCategory } from '../models/product-category';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'http://localhost:8080/api/products';

  private categoryUrl = 'http://localhost:8080/api/product-category';

  constructor(private httpClient: HttpClient){}

  public getProductList(theCategoryId: number): Observable<Product[]>{
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
    return this.httpResponse(searchUrl);
  }

   public searchProducts(name: string): Observable<Product[]>{
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${name}`;
    return this.httpResponse(searchUrl);
  }

  public getProductById(id: number): Observable<Product>{
    const searchUrl = `${this.baseUrl}/${id}`;
    return this.httpClient.get<Product>(searchUrl);
  }
  private httpResponse(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProduct>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  public getProductCategoryList(): Observable<ProductCategory[]>{
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

}

export interface GetResponseProduct {
  _embedded:{
    products: Product[];
  }
}

export interface GetResponseProductCategory {
  _embedded:{
    productCategory: ProductCategory[];
  }
}
