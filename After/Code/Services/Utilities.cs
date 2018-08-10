using After.Code.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace After.Code.Services
{
    public static class Utilities
    {
        public static string GetRandomHexColor()
        {
            var random = new Random();
            return $"#{random.Next(0x1000000):X6}";
        }
        public static double GetRadiansFromDegrees(double degrees)
        {
            return (Math.PI / 180) * degrees;
        }

        public static double GetOppositeAngle(double angle)
        {
            return angle <= 179 ? angle + 180 : angle - 180;
        }

        public static bool AreDifferent(dynamic firstObject, dynamic secondObject)
        {
            return JsonConvert.SerializeObject(firstObject) != JsonConvert.SerializeObject(secondObject);
        }
    }
}
