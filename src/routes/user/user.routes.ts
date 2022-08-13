import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { $ref, ILoginInput } from './user.schemas'

const userRoutes = async (server: FastifyInstance) => {

    server.post('/', {
        schema: {
            body: $ref('createUserSchema'),
            response: {
                201: $ref('createUserResponseSchema')
            }
        },
    }, async (req: FastifyRequest<{ Body: ILoginInput }>, reply) => {
        reply.status(201).send({
            ...req.body,
            id: 1,
            message: req.t('user_created')
        })
    })

}

export default userRoutes