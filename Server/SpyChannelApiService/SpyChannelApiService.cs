using System;
using StackExchange.Redis;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Runtime.CompilerServices;
using System.Linq;
using SpyChannel.Commons;

[assembly: InternalsVisibleTo("SpyChannel.ApiServer")]

namespace SpyChannel.ApiService
{
  public class SpyChannelChatApiService
  {
    private ConnectionMultiplexer CacheConnection { get; }
    private IDatabase Cache { get; set; }

    public SpyChannelChatApiService()
    {
      CacheConnection = ConnectionMultiplexer.Connect("localhost");
      Cache = CacheConnection.GetDatabase();
    }

    public async Task<IEnumerable<string>> GetUsersAsync()
    {
      var entries = await Cache.HashGetAllAsync(SpyChannelCacheConstants.UserHashKey);
      return entries.Select(entry => entry.ToString());
    }

    /*public async Task AddUserAsync(SpyChannelUser user)
    {
      await Cache.HashSetAsync(SpyChannelCacheConstants.UserHashKey, new HashEntry[] { new HashEntry(user.Username, "") });
    }*/
  }
}
