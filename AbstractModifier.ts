import { action, makeObservable, observable } from "mobx";
import { createModelSchema } from "serializr";
import { IStoryModifier, ModifierType } from "storygraph";
import { v4 } from "uuid";
import { rootStore } from "../../renderer";
import { IMenuTemplate } from "../../renderer/utils/PlugInClassRegistry";

function isStoryModifierType(type: string): boolean {
    const modifierTypes = ["css-class", "css-inline", "css-hybrid"];
    return modifierTypes.indexOf(type) !== -1;
}

export abstract class AbstractStoryModifier implements IStoryModifier {
    public id = v4();

    abstract name: string;
    abstract type: ModifierType;
    abstract role: string;
    abstract parent?: string;
    abstract get menuTemplate(): IMenuTemplate[];
    abstract get getRenderingProperties(): any;

    public updateParent(id: string): void {
        this.parent = id;
    }

    public deleteMe(): void {
        if (this.parent) {
            const _parent = rootStore.root.storyContentObjectRegistry.getValue(this.parent);
            if (_parent) {
                _parent.removeModifier(this);
            }
        }
    }
}

export class ObservableStoryModifier<T> extends AbstractStoryModifier {
    public name: string;
    public type: ModifierType;
    public data: T | undefined;
    public role = "";
    public parent: string | undefined;
    
    public get menuTemplate(): IMenuTemplate[] {
        return [
            {
                label: "Name",
                type: "display",
                value: () => this.name,
                valueReference: (name: string) => this.updateName(name)
            },
            {
                label: "delete",
                type: "button",
                value: () => undefined,
                valueReference: () => {
                    this.deleteMe();
                }
            },
            {
                label: "up",
                type: "button",
                value: () => undefined,
                valueReference: () => {
                    // this.deleteMe();
                }
            },
            {
                label: "down",
                type: "button",
                value: () => undefined,
                valueReference: () => {
                    // this.deleteMe();
                }
            }
            // {
            //     label: "Type",
            //     type: "dropdown",
            //     value: () => this.type,
            //     valueReference: (type: ModifierType) => this.updateType(type),
            //     options: ["css-class", "css-inline", "css-hybrid"]
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
            const _parent = rootStore.root.storyContentObjectRegistry.getValue(this.parent);
            if (_parent) {
                _parent.removeModifier(this);
            }
        }
    }
    
    public arrayPosDown(): void {
        if (this.parent) {
            const _parent = rootStore.root.storyContentObjectRegistry.getValue(this.parent);
            if (_parent) {
                _parent.removeModifier(this);
            }
        }
    }

    public constructor() {
        super();

        this.name = "";
        this.type = "css-inline";

        makeObservable(this, {
            name: observable,
            type: observable,
            updateName: action,
            updateType: action
        });
    }
}

export const ObservableStoryModifierSchema = createModelSchema(ObservableStoryModifier, {
    name: true,
    type: true,
    role: true,
    parent: true
});

export type CSSUnit = "px" | "fr" | "em" | "rem" | "%" | "vh" | "vw";

export class CSSUnitNumber {
    private _value: number;
    private _unit: CSSUnit;
    private static _validUnits = [
        "px", "fr", "em", "rem", "%", "vh", "vw"
    ];

    constructor(value?: number, unit?: CSSUnit) {
        this._value = value ||  0;
        this._unit = unit || "px";
    }

    public get value(): number {
        return this._value;
    }

    public set value(value: number) {
        this._value = value;
    }

    public get unit(): CSSUnit {
        return this._unit;
    }

    public set unit(unit: CSSUnit) {
        if (CSSUnitNumber.isValid(unit)) {
            this._unit = unit;
        } else throw("Unit not accepted.");
    }

    public static isValid(unit: string): boolean {
        return CSSUnitNumber._validUnits.indexOf(unit) !== -1
    }
}
