// const Jimp = require("jimp")
import fs from "fs"
import path from "path"
import moment from "moment"
import sharp from "sharp"

/**
 * Удаление папки с картинками
 * @param {*} customPath
 */
const DeleteFolder = async customPath => {
    const fullPath = path.join(__dirname, customPath)
    await fs.rmdirSync(fullPath, {recursive: true})
    // rimraf("/some/directory", function () { console.log("done"); });
}

const MoveFile = async ({oldPath, newPath, folderPath, nameImage}) => {
    // Путь к папке
    const fullFolderPath = path.join(__dirname, folderPath)
    // Создание папки
    if (!fs.existsSync(fullFolderPath)) fs.mkdirSync(fullFolderPath)
    const fullOldPath = path.join(__dirname, oldPath)
    const fullNewPath = path.join(__dirname, newPath)
    await fs.rename(fullOldPath, fullNewPath, () => {
    })
    return nameImage
}

function getFilesizeInBytes(filename) {
    const stats = fs.statSync(filename)
    return stats.size
}

type UploadImageType = (data: {
    folderPath: string
    imagePatch: string
    fileImage: string | Buffer
    nameFile?: string
    width?: number
    quality?: number
}) => Promise<[string, string, number]>

/**
 * Сохранение изображения
 * @param {*} config
 * @returns
 */
const UploadImage: UploadImageType = async (
    {
        folderPath,
        imagePatch,
        fileImage,
        nameFile = "image",
        width = null,
        quality = 100
    }
) => {
    // Путь к папке
    const fullFolderPath = path.join(__dirname, folderPath)
    // Создание папки
    if (!fs.existsSync(fullFolderPath)) fs.mkdirSync(fullFolderPath)

    // Картинку в буфер
    const buf =
        typeof fileImage === "string"
            ? Buffer.from(
                fileImage.replace(/^data:image\/\w+;base64,/, ""),
                "base64"
            )
            : fileImage.buffer

    const ext = "webp"
    // Название файла
    const imageName = `${nameFile}.${moment().valueOf()}.${ext}`
    // Путь к файлу
    const imagePath = `${imagePatch}/${imageName}`

    await sharp(buf)
        .webp({quality})
        .resize(width)
        .toFile(path.join(fullFolderPath, imageName))

    const sizeBytes = getFilesizeInBytes(
        path.join(fullFolderPath, imageName)
    )
    const sizeKilobytes = Math.ceil(sizeBytes / 1000)

    return [imagePath, imageName, sizeKilobytes]
}

/**
 * Удалить все изображения кроме передаваемого изображения
 * @param {*} folderPath
 * @param {*} filePath
 */
const DeleteImagesExceptCurrent = async (folderPath, filePath) => {
    // Полный путь к папке
    const fullFolderPath = path.join(__dirname, folderPath)
    // Файлы в папке
    const files = await fs.readdirSync(fullFolderPath, {
        withFileTypes: true
    })
    await Promise.all(
        await files
            // Проверка на файл
            .filter(file => file.isFile())
            .map(async file => {
                // Удалить все файлы кроме переданного
                if (!(filePath && filePath.includes(file.name)))
                    await fs.unlinkSync(
                        path.join(fullFolderPath, file.name)
                    )
            })
    )
}

/**
 * Удаление картинки
 * @param {*} filePath
 */
const DeleteImage = async filePath => {
    // Полный путь, к файлу
    const fullFilePath = path.join(__dirname, `../../../public/${filePath}`)
    // Проверка на наличия файла
    if (fs.existsSync(fullFilePath))
        // Удаление файла
        await fs.unlinkSync(fullFilePath)
}

export default {
    MoveFile,
    UploadImage,
    DeleteFolder,
    DeleteImagesExceptCurrent,
    DeleteImage
}
