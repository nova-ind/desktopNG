var wfs = new Worker('./assets/code/wfs.js');

wfs.onmessage = function (event) {
    const { type, data, requestId } = event.data;
    if (pendingRequests[requestId]) {
        if (type === 'result') {
            pendingRequests[requestId].resolve(data);
        } else if (type === 'error') {
            pendingRequests[requestId].reject(data);
        }
        delete pendingRequests[requestId];
    } else if (type === 'db_ready') {
        boot();
    } else if (type === "reboot") {
        window.location.reload();
    } else {
        console.warn('Unknown message type or requestId from wfs:', type);
    }
};

const pendingRequests = {};
let requestIdCounter = 0;

var fs = {
    send: function (message, transferList) {
        wfs.postMessage(message, transferList);
    },
    sendopfs: function (message, transferList) {
        wfs.postMessage(message, transferList);
    },
    askwfs: function (operation, params, opt) {
        const requestId = requestIdCounter++;
        return new Promise((resolve, reject) => {
            pendingRequests[requestId] = { resolve, reject };
            if (operation === 'write' && opt instanceof ArrayBuffer) {
                fs.send({ type: 'fs', operation, params, opt, requestId }, [p2]);
            } else {
                fs.send({ type: 'fs', operation, params, opt, requestId });
            }
        });
    },
    askwfsOPFS: function (operation, params, opt) {
        const requestId = requestIdCounter++;
        return new Promise((resolve, reject) => {
            pendingRequests[requestId] = { resolve, reject };
            if (operation === 'write' && opt instanceof ArrayBuffer) {
                fs.sendopfs({ type: 'opfs', operation, params, opt, requestId }, [p2]);
            } else {
                fs.sendopfs({ type: 'opfs', operation, params, opt, requestId });
            }
        });
    },
    read: function (path, filesystem = "opfs") {
        if(filesystem == "opfs") {
            return this.askwfsOPFS('read', path);
        }
        else if(filesystem == "idbfs") {
                return this.askwfs('read', path);
        }
    },
    write: function (path, data, filesystem = "opfs") {
        if(filesystem == "opfs") {
            return this.askwfsOPFS('write', path, data);
        }
        else if(filesystem == "idbfs") {
            return this.askwfs('write', path, data);
        }
    },
    del: function (path, filesystem = "opfs") {
        if(filesystem == "opfs") {
            return this.askwfsOPFS('delete', path);
        }
        else if(filesystem == "idbfs") {
            return this.askwfs('delete', path);
        }
    },
    erase: function (filesystem = "idbfs") {
        if(filesystem == "opfs") {
            return this.askwfsOPFS('erase', path);
        } else if(filesystem == "idbfs") {
            return this.askwfs('erase', path);
        }
    },
    ls: function (path, filesystem = "opfs") {
        if(filesystem == "opfs") {
            return this.askwfsOPFS('ls', path);
        } else if(filesystem == "idbfs") {
            return this.askwfs('ls', path);
        }
    },
    mkdir: function (path, filesystem = "opfs") {
        if(filesystem == "opfs") {
            return this.askwfsOPFS('mkdir', path);
        } else if(filesystem == "idbfs") {
            fs.write("/user/Documents/.", '', "idbfs");
        }
    }
};
setTimeout(function () {
    fs.ls("/user/info/name").then(async (namefile) => {
            // get count of items in app json object
            var apps = 0
            for (var key in app) {if (app[key].hasOwnProperty("onstartup")) {apps++}}
            console.log(apps)
            // document.querySelector("#currentComponent").max = apps;
            var counter = 0;
            for (var key in app) {
                if (app[key].hasOwnProperty("onstartup")) {
                    wm.notifSys("Services", `Loading ${app[key].name || key}`, 5000);
                    var appResponse = await app[key].onstartup(); // this is where each compontent is called
                    wm.notifSys("Services", `${app[key].name || key} says:<br>"${appResponse}"`, 5000);
                    counter++;
                }
            }
        });
}, 1000)
