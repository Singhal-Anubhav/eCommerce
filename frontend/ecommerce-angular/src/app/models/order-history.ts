export class OrderHistoryModel {

    constructor(public id: string,
        public orderTrackingNumber: string,
        public totalPrice: number,
        public totalQuantity: number,
        public dateCreated: number
    ){}
}
