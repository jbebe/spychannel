using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using SpyChannel.CacheService;
using SpyChannel.Commons;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using static SpyChannel.SignalServer.Extension.HubCallerContextExtension;

namespace SpyChannel.SignalServer.Hubs
{
  public class SignalServerHub : Hub
  {
    public ChatCacheService CacheService { get; }

    public SignalServerHub(ChatCacheService cacheService)
    {
      CacheService = cacheService;
    }

    // we don't use it yet
    // public virtual Task OnConnectedAsync()

    public async override Task OnDisconnectedAsync(Exception exception)
    {
      var userId = Context.GetChatUserId();
      var userName = await CacheService.GetAsync<UserEntity>(userId);
      await CacheService.RemoveAsync(userId);
      await Clients.Others.SendAsync("UserDisconnected", userName);
    }

    // hub methods

    [HubMethodName("Register")]
    public async Task RegisterAsync(string userEntityJson)
    {
      var user = JsonConvert.DeserializeObject<UserEntity>(userEntityJson);
      var userId = Commons.Function.Generate.StringID();
      Context.SetChatUserId(userId);
      await CacheService.AddAsync(userId, user);
      await Clients.Others.SendAsync("UserConnected", user);
    }

  }
}