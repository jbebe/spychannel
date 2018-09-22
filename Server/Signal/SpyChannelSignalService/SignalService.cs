using System;
using StackExchange.Redis;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Runtime.CompilerServices;
using System.Linq;

[assembly: InternalsVisibleTo("SpyChannelSignalServer")]

namespace SpyChannelSignalService
{
  public class SignalService
  {
    private ConnectionMultiplexer CacheConnection { get; }
    private IDatabase Cache { get; set; }

    public SignalService()
    {
      CacheConnection = ConnectionMultiplexer.Connect("localhost");
      Cache = CacheConnection.GetDatabase();
    }

    public async Task<IEnumerable<string>> ListUsersAsync()
    {
      return (await Cache.HashGetAllAsync(CacheConstants.UserHashKey)).Select(he => he.ToString());
    }

    public async Task AddUserAsync(SignalUser user)
    {
      await Cache.HashSetAsync(CacheConstants.UserHashKey, new HashEntry[] { new HashEntry(user.Email, user.UserName) });
    }
  }
}
