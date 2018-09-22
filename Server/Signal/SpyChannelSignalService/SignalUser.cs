using System;
using System.Collections.Generic;
using System.Text;

namespace SpyChannelSignalService
{
  public class SignalUser
  {
    public SignalUser(string email, string userName)
    {
      Email = email;
      UserName = userName;
    }

    public string Email { get; }
    public string UserName { get; }
  }
}
