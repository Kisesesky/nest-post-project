import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SocialConfigService {
    constructor(private configService: ConfigService) {}

    get googleClientId() {
        return this.configService.get<string>('social.googleClientId')
    }

    get googleClientSecret() {
        return this.configService.get<string>('social.googleClientSecret')
    }

    get googleClientCallBackUrl() {
        return this.configService.get<string>('social.googleClientCallBackUrl')
    }
}