import { createSimpleSchema, ModelSchema } from 'serializr';
import { IRenderingProperties } from '../interfaces/IRenderingProperties';


export const RenderingPropertiesSchema: ModelSchema<IRenderingProperties> = createSimpleSchema({
    width: true,
    order: true,
    collapsable: true
});