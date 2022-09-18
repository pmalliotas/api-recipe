import { FastifyHelmetOptions } from "@fastify/helmet"
import { fastifyEnvOpt } from "@fastify/env"
import { RateLimitPluginOptions } from '@fastify/rate-limit'
import { FastifyCorsOptions } from '@fastify/cors'
import { JWT } from "@fastify/jwt"
import path from "path"
import { TFunction } from "i18next"
import multer from 'fastify-multer'

// import lng from '../../locales/el/translation.json'
import { IFileType } from '../types/general'

declare module 'fastify' {
    interface FastifyInstance {
        config: {
            PORT: number,
            NODE_ENV: string,
            JWT_SECRET: string,
            DB_CONNECTION_URL: string,
            REDIS_CONNECTION_URL: string
        },
    }

    interface FastifyRequest {
        jwt: JWT
        user_data: {
            id: number
            email: string
            roles: number[]
            iat: number
        }
        file: IFileType
    }
}

declare module "@fastify/jwt" {
    interface FastifyJWT {
        id: number
        email: string
        roles: number[]
        iat: number
    }
}

export const helmetConfig: FastifyHelmetOptions = {
    global: true,
}

export const rateLimitConfig: RateLimitPluginOptions = {
    max: 100,
    timeWindow: 60 * 1000
}

export const corsConfig: FastifyCorsOptions = {
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type'],
}

const upload = multer({
    limits: {
        fileSize: 192000,
    },
    fileFilter: (req, file, cb) => {
        if (!(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/webp')) {
            return cb(new Error(`${file.originalname}'s filetype is not allowed`));
        }
        cb(null, true);
    },
})

export const uploadSingleFile = upload.single('image')
export const uploadMultipleFiles = upload.array('images', 10)

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
