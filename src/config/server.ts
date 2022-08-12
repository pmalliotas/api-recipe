import fastify from 'fastify'
import fastifyHelmet from '@fastify/helmet'
import fastifyRateLimit from '@fastify/rate-limit'
import fastifyJwt from '@fastify/jwt'
import fastifyEnv from '@fastify/env'
import fastifyPostgres from '@fastify/postgres'
import fastifyRedis from '@fastify/redis'
import fastifySwagger from '@fastify/swagger'
import { withRefResolver } from 'fastify-zod'
import { version } from '../../package.json'

// import configs
import { helmetConfig, envConfig, rateLimitConfig } from './config'

// import routes
import usersRoutes from '../routes/users/users.route'

// import schemas
import { userSchemas } from '../routes/users/users.schemas'


// Start building the server
const server = fastify()

const buildServer = async () => {

    //Register middlewares
    server.register(fastifyHelmet, helmetConfig)
    server.register(fastifyRateLimit, rateLimitConfig)
    server.register(fastifyEnv, envConfig).ready((err => { err && console.log(err) }))

    await server.after()

    // server.register(fastifyRedis, { url: server.config.REDIS_CONNECTION_URL })
    // server.register(fastifyPostgres, { connectionString: server.config.DB_CONNECTION_URL })
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
                    title: "Fastify API",
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