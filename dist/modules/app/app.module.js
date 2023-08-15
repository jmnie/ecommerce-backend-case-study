"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const app_controller_1 = require("./app.controller");
const order_module_1 = require("../order/order.module");
const typeorm_1 = require("@nestjs/typeorm");
const path_1 = require("path");
const middleware_config_1 = require("../../config/middleware.config");
const wechatAPI_module_1 = require("../wechatAPIToken/wechatAPI.module");
const nestjs_redis_1 = require("@liaoliaots/nestjs-redis");
const { database, redisCache, redisConfig } = (0, middleware_config_1.getMiddleConfig)();
const entities = process.env.NODE_ENV === 'production' ? ['*.entity.js'] : [(0, path_1.join)(__dirname, '**', '*.entity.{ts,js}')];
const TypeOrmModuleInstance = typeorm_1.TypeOrmModule.forRoot({
    type: 'mysql',
    host: database.host,
    port: database.port,
    username: database.username,
    password: database.password,
    database: database.database,
    entities: [],
    synchronize: true,
    autoLoadEntities: true,
    retryAttempts: 3,
    cache: {
        type: 'redis',
        options: {
            host: redisCache.host,
            port: redisCache.port,
        },
        duration: redisCache.duration,
    },
});
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
        imports: [
            typeorm_1.TypeOrmModule,
            TypeOrmModuleInstance,
            wechatAPI_module_1.WeChatAPIModule,
            order_module_1.OrderModule,
            nestjs_redis_1.RedisModule.register({
                host: redisConfig.host,
                port: redisConfig.port,
                name: redisConfig.name
            }),
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map