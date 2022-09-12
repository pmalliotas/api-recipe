
export interface IFileType {
    file: {
        fieldname: string,
        originalname: string,
        encoding: string,
        mimetype: 'image/png' | 'image/jpeg' | 'image/jpg' | 'image/webp',
        buffer: Buffer,
        size: number
    }
}