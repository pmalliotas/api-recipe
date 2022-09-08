import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { $ref, ISignInRequest, IRegisterRequest } from './user.schemas'
import { addUserToDatabase, findUserByEmail, findUserByEmailorUsername, findUserByUsername } from "./user.services"
import bcrypt from 'bcrypt'
import { isAuth } from "../../middlewares/auth"

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
        const userEmailExists = Boolean(userEmail)
        if (userEmailExists) {
            reply.status(406).send({
                message: req.t('user_email_exists')
            })
        }

        const userName = await findUserByUsername(username)
        const userNameExists = Boolean(userName)
        if (userNameExists) {
            reply.status(406).send({
                message: req.t('user_name_exists')
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await addUserToDatabase({ email, username, password: hashedPassword })

        const jwtSigned = server.jwt.sign({
            id: user?.id,
            email: user?.email,
            roles: user?.roles,
            iat: Date.now() + 30000
        })

        reply.status(201).send({
            jwt: jwtSigned,
            message: req.t('user_name_exists')
        })
    })

    server.post('/sign-in', {
        schema: {
            body: $ref('signInRequest'),
            response: {
                201: $ref('signInResponse')
            }
        },
    }, async (req: FastifyRequest<{ Body: ISignInRequest }>, reply: FastifyReply) => {
        const { email, password, username } = req.body

        if (!email && !username) {
            reply.status(403).send({
                message: req.t('user_credentials_missing')
            })
        }

        const userField = email || username

        const user = await findUserByEmailorUsername(userField as string)
        if (!user) {
            reply.status(406).send({
                message: req.t('user_not_found')
            })
        }

        const isAuthenticated = await bcrypt.compare(password, user!.password as string)
        if (!isAuthenticated) {
            reply.status(403).send({
                message: req.t('user_wrong_password')
            })
        }

        const jwtSigned = server.jwt.sign({
            id: user?.id,
            email: user?.email,
            roles: user?.roles,
            iat: Date.now() + 30 * 60 * 1000
        })

        reply.status(201).send({
            jwt: jwtSigned
        })
    })

    server.get('/test', {
        preHandler: [isAuth]
    }, async (req: FastifyRequest, reply: FastifyReply) => {
        console.log(req.user_data)
        reply.status(201).send({ message: 'It\'s ok' })
    })
}


export default userRoutes