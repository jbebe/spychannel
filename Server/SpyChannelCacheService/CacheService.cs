using SpyChannel.Commons;
using StackExchange.Redis;
using System;
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

    public async Task AddAsync(string name, string value)
    {
      await AddAsync((name, value));
    }

    public async Task AddAsync(params (string name, string value)[] nameValuePairs)
    {
      var hashEntries = nameValuePairs
        .Select(pair => new HashEntry(pair.name, pair.value))
        .ToArray();
      await Cache.HashSetAsync(CacheGroupName, hashEntries);
    }

    public async Task<string> GetAsync(string name)
    {
      return await Cache.HashGetAsync(CacheGroupName, name);
    }

    public async Task RemoveAsync(string name)
    {
      await Cache.HashDeleteAsync(CacheGroupName, name);
    }

    public async Task<IEnumerable<string>> GetAllAsync()
    {
      var entries = await Cache.HashGetAllAsync(CacheGroupName);
      return entries.Select(entry => entry.Value.ToString());
    }

  }
}
