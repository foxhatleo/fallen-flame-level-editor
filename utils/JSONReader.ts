export default class JSONReader {
    private readonly file: File;
    constructor(file: File) {
        this.file = file;
    }
    load(): Promise<Object> {
        return new Promise<Object>((resolve, reject) => {
            const fr = new FileReader();
            fr.onload = () => {
                try {
                    if (typeof fr.result === "string") {
                        const r = fr.result.replace(
                            new RegExp("((?:[0-9]+)|(?:[0-9]*\.[0-9]+))f", "gm"), "$1");
                        let json = JSON.parse(r);
                        resolve(json);
                    } else {
                        reject(true);
                    }
                } catch(e) { reject(true); return; }
            };
            fr.onabort = fr.onerror = () => { reject(false); };
            fr.readAsText(this.file);
        });
    }
}
