import bcrypt from 'bcrypt'
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"

import { IRegisterRequest, ISignInRequest } from "./user.schemas"
import { addUserToDatabase, findUserByEmail, findUserByEmailorUsername, findUserById, findUserByUsername, updateUserImage } from "./user.services"

import { getUsersFilePath, removeFile, uploadImage } from '../../lib/file.utils'
import path from 'path'

export const onRegister = (server: FastifyInstance) => async (req: FastifyRequest<{ Body: IRegisterRequest }>, reply: FastifyReply) => {
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
}

export const onSignIn = (server: FastifyInstance) => async (req: FastifyRequest<{ Body: ISignInRequest }>, reply: FastifyReply) => {
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
        id: user!.id,
        email: user!.email,
        roles: user!.roles,
        iat: Date.now() + 30 * 60 * 1000
    })

    reply.status(201).send({
        jwt: jwtSigned
    })
}

export const onUploadImage = (server: FastifyInstance) => async (req: FastifyRequest, reply: FastifyReply) => {
    const user = await findUserById(req.user_data.id)

    if (user) {
        removeFile(path.join(getUsersFilePath(), user.image as string))
    }

    const fileName = uploadImage(getUsersFilePath(), req.file)

    await updateUserImage(req.user_data.id, fileName as string)

    reply.status(201).send({ message: 'File uploaded successfully' })
}
