using System.Net.WebSockets;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace SpyChannel.SignalServer
{
  public interface IWebSocketServer
  {
    Task HandleAsync();
  }
}