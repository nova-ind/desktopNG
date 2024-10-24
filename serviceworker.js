var opfsRoot;
navigator.storage.getDirectory().then(function (dir) {
    opfsRoot = dir;
    foxyfs.init()
})
var plainTextTypes = [
    "application/json",
    "application/x-sh",
    "image/svg+xml",
    "application/xml",
    "application/atom+xml",
  ];
var foxyfs = {
  getFileHandle: async function getFileHandle(path1) {
    // Remove leading slash if present and split the path
    const cleanPath = path1.startsWith('/') ? path1.substring(1) : path1;
    const path = cleanPath.split("/");
    const nameofFile = path[path.length - 1];
    
    // Remove the filename from path array
    path.pop();
    
    console.log('Processing:', { path, nameofFile, originalPath: path1 });
    
    try {
        // Case 1: File is in root directory
        if (path.length === 0) {
            return await opfsRoot.getFileHandle(nameofFile);
        }
        
        // Case 2: File is in a nested directory
        let dirHandle = opfsRoot;
        
        // Navigate through the directory structure
        for (const dir of path) {
            if (!dir) continue; // Skip empty directory names
            dirHandle = await dirHandle.getDirectoryHandle(dir, { create: false });
            if (!dirHandle) {
                console.log(`Directory not found: ${dir}`);
                throw new Error(`DirNotFoundErr,${dir}`)
            };
        }
        
        // Get the final file handle
        const fileHandle = await dirHandle.getFileHandle(nameofFile, { create: false });
        if (!fileHandle) {
            console.log(`File not found: ${dir}`);
            throw new Error(`FileNotFoundErr,${dir}`)
        };
        
        return fileHandle;
    } catch (error) {
        console.error('Error accessing file:', {
            error,
            path: path1,
            cleanPath,
            directories: path,
            filename: nameofFile
        });
        throw error;
    }
},
  getDirHandle: async function (path1) {
      var path = path1.split("/")
      var nameofFile = path[path.length - 1]
      path[path.length - 1] = '';
      path = path.filter(function (el) {
          return el != '';
      });
      var content = {};
      if (path.length == 0) {
          var dirHandle = await opfsRoot.getDirectoryHandle(nameofFile);
      }
      else if (path.length > 1) {
          var dirHandle = await opfsRoot.getDirectoryHandle(path[0]);

          for (var item of path) {
              if (item == path[0]) {

              } else {
                  dirHandle = await dirHandle.getDirectoryHandle(item)
              }
          }
      } else if (path.length == 1) {
          var dirHandle = await opfsRoot.getDirectoryHandle(path[0]);
      }
      return dirHandle
  },
  init: async function () {
  },
  ls: async function (dir) {
      try {
          var path = dir.split("/")
          path = path.filter(function (el) {
              return el != '';
          });
          if (path.length == 0) {
              var content = [];
              for await (let [name, handle] of opfsRoot.entries()) {
                  content.push({ name: name, type: handle.kind, path: dir + name })
              }
              return { items: content };
          }
          var dirHandle = await opfsRoot.getDirectoryHandle(path[0], {create:true});
          if (path.length > 1) {
              for (var item of path) {
                  if (item == path[0]) {

                  } else {
                      dirHandle = await dirHandle.getDirectoryHandle(item, {create:true})
                  }
              }
              var content = [];
              for await (let [name, handle] of dirHandle.entries()) {
                  content.push({ name: name, type: handle.kind, path: dir + name })
              }
              return { items: content };
          } else if (path.length == 1) {
              var content = [];
              for await (let [name, handle] of dirHandle.entries()) {
                  content.push({ name: name, type: handle.kind, path: dir + name })
              }
              return { items: content };
          }
      } catch (error) {
          console.log(error)
      }

  },
  typeof: async function (path1) {
      var path = path1.split("/")
      var nameofFile = path[path.length - 1]
      path[path.length - 1] = '';
      path = path.filter(function (el) {
          return el != '';
      });
      var content = {};
      if (path.length == 0) {
          var dirHandle = await opfsRoot.getDirectoryHandle(nameofFile);
          content[nameofFile] = dirHandle.kind
      }
      else if (path.length > 1) {
          var dirHandle = await opfsRoot.getDirectoryHandle(path[0]);

          for (var item of path) {
              if (item == path[0]) {

              } else {
                  dirHandle = await dirHandle.getDirectoryHandle(item)
              }
          }
          var content = {};
          for await (let [name, handle] of dirHandle.entries()) {
              content[name] = handle.kind
          }
      } else if (path.length == 1) {
          var dirHandle = await opfsRoot.getDirectoryHandle(path[0]);

          var content = {};
          for await (let [name, handle] of dirHandle.entries()) {
              content[name] = handle.kind
          }
      }
      return content[nameofFile]
  },
  read: async function (path) {
    try {
      var h = await foxyfs.getFileHandle(path);
      var file = await h.getFile();
      console.log(file.type);
      if(file.type == ""){
        return {txt: await file.text(), type: "text/plain"};
      }
      else if(plainTextTypes.includes(file.type) || file.type.startsWith("text/")){
        return {txt: await file.text(), type: file.type};
      } else {
        return {txt: file, type: file.type};
      }
    } catch (error) {
      console.log(error);
    }
  }
}

// sw.js - Service Worker file
self.addEventListener('install', (event) => {
  console.log("[Service Worker] Install");
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  console.log("[Service Worker] activate");
  event.waitUntil(clients.claim());
});


async function handlereq(ev){
    const url = new URL(ev.request.url);
    const path = url.pathname;
  
    // Handle paths starting with /fs/opfs/
    if (path.startsWith('/fs/opfs/')) {
        //   event.preventDefault();
        console.log("[Service Worker] fetch opfs file");
        const filePath = path.replace('/fs/opfs', ''); // Get the actual path for the file system
        const content = await foxyfs.read(filePath);
        console.log("[Service Worker] OPFS Response\n\n", "Path:\n", filePath, "\nContent:\n",content,"\nType:\n", typeof content)
        const response = new Response(content.txt, {
            headers: {
                'Content-Type': content.type,
                'Cache-Control': 'no-cache',
            },
            status: 200
        });

        console.log(response);
        return response;
            // If we reach here, the file does not exist, so we return 404
        //   const notFoundResponse = new Response('404 Not Found', {
        //       status: 404,
        //       headers: { 'Content-Type': 'text/plain' }
        //   });
    
        //   event.respondWith(notFoundResponse);
        //   return; // Respond with 404
    }
            //   console.error('Error accessing file:', error);
  
    // Fallback for other requests (optional)
    return fetch(ev.request);
}

self.addEventListener('fetch', async (event) => {
  console.log("[Service Worker] fetch");
  event.respondWith(handlereq(event))
});
