using System.Collections.Generic;
using System.Dynamic;

namespace After.Dependencies
{
    public class Dynamic : DynamicObject
    {
        Dictionary<string, dynamic> properties = new Dictionary<string, dynamic>();

        public override bool TryGetMember(GetMemberBinder binder, out dynamic result)
        {
            if (properties.ContainsKey(binder.Name))
            {
                result = properties[binder.Name];
            }
            else
            {
                result = null;
            }
            return true;
        }

        public override bool TrySetMember(SetMemberBinder binder, dynamic value)
        {
            properties[binder.Name] = value;
            base.TrySetMember(binder, value as object);
            return true;
        }
        public Dictionary<string, dynamic> ToDictionary()
        {
            return properties;
        }
        public override IEnumerable<string> GetDynamicMemberNames()
        {
            return properties.Keys;
        }
        public dynamic this[string key]
        {
            get
            {
                if (properties.ContainsKey(key))
                {
                    return properties[key];
                }
                else
                {
                    return null;
                }
            }
            set
            {
                properties[key] = value;
            }
        }
    }
}
