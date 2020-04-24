/**
 * Download a JSON file.
 *
 * @param value {string} The JSON representation value.
 * @param name {string} The filename. Note that the user can change it before downloading.
 * @param type {string} The content type of the file. By default JSON.
 */
export function download(value: object,
                                 name: string,
                                 type: string = "application/json") {
    const w = window as any;
    const jsonValue: string = JSON.stringify(value, undefined, 2);

    name = name + ".json";

    let blob;
    if (typeof w.Blob == "function") {
        blob = new Blob([jsonValue], {type: type});
    } else {
        const BlobBuilder = w.BlobBuilder || w.MozBlobBuilder || w.WebKitBlobBuilder || w.MSBlobBuilder;
        const instance = new BlobBuilder();
        instance.append(value);
        blob = instance.getBlob(type);
    }

    const
        URL = w.URL || w.webkitURL,
        blobURL = URL.createObjectURL(blob),
        anchor = document.createElement("a");

    if ("download" in anchor) {
        anchor.style.visibility = "hidden";
        anchor.href = blobURL;
        anchor.download = name;
        document.body.appendChild(anchor);
        const evt = document.createEvent("MouseEvents");
        evt.initEvent("click", true, true);
        anchor.dispatchEvent(evt);
        document.body.removeChild(anchor);
    } else if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, name);
    } else {
        location.href = blobURL;
    }
}

export enum JsonLoadFailReason {
    IO_ERROR,

    JSON_SYNTAX_ERROR,
}

/**
 * Upload a JSON file.
 *
 * @param file {File} The file to be uploaded.
 */
export function load(file: File): Promise<Object> {
    return new Promise<Object>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => {
            try {
                if (typeof r.result === "string") {
                    // VERY IMPORTANT!
                    // For some reason the level JSONs from Walker we have float literals like "1.23f".
                    // That is not valid JSON so get rid of the "f" first.
                    const i = r.result.replace(
                        new RegExp("((?:[0-9]+)|(?:[0-9]*\.[0-9]+))f", "gm"), "$1");
                    let json = JSON.parse(i);
                    resolve(json);
                } else {
                    reject(JsonLoadFailReason.IO_ERROR);
                }
            } catch(e) {
                if (e instanceof SyntaxError) {
                    reject(JsonLoadFailReason.JSON_SYNTAX_ERROR);
                } else {
                    reject(JsonLoadFailReason.IO_ERROR);
                }
            }
        };
        r.onabort = r.onerror = () => { reject(JsonLoadFailReason.IO_ERROR); };
        r.readAsText(file);
    });
}
