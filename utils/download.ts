export default function download(value, name, type = "application/json") {
    const w = window as any;

    let blob;
    if (typeof w.Blob == "function") {
        blob = new Blob([value], {type: type});
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
};
