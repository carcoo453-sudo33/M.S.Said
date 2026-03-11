using System.Text.Json;

namespace Portfolio.API.Helpers;

public static class JsonHelper
{
    public static List<T> DeserializeList<T>(string? json)
    {
        if (string.IsNullOrEmpty(json)) 
            return new List<T>();
        
        try
        {
            return JsonSerializer.Deserialize<List<T>>(json) ?? new List<T>();
        }
        catch (JsonException)
        {
            return new List<T>();
        }
    }

    public static T? Deserialize<T>(string? json) where T : class
    {
        if (string.IsNullOrEmpty(json)) 
            return null;
        
        try
        {
            return JsonSerializer.Deserialize<T>(json);
        }
        catch (JsonException)
        {
            return null;
        }
    }

    public static string Serialize<T>(T obj)
    {
        try
        {
            return JsonSerializer.Serialize(obj);
        }
        catch (JsonException)
        {
            return "[]";
        }
    }
}