
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.GridFS;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using  FileApi.Models; 
namespace FileApi.Services
{
    public class MongoDbService
    {
        private readonly IMongoDatabase _database;
        private readonly GridFSBucket _gridFsBucket;

        public MongoDbService()
        {
            var client = new MongoClient("mongodb://localhost:27017");
            _database = client.GetDatabase("FileDatabase");
            _gridFsBucket = new GridFSBucket(_database);
        }

        //  Upload File to GridFS
        public async Task<string> UploadFileAsync(Stream fileStream, string fileName, string description)
        {
            var options = new GridFSUploadOptions
            {
                Metadata = new BsonDocument
                {
                    { "description", description }
                }
            };

            var fileId = await _gridFsBucket.UploadFromStreamAsync(fileName, fileStream, options);
            return fileId.ToString();
        }

        //  Get All Files from GridFS
        public async Task<List<object>> GetAllFilesAsync()
    {
        var filter = Builders<GridFSFileInfo<ObjectId>>.Filter.Empty;
        using var cursor = await _gridFsBucket.FindAsync(filter);
        var files = await cursor.ToListAsync();

        if (files == null || files.Count == 0)
        {
            return new List<object>();  // Return empty list instead of null
        }

        var result = files.Select(file => new
        {
            Id = file.Id.ToString(),
            FileName = file.Filename,
            UploadDate = file.UploadDateTime,
            Metadata = new
            {
                Description = file.Metadata.Contains("description") && file.Metadata["description"].IsString
                    ? file.Metadata["description"].AsString
                    : ""
            }
        }).ToList();

        return result.Cast<object>().ToList();
    }

    public async Task<FileDetailsDto> GetFileDetailsAsync(string id)
        {
            var filter = Builders<GridFSFileInfo>.Filter.Eq("_id", new ObjectId(id));
            var fileInfo = await _gridFsBucket.Find(filter).FirstOrDefaultAsync();

            if (fileInfo == null) return null;

            return new FileDetailsDto
            {
                Id = fileInfo.Id.ToString(),
                FileName = fileInfo.Filename,
                UploadDate = fileInfo.UploadDateTime,
                Metadata = new MetadataDto  //  MetadataDto instead of an anonymous object
                {
                    Description = fileInfo.Metadata.Contains("description") ? fileInfo.Metadata["description"].AsString : ""
            
                }
            };
        }





        // ✅ Download File from GridFS
        public async Task<(Stream, string)> DownloadFileAsync(string fileId)
        {
            var objectId = ObjectId.Parse(fileId);
            var fileInfo = await _gridFsBucket.Find(Builders<GridFSFileInfo<ObjectId>>.Filter.Eq("_id", objectId)).FirstOrDefaultAsync();

            if (fileInfo == null)
                throw new FileNotFoundException("File not found in GridFS");

            var stream = await _gridFsBucket.OpenDownloadStreamAsync(objectId);
            return (stream, fileInfo.Filename);
        }

        // ✅ Get File Metadata
        public async Task<BsonDocument> GetFileMetadataAsync(string fileId)
        {
            var objectId = ObjectId.Parse(fileId);
            var fileInfo = await _gridFsBucket.Find(Builders<GridFSFileInfo<ObjectId>>.Filter.Eq("_id", objectId)).FirstOrDefaultAsync();

            if (fileInfo == null)
                throw new FileNotFoundException("File not found");

            return fileInfo.Metadata;
        }

        // Delete File from GridFS
        public async Task DeleteFileAsync(string fileId)
        {
            var objectId = ObjectId.Parse(fileId);
            await _gridFsBucket.DeleteAsync(objectId);
        }
    }
}
