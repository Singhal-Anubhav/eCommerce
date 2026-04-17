export default {
    auth: {
        domain: "<Auth - DOMAIN>",
        clientId: "<Auth Client Id>",
        authorizationParams: {
            redirect_uri: "https://localhost:4200/",
            audience: "http://localhost:8080"
        },
    },
    httpInterceptor: {
        allowedList: [
            'http://localhost:8080/api/orders/**',
            'http://localhost:8080/api/checkout/purchase',
            'http://localhost:8080/api/orderses/**'
        ],
    },
}
