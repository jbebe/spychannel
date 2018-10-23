using SpyChannel.SignalServer.Hubs;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using SpyChannel.CacheService;
using Microsoft.AspNetCore.SignalR;

namespace SpyChannel.SignalServer
{
  public class Startup
  {
    // This method gets called by the runtime. Use this method to add services to the container.
    // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
    public void ConfigureServices(IServiceCollection services)
    {
			services.AddSingleton(new ChatCacheService(Commons.CacheConstants.UserGroupKey));
      services.AddCors();

			services.AddSignalR();
		}

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IHostingEnvironment env)
    {
      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
      }

      app.UseCors(builder =>
       builder
       .AllowAnyOrigin()
       .AllowAnyHeader()
       .AllowAnyMethod()
       .AllowCredentials()
       .Build());

      app.UseFileServer();

      app.UseSignalR(routes =>
      {
        routes.MapHub<SignalServerHub>("/chat");
      });
    }
  }
}
