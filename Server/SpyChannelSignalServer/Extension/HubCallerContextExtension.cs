using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SpyChannel.SignalServer.Extension
{
  public static class HubCallerContextExtension
  {
		class UserIdentity : System.Security.Principal.IIdentity
		{
			public string AuthenticationType => "basic";

			public bool IsAuthenticated => true;

			public string Name { get; }

			public UserIdentity(string userId)
			{
				Name = userId;
			}
		}

		public static string GetChatUserId(this HubCallerContext context)
    {
      return context.Items["user_id"] as string;
    }

    public static void SetChatUserId(this HubCallerContext context, string userId)
    {
			context.Items["user_id"] = userId;
    }
  }
}
