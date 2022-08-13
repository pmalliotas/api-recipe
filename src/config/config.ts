import { FastifyHelmetOptions } from "@fastify/helmet";
import { fastifyEnvOpt } from "@fastify/env";
import { RateLimitPluginOptions } from '@fastify/rate-limit'
import { JWT } from "@fastify/jwt";
import lng from '../../locales/el/translation.json'
import { TFunction } from "i18next";

declare module 'fastify' {
    interface FastifyInstance {
        config: {
            PORT: number,
            ENV: string,
            JWT_SECRET: string,
            DB_CONNECTION_URL: string,
            REDIS_CONNECTION_URL: string
        }
    }

    interface FastifyRequest {
        jwt: JWT;
        t: (language_key: keyof typeof lng) => string & TFunction
    }


    export interface FastifyInstance {
        authenticate: any;
    }
}

declare module "@fastify/jwt" {
    interface FastifyJWT {
        user: {
            id: number;
            email: string;
            roles: number[]
        };
    }
}

export const helmetConfig: FastifyHelmetOptions = {
    global: true,
}

export const rateLimitConfig: RateLimitPluginOptions = {
    max: 100,
    timeWindow: 60 * 1000
}

export const envConfig: fastifyEnvOpt = {
    dotenv: {
        path: `${__dirname}/../../.env`,
        debug: true
    },
    schema: {
        type: 'object',
        required: ['PORT', 'ENV', 'JWT_SECRET'],
        properties: {
            PORT: {
                type: 'number',
                default: 3000
            },
            ENV: {
                type: 'string',
                default: 'development'
            },
            JWT_SECRET: {
                type: 'string',
                default: 'fOowujOnqmoTnssS7x9qxo4d'
            },
            DB_CONNECTION_URL: {
                type: 'string'
            },
            REDIS_CONNECTION_URL: {
                type: 'string',
                default: 'redis://127.0.0.1'
            }
        }
    }
}
