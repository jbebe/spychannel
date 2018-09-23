using Microsoft.AspNetCore.Builder;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Threading.Tasks;

namespace SpyChannel.SignalServer
{
  public static class SpyChannelWebSocketExtensions
  {
    public static IApplicationBuilder UseWebSocketServer(this IApplicationBuilder app)
    {
      app.Use(async (context, next) =>
      {
        if (context.Request.Path.Value.Contains("/ws"))
        {
          if (context.WebSockets.IsWebSocketRequest)
          {
            // every time a new wsc is initiated, we create a server that will eventually call the service
            var webSocket = await context.WebSockets.AcceptWebSocketAsync();
            var server = new SpyChannelSocketServer(context, webSocket);
            await server.HandleAsync();
          }
          else
          {
            context.Response.StatusCode = 400;
          }
        }
        else
        {
          await next();
        }
      });

      return app;
    }
  }
}
