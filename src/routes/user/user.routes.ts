import { FastifyInstance, FastifyReply, FastifyRequest, preHandlerHookHandler } from "fastify"
import { $ref } from './user.schemas'
import { isAuth } from '../../middlewares/auth'
import { onRegister, onSignIn, onUploadImage } from './user.controller'
import { uploadSingleFile } from '../../config/config'

const userRoutes = async (server: FastifyInstance) => {
    server.post('/register', {
        schema: {
            body: $ref('registerRequest'),
            response: {
                201: $ref('registerResponse'),
            }
        },
    }, onRegister(server))

    server.post('/sign-in', {
        schema: {
            body: $ref('signInRequest'),
            response: {
                201: $ref('signInResponse')
            }
        },
    }, onSignIn(server))

    server.post('/upload-image', {
        preHandler: [isAuth, uploadSingleFile]
    },
        onUploadImage(server)
    )

    server.get('/test', {
        preHandler: [isAuth]
    }, async (req: FastifyRequest, reply: FastifyReply) => {
        console.log(req.user_data)
        reply.status(201).send({ message: 'It\'s ok' })
    })
}

export default userRoutes