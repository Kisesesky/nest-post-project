import { registerAs } from "@nestjs/config";

export default registerAs('social', ()=>({
    googleClientId : process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleClientCallBackUrl: process.env.GOOGLE_CLIENT_CALLBACKURL
}))