using System;
using System.Collections.Generic;
using System.Text;

namespace SpyChannel.Commons
{
  public class SpyChannelUser
  {
    public SpyChannelUser(string username)
    {
      Username = username;
    }
    public string Username { get; }
  }
}
