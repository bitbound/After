using System;

namespace After.Code.Interfaces
{
    internal interface IExpirable
    {
        DateTime Expiration { get; set; }
    }
}