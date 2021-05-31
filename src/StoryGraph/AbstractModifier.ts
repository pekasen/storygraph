// import { action, makeObservable, observable } from "mobx";
import { h } from "preact";
import { createModelSchema } from "serializr";
import { v4 } from "uuid";
import { VReg } from "storymesh-plugin-support";
import { ButtonGroup, Display, MenuTemplate } from "preact-sidebar";
import { IStoryModifier, ModifierType, IConnectorPort } from "..";

function isStoryModifierType(type: string): boolean {
    const modifierTypes = ["css-class", "css-inline", "css-hybrid"];
    return modifierTypes.indexOf(type) !== -1;
}

export abstract class AbstractStoryModifier implements IStoryModifier {
    
    public id = v4();

    public abstract name: string;
    public abstract type: ModifierType;
    public abstract role: string;
    public abstract parent?: string;
    public abstract get menuTemplate(): MenuTemplate[];
    public abstract get getRenderingProperties(): any;
    public abstract modify(element: h.JSX.Element): h.JSX.Element;

    public updateParent(id: string): void {
        this.parent = id;
    }

    public deleteMe(): void {
        if (this.parent) {
            const _parent = VReg.instance().get(this.parent);
            if (_parent) {
                _parent.removeModifier(this);
            }
        }
    }

    public requestConnectors(): [string, IConnectorPort][] {
        throw new Error("Method not implemented.");
    }
}

export class ObservableStoryModifier<T> extends AbstractStoryModifier {
    public name: string;
    public type: ModifierType;
    public data: T | undefined;
    public role = "";
    public parent: string | undefined;
    
    public get menuTemplate(): MenuTemplate[] {
        return [
            // {
            //     label: "Name",
            //     type: "display",
            //     value: () => this.name,
            //     valueReference: (name: string) => this.updateName(name)
            // },
            new Display("Name", () => this.name),
            new ButtonGroup("Default", {
                callbacks: [
                    {
                        label: "delete",
                        trigger: () => this.deleteMe()
                    },
                    {
                        label: "up",
                        trigger: () => undefined
                    },
                    {
                        label: "down",
                        trigger: () => undefined
                    },
                ]
            })
            // {
            //     label: "",
            //     type: "buttongroup",
            //     value: () => undefined,
            //     valueReference: () => undefined,
            //     options: {
            //         callbacks: [
            //             {
            //                 label: "delete",
            //                 valueReference: () => {
            //                     this.deleteMe();
            //                 }
            //             },
            //             {
            //                 label: "up",
    
            //                 valueReference: () => {
            //                     // this.deleteMe();
            //                 }
            //             },
            //             {
            //                 label: "down",
            //                 valueReference: () => {
            //                     // this.deleteMe();
            //                 }
            //             }
            //         ]
            //     }
            // }
        ]
    }

    public get getRenderingProperties(): any | undefined {
        throw("");
    }

    public updateName(name: string): void {
        this.name = name;
    }

    public updateType(type: ModifierType): void {
        if (isStoryModifierType(type)) {
            this.type = type;
        }
    }

    public arrayPosUp(): void {
        if (this.parent) {
            const _parent = VReg.instance().get(this.parent);
            if (_parent) {
                _parent.removeModifier(this);
            }
        }
    }
    
    public arrayPosDown(): void {
        if (this.parent) {
            const _parent = VReg.instance().get(this.parent);
            if (_parent) {
                _parent.removeModifier(this);
            }
        }
    }

    public modify(element: h.JSX.Element): h.JSX.Element {
        throw("Method cannot be called directly");
    }

    public constructor() {
        super();

        this.name = "";
        this.type = "css-inline";

        // makeObservable(this, {
        //     name: observable,
        //     type: observable,
        //     updateName: action,
        //     updateType: action
        // });
    }
}


export const ObservableStoryModifierSchema = createModelSchema(ObservableStoryModifier, {
    name: true,
    type: true,
    role: true,
    parent: true
});
