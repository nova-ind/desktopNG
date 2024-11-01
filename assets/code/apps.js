var app = {
  settings: {
    runs: true,
    name: "Settings",
    icon: "./assets/img/systemIcons/settings.svg",
    init: async function () {
      const main = tk.mbw(
        "Settings",
        "300px",
        "auto",
        true,
        true,
        true,
        undefined,
        "./assets/img/systemIcons/settings.svg"
      );
      const generalPane = tk.c("div", main.main, "hide");
      const appearPane = tk.c("div", main.main, "hide");
      const mainPane = tk.c("div", main.main);
      // Main pane
      tk.p("Settings", undefined, mainPane);
      tk.cb("b1 b2", "General", () => ui.sw2(mainPane, generalPane), mainPane);
      tk.cb(
        "b1 b2",
        "Appearance",
        () => ui.sw2(mainPane, appearPane),
        mainPane
      );
      // General pane
      tk.p("General", undefined, generalPane);
      tk.cb(
        "b1 b2 red",
        "Erase This WebDesk",
        () =>
          wm.wal(
            `<p>Warning: Erasing this WebDesk will destroy all data stored on it, and you'll need to do setup again.</p>`,
            () => fs.erase("reboot"),
            "Erase"
          ),
        generalPane
      );
      tk.cb("b1", "Back", () => ui.sw2(generalPane, mainPane), generalPane);
      // Appearance pane
      tk.p("Appearance", undefined, appearPane);
      const bg1 = tk.c("input", appearPane, "i1");
      bg1.setAttribute("data-jscolor", "{}");
      bg1.addEventListener("input", function () {
        ui.crtheme(event.target.value);
      });
      const bgc = tk.c("input", appearPane, "i1");
      bgc.type = "color";
      bgc.addEventListener("change", function () {
        ui.crtheme(event.target.value);
        bg1.value = event.target.value;
      });
      tk.p("UI Theme", undefined, appearPane);
      tk.cb(
        "b1 b2",
        "Dark mode",
        function () {
          fs.del("/user/info/lightdarkpref");
          sys.autodarkacc = false;
          wd.dark();
        },
        appearPane
      );
      tk.cb(
        "b1 b2",
        "Auto (based off color picker)",
        async function () {
          fs.write("/user/info/lightdarkpref", "auto");
          const killyourselfapplesheep = await fs.read("/user/info/color");
          ui.crtheme(killyourselfapplesheep);
          sys.autodarkacc = true;
        },
        appearPane
      );
      tk.cb(
        "b1 b2",
        "Clear mode (Light Text)",
        function () {
          fs.del("/user/info/lightdarkpref");
          sys.autodarkacc = false;
          wd.clearm2();
        },
        appearPane
      );
      tk.cb(
        "b1 b2",
        "Clear mode (Dark Text)",
        function () {
          fs.del("/user/info/lightdarkpref");
          sys.autodarkacc = false;
          wd.clearm();
        },
        appearPane
      );
      tk.cb(
        "b1 b2",
        "Light mode",
        function () {
          fs.del("/user/info/lightdarkpref");
          sys.autodarkacc = false;
          wd.light();
        },
        appearPane
      );
      tk.p("Other", undefined, appearPane);
      tk.cb(
        "b1",
        "Reset Colors",
        function () {
          fs.del("/user/info/color");
          fs.del("/user/info/lightdark");
          fs.del("/user/info/lightdarkpref");
          wm.wal(
            "Reboot to finish resetting colors.",
            () => wd.reboot(),
            "Reboot"
          );
        },
        appearPane
      );
      tk.cb("b1", "Back", () => ui.sw2(appearPane, mainPane), appearPane);
    },
  },
  store: {
    runs: true,
    name: "AppStore",
    icon: "./assets/img/systemIcons/store.svg",
    init: async function () {
      const main = tk.mbw(
        "Store",
        "800px",
        "500px",
        true,
        true,
        true,
        undefined,
        "./assets/img/systemIcons/store.svg"
      );
      // tk.cb('b1 b2', 'Home', function(){}, )
      var navbar = main.win.children[0].children[0];
      var wc = main.main;
      var appstorepage = tk.c("iframe", wc);
      navbar.appendChild(
        tk.cb(
          "b4",
          "Home",
          function () {
            appstorepage.src = "/assets/sysappfiles/appstore/home.html";
          },
          null
        )
      );
      // navbar.appendChild(
      //   tk.cb(
      //     "b4",
      //     "Categories",
      //     function () {
      //       appstorepage.src = "/assets/sysappfiles/appstore/categories.html";
      //     },
      //     null
      //   )
      // );
      // navbar.appendChild(
      //   tk.cb(
      //     "b4",
      //     "This Device",
      //     function () {
      //       appstorepage.src = "/assets/sysappfiles/appstore/thisdevice.html";
      //     },
      //     null
      //   )
      // );
      appstorepage.setAttribute("frameborder", "0");
      appstorepage.src = "/assets/sysappfiles/appstore/home.html";
      appstorepage.style.width = "100%";
      appstorepage.style.height = "100%";
      wc.style.height = "calc(100% - 65px)";
      appstorepage.onload = function () {
        console.log(document.body.parentElement);
        appstorepage.contentDocument.body.parentElement.setAttribute(
          "style",
          document.body.parentElement.getAttribute("style")
        );
      };
      appstorepage.contentWindow.onhashchange = function () {
        var hash = appstorepage.contentWindow.location.hash;
        if (hash.startsWith("#installApp:")) {
          var appid = hash.split(":")[1];
          function toDataUrl(url, callback) {
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
              var reader = new FileReader();
              reader.onloadend = function () {
                callback(reader.result);
              };
              reader.readAsDataURL(xhr.response);
            };
            xhr.open("GET", url);
            xhr.responseType = "blob";
            xhr.send();
          }
          
        }
      };
    },
  },
  setup: {
    runs: false,
    init: async function () {
      if (!sys.isIOT) {
        const main = document.querySelector("#setuparea");
        // const main = tk.c('div', setupWin.main, 'setupbox');
        // create setup menubar
        const bar = tk.c("div", main, "setupbar");
        const tnav = tk.c("div", bar, "tnav");
        const title = tk.c("div", bar, "title");
        tk.cb("b4", "Start Over", () => fs.erase("reboot"), tnav);
        tk.cb("b4 time", "what", undefined, title);
        // first menu
        const first = tk.c("div", main, "setb");
        tk.img("./assets/img/systemIcons/os.svg", "setupi", first);
        tk.p("Welcome to NovaOS Deskop Next-Gen!", "h2", first);
        tk.p("NovaOS is powered by WebDesk!", "h3", first);
        tk.cb("b1", `Begin Setup`, () => ui.sw2(first, user), first);
        // user menu
        const user = tk.c("div", main, "setb hide");
        tk.img("./assets/img/setup/user.svg", "setupi", user);
        tk.p("About You", "h2", user);
        tk.p(
          `Set up a user for NovaOS to store all of your stuff in, and set up permissions. By default, your data is stored on-device, soon you will be able to opt-in to cloud sync..`,
          undefined,
          user
        );
        const input = tk.c("input", user, "i1");
        input.placeholder = "Pick a username.";
        tk.cb(
          "b1",
          "Done!",
          function () {
            wd.finishsetup(input.value, user, sum);
          },
          user
        );
        // summary
        const sum = tk.c("div", main, "setb hide");
        tk.img("./assets/img/setup/check.svg", "setupi", sum);
        tk.p("Setup is complete.", "h2", sum);
        tk.p(
          "Keep in mind, novaOS is still in early public alpha.",
          undefined,
          sum
        );
        tk.cb(
          "b1 rb",
          "Erase & restart",
          function () {
            fs.erase("reboot");
          },
          sum
        );
        tk.cb(
          "b1",
          "Complete setup",
          function () {
            wd.reboot();
          },
          sum
        );
        sum.id = "setupdone";
        fs.mkdir("/user/Documents/", "opfs");
      } else {
        fs.mkdir("/user/Documents/", "opfs");
        wd.finishsetup();
        wd.reboot();
      }
    },
  },
  files: {
    runs: true,
    name: "Files",
    icon: "./assets/img/systemIcons/files.svg",
    init: async function () {
      var history = [];
      var forwardHistory = [];
      var currentHistoryIndex = "notNavigated";
      const win = tk.mbw(
        `Files`,
        "340px",
        "auto",
        true,
        true,
        true,
        undefined,
        app.files.icon
      );
      win.main.classList.add("fileman");
      const lowerZone = tk.c("div", win.main);
      lowerZone.classList.add("lowerZone");
      const mainPane = tk.c("div", lowerZone);
      const navBar = tk.c("div", win.main);
      navBar.classList.add("navbar");
      const navPane = tk.c("div", lowerZone);
      navPane.classList.add("navpane");
      const fm = tk.c("div", mainPane);
      fm.classList.add("fm");
      const backButton = tk.cb("b1", "◀️", function () {}, navBar);
      const fwdButton = tk.cb("b1", "▶️", function () {}, navBar);
      const reButton = tk.cb("b1", "🔁", function () {}, navBar);
      const mkFolder = tk.cb("b1", "➕", function () {}, navBar);
      const breadcrumbs = tk.c("div", navBar);
      breadcrumbs.classList.add("bc");
      const items = tk.c("div", fm);
      const navPaneDrives = tk.c("ul", navPane);
      const osDrive = tk.c("li", navPaneDrives);
      osDrive.classList.add("flist", "width", "drive");
      osDrive.innerText = "OPFS (NovaOS)";
      const classicDrive = tk.c("li", navPaneDrives);
      classicDrive.classList.add("flist", "width", "drive");
      classicDrive.innerText = "IDBFS (Classic)";
      async function navto(path, filesystem = "opfs") {
        if (history.length == 0) {
          history.push({ path: path, filesystem: filesystem });
          currentHistoryIndex = history.length - 1;
        }
        if (
          history[history.length - 1].path !== path ||
          history[history.length - 1].filesystem !== filesystem
        ) {
          history.push({ path: path, filesystem: filesystem });
          currentHistoryIndex = history.length - 1;
        }

        // if(history.length == 0){
        //     history.push({path: path, filesystem: filesystem})
        //     currentHistoryIndex = 0
        //     console.log(history[history.length - 1].path !== path, history[history.length - 1].filesystem !== filesystem)
        // }
        // else if(history[history.length - 1].path !== path && history[history.length - 1].filesystem !== filesystem){
        //     history.push({path: path, filesystem: filesystem})
        //     currentHistoryIndex = history.length - 1

        // }
        console.log(history);
        reButton.onclick = async function () {
          navto(path, filesystem);
        };
        backButton.onclick = async function () {
          console.log(history, forwardHistory, currentHistoryIndex);
          if (history.length > 1) {
            currentHistoryIndex = history.length - 2;
            forwardHistory.push(history.pop());
            console.log(forwardHistory);
            const last = history[currentHistoryIndex];
            navto(last.path, last.filesystem);
          }
        };
        fwdButton.onclick = async function () {
          console.log("Scheiße", history, forwardHistory, currentHistoryIndex);
          if (forwardHistory.length > 0) {
            currentHistoryIndex += 1;
            const next = forwardHistory[forwardHistory.length - 1];
            history.push(forwardHistory.pop());
            console.log(next, "hasOwnProperty");
            if (next !== undefined) {
              navto(next.path, next.filesystem);
            }
          }
        };
        mkFolder.onclick = async function () {
          if (filesystem == "opfs") {
            fs.mkdir(
              `${path}${prompt("enter folder name here", "New Folder")}/.`,
              "opfs"
            );
          } else {
            fs.write(
              `${path}${prompt("enter folder name here", "New Folder")}/.`,
              "",
              "idbfs"
            );
          }
          navto(path, filesystem);
        };
        items.innerHTML = "";
        breadcrumbs.innerHTML = "";
        let crumbs = path.split("/").filter(Boolean);
        let currentp = "/";
        tk.cb("flist", "Root", () => navto("/", filesystem), breadcrumbs);
        crumbs.forEach((crumb, index) => {
          currentp += crumb + "/";
          tk.cb("flists", "/", undefined, breadcrumbs);
          tk.cb(
            "flist",
            crumb,
            () => {
              let newPath = crumbs.slice(0, index + 1).join("/");
              navto("/" + newPath + "/", filesystem);
            },
            breadcrumbs
          );
        });
        const thing = await fs.ls(path, filesystem);
        thing.items.forEach(function (thing) {
          if (thing.type === "folder" || thing.type === "directory") {
            tk.cb(
              "flist width",
              "📁 " + thing.name,
              () => navto(thing.path + "/", filesystem),
              items
            );
          } else if (thing.name.startsWith(".")) {
            void 0;
          } else {
            tk.cb(
              "flist width",
              "📄 " + thing.name,
              async function () {
                const yeah = await fs.read(thing.path);
                wm.wal(yeah);
              },
              items
            );
          }
        });
      }
      osDrive.addEventListener(
        "click",
        await function () {
          navto("/", "opfs");
        }
      );
      classicDrive.addEventListener(
        "click",
        await function () {
          navto("/", "idbfs");
        }
      );

      navto("/", "opfs");
    },
  },
  about: {
    runs: true,
    name: "About",
    icon: "./assets/img/systemIcons/os.svg",
    init: async function () {
      const win = tk.mbw("About", "300px", "auto", false, true, true);
      var aboutTxt = tk.c("div", win.main);
      aboutTxt.innerHTML = `
            <img height="100px" src="./assets/img/systemIcons/os.svg">
            <h2>NovaOS</h1>
            <p>NovaOS is a free, open-source operating system designed for the web. It is built on WebDesk, a web-based desktop environment.</p>
            <p>Version: ${abt.ver}</p>
            <p>Latest update: ${abt.lastmod}</p>
            `;
    },
  },
  browser: {
    runs: true,
    name: "Browser",
    icon: "./assets/img/systemIcons/networking.svg",
    init: async function () {
      const win = tk.mbw("Browser", "80vw", "82vh", false, true, true);
      ui.dest(win.title, 0);
      const tabs = tk.c("div", win.main, "tabbar d");
      let currenttab = tk.c("div", win.main, "hide");
      let currentbtn = tk.c("div", win.main, "hide");
      win.main.classList = "browsercont";
      tk.css("./assets/lib/browse.css");
      const btnnest = tk.c("div", tabs, "tnav");
      const addbtn = tk.cb(
        "b4 browserbutton",
        "+",
        function () {
          const tab = tk.c("embed", win.main, "browsertab");
          tab.src = "https://corsproxy.io/?https%3A%2F%2Fnovafurry.win";
          ui.sw2(currenttab, tab);
          currenttab = tab;
          const tabbtn = tk.cb(
            "b4",
            "novafurry.win",
            function () {
              ui.sw2(currenttab, tab);
              currenttab = tab;
              currentbtn = tabtitle;
            },
            btnnest
          );
          const tabtitle = tk.c("span", tabbtn);
          currentbtn = tabtitle;
          const closetab = tk.cb(
            "browserclosetab",
            "X",
            function () {
              ui.dest(tabbtn);
              ui.dest(currenttab);
            },
            tabbtn
          );
        },
        btnnest
      );
      const okiedokie = tk.c("div", tabs, "browsertitle");
      const searchbtns = tk.c("div", okiedokie, "tnav");
      const close = tk.cb(
        "b4 rb browserbutton",
        "x",
        function () {
          ui.dest(win.win, 150);
          ui.dest(win.tbn, 150);
        },
        searchbtns
      );
      const rel = tk.cb("b4 browserbutton", "⟳", function () {}, searchbtns);
      const back = tk.cb("b4 browserbutton", "<", function () {}, searchbtns);
      const rev = tk.cb("b4 browserbutton", ">", function () {}, searchbtns);
      const searchnest = tk.c("div", tabs, "title");
      const search = tk.c("input", okiedokie, "i1 browserbutton");
      search.placeholder = "Enter URL";
      const go = tk.cb(
        "b4 browserbutton",
        "Go!",
        function () {
          currenttab.src = `https://corsproxy.io/?${
            search.value.startsWith("http")
              ? encodeURIComponent(search.value)
              : "https://" + encodeURIComponent(search.value)
          }`;
          console.log(
            `https://corsproxy.io/?${
              search.value.startsWith("http")
                ? encodeURIComponent(search.value)
                : "https://" + encodeURIComponent(search.value)
            }`
          );
          currentbtn.innerHTML = search.value;
        },
        okiedokie
      );
      wd.win();
    },
  },
  sysqna: {
    runs: false,
    name: "DocAI ML Models",
    onstarytup: async function () {
      try {
        const model = await qna.load();
        console.log("Model loaded");
        window.docAImodel = model;
        return "Sysqna model loaded";
      } catch (error) {
        console.error("Failed to load model", error);
        return "Failed to load model";
      }
    },
  },
  txter: {
    runs: true,
    name: "txter editor",
    icon: "./assets/img/systemIcons/txter.svg",
    init: async function () {
      const win = tk.mbw(
        "txter",
        "fit-content",
        "fit-content",
        true,
        true,
        true,
        undefined,
        "./assets/img/systemIcons/txter.svg"
      );
      const txtarea = tk.c("textarea", win.main, "i1");
      const bruh = tk.c("br", win.main);
      txtarea.style.height = "calc(82vh - 120px)";
      txtarea.style.width = "300px";
      const savebtn = tk.cb(
        "b1",
        "Save",
        async function () {
          await fs.write(
            `${prompt(
              "Enter a path to save file as",
              "/user/Documents/txter.txt"
            )}`,
            txtarea.value
          );
          wm.wal("Saved!");
        },
        win.main
      );
      const loadbtn = tk.cb(
        "b1",
        "Load",
        async function () {
          txtarea.value = await fs.read(
            `${prompt(
              "Enter a path to load a file from",
              "/user/Documents/txter.txt"
            )}`
          );
        },
        win.main
      );
    },
  },
  docai: {
    runs: true,
    name: "DocAI",
    requiresServices: ["sysqna"],
    icon: "./assets/img/systemIcons/Docai.svg",
    init: async function (query = "") {
      const win = tk.mbw(
        "DocAI",
        "500px",
        "auto",
        false,
        true,
        true,
        undefined,
        "./assets/img/systemIcons/Docai.svg"
      );
      var div = tk.c("div", win.main);
      // div.innerText = "DocAI is not yet available in this version of NovaOS.";
      div.innerHTML = `
            <h2>DocAI</h2>
            <i>Your personal AI.</i><br>
            <b>DocAI <u>NEVER HALLUCINATES</u></b><br>
            <input class="i1" id="question" placeholder="Ask your documents!" value="${query}">
            <button id="ask" class="b1">Answer</button>
            <h3>Answers:</h3>
            <div id="answers"></div>
            `;
      var askBtn = document.getElementById("ask");
      var question = document.getElementById("question");
      if (window.docAImodel) {
        var model = window.docAImodel;
        askBtn.removeAttribute("disabled");
        async function ask() {
          window.ans = [];
          var resp = await fs.ls("/user/Documents/");
          console.log(resp);
          var documents = resp.items;
          console.log(documents);
          var contentsForAi = "";
          var contentsDisplay = [];
          documents.forEach(async function (v, i) {
            var fc = await fs.read(v.path);
            contentsForAi = contentsForAi + fc + "\n\n";
            contentsDisplay.push(v.path + ": \n" + fc + "\n\n");
          });
          document.querySelector("#answers").innerHTML = "<p>Thinking...</p>";
          console.log(question.value);
          async function processDocuments(documents) {
            let ans = [];

            for (const v of documents) {
              try {
                var fc = await fs.read(v.path);
                if (fc.length > 10) {
                  const answers = await model.findAnswers(question.value, fc);
                  answers.forEach((a, i) => {
                    a.path = v.path;
                    ans.push(answers[i]);
                  });
                }
              } catch (error) {
                console.error("Error processing document:", error);
              }
            }

            // Sort answers by highest to lowest score
            ans = ans.sort((a, b) => b.score - a.score);
            var grpd = ans.reduce((acc, obj) => {
              var key = obj.path;
              if (!acc[key]) {
                acc[key] = [];
              }
              acc[key].push(obj);
              return acc;
            }, {});
            var grouped = [];
            for (key in grpd) {
              grouped.push({ path: key, answers: grpd[key] });
            }
            console.log(grouped);
            // Display answers
            window.answersFormatted = [];
            grouped.forEach(async (ans, i) => {
              var lowestStartIndex = 0;
              var highestEndIndex = 0;
              var isFirstLoop = true;
              ans.answers.forEach((a, i) => {
                if (isFirstLoop) {
                  lowestStartIndex = a.startIndex;
                  highestEndIndex = a.endIndex;
                  isFirstLoop = false;
                } else {
                  if (a.startIndex < lowestStartIndex) {
                    lowestStartIndex = a.startIndex;
                  }
                  if (a.endIndex > highestEndIndex) {
                    highestEndIndex = a.endIndex;
                  }
                }
              });
              var txtFile = await fs.read(ans.path);
              var sentenceEnd = txtFile.substr(highestEndIndex).split(".")[0];
              var lineEnd = txtFile.substr(highestEndIndex).split(".")[0];
              var bestOutput =
                sentenceEnd.length < lineEnd.length ? sentenceEnd : lineEnd;
              // highestEndIndex = lowestStartIndex+Math.min(txtFile.substr(highestEndIndex).indexOf("."), txtFile.substr(highestEndIndex).indexOf("\n"))
              answersFormatted.push({
                text:
                  txtFile.substring(lowestStartIndex, highestEndIndex) +
                  bestOutput,
                score: ans.answers[0].score,
                path: ans.path,
              });
            });
            var undefineds = 0;
            var count = 0;
            setTimeout(function () {
              document.querySelector("#answers").innerHTML = "";
              answersFormatted.forEach((a) => {
                if (a !== undefined && count < 3) {
                  var p = document.createElement("p");
                  p.innerHTML = `${a.text}<br><small>(score: ${Math.round(
                    a.score
                  )}; found in: ${a.path})</small>`;
                  console.log(
                    `${a.text}<br><small>(score: ${Math.round(
                      a.score
                    )}; found in: ${a.path})</small>`
                  );
                  document.querySelector("#answers").appendChild(p);
                  count++;
                } else {
                  undefineds++;
                }
              });
            }, 1000);
            // ans.forEach(a => {
            //     if (a !== undefined && count < 3) {
            //         console.log(a);
            //         var p = document.createElement('p');
            //         p.innerHTML = `${a.text}<br><small>(score: ${Math.round(a.score)}; found in: ${a.path})</small>`;
            //         document.querySelector("#answers").appendChild(p);
            //         count++;
            //     } else {
            //         undefineds++
            //     }
            // });
            if (undefineds == ans.length) {
              document.querySelector(
                "#answers"
              ).innerHTML = `No answers found.`;
            }
          }

          // Call the function with the documents array
          processDocuments(documents);
        }
        if (query !== "") {
          ask();
        }
        // Find the answers
        askBtn.addEventListener("click", ask);
      } else {
        document.querySelector("#docai").remove();
        document.querySelector("#docaitbn").remove();
        const load = tk.mbw(
          "DocAi Model Loader",
          "500px",
          "auto",
          true,
          undefined,
          undefined,
          undefined,
          "docaiml"
        );
        wm.wal("The sysqna model failed to load on boot. Please wait.");
        var div = tk.c("p", load.main);
        div.innerHTML = `DocAI is reloading the model...<br><progress></progress>`;
        try {
          await app.sysqna.onstartup();
        } catch (error) {
          document.querySelector("#docaiml").remove();
          document.querySelector("#docaimltbn").remove();
          app.docai.init();
        }
        document.querySelector("#docaiml").remove();
        document.querySelector("#docaimltbn").remove();
        app.docai.init();
      }
    },
  },
  cast: {
    runs: true,
    name: "Cast",
    icon: "./assets/img/systemIcons/cast.svg",
    init: async function (id = false, username = "ffs, not a cast") {
      const displayMediaOptions = {
        video: {
          displaySurface: "browser",
        },
        audio: {
          suppressLocalAudioPlayback: false,
        },
        preferCurrentTab: false,
        selfBrowserSurface: "include",
        systemAudio: "exclude",
        surfaceSwitching: "include",
        monitorTypeSurfaces: "include",
      };
      var p;
      const win = tk.mbw(
        "Cast",
        "300px",
        "auto",
        false,
        true,
        true,
        "ncast",
        "./assets/img/systemIcons/cast.svg"
      );
      win.win.id = "ncast";
      tk.mkel("h1", [], "Cast", win.main);
      tk.p(
        "enter the deskID of another user with the cast app open to share your screen.",
        "",
        win.main
      );
      var recepient = tk.c("input", win.main, "i1");
      recepient.required = true;
      var disableTurn = tk.c("input", win.main, "");
      disableTurn.id = "dt";
      var dtlabel = tk.c("label", win.main, "");
      dtlabel.for = "dt";
      dtlabel.innerText =
        "Disable Cloud Connections (LAN Only) (requires ?cast.dt in the end of the url on recieving page :) )";
      var send = tk.cb(
        "b1",
        "Start",
        async function () {
          ui.dest(send);
          var conntxt = tk.p("Connecting...", "", win.main);
          console.log("Initializing");
          var conn = peer.connect(recepient.value);
          conn.on("open", async function () {
            console.log("Connected");

            // Send messages
            if (disableTurn.checked == true) {
              var castconfig = {
                config: {},
              };
            } else {
              var castconfig = {
                config: {
                  iceServers: [
                    { urls: "stun:freeturn.net:3478" },
                    {
                      urls: "turn:freeturn.net:3478",
                      username: "free",
                      credential: "free",
                    },
                  ],
                },
              };
            }
            var castpeer = new Peer(
              (await fs.read("/system/deskid")) + "-cast",
              castconfig
            );
            castpeer.on("open", async function (id2) {
              console.log(id2, castpeer);
              conn.send({
                name: "osAppConnect-cast",
                id: await fs.read("/system/deskid"),
                uname: (await fs.read("/user/info/name")) || "NovaOS User",
              });
            });
            castpeer.on("connection", (conn2) => {
              conn2.on("data", async function (data) {
                console.log(data);
                if (data == "connAccept") {
                  ui.dest(conntxt);
                  var media = await navigator.mediaDevices.getDisplayMedia(
                    displayMediaOptions
                  );
                  castpeer.call(recepient.value + "-cast", media);
                  console.log(win);
                  castpeer.on("close", function () {
                    castpeer.destroy();
                    media.getTracks().forEach((track) => {
                      track.stop();
                    });
                    win.title.children[0].children[0].click();
                  });
                  tk.cb(
                    "b1",
                    "Stop",
                    function () {
                      conn2.send("cast_over");
                      castpeer.destroy();
                      media.getTracks().forEach((track) => {
                        track.stop();
                      });
                      win.title.children[0].children[0].click();
                    },
                    win.main
                  );
                }
              });
              conn2.send("hai uwu");
            });
          });
        },
        win.main
      );
      //   var stop = tk.cb("b1", "Stop", function () {}, win.main);
      stop.style.display = "none";
      console.log(id);
    },
    iot: async function () {
      const win = tk.mbw(
        "iotapp",
        "auto",
        "auto",
        false,
        false,
        false,
        "ncast",
        ""
      );
      var title = tk.mkel("h1", ["time"], "", win.main);
      var kb = tk.mkel("h2", [], "", win.main);
      kb.innerHTML = `Use '${await fs.read("/system/deskid")}' to connect`;
    },
    connection: async function (id, username = "ffs, not a cast") {
      var win;
      var recv;
      async function acceptCast() {
        if (window.location.search == "?cast.dt") {
          var castconfig = {
            config: {},
          };
        } else {
          var castconfig = {
            config: {
              iceServers: [
                { urls: "stun:freeturn.net:3478" },
                {
                  urls: "turn:freeturn.net:3478",
                  username: "free",
                  credential: "free",
                },
              ],
            },
          };
        }
        p = new Peer((await fs.read("/system/deskid")) + "-cast", castconfig);
        p.on("open", function (thisID) {
          console.log("My peer ID is: " + thisID);
          var c = p.connect(id + "-cast");
          c.on("data", function (data) {
            if (data == "cast_over") {
              recv.title.children[0].children[0].click();
              if (sys.isIOT) {
                window.location.reload();
              } else {
                p = undefined;
                c = undefined;
              }
            }
          });
          c.on("open", function () {
            // Send messages
            c.send("connAccept");
          });
        });
        recv = tk.mbw(
          `Cast Reciever: ${username.toString()}#${id.toString()}`,
          "850px",
          "490px",
          false,
          true,
          true,
          "./assets/img/systemIcons/cast.svg"
        );
        const video = tk.c("video", recv.main);
        video.setAttribute("controls", "yes");
        video.setAttribute("autoplay", "yes");
        video.style.width = "100%";
        video.style.height = "100%";
        video.style.id = "castvideo";

        p.on("call", function (call) {
          // Answer the call, providing our mediaStream
          call.answer(null);
          call.on("stream", function (stream) {
            // `stream` is the MediaStream of the remote peer.
            // Here you'd add it to an HTML video/canvas element.
            video.srcObject = stream;
            video.play();
            const stop = tk.cb(
              "b4",
              "Stop",
              function () {
                p.destroy();
                // win.title.children[0].children[0].click();
                recv.title.children[0].children[0].click();
              },
              recv.title.children[0]
            );
          });
          call.on("close", function () {
            p.destroy();
            recv.title.children[0].children[0].click();
            if (sys.isIOT) {
              window.location.reload();
            }
            // win.title.children[0].children[0].click();
          });
        });
      }
      if (username !== "ffs, not a cast") {
        if (!sys.isIOT) {
          win = tk.mbw(
            "Cast",
            "300px",
            "auto",
            false,
            true,
            true,
            "ncast",
            "./assets/img/systemIcons/cast.svg"
          );
          var ic = tk.mkel("div", ["notif"], "", win.main);
          console.log(win);
          ic.id = "ncastNotizone";
          tk.mkel("b", [], "Incoming Request<br>", ic);
          var req = tk.mkel(
            "span",
            [],
            `ID: ${id.toString()}<br>Username: ${username.toString()}<br>`,
            ic
          );
          var ac = tk.cb(
            "b1 smallb",
            "Accept",
            function () {
              acceptCast();
              win.title.children[0].children[0].click();
            },
            ic
          );
          var de = tk.cb(
            "b1 smallb",
            "Deny",
            function () {
              win.title.children[0].children[0].click();
            },
            ic
          );
        } else {
          acceptCast();
          wm.notif(
            "Cast Connection",
            `${username}#${id} connected to this reciever`
          );
        }
      }
    },
  },
  appmark: {
    runs: true,
    name: "App Market",
    icon: "./assets/img/systemIcons/store.svg",
    create: async function (apploc, app, update) {
      async function execute(url2) {
        try {
          const response = await fetch(url2);
          if (!response.ok) {
            wm.wal(
              `<p>Couldn't load apps, check your internet or try again later. If it's not back up within an hour, DM macos.amfi on Discord.</p>`
            );
          }
          const scriptContent = await response.text();
          const script = document.createElement("script");
          script.textContent = scriptContent;
          document.head.appendChild(script);
          sys.installer = script;
          return scriptContent;
        } catch (error) {
          console.error(`Failed to execute script: ${error}`);
          throw error;
        }
      }

      console.log(`<i> Installing ${apploc}`);
      const apps = await fs.read("/system/apps.json");
      if (apps) {
        const ok = await execute(`https://appmarket.meower.xyz` + apploc);
        const newen = {
          name: app.name,
          ver: app.ver,
          id: Date.now(),
          exec: ok,
        };
        const jsondata = JSON.parse(apps);
        const check = jsondata.some((entry) => entry.name === newen.name);
        if (check === true) {
          console.log("<i> Already installed");
          wm.wal("<p>Already installed!</p>");
        } else {
          jsondata.push(newen);
          if (update === true) {
            wm.notif(`Updated: `, app.name);
          } else {
            wm.notif(`Installed: `, app.name);
          }
          console.log("nata", jsondata);
          await fs.write("/system/apps.json", jsondata);
        }
      } else {
        const ok = await execute(`https://appmarket.meower.xyz` + apploc);
        await fs.write(
          "/system/apps.json",
          JSON.stringify([
            { name: app.name, ver: app.ver, id: Date.now(), exec: ok },
          ])
        );
        wm.notif(`Installed: `, app.name);
      }
    },
    init: async function () {
      const win = tk.mbw(
        "App Market",
        "340px",
        "auto",
        true,
        true,
        true,
        "./assets/img/systemIcons/store.svg"
      );
      const apps = tk.c("div", win.main);
      const appinfo = tk.c("div", win.main, "hide");
      async function loadapps() {
        try {
          const response = await fetch(`https://appmarket.meower.xyz/refresh`);
          const apps = await response.json();
          apps.forEach(function (app2) {
            const notif = tk.c("div", win.main, "notif2");
            tk.p(
              `<bold class="bold">${app2.name}</bold> by ${app2.pub}`,
              "",
              notif
            );
            tk.p(app2.info, undefined, notif);
            notif.addEventListener("click", async function () {
              app.appmark.create(app2.path, app2);
            });
          });
        } catch (error) {
          console.log(error);
        }
      }
      tk.p("Welcome to the App Market!", undefined, apps);
      tk.p(
        `Look for things you might want, all apps have <span class="bold">full access</span> to this WebDesk/it's files. Anything in this store is safe.`,
        undefined,
        apps
      );
      await loadapps();
    },
  },
  modernde: {
    runs: false,
    name: "ModernDE",
    icon: "./assets/img/systemIcons/os.svg",
    desktop: function (name, deskid) {
      ui.dest(tk.g("setuparea"));
      function smApps(apps = app) {
        document.querySelectorAll(".appItem").forEach(function (e) {
          e.remove();
        });
        for (var key in apps) {
          if (apps.hasOwnProperty(key)) {
            if (apps[key].hasOwnProperty("runs") && apps[key].runs === true) {
              console.log(`<i> ${apps[key].name} is launchable!`);
              const btn = tk.cb("b1", apps[key].name, function () {}, el.sm);
              btn.innerHTML = `
                          <img src='${apps[key].icon}' class='appIcon'/>
                          <span class='appName'>${apps[key].name}</span>`;
              btn.classList.add("appItem");
              var $thisapp = app[key];
              btn.onclick = $thisapp.init;
              btn.addEventListener("click", function () {
                if (document.querySelector(".tbmenu")) {
                  ui.dest(document.querySelector(".tbmenu"), 150);
                }
              });
            } else {
              console.log(`<i> ${apps[key].name} is not launchable! :(`);
            }
          }
        }
      }
      function startmenu() {
        if (el.sm == undefined) {
          if (document.querySelector(".contcent")) {
            $(".contcent").fadeOut(150, function () {});
          }
          el.sm = tk.c("div", document.body, "tbmenu");
          el.sm.addEventListener("mouseleave", function () {
            ui.dest(el.sm, 150);
            el.sm = undefined;
          });
          const btm = el.taskbar.getBoundingClientRect();
          el.sm.style.bottom = btm.height + btm.x + 4 + "px";
          tk.p(`Hello, ${name}!`, "h2", el.sm);
          console.log(el.sm);
          var searchbar = tk.mkel("input", ["i1"], "", el.sm);
          searchbar.placeholder = "Search for anything...";
          searchbar.addEventListener("input", async function (event) {
            var results = {};
            var search = event.target.value.trim();
            var searchAsWords = search.split(" ");
            var appIds = Object.keys(app);
            appIds.forEach(function (appId, index) {
              appIds[index] = appId.toLowerCase();
            });
            searchAsWords.forEach((srch) => {
              if (appIds.includes(srch.toLowerCase())) {
                results[srch] = app[srch];
              }
            });
            // search by app names
            searchAsWords.forEach((srch) => {
              for (var key in app) {
                console.log(app[key]);
                if (app.hasOwnProperty(key) && app[key].hasOwnProperty("name")) {
                  console.log(app[key].name);
                  if (app[key].name.toLowerCase().includes(srch.toLowerCase())) {
                    results[key] = app[key];
                  }
                }
              }
            });
            console.log(results);
            smApps(results);
            if (document.querySelector(".aiResponse") == null) {
              var aiResponse = tk.c("p", el.sm, "aiResponse");
            }
            document.querySelector(".aiResponse").innerText = "";
  
            // const  = {
            //     queries: [search],
            //     responses: [
            //         `Your system colour is set to ${await fs.read('/user/info/color')}.`,
            //         `Your system colour scheme is set to ${await fs.read('/user/info/lightdark') || "default"}.`,
            //         `Your name is ${await fs.read('/user/info/name') || "unset, somehow (how did you get here without triggering setup lmaoo)"}.`,
            //     ]
            // };
            if (
              (search.includes("what") &&
                search.includes("your") &&
                search.includes("name")) ||
              (search.includes("who") && search.includes("you")) ||
              (search.includes("ai") && search.includes("you"))
            ) {
              document.querySelector(".aiResponse").innerText =
                "I'm NovaAI! (not really ai lmao im just some if loops uwu)";
            } else if (
              search.includes("what") &&
              search.includes("my") &&
              search.includes("name")
            ) {
              document.querySelector(".aiResponse").innerText =
                `Your name is ${(await fs.read("/user/info/name")) || "unset, somehow (how did you get here without triggering setup lmaoo)"}!`;
            } else if (
              search.includes("what") &&
              (search.includes("color") || search.includes("colour")) &&
              (search.includes("theme") || search.includes("accent"))
            ) {
              document.querySelector(".aiResponse").innerText =
                `Your system colour is set to ${(await fs.read("/user/info/color")) || "unknown"}.`;
            } else if (
              search.includes("what") &&
              (search.includes("color") || search.includes("colour")) &&
              (search.includes("scheme") || search.includes("mode"))
            ) {
              document.querySelector(".aiResponse").innerText =
                `Your system colour mode is set to ${(await fs.read("/user/info/lightdark")) || "default"}.`;
            } else if (
              search.includes("what") &&
              (search.includes("time") ||
                search.includes("clock") ||
                search.includes("hour") ||
                search.includes("minute"))
            ) {
              document.querySelector(".aiResponse").innerHTML =
                `It is currently <div class="time">${wd.clock() || "Unknown"}</div>`;
            } else if (app.hasOwnProperty("docai")) {
              document.querySelector(".aiResponse").innerHTML =
                `No results found.<br> Would you like to <button class="b1" onclick="app.docai.init('${search}')">Search for it with DocAI?</button>`;
            } else {
              document.querySelector(".aiResponse").innerText =
                "No results found, and DocAI is not found on your system!";
            }
          });
          smApps(app);
        } else {
          ui.dest(el.sm, 150);
          el.sm = undefined;
        }
      }
      function desktopgo() {
        tk.css("/assets/modernde.css")
        setTimeout(function(){
          el.topbar = tk.c("div", document.body, "modernde-topbar");
          el.topbarLeft = tk.c("div", el.topbar, "")
          el.topbarRight = tk.c("div", el.topbar, "")
          el.taskbar = tk.c("div", document.body, "modernde-taskbar");
          const start = tk.cb("modernde-start", "", () => startmenu(), el.topbarLeft);
          var title = tk.c("span", el.topbarLeft, "modernde-title")
          title.innerText = abt.product || "WebDesk or Derivative work (set abt/product in index.html please)"
          start.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-command small-icon text-white opacity-80"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path></svg>`;
          tk.cb("time modernde-time", "--:--", () => wd.controls.toggle(), el.topbarRight);
        }, 200)
      }
      desktopgo()
    },
  }
};
window.installApp = function (appn, appid, appscripts, appico) {
  var appc = {
    runs: true,
    name: appn,
    icon: appico,
  };
  fs.mkdir(`/system/apps/${appid}`, "opfs");
  fs.write(`/system/apps/${appid}/meta.json`, JSON.stringify(appc));
  appscripts.forEach(async function (script) {
    fs.write(`/system/apps/${appid}/${script.name}`, script.script);
  });
};
// app.cast.connection(30012)
if (sys.isIOT) {
  try {
    app[sys.iotApp].iot();
  } catch {
    app[sys.iotApp].init();
  }
}
