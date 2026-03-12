namespace Portfolio.API.Tests;

public class UnitTest1
{
    [Fact]
    public void Test1()
    {
        // Arrange
        var expected = 2;
        var a = 1;
        var b = 1;

        // Act
        var result = a + b;

        // Assert
        Assert.Equal(expected, result);
        Assert.NotNull(result);
        Assert.True(result > 0);
    }
}
