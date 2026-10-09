import { t as ActionDescriptor } from "./actions-CMfmwPV6.js";
//#region .gen/stage/staticDescriptors.gen.d.ts
/**
 * The mutating actions (`mutation` set) — the writes a human-in-the-loop UI gates on approval;
 * reads never pause. A standalone literal, so a browser importing only this tree-shakes the reads
 * away.
 */
declare const staticMutatingActionDescriptors: readonly ActionDescriptor[];
/** The non-mutating actions (reads) — no approval needed. A standalone literal for the same reason. */
declare const staticNonMutatingActionDescriptors: readonly ActionDescriptor[];
/**
 * The full visible action surface — every read and write. Composed from the two subsets above (not
 * its own literal) so importing a subset doesn't drag in the whole surface.
 */
declare const staticActionDescriptors: readonly ActionDescriptor[];
//#endregion
export { staticActionDescriptors, staticMutatingActionDescriptors, staticNonMutatingActionDescriptors };