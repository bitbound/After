using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace After.Code.Interfaces
{
    public interface IDestructible : IGameObject
    {
        double CurrentEnergy { get; set; }

        void OnDestruction();
    }
}
