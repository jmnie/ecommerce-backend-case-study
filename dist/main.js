"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./modules/app/app.module");
const app_config_1 = require("./config/app.config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const { host, port } = (0, app_config_1.getAppConfig)().config;
    await app.listen(port, host);
}
bootstrap();
//# sourceMappingURL=main.js.map