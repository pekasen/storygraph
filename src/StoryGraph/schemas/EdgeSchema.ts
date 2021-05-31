import { ModelSchema, identifier, createSimpleSchema } from 'serializr';
import { IEdge } from '../interfaces/IEdge';

export const EdgeSchema: ModelSchema<IEdge> = createSimpleSchema({
    from: true,
    to: true,
    id: identifier(),
    parent: false
});
