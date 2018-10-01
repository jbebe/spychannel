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
  public class ChatApiController : ControllerBase
  {
    private ChatApiService ApiService { get; }

    public ChatApiController(ChatApiService apiService)
    {
      ApiService = apiService;
    }

    /// <summary>
    /// Get online users
    /// </summary>
    [HttpGet]
    public async Task<IEnumerable<UserEntity>> GetAsync()
    {
      return await ApiService.GetUsersAsync();
    }

  }
}
