using Microsoft.AspNetCore.SignalR;
using SpyChannel.CacheService;
using SpyChannel.Commons;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

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
      try
      {
        var userId = Context.Items["user_id"] as string;
        var userName = await CacheService.GetAsync(userId);
        await CacheService.RemoveAsync(userId);
        await Clients.Others.SendAsync("UserDisconnected", userName);
      }
      catch (Exception ex)
      {
        Debug.WriteLine($"[error]: {ex.Message}");
      }
    }

    // hub methods

    [HubMethodName("Register")]
    public async void RegisterAsync(string username)
    {
      try
      {
        var userId = Commons.Function.Generate.StringID();
        Context.Items["user_id"] = userId;
        await CacheService.AddAsync(userId, username);
        await Clients.Others.SendAsync("UserConnected", username);
      } catch (Exception ex)
      {
        Debug.WriteLine($"[error]: {ex.Message}");
      }
    }

  }
}