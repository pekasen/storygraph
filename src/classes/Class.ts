
export interface Class<Type> {
    new(
        editable: boolean
    ): Type;
}
