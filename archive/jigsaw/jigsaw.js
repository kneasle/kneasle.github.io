let wasm;

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

const JigsawFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_jigsaw_free(ptr >>> 0));
/**
* The complete state of the composition editor, complete with undo history and UI/view state.
*
* The general data-flow is:
* - User generates some input (keypress, mouse click, etc.)
* - JS reads this input and calls one of the `#[wasm_bindgen]` methods on the `Jigsaw` singleton
* - These call some `self.make_*action*` function which runs a given closure on the existing
*   [`Spec`]
*   - This also handles the undo history (i.e. doesn't overwrite old copies, and deallocates
*     future redo steps that are now unreachable).
*   - Because the [`Spec`] has changed, we rebuild the [`DerivedState`] from this new [`Spec`].
*     This is necessary because JS can't access the [`Spec`] directly.
* - The following all happens during the call to the JS `on_comp_change()` method:
*   - After every edit, JS will call [`Jigsaw::ser_derived_state`] which returns a JSON
*     serialisation of the current [`DerivedState`], which is parsed into a full-blown JS object
*     and the global `derived_state` variable is overwritten with this new value.
*   - The HUD UI (sidebar, etc.) are all updated to this new value
*   - A repaint is requested, so that the updated [`DerivedState`] gets fully rendered to the
*   screen.
*/
export class Jigsaw {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Jigsaw.prototype);
        obj.__wbg_ptr = ptr;
        JigsawFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        JigsawFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_jigsaw_free(ptr);
    }
    /**
    * Create an example composition
    * @returns {Jigsaw}
    */
    static example() {
        const ret = wasm.jigsaw_example();
        return Jigsaw.__wrap(ret);
    }
    /**
    * Attempt to parse a new part head specification [`String`].  If it successfully parses then
    * update the part head list as a new edit (returning `""`), otherwise return a [`String`]
    * summarising the issue with the parsing.
    * @param {string} s
    * @returns {string}
    */
    parse_part_head_spec(s) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(s, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.jigsaw_parse_part_head_spec(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred2_0 = r0;
            deferred2_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * Return a JSON serialisation of the derived state
    * @returns {string}
    */
    ser_derived_state() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.jigsaw_ser_derived_state(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * Return a JSON serialisation of the current view settings
    * @returns {string}
    */
    ser_view() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.jigsaw_ser_view(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * @param {string} json
    */
    set_view_from_json(json) {
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.jigsaw_set_view_from_json(this.__wbg_ptr, ptr0, len0);
    }
    /**
    * Returns `true` if the editor is in [`State::Idle`]
    * @returns {boolean}
    */
    is_state_idle() {
        const ret = wasm.jigsaw_is_state_idle(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
    * Returns `true` if the editor is in [`State::Dragging`]
    * @returns {boolean}
    */
    is_state_dragging() {
        const ret = wasm.jigsaw_is_state_dragging(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
    * Returns the index of the [`Frag`] being dragged, `panic!`ing if the UI is not in
    * [`State::Dragging`].
    * @returns {number}
    */
    frag_being_dragged() {
        const ret = wasm.jigsaw_frag_being_dragged(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * Moves the UI into [`State::Dragging`], `panic!`ing if we start in any state other than
    * [`State::Idle`]
    * @param {number} frag_ind
    */
    start_dragging(frag_ind) {
        wasm.jigsaw_start_dragging(this.__wbg_ptr, frag_ind);
    }
    /**
    * Called to exit [`State::Dragging`].  This moves the [`Frag`] the user was dragging to the
    * provided coords (as a new undo step), and returns to [`State::Idle`].  This `panic!`s if
    * called from any state other than [`State::Dragging`].
    * @param {number} new_x
    * @param {number} new_y
    */
    finish_dragging(new_x, new_y) {
        wasm.jigsaw_finish_dragging(this.__wbg_ptr, new_x, new_y);
    }
    /**
    * Returns `true` if the editor is in [`State::Transposing`]
    * @returns {boolean}
    */
    is_state_transposing() {
        const ret = wasm.jigsaw_is_state_transposing(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
    * Moves the editor into [`State::Transposing`] the [`Frag`] at `frag_ind`.  This returns the
    * string representation of the first [`Row`] of that [`Frag`], to initialise the
    * transposition input box.  This `panic!`s if called from any state other than
    * [`State::Idle`].
    * @param {number} frag_ind
    * @param {number} row_ind
    * @returns {string}
    */
    start_transposing(frag_ind, row_ind) {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.jigsaw_start_transposing(retptr, this.__wbg_ptr, frag_ind, row_ind);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * Attempt to parse a [`String`] into a [`Row`] of the [`Stage`] of the current [`Spec`], to
    * be used in [`State::Transposing`].  There are two possible outcomes:
    * - **The string corresponds to a valid [`Row`]**: This parsed [`Row`] is used to modify
    *   the temporary [`Spec`] contained with in the [`State::Transposing`] enum.  The
    *   [`DerivedState`] is updated and `""` is returned.
    * - **The string creates a parse error**:  No modification is made, and a [`String`]
    *   representing the error is returned.
    * This `panic!`s if called from any state other than [`State::Transposing`].
    * @param {string} row_str
    * @returns {string}
    */
    try_parse_transpose_row(row_str) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(row_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.jigsaw_try_parse_transpose_row(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred2_0 = r0;
            deferred2_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * Called to exit [`State::Transposing`], saving the changes.  If `row_str` parses to a valid
    * [`Row`] then this commits the desired transposition and returns the editor to
    * [`State::Idle`] (returning `true`), otherwise no change occurs and this returns `false`.
    * This `panic!`s if called from any state other than [`State::Transposing`].
    * @param {string} row_str
    * @returns {boolean}
    */
    finish_transposing(row_str) {
        const ptr0 = passStringToWasm0(row_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.jigsaw_finish_transposing(this.__wbg_ptr, ptr0, len0);
        return ret !== 0;
    }
    /**
    * Called to exit [`State::Transposing`], **without** saving the changes.  This `panic!`s if
    * called from any state other than [`State::Transposing`].
    */
    exit_transposing() {
        wasm.jigsaw_exit_transposing(this.__wbg_ptr);
    }
    /**
    * Returns `true` if the editor is in [`State::EditingMethod`]
    * @returns {boolean}
    */
    is_state_editing_method() {
        const ret = wasm.jigsaw_is_state_editing_method(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
    * Starts editing the [`MethodSpec`] at a given index
    * @param {number} index
    */
    start_editing_method(index) {
        wasm.jigsaw_start_editing_method(this.__wbg_ptr, index);
    }
    /**
    * Starts editing a new [`MethodSpec`], which will get added at the end
    */
    start_editing_new_method() {
        wasm.jigsaw_start_editing_new_method(this.__wbg_ptr);
    }
    /**
    * Return all the information required for JS to update the method edit box, serialised as
    * JSON
    * @returns {string}
    */
    method_edit_state() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.jigsaw_method_edit_state(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * Sets both the name and shorthand of the method being edited
    * @param {string} new_name
    * @param {string} new_shorthand
    */
    set_method_names(new_name, new_shorthand) {
        const ptr0 = passStringToWasm0(new_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(new_shorthand, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        wasm.jigsaw_set_method_names(this.__wbg_ptr, ptr0, len0, ptr1, len1);
    }
    /**
    * Sets the place notatation string in the method edit box, and reparses to generate a new
    * error.  Called whenever the user types into the method box
    * @param {string} new_pn
    */
    set_method_pn(new_pn) {
        const ptr0 = passStringToWasm0(new_pn, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.jigsaw_set_method_pn(this.__wbg_ptr, ptr0, len0);
    }
    /**
    * Exit method editing mode, without commiting any of the changes
    */
    exit_method_edit() {
        wasm.jigsaw_exit_method_edit(this.__wbg_ptr);
    }
    /**
    * Exit method editing mode, commiting the new method to the composition if valid.  This
    * returns `false` if no change occured
    * @returns {boolean}
    */
    finish_editing_method() {
        const ret = wasm.jigsaw_finish_editing_method(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
    */
    undo() {
        wasm.jigsaw_undo(this.__wbg_ptr);
    }
    /**
    */
    redo() {
        wasm.jigsaw_redo(this.__wbg_ptr);
    }
    /**
    * See [`Spec::extend_frag_end`] for docs
    * @param {number} frag_ind
    * @param {number} method_ind
    * @param {boolean} add_course
    */
    extend_frag(frag_ind, method_ind, add_course) {
        wasm.jigsaw_extend_frag(this.__wbg_ptr, frag_ind, method_ind, add_course);
    }
    /**
    * See [`Spec::add_frag`] for docs
    * @param {number} x
    * @param {number} y
    * @param {number} method_ind
    * @param {boolean} add_course
    * @returns {number}
    */
    add_frag(x, y, method_ind, add_course) {
        const ret = wasm.jigsaw_add_frag(this.__wbg_ptr, x, y, method_ind, add_course);
        return ret >>> 0;
    }
    /**
    * Deletes a [`Frag`]ment by index.
    * @param {number} frag_ind
    */
    delete_frag(frag_ind) {
        wasm.jigsaw_delete_frag(this.__wbg_ptr, frag_ind);
    }
    /**
    * Duplicates a [`Frag`]ment by index, returning the index of the cloned [`Frag`].
    * @param {number} frag_ind
    * @param {number} new_x
    * @param {number} new_y
    * @returns {number}
    */
    duplicate_frag(frag_ind, new_x, new_y) {
        const ret = wasm.jigsaw_duplicate_frag(this.__wbg_ptr, frag_ind, new_x, new_y);
        return ret >>> 0;
    }
    /**
    * See [`Spec::join_frags`] for docs.
    * @param {number} frag_1_ind
    * @param {number} frag_2_ind
    */
    join_frags(frag_1_ind, frag_2_ind) {
        wasm.jigsaw_join_frags(this.__wbg_ptr, frag_1_ind, frag_2_ind);
    }
    /**
    * Splits a given [`Frag`]ment into two fragments, returning `""` on success and an error
    * string on failure. `split_index` refers to the first row of the 2nd fragment (so row
    * #`split_index` will also be the new leftover row of the 1st subfragment).
    * @param {number} frag_ind
    * @param {number} split_index
    * @param {number} new_y
    * @returns {string}
    */
    split_frag(frag_ind, split_index, new_y) {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.jigsaw_split_frag(retptr, this.__wbg_ptr, frag_ind, split_index, new_y);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * Replace the call at the end of a composition.  Calls are referenced by their index, and any
    * negative number will correspond to removing a call.  See [`Spec::set_call`] for more docs.
    * @param {number} frag_ind
    * @param {number} row_ind
    * @param {number} call_ind
    * @returns {string}
    */
    set_call(frag_ind, row_ind, call_ind) {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.jigsaw_set_call(retptr, this.__wbg_ptr, frag_ind, row_ind, call_ind);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * Toggle whether or not a given [`Frag`] is muted
    * @param {number} frag_ind
    */
    toggle_frag_mute(frag_ind) {
        wasm.jigsaw_toggle_frag_mute(this.__wbg_ptr, frag_ind);
    }
    /**
    * [`Frag`] soloing ala FL Studio; this has two cases:
    * 1. `frag_ind` is the only unmuted [`Frag`], in which case we unmute everything
    * 2. `frag_ind` isn't the only unmuted [`Frag`], in which case we mute everything except it
    * @param {number} frag_ind
    */
    toggle_frag_solo(frag_ind) {
        wasm.jigsaw_toggle_frag_solo(this.__wbg_ptr, frag_ind);
    }
    /**
    * Toggles the lead folding at a given **on screen** row index.  This doesn't update the undo
    * history.
    * @param {number} frag_ind
    * @param {number} on_screen_row_ind
    */
    toggle_lead_fold(frag_ind, on_screen_row_ind) {
        wasm.jigsaw_toggle_lead_fold(this.__wbg_ptr, frag_ind, on_screen_row_ind);
    }
    /**
    * Remove a method from the list, if it doesn't appear in the composition
    * @param {number} method_ind
    * @returns {string}
    */
    remove_method(method_ind) {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.jigsaw_remove_method(retptr, this.__wbg_ptr, method_ind);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * Change the shorthand name of a method
    * @param {number} method_ind
    * @param {string} new_name
    */
    set_method_shorthand(method_ind, new_name) {
        const ptr0 = passStringToWasm0(new_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.jigsaw_set_method_shorthand(this.__wbg_ptr, method_ind, ptr0, len0);
    }
    /**
    * Change the full name of a method (without causing an undo history
    * @param {number} method_ind
    * @param {string} new_name
    */
    set_method_name(method_ind, new_name) {
        const ptr0 = passStringToWasm0(new_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.jigsaw_set_method_name(this.__wbg_ptr, method_ind, ptr0, len0);
    }
    /**
    * Resets the composition to the example
    */
    reset() {
        wasm.jigsaw_reset(this.__wbg_ptr);
    }
    /**
    * Returns the saved JSON of the current undo history
    * @returns {string}
    */
    get_save_file() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.jigsaw_get_save_file(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * Moves the view's camera to a given location
    * @param {number} new_cam_x
    * @param {number} new_cam_y
    */
    set_view_coords(new_cam_x, new_cam_y) {
        wasm.jigsaw_set_view_coords(this.__wbg_ptr, new_cam_x, new_cam_y);
    }
    /**
    * Sets the current part being viewed
    * @param {number} new_part
    */
    set_current_part(new_part) {
        wasm.jigsaw_set_current_part(this.__wbg_ptr, new_part);
    }
    /**
    * Toggles the foldedness of the method section, returning `false` if no section with that
    * name exists.
    * @param {string} section_name
    * @returns {boolean}
    */
    toggle_section_fold(section_name) {
        const ptr0 = passStringToWasm0(section_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.jigsaw_toggle_section_fold(this.__wbg_ptr, ptr0, len0);
        return ret !== 0;
    }
    /**
    * Toggles the foldedness of a specific method panel
    * @param {number} method_ind
    */
    toggle_method_fold(method_ind) {
        wasm.jigsaw_toggle_method_fold(this.__wbg_ptr, method_ind);
    }
    /**
    * Returns whether or not a given method info panel is open
    * @param {number} method_ind
    * @returns {boolean}
    */
    is_method_panel_open(method_ind) {
        const ret = wasm.jigsaw_is_method_panel_open(this.__wbg_ptr, method_ind);
        return ret !== 0;
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbg_new_abda76e883ba8a5f = function() {
        const ret = new Error();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_stack_658279fe44541cf6 = function(arg0, arg1) {
        const ret = getObject(arg1).stack;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_error_f851667af71bcfc6 = function(arg0, arg1) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    return imports;
}

function __wbg_init_memory(imports, maybe_memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedInt32Memory0 = null;
    cachedUint8Memory0 = null;


    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(input) {
    if (wasm !== undefined) return wasm;

    if (typeof input === 'undefined') {
        input = new URL('jigsaw_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await input, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync }
export default __wbg_init;
