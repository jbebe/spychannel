using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using SpyChannel.CacheService;
using SpyChannel.Commons;
using StackExchange.Redis;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using static SpyChannel.SignalServer.Extension.HubCallerContextExtension;

namespace SpyChannel.SignalServer.Hubs
{
	public class SignalServerHub : Hub
	{
		public ChatCacheService UserCache { get; }

		public SignalServerHub(ChatCacheService cacheService)
		{
			UserCache = cacheService;
		}

		// we don't use it yet
		// public virtual Task OnConnectedAsync()

		public async override Task OnDisconnectedAsync(Exception exception)
		{
			var userId = Context.GetChatUserId();
			var userName = await UserCache.GetAsync<UserEntity>(userId);
			await UserCache.RemoveAsync(userId);
			await Clients.Others.SendAsync("UserDisconnected", userName);
		}

		// hub methods

		[HubMethodName("Register")]
		public async Task<UserEntity> RegisterAsync(string userEntityJson)
		{
			var user = JsonConvert.DeserializeObject<UserEntity>(userEntityJson);
			user.ConnectionId = Context.ConnectionId;
			var userId = user.Username; // TODO: better id generation
			Context.SetChatUserId(userId);
			await UserCache.AddAsync(userId, user);
			await Clients.Others.SendAsync("UserConnected", user);

			return user;
		}

		[HubMethodName("RequestSdpExchange")]
		public async Task RequestSdpExchangeAsync(string guestId, string hostSdpHeader)
		{
			// find user 
			var guestEntity = await UserCache.GetAsync<UserEntity>(guestId);
			var guestSocket = Clients.Client(guestEntity.ConnectionId);

			// send out the request
			var hostId = Context.GetChatUserId();
			await guestSocket.SendCoreAsync("RequestSdpExchange", new object[] { hostId, hostSdpHeader });
		}

		[HubMethodName("RespondToSdpExchange")]
		public async Task RespondToSdpExchangeAsync(string hostId, string guestSdpHeader)
		{
			// find host
			var hostEntity = await UserCache.GetAsync<UserEntity>(hostId);
			var hostSocket = Clients.Client(hostEntity.ConnectionId);

			// send guest sdp to host
			var guestId = Context.GetChatUserId();
			await hostSocket.SendCoreAsync("RespondToSdpExchange", new object[] { guestId, guestSdpHeader });
		}

	}
}