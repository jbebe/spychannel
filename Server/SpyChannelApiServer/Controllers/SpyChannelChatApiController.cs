using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SpyChannel.ApiService;
using SpyChannel.Commons;

namespace SpyChannel.ApiServer.Controllers
{
  [Route("api/user")]
  [ApiController]
  public class SpyChannelChatApiController : ControllerBase
  {
    private SpyChannelChatApiService Service { get; }

    public SpyChannelChatApiController(SpyChannelChatApiService apiService)
    {
      Service = apiService;
    }

    /// <summary>
    /// Get current users
    /// </summary>
    [HttpGet]
    public async Task<IEnumerable<string>> GetAsync()
    {
      return await Service.GetUsersAsync();
    }

  }
}
