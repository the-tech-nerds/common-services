export default {
  auth: {
    local: 'http://localhost:8081',
    dev: null,
    prod: 'http://auth-service.default.svc.cluster.local:3000',
  },
  product: {
    local: 'http://localhost:8082',
    dev: null,
    prod: 'http://product-service.default.svc.cluster.local:3000',
  },
};
