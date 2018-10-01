using Newtonsoft.Json;
using StackExchange.Redis;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpyChannel.CacheService
{
  public class ChatCacheService
  {
    private ConnectionMultiplexer CacheConnection { get; }
    private IDatabase Cache { get; set; }
    private string CacheGroupName { get; }

    public ChatCacheService(string cacheGroupName)
    {
      CacheConnection = ConnectionMultiplexer.Connect("localhost");
      Cache = CacheConnection.GetDatabase();
      CacheGroupName = cacheGroupName;
    }

    public async Task AddAsync<T>(string id, T value)
    {
      await AddAsync((id, value));
    }

    public async Task AddAsync<T>(params (string id, T value)[] nameValuePairs)
    {
      var hashEntries = nameValuePairs
        .Select(pair => (id: pair.id, value: JsonConvert.SerializeObject(pair.value)))
        .Select(pair => new HashEntry(pair.id, pair.value))
        .ToArray();
      await Cache.HashSetAsync(CacheGroupName, hashEntries);
    }

    public async Task<T> GetAsync<T>(string id)
      => JsonConvert.DeserializeObject<T>(await Cache.HashGetAsync(CacheGroupName, id));

    public async Task RemoveAsync(string id)
    {
      await Cache.HashDeleteAsync(CacheGroupName, id);
    }

    public async Task<IEnumerable<(string id, T value)>> GetAllAsync<T>()
    {
      var entries = await Cache.HashGetAllAsync(CacheGroupName);
      return entries.Select(entry => (
        id: entry.Name.ToString(), 
        value: JsonConvert.DeserializeObject<T>(entry.Value)
        ));
    }

  }
}
