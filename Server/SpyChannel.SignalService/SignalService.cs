using SpyChannel.CacheService;
using System;
using System.Threading.Tasks;

namespace SpyChannel.SignalService
{
  public class SignalService
  {
    public ChatCacheService CacheService { get; }
    public ISignalContext Context { get; }

    public SignalService(ChatCacheService cacheService, ISignalContext context)
    {
      CacheService = cacheService;
      Context = context;
    }

    // we don't use it yet
    // public virtual Task OnConnectedAsync()

    //public async Task OnDisconnectedAsync(Exception exception)
    //{
    //  try
    //  {
    //    var userId = Context.Items["user_id"] as string;
    //    var userName = await CacheService.GetAsync(userId);
    //    await CacheService.RemoveAsync(userId);
    //    await Clients.Others.SendAsync("UserDisconnected", userName);
    //  }
    //  catch (Exception ex)
    //  {
    //    Debug.WriteLine($"[error]: {ex.Message}");
    //  }
    //}

    //// hub methods

    //[HubMethodName("Register")]
    //public async void RegisterAsync(string username)
    //{
    //  try
    //  {
    //    var userId = Commons.Function.Generate.StringID();
    //    Context.Items["user_id"] = userId;
    //    await CacheService.AddAsync(userId, username);
    //    await Clients.Others.SendAsync("UserConnected", username);
    //  }
    //  catch (Exception ex)
    //  {
    //    Debug.WriteLine($"[error]: {ex.Message}");
    //  }
    //}

  }
}
