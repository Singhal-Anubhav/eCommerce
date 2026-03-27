import { Product } from "../../models/product";
import { ProductCategory } from "../../models/product-category";

export class ProductServiceModel {
}

export interface GetResponseProduct {
    _embedded: {
        products: Product[];
    },
    page: {
        size: number,
        totalElements: number,
        totalPages: number,
        number: number
    }
}

export interface GetResponseProductCategory {
    _embedded: {
        productCategory: ProductCategory[];
    }
}

