using Microsoft.AspNetCore.SignalR;
using SpyChannel.Commons;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace SpyChannel.SignalServer.Hubs
{
  public class SignalServerHub: Hub
  {
    private ConnectionMultiplexer CacheConnection { get; }
    private IDatabase Cache { get; set; }

    public SignalServerHub(): base()
    {
      CacheConnection = ConnectionMultiplexer.Connect("localhost");
      Cache = CacheConnection.GetDatabase();
    }

    public async void RegisterNewUser(string username)
    {
      try
      {
        await Clients.Others.SendAsync("UserConnected", username);
        await Cache.HashSetAsync(
        SpyChannelCacheConstants.UserGroupKey,
        new[] { new HashEntry(username, username) });
      } catch (Exception ex)
      {
        Debug.Write(ex.StackTrace);
      }
    }

    public async Task<IEnumerable<string>> GetAllUser()
    {
      var entries = await Cache.HashGetAllAsync(SpyChannelCacheConstants.UserGroupKey);
      return entries.Select(entry => entry.Value.ToString());
    }

    public void Send(string name, string message)
    {
      // Call the broadcastMessage method to update clients.
      Clients.All.SendAsync("broadcastMessage", name, message);
    }
  }
}