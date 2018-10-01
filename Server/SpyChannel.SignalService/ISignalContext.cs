using System;
using System.Collections.Generic;
using System.Text;

namespace SpyChannel.SignalService
{
  public interface ISignalContext
  {
    string ConnectionId { get; }

    string UserIdentifier { get; }

    IDictionary<object, object> Items { get; }

    void Abort();
  }
}
