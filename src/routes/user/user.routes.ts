import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { $ref, ISignInRequest, IRegisterRequest } from './user.schemas'
import { addUserToDatabase, findUserByEmail, findUserByUsername } from "./user.services"
import bcrypt from 'bcrypt'

const userRoutes = async (server: FastifyInstance) => {
    server.post('/register', {
        schema: {
            body: $ref('registerRequest'),
            response: {
                201: $ref('registerResponse'),
            }
        },
    }, async (req: FastifyRequest<{ Body: IRegisterRequest }>, reply) => {

        const { email, username, password, confirmPassword } = req.body

        if (password !== confirmPassword) {
            reply.status(403).send({
                message: 'Passwords do not match'
            })
        }

        const userEmail = await findUserByEmail(email)
        const userEmailExists = Boolean(userEmail?.length)
        if (userEmailExists) {
            reply.status(406).send({
                message: req.t('user_email_exists')
            })
        }

        const userName = await findUserByUsername(username)
        const userNameExists = Boolean(userName?.length)
        if (userNameExists) {
            reply.status(406).send({
                message: req.t('user_name_exists')
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const addedUserId = await addUserToDatabase({ email, username, password: hashedPassword })

        reply.status(201).send({
            jwt: 'saka',
            message: req.t('user_name_exists')
        })
    })

}

export default userRoutes