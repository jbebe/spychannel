using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;

namespace SpyChannel.Commons
{
  [JsonObject(MemberSerialization.OptIn, NamingStrategyType = typeof(CamelCaseNamingStrategy))]
  public class UserEntity
  {
    [JsonProperty]
    public string Username { get; }

    [JsonProperty]
    public DateTime CreationDate { get; }

		[JsonProperty]
		public string ConnectionId { get; set; }


		public UserEntity(string username, DateTime? creationDate = null)
    {
      Username = username;
      CreationDate = creationDate ?? DateTime.UtcNow;
    }

  }
}
