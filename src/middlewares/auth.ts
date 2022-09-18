import jwt from 'jsonwebtoken'
import { DoneFuncWithErrOrRes, FastifyReply, FastifyRequest } from 'fastify'
import { FastifyJWT } from '@fastify/jwt'

export const isAuth = (req: FastifyRequest, reply: FastifyReply, next: DoneFuncWithErrOrRes) => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        reply.status(401).send({ message: 'Authorization header not found' })
    }
    const token = authHeader?.split(' ')[1]?.toString()

    if (!token) {
        reply.status(401).send({ message: 'Authentication token not found!' })
    }

    const decoded = jwt.verify(token as string, process.env.JWT_SECRET as string) as FastifyJWT

    if (Date.now() > decoded.iat * 1000) {
        reply.status(403).send({ message: 'Auth token expired' })
    }

    req.user_data = decoded
    next()
}

export const isAdmin = (req: FastifyRequest, reply: FastifyReply, next: DoneFuncWithErrOrRes) => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        reply.status(401).send({ message: 'Authorization header not found' })
    }
    const token = authHeader?.split(' ')[1]?.toString()

    if (!token) {
        reply.status(401).send({ message: 'Authentication token not found!' })
    }

    const decoded = jwt.verify(token as string, process.env.JWT_SECRET as string) as FastifyJWT

    if (Date.now() > decoded.iat * 1000) {
        reply.status(403).send({ message: 'Auth token expired' })
    }

    if (!decoded.roles.includes(5150)) {
        reply.status(401).send({
            message: 'User is not administrator'
        })
    }

    req.user_data = decoded
    next()
}