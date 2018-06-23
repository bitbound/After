using Newtonsoft.Json;
using After.Dependencies;
using System.Collections.Generic;
namespace After.Dependencies
{
    public class JSON
    {
        public static string Encode(object JsonObject)
        {
            if (JsonObject is Dynamic)
            {
                return JsonConvert.SerializeObject((JsonObject as Dynamic).ToDictionary());
            }
            else
            {
                return JsonConvert.SerializeObject(JsonObject);
            }
        }
        public static T Decode<T>(string JsonString)
        {
            return JsonConvert.DeserializeObject<T>(JsonString);
        }
        public static dynamic Decode(string JsonString)
        {
            dynamic deserialized = JsonConvert.DeserializeObject<Dynamic>(JsonString);
            return deserialized;
        }
    }
}
