import { FastifyHelmetOptions } from "@fastify/helmet";
import { fastifyEnvOpt } from "@fastify/env";
import { RateLimitPluginOptions } from '@fastify/rate-limit'
import { JWT } from "@fastify/jwt";
import path from "path";
import { TFunction } from "i18next";

import lng from '../../locales/el/translation.json'
import { Knex } from "knex";

declare module 'fastify' {
    interface FastifyInstance {
        config: {
            PORT: number,
            NODE_ENV: string,
            JWT_SECRET: string,
            DB_CONNECTION_URL: string,
            REDIS_CONNECTION_URL: string
        },
        knex: Knex
    }

    interface FastifyRequest {
        jwt: JWT;
        t: (key: keyof typeof lng) => string & TFunction
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
        path: path.join(path.resolve(), '.production.env'),
        debug: true
    },
    schema: {
        type: 'object',
        required: ['PORT', 'NODE_ENV', 'JWT_SECRET', 'DB_CONNECTION_URL', 'REDIS_CONNECTION_URL'],
        properties: {
            PORT: {
                type: 'number',
                default: 3000
            },
            NODE_ENV: {
                type: 'string',
                default: 'development'
            },
            JWT_SECRET: {
                type: 'string',
                default: 'fOowujOnqmoTnssS7x9qxo4d'
            },
            DB_CONNECTION_URL: {
                type: 'string',
                default: 'postgresql://127.0.0.1:5432'
            },
            REDIS_CONNECTION_URL: {
                type: 'string',
                default: 'redis://127.0.0.1'
            }
        }
    }
}
