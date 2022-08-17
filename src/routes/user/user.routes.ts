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
    }, async (req: FastifyRequest<{ Body: ILoginInput, Querystring: { id: string } }>, reply) => {

        const res = await server.knex('users').select('created_at', 'email', 'password', 'id').where('id', 1)
        console.log(res[0])

        reply.status(201).send({
            ...res[0],
            message: req.t('user_created')
        })
    })

}

export default userRoutes