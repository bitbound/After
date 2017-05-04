/// <summary>
/// Binds the property of a data element to the value of an HTML element's attribute.
/// </summary>
function DataBind(DataObject: Object, ObjectProperty: string, Element: HTMLElement, ElementPropertyKey: string) {
    Object.defineProperty(DataObject, ObjectProperty, {
        configurable: true,
        enumerable: true,
        get() {
            return Element[ElementPropertyKey];
        },
        set(value: any) {
            Element[ElementPropertyKey] = value;
        }
    })
};