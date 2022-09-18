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

export const findUserById = async (id: number) => {
    try {
        const user = await db.selectFrom('users').selectAll().where('id', '=', id).executeTakeFirst()
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

export const updateUserPassword = async (userId: number, password: string) => {
    try {
        const dbUser = await db.updateTable('users').set({ password }).where('id', '=', userId).returningAll().executeTakeFirst()
        return dbUser
    } catch (error) {
        console.log(error)
    }
}

export const updateUserImage = async (userId: number, imageUrl: string) => {
    try {
        const dbUser = await db.updateTable('users').set({ image: imageUrl }).where('id', '=', userId).returning('image').execute()
        return dbUser
    } catch (error) {
        console.log(error)
    }
}

export const removeUserImage = async (userId: number) => {
    try {
        const dbUser = await db.updateTable('users').set({ image: undefined }).where('id', '=', userId).returning('image').execute()
        return dbUser
    } catch (error) {
        console.log(error)
    }
}