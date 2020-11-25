const chance = require('chance')

const Drive = use('Drive')

class FileStorage {
  static async store(file, { acl, deleteKey } = {}) {
    // upload file
    const guid = chance().guid()
    const filename = `${guid}.${file.subtype}`

    await Drive.put(filename, file.stream, {
      ContentType: file.headers['content-type'],
      ACL: acl || 'public-read',
    })

    const exists = deleteKey && (await Drive.exists(deleteKey))

    if (exists) {
      await Drive.delete(deleteKey)
    }

    const fileUrl = Drive.getUrl(filename)
    return {
      filename,
      fileUrl,
    }
  }
}

module.exports = FileStorage
