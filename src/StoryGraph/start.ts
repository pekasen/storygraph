import { PPReg, PReg, VReg } from "..";
import { PlugInManifest } from "./registry/PlugInManifest";

/**
 * 
 */
export function start(manifest?: PlugInManifest[], file?: any) {
    const ppreg = PPReg.instance();
    const preg  = PReg.instance();
    const vreg  = VReg.instance();
    // load installed PPs and initliaze PPReg
    if (manifest !== undefined) {
        Promise.all(manifest.
            map(e => {
                return fetch(e.url)
            })
        ).then((values) => {

        });
    }
    // fill PReg with PI from PPReg
    // if file is present, load VReg from file
    // else load new Story

    return { ppreg, preg, vreg }
}