/// <summary>
/// Binds the property of a data element to the value of an HTML element's attribute.
/// </summary>
function DataBind(DataObject, ObjectProperty, Element, ElementPropertyKey) {
    Object.defineProperty(DataObject, ObjectProperty, {
        configurable: true,
        enumerable: true,
        get() {
            return Element[ElementPropertyKey];
        },
        set(value) {
            Element[ElementPropertyKey] = value;
        }
    });
}
;
//# sourceMappingURL=DataBind.js.map