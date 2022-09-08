import { User } from "../../db/schemas"

import { db } from "../../config/server"

export const findUserByEmail = async (email: string) => {
    try {
        const user = await db.selectFrom('users').selectAll().where('email', '=', email).executeTakeFirst()
        return user
    } catch (error) {
        console.log(error)
    }
}

export const findUserByEmailorUsername = async (field: string) => {
    try {
        const user = await db.selectFrom('users').selectAll().where('email', '=', field).orWhere('username', '=', field).executeTakeFirst()
        return user
    } catch (error) {
        console.log(error)
    }
}

export const findUserByUsername = async (username: string) => {
    try {
        const user = await db.selectFrom('users').selectAll().where('username', '=', username).executeTakeFirst()
        return user
    } catch (error) {
        console.log(error)
    }
}

export const addUserToDatabase = async (user: Pick<User, 'email' | 'password' | 'username'>) => {
    try {
        const dbUser = await db.insertInto('users').values({ ...user }).returningAll().executeTakeFirst()
        return dbUser
    } catch (error) {
        console.log(error)
    }
}