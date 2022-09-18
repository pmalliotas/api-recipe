import path from 'path'
import fs from 'fs'
import { IFileType } from '../types/general'

import { v4 as uuid } from 'uuid'

export const getUsersFilePath = () => {
    return path.join(path.resolve(), 'public', 'images', 'users')
}

export const getRecipeFilePath = (recipeId: number) => {
    return path.join(path.resolve(), 'public', 'images', 'recipes', recipeId.toString())
}

export const getRecipesFilePath = () => {
    return path.join(path.resolve(), 'public', 'images', 'recipes')
}

export const getFileExtension = (mimeType: string) => {
    return `.${mimeType.split('/')[1]}`
}

export const uploadImage = (basePath: string, image: IFileType, customFileName?: string) => {
    try {
        const fileExtension = getFileExtension(image.mimetype)
        if (!fs.existsSync(basePath)) {
            fs.mkdirSync(basePath, { recursive: true })
        }

        const randomId = uuid()

        const fileName = (customFileName || randomId) + fileExtension
        const imageUrl = `${basePath}/${fileName}`
        const stream = fs.createWriteStream(imageUrl)

        stream.once('open', () => {
            stream.write(image.buffer)
            stream.end()
        })

        return randomId + fileExtension
    } catch (err) {
        console.log(err)
        return err
    }
}

export const removeFile = (filePath: string) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            return {
                message: 'Could not remove file from server'
            }
        }
    })
    return filePath
}

export const removePath = (pathName: string) => {
    try {
        fs.rm(pathName, { recursive: true }, (err) => {
            if (err) {
                return {
                    message: 'Could not remove path from server'
                }
            }
        })
        return pathName
    } catch (err) {
        console.log(err)
        return err
    }
}
