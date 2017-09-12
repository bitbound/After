using Newtonsoft.Json;
using Really_Dynamic;
// LICENSE: Apache v2.
namespace Dynamic_JSON
{
    public class JSON
    {
        public static string Encode(object JsonObject)
        {
            return JsonConvert.SerializeObject(JsonObject);
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
