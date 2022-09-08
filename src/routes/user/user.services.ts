import { User } from "../../db/schemas"

import { db } from "../../config/server"

export const findUserByEmail = async (email: string) => {
    try {
        const userEmail = await db.selectFrom('users').select('email').where('email', '=', email).execute()
        console.log(userEmail)
        return userEmail
    } catch (error) {
        console.log(error)
    }
}

export const findUserByUsername = async (username: string) => {
    try {
        const userName = await db.selectFrom('users').select('username').where('username', '=', username).execute()
        return userName
    } catch (error) {
        console.log(error)
    }
}

export const addUserToDatabase = async (user: Pick<User, 'email' | 'password' | 'username'>) => {
    try {
        const addedUserId = await db.insertInto('users').values({ ...user }).returning('id').execute()
        return addedUserId
    } catch (error) {
        console.log(error)
    }
}