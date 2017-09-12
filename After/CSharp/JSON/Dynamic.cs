using System.Collections.Generic;
using System.Dynamic;

namespace Dynamic_JSON
{
    public class Dynamic : DynamicObject
    {
        Dictionary<string, object> properties = new Dictionary<string, object>();

        public override bool TryGetMember(GetMemberBinder binder, out object result)
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

        public override bool TrySetMember(SetMemberBinder binder, object value)
        {
            properties[binder.Name] = value;
            base.TrySetMember(binder, value);
            return true;
        }
    }
}
