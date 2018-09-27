using System;
using System.Collections.Generic;
using System.Text;

namespace SpyChannel.Commons
{
  public class User
  {
    public User(string username)
    {
      Username = username;
    }
    public string Username { get; }
  }
}
