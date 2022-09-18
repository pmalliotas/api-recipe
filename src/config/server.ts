import fastify from 'fastify'
import fastifyHelmet from '@fastify/helmet'
import fastifyRateLimit from '@fastify/rate-limit'
import fastifyJwt from '@fastify/jwt'
import fastifyEnv from '@fastify/env'
import fastifyMulter from 'fastify-multer'
import fastifyRedis from '@fastify/redis'
import fastifySwagger from '@fastify/swagger'
import fastifyStatic from '@fastify/static'
import { withRefResolver } from 'fastify-zod'

import fastifyCors from '@fastify/cors'
import { Kysely, PostgresDialect } from 'kysely'
import { Pool } from 'pg'

import { version } from '../../package.json'
import { Database } from '../db/schemas'

// import configs
import { helmetConfig, envConfig, rateLimitConfig, corsConfig } from './config'

// import routes
import usersRoutes from '../routes/user/user.routes'

// import schemas
import { userSchemas } from '../routes/user/user.schemas'
import path from 'path'

// Start building the server
const server = fastify()

export const db = new Kysely<Database>({
    dialect: new PostgresDialect({
        pool: new Pool({
            // connectionString: process.env.DB_CONNECTION_URL,
            host: 'localhost',
            database: 'recipe_app',
            user: 'panos',
            password: 'sakasaka'
        })
    })
})

const buildServer = async () => {
    //Register middlewares
    server.register(fastifyHelmet, helmetConfig)
    server.register(fastifyRateLimit, rateLimitConfig)
    server.register(fastifyCors, corsConfig)
    server.register(fastifyEnv, envConfig).ready((err => { err && console.log(err) }))
    server.register(fastifyMulter.contentParser)

    await server.after()

    server.register(fastifyStatic, {
        root: path.join(path.resolve(), 'public'),
        prefix: '/public/',
    })

    // server.register(fastifyRedis, { url: server.config.REDIS_CONNECTION_URL })
    server.register(fastifyJwt, { secret: server.config.JWT_SECRET })

    for (const schema of [...userSchemas]) {
        server.addSchema(schema);
    }

    server.register(
        fastifySwagger,
        withRefResolver({
            routePrefix: "/docs",
            exposeRoute: true,
            staticCSP: true,
            openapi: {
                info: {
                    title: "Recipe App API",
                    description: "API for Recipe APP",
                    version,
                },
            },
        })
    )

    server.register(usersRoutes, { prefix: 'api/users' })

    return server
}

export default buildServer