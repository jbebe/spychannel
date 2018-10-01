using System;
using StackExchange.Redis;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Runtime.CompilerServices;
using System.Linq;
using SpyChannel.Commons;
using SpyChannel.CacheService;

namespace SpyChannel.ApiService
{
  public class ChatApiService
  {
    public ChatCacheService CacheService { get; }

    public ChatApiService(ChatCacheService cacheService)
    {
      CacheService = cacheService;
    }

    public async Task<IEnumerable<UserEntity>> GetUsersAsync()
    {
      var allUserPairs = await CacheService.GetAllAsync<UserEntity>();
      var allUsers = allUserPairs.Select(pair => pair.value);
      return allUsers;
    }

  }
}
