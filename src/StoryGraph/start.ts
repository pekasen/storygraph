import { PPReg, PReg, VReg } from "..";
import { PlugInManifest } from "./registry/PlugInManifest";
/**
 * 
 */
export function start(story?: any, manifest?: PlugInManifest[]) {
    const ppreg = PPReg.instance();
    const preg  = PReg.instance();
    const vreg  = VReg.instance();

    // fill PReg with PI from PPReg
    // if file is present, load VReg from file
    // else load new Story


    // load installed PPs and initliaze PPReg
    // if (manifest === undefined) {
    //     manifest = VReg.instance().getManifest()
    // }
    if (manifest !== undefined) {
        Promise.all(manifest.
            map(e => {
                return import(e.url)
            })
        ).then((values) => {
            values.forEach((value) => {
                const { PlugInExports } = value;
                console.dir("Thing", PlugInExports);
                ppreg.set(PlugInExports.name, PlugInExports);
                // TODO: send message to App that loading is finished and we can build the UI
            });
        });
    }
    

    return { ppreg, preg, vreg }
}