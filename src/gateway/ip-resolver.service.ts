import { Injectable } from '@nestjs/common';

@Injectable()
export class IpResolverService {
    private readonly services = {
        auth: {
            local: 'http://localhost:8081/api/v1/',
            dev: null,
            prod: 'app.svc.cluster.asdasdd:/',
        },
    };
    constructor(
    ) {}


    resolve(serviceName) {
        return this.services.auth.local;
    }
}