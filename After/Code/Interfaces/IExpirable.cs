using System;

namespace After.Code.Interfaces
{
    internal interface IExpirable : IGameObject
    {
        DateTime Expiration { get; set; }
    }
}