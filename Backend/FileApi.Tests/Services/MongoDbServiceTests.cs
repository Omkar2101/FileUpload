using Xunit;
using Moq;
using MongoDB.Driver;
using MongoDB.Driver.GridFS;
using MongoDB.Bson;
using System.IO;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using FileApi.Services;

public class MongoDbServiceTests
{
    private readonly Mock<IGridFSBucket> _mockGridFSBucket;
    private readonly MongoDbService _mongoDbService;

    public MongoDbServiceTests()
    {
        _mockGridFSBucket = new Mock<IGridFSBucket>();
        var mockMongoClient = new Mock<IMongoClient>();
        var mockDatabase = new Mock<IMongoDatabase>();

        // Setup mock to return the database when GetDatabase is called
        mockMongoClient.Setup(c => c.GetDatabase(It.IsAny<string>(), null)).Returns(mockDatabase.Object);
        // Setup mock to return the mocked GridFS bucket
        _mockGridFSBucket.Setup(b => b.UploadFromStreamAsync(
            It.IsAny<string>(),
            It.IsAny<Stream>(),
            It.IsAny<GridFSUploadOptions>(),
            default))
            .ReturnsAsync(ObjectId.GenerateNewId()); 

        _mongoDbService = new MongoDbService();
    }

    [Fact]
    public async Task UploadFileAsync_Should_Return_FileId_AsString()
    {
        // Arrange
        var fileName = "testFile.txt";
        var description = "Sample description";
        var fileStream = new MemoryStream(new byte[] { 1, 2, 3, 4, 5 }); 
        var mockFileId = ObjectId.GenerateNewId();

        _mockGridFSBucket
            .Setup(b => b.UploadFromStreamAsync(It.IsAny<string>(), It.IsAny<Stream>(), It.IsAny<GridFSUploadOptions>(), default(CancellationToken)))
            .ReturnsAsync(mockFileId);

        // Act
        var result = await _mongoDbService.UploadFileAsync(fileStream, fileName, "Test Description");

        // Assert
        Assert.NotNull(result);
        Assert.Equal(mockFileId.ToString(), result);
    }

    [Fact]
    public async Task GetFileDetailsAsync_ShouldReturnFileDetails_WhenFileExists()
    {
        // Arrange
        var fileId = ObjectId.GenerateNewId().ToString();
        var metadata = new BsonDocument { { "description", "Test file description" } };

        var mockFileInfo = Mock.Of<GridFSFileInfo<ObjectId>>(f =>
            f.Id == new ObjectId(id) &&
            f.Filename == "TestFile.txt" &&
            f.Length == 1234 &&
            f.UploadDateTime == DateTime.UtcNow &&
            f.Metadata == metadata);

        var cursorMock = new Mock<IAsyncCursor<GridFSFileInfo<ObjectId>>>();
        cursor.SetReturnsDefault(new List<GridFSFileInfo<ObjectId>> { mockFileInfo }.AsQueryable());

        _mockGridFsBucket.Setup(g => g.FindAsync(It.IsAny<FilterDefinition<GridFSFileInfo<ObjectId>>>>(), null, default))
            .ReturnsAsync(Mock.Of<IAsyncCursor<GridFSFileInfo<ObjectId>>>(c =>
                c.Current == new List<GridFSFileInfo<ObjectId>> { mockFileInfo } &&
                c.FirstOrDefaultAsync(default) == Task.FromResult(mockFileInfo)));

        _mongoDbService = new MongoDbService(); // Make sure your actual class is named correctly.

        // Act
        var result = await _mongoDbService.GetFileDetailsAsync(fileInfo.Id.ToString());

        // Assert
        Assert.NotNull(result);
        Assert.Equal("1", result.Id);
        Assert.Equal("TestFile.txt", result.FileName);
        Assert.Equal(mockFileInfo.Length, result.Size);
        Assert.Equal(mockFileInfo.UploadDateTime, result.UploadDate);
        Assert.NotNull(result.Metadata);
        Assert.Equal("Test file description", result.Metadata.Description);
    }
}
