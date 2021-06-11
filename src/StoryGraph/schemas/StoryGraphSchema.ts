import { createModelSchema, list, object, primitive } from 'serializr';
import { StoryGraph } from '../StoryGraph';
import { EdgeSchema } from './EdgeSchema';

export const StoryGraphSchema = createModelSchema(StoryGraph, {
    parent: primitive(),
    nodes: list(primitive()),
    edges: list(object(EdgeSchema), {
        // afterDeserialize: (cb, err, newValue) => {
        //     // if (newValue instanceof AbstractStoryObject)
        //     // const graph = context.target as ObservableStoryGraph;
        //     // // graph.edges = [];
        //     // setTimeout(() => {
        //     //     newValue.forEach((edge: IEdge) => {
        //     //         const payload: INotificationData<IEdgeEvent> = {
        //     //             data: {
        //     //                 add: [edge]
        //     //             },
        //     //             source: this,
        //     //             type: "edge"
        //     //         };
        //     //         [
        //     //             ...StoryGraph.parseNodeId(edge.from),
        //     //             ...StoryGraph.parseNodeId(edge.to),
        //     //         ].forEach(id => {
        //     //             graph.notificationCenter.push(
        //     //                 id, payload
        //     //             )
        //     //         });
        //     //     });
        //     // }, 150)
        //     // // graph.connect(undefined, newValue);
        //     // // catches edges
        //     // Logger.info("caught", newValue, context);
        //     // cb(err, newValue);
        //     cb(err, newValue);
        // }
    }),
});
