import fastify from 'fastify'
import fastifyHelmet from '@fastify/helmet'
import fastifyRateLimit from '@fastify/rate-limit'
import fastifyJwt from '@fastify/jwt'
import fastifyEnv from '@fastify/env'
import fastifyRedis from '@fastify/redis'
import fastifySwagger from '@fastify/swagger'
import { withRefResolver } from 'fastify-zod'
import i18next from 'i18next'
import i18nextFsBackend from 'i18next-fs-backend'
import i18nextMiddleware from 'i18next-http-middleware'
import knex from 'knex'

import { version } from '../../package.json'

// import configs
import { helmetConfig, envConfig, rateLimitConfig } from './config'

// import routes
import usersRoutes from '../routes/user/user.routes'

// import schemas
import { userSchemas } from '../routes/user/user.schemas'

// Set up i18next
i18next.use(i18nextFsBackend).use(i18nextMiddleware.LanguageDetector).init({
    fallbackLng: 'en',
    preload: ['el', 'en'],
    backend: {
        loadPath: './locales/{{lng}}/translation.json',
    },
    keySeparator: false
})

// Start building the server
const server = fastify()

const buildServer = async () => {

    //Register middlewares
    server.register(fastifyHelmet, helmetConfig)
    server.register(fastifyRateLimit, rateLimitConfig)
    server.register(fastifyEnv, envConfig).ready((err => { err && console.log(err) }))
    server.register(i18nextMiddleware.plugin, { i18next })

    await server.after()

    const pg = knex({
        client: 'pg',
        connection: server.config.DB_CONNECTION_URL
    })

    // server.register(fastifyRedis, { url: server.config.REDIS_CONNECTION_URL })
    server.decorate('knex', pg)
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