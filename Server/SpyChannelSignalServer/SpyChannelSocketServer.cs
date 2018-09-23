using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using SpyChannel;
using SpyChannel.SignalService;

namespace SpyChannel.SignalServer
{
  public class SpyChannelSocketServer : IWebSocketServer
  {
    public SpyChannelSignalService SignalService { get; }
    public HttpContext Context { get; }
    public WebSocket WebSocket { get; }

    public SpyChannelSocketServer(HttpContext context, WebSocket webSocket)
    {
      Context = context;
      WebSocket = webSocket;
      SignalService = new SpyChannelSignalService(async (data) => await SendAsync(data));
    }

    public async Task SendAsync(string data)
    {
      var result = Encoding.Unicode.GetBytes(data);
      await WebSocket.SendAsync(result, WebSocketMessageType.Text, true, CancellationToken.None);
    }

    public async Task HandleAsync()
    {
      var buffer = new byte[1024 * 4];
      WebSocketReceiveResult result;

      do
      {
        // wait for message
        result = await WebSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
        var receivedString = System.Text.Encoding.Default.GetString(buffer);
        await SignalService.OnMessageAsync(receivedString);
        // incoming message? respond with same data!
        await WebSocket.SendAsync(new ArraySegment<byte>(buffer, 0, result.Count), result.MessageType, result.EndOfMessage, CancellationToken.None);
      }
      // loop while the connection is not closed
      while (!result.CloseStatus.HasValue);

      await WebSocket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
    }
  }
}
