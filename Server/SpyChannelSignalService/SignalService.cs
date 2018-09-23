using System;
using System.Threading.Tasks;

namespace SpyChannel.SignalService
{
  public class SpyChannelSignalService
  {
    private Action<string> Send { get; }

    public SpyChannelSignalService(Action<string> sendAction)
    {
      Send = sendAction;
    }

    public async Task<int> OnMessageAsync(string data)
    {
      return await Task.FromResult(1);
    }
  }
}
