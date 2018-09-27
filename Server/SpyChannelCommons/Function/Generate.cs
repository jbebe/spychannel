using System;
using System.Collections.Generic;
using System.Text;

namespace SpyChannel.Commons.Function
{
  public static class Generate
  {
    public static string StringID()
    {
      return Guid.NewGuid().ToString();
    }
  }
}
