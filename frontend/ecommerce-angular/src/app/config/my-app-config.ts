export default {
    auth: {
        domain: "dev-g67prsypsiyjcpd6.us.auth0.com",
        clientId: "o2ZZDkdp6Ef30wLCgjZ6Bzmx3kqYOYFD",
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
