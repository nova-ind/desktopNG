var opfsRoot;
navigator.storage.getDirectory().then(function (dir) {
    opfsRoot = dir;
    foxyfs.init()
})
var foxyfs = {
  getFileHandle: async function (path1) {
      var path = path1.split("/")
      var nameofFile = path[path.length - 1]
      path[path.length - 1] = '';
      path = path.filter(function (el) {
          return el != '';
      });
      var content = {};
      console.log(path, nameofFile)
      if (path.length == 0) {
          var dirHandle = await opfsRoot.getFileHandle(nameofFile)
          content[nameofFile] = dirHandle
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
              content[name] = handle
          }
      } else if (path.length == 1) {
          var dirHandle = await opfsRoot.getDirectoryHandle(path[0]);

          var content = {};
          for await (let [name, handle] of dirHandle.entries()) {
              content[name] = handle
          }
      }
      return content[nameofFile]
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
  mkdir: async function (location, name) {
      try {
          if (location == '' || location == "/") {
          return await opfsRoot.getDirectoryHandle(name, { create: true });
      } else {
          var path = location.split("/")
          path = path.filter(function (el) {
              return el != '';
          });
          var dirHandle = await opfsRoot.getDirectoryHandle(path[0])
          for (var item of path) {
              if (item == path[0]) {

              } else {
                  dirHandle = await dirHandle.getDirectoryHandle(item)
              }
          }
          return await dirHandle.getDirectoryHandle(name, { create: true })
      }
      } catch (error) {
          console.log(error)
      }
      
  },
  touch: async function (location, name) {
      if (location == '' || location == "/") {
          return await opfsRoot.getFileHandle(name, { create: true });
      } else {
          var path = location.split("/")
          path = path.filter(function (el) {
              return el != '';
          });
          var dirHandle = await opfsRoot.getDirectoryHandle(path[0])
          for (var item of path) {
              if (item == path[0]) {

              } else {
                  dirHandle = await dirHandle.getDirectoryHandle(item)
              }
          }
          return await dirHandle.getFileHandle(name, { create: true })
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
          var h = await foxyfs.getFileHandle(path)
          var file = await h.getFile()
          return await file.text()
      } catch (error) {
          console.log(error)
      }
  },
  write: async function (path, content) {
      var h = await foxyfs.getFileHandle(path, { create: true })
      var stream = await h.createWritable()
      stream.write(content)
      stream.close()
      return h;
  },
  rmfile: async function (path) {
      var h = await foxyfs.getFileHandle(path)
      h.remove()
  },
  rmdir: async function (path) {
      var h = await foxyfs.getDirHandle(path)
      var returnVal = "it no worky :(";
      try {
          h.remove({ recursive: false })
          returnVal = "Successful"
      } catch {

          h.remove({ recursive: true })
          returnVal = "Successful, but had to work recursivly"

      }
      return returnVal;
  },
  rm: async function (path) {
      var h = await foxyfs.getDirHandle(path)
      var returnVal = "it no worky :(";
      try {
          var h = await foxyfs.getFileHandle(path)
          h.remove()
          returnVal = "baller, its a file"
      } catch (error) {
          try {
              var h = await foxyfs.getDirHandle(path)
              try {
                  h.remove({ recursive: false })
                  returnVal = "Successful, no recurse"
              } catch {

                  h.remove({ recursive: true })
                  returnVal = "Successful, but had to work recursivly"

              }
          } catch (error) {
              returnVal = "not baller, it doesnt work."
          }
      }
      return returnVal;
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

self.addEventListener('fetch', async (event) => {
  console.log("[Service Worker] fetch");

  const url = new URL(event.request.url);
  const path = url.pathname;

  // Handle paths starting with /fs/opfs/
  if (path.startsWith('/fs/opfs/')) {
  console.log("[Service Worker] fetch opfs file");

      const filePath = path.replace('/fs/opfs', ''); // Get the actual path for the file system

      try {
          // Access the file system (this may require user interaction)
          const content = await foxyfs.read(filePath)
        console.log("[Service Worker] opfs file "+filePath+" content "+content)
          const response = new Response(content, {
              headers: {
                  'Content-Type': 'text/plain',
                  'Cache-Control': 'no-cache',
              },
              status: 200
          });

          event.respondWith(response);
          return; // Respond with file content
      } catch (error) {
          console.error('Error accessing file:', error);
      }

      // If we reach here, the file does not exist, so we return 404
      const notFoundResponse = new Response('404 Not Found', {
          status: 404,
          headers: { 'Content-Type': 'text/plain' }
      });

      event.respondWith(notFoundResponse);
      return; // Respond with 404
  }

  // Fallback for other requests (optional)
  event.respondWith(fetch(event.request));
});

// Function to get a file handle (this is a simplified version)
async function getFileHandle(filePath) {
  // Implementation would depend on how you're managing file access
  // This example assumes you have a root directory you are allowed to access
  const rootDirectoryHandle = await getRootDirectoryHandle(); // You need to implement this

  const parts = filePath.split('/');
  let currentHandle = rootDirectoryHandle;

  for (const part of parts) {
      const entry = await currentHandle.getDirectoryHandle(part, { create: false });
      currentHandle = entry; // Traverse down the directory
  }

  // Return the file handle
  return currentHandle.getFileHandle(parts[parts.length - 1], { create: false });
}

// Function to get the root directory handle (implement as needed)
async function getRootDirectoryHandle() {
  // Implement your logic to get the root directory handle
  // This might require user interaction to select a directory
  // For example, using window.showDirectoryPicker() in a user gesture
  const directoryHandle = await window.showDirectoryPicker();
  return directoryHandle;
}
