const fs = require('fs')
const S3 = require('aws-sdk/clients/s3')

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
})

module.exports = {

    //upload file to s3
    uploadFile: (file)=> {
        const fileStream = fs.createReadStream(file.path)

    const uploadParam = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename
    }

    return s3.upload(uploadParam).promise()
    },

    //dowload file from s3
    getFileStream: (fileKey) => {
        const downloadParams = {
            Key: fileKey,
            Bucket: bucketName
        }

        return s3.getObject(downloadParams).createReadStream()
    },

    //delete file after upload
    deleteFile: (path) => {
        fs.unlink(path, (err) => {
            if (err) {
              console.error(err)
              return
            }
          
            //file removed
          })
    
    }
    
}




