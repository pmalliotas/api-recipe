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

        const user = await server.knex('users').select('created_at', 'email', 'password', 'id').where('id', 1)
        console.log(user[0])

        const comments = await server.knex('comments').innerJoin('users', 'comments.user_id', '=', 'users.id')
        console.log('🚀 ~ file: user.routes.ts ~ line 19 ~ userRoutes ~ comments', comments[0]);

        reply.status(201).send({
            ...user[0],
            message: req.t('user_created')
        })
    })

}

export default userRoutes