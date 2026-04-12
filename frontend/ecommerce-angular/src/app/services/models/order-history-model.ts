import { OrderHistoryModel } from "../../models/order-history"

export interface GetOrderHistoryResponse {
    _embedded:{
        orderses: OrderHistoryModel[]
    }
}