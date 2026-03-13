using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Text.Json;
using System.Linq;

namespace GithubTest
{
    class Program
    {
        static async Task Main(string[] args)
        {
            var username = "Mostafa-SAID7";
            var token = args.Length > 0 ? args[0] : null;
            
            using var client = new HttpClient();
            client.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (compatible; PortfolioAPI/1.0)");
            if (!string.IsNullOrEmpty(token))
            {
                client.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");
            }

            Console.WriteLine($"Testing GitHub API for user: {username}");

            // 1. Test Repos Count
            try {
                var reposUrl = $"https://api.github.com/users/{username}";
                var response = await client.GetAsync(reposUrl);
                var content = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(content);
                int repos = doc.RootElement.GetProperty("public_repos").GetInt32();
                Console.WriteLine($"Public Repos: {repos}");
            } catch (Exception ex) {
                Console.WriteLine($"Error fetching repos: {ex.Message}");
            }

            // 2. Test Commits Count
            try {
                // Requires specific header for Search Commits API
                var request = new HttpRequestMessage(HttpMethod.Get, $"https://api.github.com/search/commits?q=author:{username}");
                request.Headers.Add("Accept", "application/vnd.github.cloak-preview");
                
                var response = await client.SendAsync(request);
                var content = await response.Content.ReadAsStringAsync();
                
                if (response.IsSuccessStatusCode) {
                    using var doc = JsonDocument.Parse(content);
                    int commits = doc.RootElement.GetProperty("total_count").GetInt32();
                    Console.WriteLine($"Total Commits: {commits}");
                } else {
                    Console.WriteLine($"Commits API Failed: {response.StatusCode}");
                    Console.WriteLine(content);
                }
            } catch (Exception ex) {
                Console.WriteLine($"Error fetching commits: {ex.Message}");
            }
        }
    }
}
