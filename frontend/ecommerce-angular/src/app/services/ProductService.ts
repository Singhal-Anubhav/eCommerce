import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../models/product';
import { ProductCategory } from '../models/product-category';
import { GetResponseProduct, GetResponseProductCategory } from './models/product-service-model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = environment.eCommerceApiUrl + '/products';

  private categoryUrl = environment.eCommerceApiUrl + '/product-category';

  constructor(private httpClient: HttpClient) { }

  public getProductById(id: number): Observable<Product> {
    const searchUrl = `${this.baseUrl}/${id}`;
    return this.httpClient.get<Product>(searchUrl);
  }

  public getProductList(theCategoryId: number): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
    return this.httpResponse(searchUrl);
  }

  public searchProducts(name: string): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${name}`;
    return this.httpResponse(searchUrl);
  }

  private httpResponse(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProduct>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  public getProductCategoryList(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  public getProductListPaginate(theCategoryId: number,
    thePage: number,
    thePageSize: number): Observable<GetResponseProduct> {
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
      + `&page=${thePage}&size=${thePageSize}`;
    return this.httpResponsePaginate(searchUrl);
  }

  public searchProductsPaginate(name: string, thePage: number,
    thePageSize: number): Observable<GetResponseProduct> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${name}`
      + `&page=${thePage}&size=${thePageSize}`;
    return this.httpResponsePaginate(searchUrl);
  }

  private httpResponsePaginate(searchUrl: string): Observable<GetResponseProduct> {
    return this.httpClient.get<GetResponseProduct>(searchUrl);
  }

}
