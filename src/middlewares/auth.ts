
// // import { AuthRequest, JWTPayload } from '../types/types'
// import jwt, { GetPublicKeyOrSecret, JwtPayload } from 'jsonwebtoken'

// import { FastifyReply, FastifyRequest } from 'fastify'

// export const isAuth = (req: FastifyRequest, reply: FastifyReply) => {
//     try {
//         const authHeader = req.headers.authorization
//         if (!authHeader) {
//             reply.status(401).send({ message: 'Authorization header not found' })
//         }
//         const token = authHeader?.split(' ')[1].toString()

//         if (!token) {
//             reply.status(401).send({ message: 'Unauthenticated. Authentication token not found!' })
//         }

//         const decoded = jwt.verify(token as string, process.env.JWT_SECRET_KEY as string) as JwtPayload

//         if (Date.now() < decoded.iat * 1000) {
//             reply.status(403).send({ message: 'Auth token expired' })
//         }

//         req.user = decoded

//     } catch (err) {
//         reply.status(500).send({
//             message: 'Something went wrong'
//         })
//     }
// }

// export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
//     try {
//         const authHeader = req.headers?.authorization
//         if (!authHeader) {
//             return next()
//         }

//         const token = authHeader.split(' ')[1].toString()

//         if (!token) {
//             return next()
//         }

//         const decoded = <JWTPayload>jwt.verify(token, process.env.JWT_SECRET_KEY)

//         if (Date.now() < decoded.iat * 1000) {
//             throw customError(403, 'Auth token expired')
//         }

//         req.userData = decoded
//         next()
//     } catch (err) {
//         next()
//     }
// }

// export const isAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
//     try {
//         const authHeader = req.headers.authorization

//         if (!authHeader) {
//             throw customError(401, 'Authorization header not found')
//         }
//         const token = authHeader.split(' ')[1].toString()

//         if (!token) {
//             throw customError(401, 'Authorization token not found')
//         }

//         const decoded = <JWTPayload>jwt.verify(token, process.env.JWT_SECRET_KEY)

//         if (Date.now() < decoded.iat * 1000) {
//             throw customError(403, 'Auth token expired')
//         }

//         req.userData = decoded

//         const userDoc = await User.findOne({ _id: decoded.userId, roles: { $in: 5150 } })

//         if (!userDoc) {
//             throw customError(401, 'User does not have administrative priviledges')
//         }

//         next()
//     } catch (err) {
//         next(err)
//     }
// }
