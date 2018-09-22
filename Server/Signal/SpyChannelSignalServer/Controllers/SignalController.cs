using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SpyChannelSignalService;

namespace SpyChannelSignalServer.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class SignalController : ControllerBase
  {
    public SignalService Service { get; }

    public SignalController(SignalService signalService)
    {
      Service = signalService;
    }

    // GET: api/signal
    [HttpGet]
    public async Task<IEnumerable<string>> GetAsync()
    {
      return await Service.ListUsersAsync();
    }

    // GET: api/signal/5
    [HttpGet("{id}")]
    public async Task GetAsync(int id)
    {
      await Service.AddUserAsync(new SignalUser($"{id}@asd.hu", id.ToString()));
    }

    // POST: api/signal
    [HttpPost]
    public void Post([FromBody] string value)
    {
    }

    // PUT: api/signal/5
    [HttpPut("{id}")]
    public void Put(int id, [FromBody] string value)
    {
    }

    // DELETE: api/signal/5
    [HttpDelete("{id}")]
    public void Delete(int id)
    {
    }
  }
}
