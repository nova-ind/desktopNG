var app = {
    settings: {
        runs: true,
        name: 'Settings',
        icon: './assets/img/systemIcons/settings.svg',
        init: async function () {
            const main = tk.mbw('Settings', '300px', 'auto', true, true, true, undefined, './assets/img/systemIcons/settings.svg');
            const generalPane = tk.c('div', main.main, 'hide');
            const appearPane = tk.c('div', main.main, 'hide');
            const mainPane = tk.c('div', main.main);
            // Main pane
            tk.p('Settings', undefined, mainPane);
            tk.cb('b1 b2', 'General', () => ui.sw2(mainPane, generalPane), mainPane);
            tk.cb('b1 b2', 'Appearance', () => ui.sw2(mainPane, appearPane), mainPane);
            // General pane
            tk.p('General', undefined, generalPane);
            tk.cb('b1 b2 red', 'Erase This WebDesk', () => wm.wal(`<p>Warning: Erasing this WebDesk will destroy all data stored on it, and you'll need to do setup again.</p>`, () => fs.erase('reboot'), 'Erase'), generalPane);
            tk.cb('b1', 'Back', () => ui.sw2(generalPane, mainPane), generalPane);
            // Appearance pane
            tk.p('Appearance', undefined, appearPane);
            const bg1 = tk.c('input', appearPane, 'i1');
            bg1.setAttribute("data-jscolor", "{}");
            bg1.addEventListener('input', function () {
                ui.crtheme(event.target.value);
            });
            const bgc = tk.c('input', appearPane, 'i1');
            bgc.type = 'color';
            bgc.addEventListener('change', function () {
                ui.crtheme(event.target.value);
                bg1.value = event.target.value;
            });
            tk.p('UI Theme', undefined, appearPane);
            tk.cb('b1 b2', 'Dark mode', function () {
                fs.del('/user/info/lightdarkpref');
                sys.autodarkacc = false;
                wd.dark();
            }, appearPane);
            tk.cb('b1 b2', 'Auto (based off color picker)', async function () {
                fs.write('/user/info/lightdarkpref', 'auto');
                const killyourselfapplesheep = await fs.read('/user/info/color');
                ui.crtheme(killyourselfapplesheep);
                sys.autodarkacc = true;
            }, appearPane);
            tk.cb('b1 b2', 'Clear mode (Light Text)', function () {
                fs.del('/user/info/lightdarkpref');
                sys.autodarkacc = false;
                wd.clearm2();
            }, appearPane);
            tk.cb('b1 b2', 'Clear mode (Dark Text)', function () {
                fs.del('/user/info/lightdarkpref');
                sys.autodarkacc = false;
                wd.clearm();
            }, appearPane);
            tk.cb('b1 b2', 'Light mode', function () {
                fs.del('/user/info/lightdarkpref');
                sys.autodarkacc = false;
                wd.light();
            }, appearPane);
            tk.p('Other', undefined, appearPane);
            tk.cb('b1', 'Reset Colors', function () {
                fs.del('/user/info/color');
                fs.del('/user/info/lightdark');
                fs.del('/user/info/lightdarkpref');
                wm.wal('Reboot to finish resetting colors.', () => wd.reboot(), 'Reboot');
            }, appearPane); tk.cb('b1', 'Back', () => ui.sw2(appearPane, mainPane), appearPane);
        }
    },
    store: {
        runs: true,
        name: 'AppStore',
        icon: './assets/img/systemIcons/store.svg',
        init: async function () {
            const main = tk.mbw('Store', '800px', '500px', true, true, true, undefined, './assets/img/systemIcons/store.svg');
            // tk.cb('b1 b2', 'Home', function(){}, )
            var navbar = main.win.children[0].children[0];
            navbar.appendChild(tk.cb('b4', 'Home', function () {}, null))
            navbar.appendChild(tk.cb('b4', 'Categories', function () {}, null))
            navbar.appendChild(tk.cb('b4', 'This Device', function () {}, null))
            var wc = main.main;
            var appstorepage = tk.c('iframe', wc);
            appstorepage.setAttribute("frameborder", "0")
            appstorepage.src = "/assets/sysappfiles/appstore/index.html";
            appstorepage.style.width = "100%"
            appstorepage.style.height = "100%"
            wc.style.height = "calc(100% - 65px)"
            appstorepage.onload = function(){
                console.log(document.body.parentElement)
                appstorepage.contentDocument.body.parentElement.setAttribute("style",document.body.parentElement.getAttribute("style"))
            }
        }
    },
    setup: {
        runs: false,
        init: async function () {
            const setupWin = tk.mbw('Setup', '300px', '300px', true,true,true)
            const main = tk.c('div', setupWin.main, 'setupbox');
            // create setup menubar
            const bar = tk.c('div', main, 'setupbar');
            const tnav = tk.c('div', bar, 'tnav');
            const title = tk.c('div', bar, 'title');
            tk.cb('b4', 'Start Over', () => fs.erase('reboot'), tnav);
            tk.cb('b4 time', 'what', undefined, title);
            // first menu
            const first = tk.c('div', main, 'setb');
            tk.img('./assets/img/systemIcons/os.svg', 'setupi', first);
            tk.p('Welcome to NovaOS Deskop Next-Gen!', 'h2', first);
            tk.p('NovaOS is proudly powered by WebDesk!', 'h3', first);
            tk.cb('b1', `Login as Guest`, () => wd.desktop('Guest', gen(8)), first);
            tk.cb('b1', `Begin Setup`, () => ui.sw2(first, transfer), first);
            // migrate menu
            const transfer = tk.c('div', main, 'setb hide');
            tk.img('./assets/img/setup/quick.png', 'setupi', transfer);
            tk.p('Quick Start', 'h2', transfer);
            tk.p(`If you have used WebDesk or NovaOS-NG previously, you can migrate it's data to this device. To do so, open settings, choose Backup, then Migrate and enter the code below.`, undefined, transfer);
            tk.p('--------', 'h2 deskid', transfer);
            tk.cb('b1', 'No thanks', () => ui.sw2(transfer, warn), transfer);
            transfer.id = "quickstartwdsetup";
            // copying menu
            const copy = tk.c('div', main, 'setb hide');
            tk.img('./assets/img/setup/restore.svg', 'setupi', copy);
            tk.p('Restoring from other Device', 'h2', copy);
            tk.p('This might take a while depending on settings and file size.', undefined, copy);
            tk.p('Starting...', 'restpg', copy);
            tk.cb('b1', 'Cancel', function () { fs.erase('reboot'); }, copy);
            copy.id = "quickstartwdgoing";
            // warn menu
            const warn = tk.c('div', main, 'setb hide');
            tk.img('./assets/img/systemIcons/os.svg', 'setupi', warn);
            tk.p(`Online services`, 'h2', warn);
            tk.p('NovaOS makes an ID called a DeskID for you. Others using WebDesk, NovaOS-NG or compatible tools can use this ID to send you files or call you.', undefined, warn);
            tk.p('To recieve calls and files from others, NovaOS needs to be open. When not in use, NovaOS uses less resources', undefined, warn);
            tk.p('You can find your DeskID upon completion of setup.', undefined, warn);
            // tk.cb('b1', `What's my DeskID?`, function () {
            //     const box = wm.cm();
            //     tk.p(`Your DeskID is <span class="deskid med">unknown</span>. You'll need to finish setup to use this ID.`, undefined, box);
            //     tk.cb('b1 rb', 'Got it', undefined, box);
            // }, warn); 
            tk.cb('b1', 'Got it', function () { ui.sw2(warn, user) }, warn);
            // user menu
            const user = tk.c('div', main, 'setb hide');
            tk.img('./assets/img/setup/user.svg', 'setupi', user);
            tk.p('About You', 'h2', user);
            tk.p(`Set up a user for NovaOS to store all of your stuff in, and set up permissions. By default, your data is stored on-device, soon you will be able to opt-in to cloud sync..`, undefined, user);
            const input = tk.c('input', user, 'i1');
            input.placeholder = "Pick a username.";
            tk.cb('b1', 'Done!', function () { wd.finishsetup(input.value, user, sum) }, user);
            // summary
            const sum = tk.c('div', main, 'setb hide');
            tk.img('./assets/img/setup/check.svg', 'setupi', sum);
            tk.p('Setup is complete.', 'h2', sum);
            tk.p('Keep in mind, novaOS is still in early public alpha.', undefined, sum);
            tk.cb('b1 rb', 'Erase & restart', function () { fs.erase('reboot'); }, sum); tk.cb('b1', 'Complete setup', function () { wd.reboot(); }, sum);
            sum.id = "setupdone";
            fs.mkdir('/user/Documents/', 'opfs');
        }
    },
    files: {
        runs: true,
        name: 'Files',
        icon: './assets/img/systemIcons/files.svg',
        init: async function () {
            var history = []
            var forwardHistory = []
            var currentHistoryIndex = "notNavigated"
            const win = tk.mbw(`Files`, '340px', 'auto', true, true, true, undefined, app.files.icon);
            win.main.classList.add("fileman")
            const lowerZone = tk.c('div', win.main)
            lowerZone.classList.add("lowerZone")
            const mainPane = tk.c('div', lowerZone)
            const navBar = tk.c('div', win.main)
            navBar.classList.add("navbar")
            const navPane = tk.c('div', lowerZone)
            navPane.classList.add("navpane")
            const fm = tk.c('div', mainPane)
            fm.classList.add("fm")
            const backButton = tk.cb('b1', '◀️', function () {}, navBar);
            const fwdButton = tk.cb('b1', '▶️', function () {}, navBar);
            const reButton = tk.cb('b1', '🔁', function () {}, navBar);
            const mkFolder = tk.cb('b1', '➕', function () {}, navBar);
            const breadcrumbs = tk.c('div', navBar);
            breadcrumbs.classList.add("bc");
            const items = tk.c('div', fm);
            const navPaneDrives = tk.c('ul', navPane)
            const osDrive = tk.c("li", navPaneDrives)
            osDrive.classList.add("flist", "width", "drive")
            osDrive.innerText = "OPFS (NovaOS)"
            const classicDrive = tk.c("li", navPaneDrives)
            classicDrive.classList.add("flist", "width", "drive")
            classicDrive.innerText = "IDBFS (Classic)"
            async function navto(path, filesystem = "opfs") {
                if(history.length == 0){
                    history.push({path: path, filesystem: filesystem})
                    currentHistoryIndex = history.length - 1
                }
                if(history[history.length - 1].path !== path || history[history.length - 1].filesystem !== filesystem){
                    history.push({path: path, filesystem: filesystem})
                    currentHistoryIndex = history.length - 1
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
                console.log(history)
                reButton.onclick = async function () {navto(path, filesystem)}
                backButton.onclick = async function () {
                    console.log(history,forwardHistory,currentHistoryIndex)
                    if (history.length > 1) {
                        currentHistoryIndex = history.length - 2;
                        forwardHistory.push(history.pop())
                        console.log(forwardHistory)
                        const last = history[currentHistoryIndex]
                        navto(last.path, last.filesystem)
                    }
                }
                fwdButton.onclick = async function () {
                    console.log("Scheiße", history,forwardHistory,currentHistoryIndex)
                    if (forwardHistory.length > 0) {
                        currentHistoryIndex+=1;
                        const next = forwardHistory[forwardHistory.length - 1]  
                        history.push(forwardHistory.pop())
                        console.log(next, "hasOwnProperty")
                        if(next !== undefined){navto(next.path, next.filesystem)}
                    }
                }
                mkFolder.onclick = async function () {
                    if(filesystem == 'opfs'){
                        fs.mkdir(`${path}${prompt("enter folder name here", "New Folder")}/.`, 'opfs');
                    }
                    else{
                        fs.write(`${path}${prompt("enter folder name here", "New Folder")}/.`, '', 'idbfs');
                    };
                    navto(path, filesystem)
                }
                items.innerHTML = "";
                breadcrumbs.innerHTML = "";
                let crumbs = path.split('/').filter(Boolean);
                let currentp = '/';
                tk.cb('flist', 'Root', () => navto('/', filesystem), breadcrumbs);
                crumbs.forEach((crumb, index) => {
                    currentp += crumb + '/';
                    tk.cb('flists', '/', undefined, breadcrumbs);
                    tk.cb('flist', crumb, () => {
                        let newPath = crumbs.slice(0, index + 1).join('/');
                        navto('/' + newPath + "/", filesystem);
                    }, breadcrumbs);
                });
                const thing = await fs.ls(path, filesystem);
                thing.items.forEach(function (thing) {
                    if (thing.type === "folder" || thing.type === "directory") {
                        tk.cb('flist width', "📁 " + thing.name, () => navto(thing.path + "/", filesystem), items);
                    } else if (thing.name.startsWith('.')) {
                        void (0)
                    } else {
                        tk.cb('flist width', "📄 " + thing.name, async function () { const yeah = await fs.read(thing.path); wm.wal(yeah); }, items);
                    }
                });
            }
            osDrive.addEventListener("click", await function (){
                navto("/", "opfs")
            })
            classicDrive.addEventListener("click", await function (){
                navto("/", "idbfs")
            });

            navto('/', 'opfs');
        }
    },
    about: {
        runs: true,
        name: 'About',
        icon: './assets/img/systemIcons/os.svg',
        init: async function () {
            const win = tk.mbw('About', '300px', 'auto', false, true, true);
            var aboutTxt = tk.c('div', win.main);
            aboutTxt.innerHTML = `
            <img height="100px" src="./assets/img/systemIcons/os.svg">
            <h2>NovaOS</h1>
            <p>NovaOS is a free, open-source operating system designed for the web. It is built on WebDesk, a web-based desktop environment.</p>
            <p>Version: ${abt.ver}</p>
            <p>Latest update: ${abt.lastmod}</p>
            `
        }
    },
    browser: {
        runs: true,
        name: 'Browser',
        icon: './assets/img/systemIcons/networking.svg',
        init: async function () {
            const win = tk.mbw('Browser', '80vw', '82vh', false, true, true);
            ui.dest(win.title, 0);
            const tabs = tk.c('div', win.main, 'tabbar d');
            let currenttab = tk.c('div', win.main, 'hide');
            let currentbtn = tk.c('div', win.main, 'hide');
            win.main.classList = "browsercont";
            tk.css('./assets/lib/browse.css');
            const btnnest = tk.c('div', tabs, 'tnav');
            const addbtn = tk.cb('b4 browserbutton', '+', function () {
                const tab = tk.c('embed', win.main, 'browsertab');
                tab.src = "https://corsproxy.io/?https%3A%2F%2Fnovafurry.win";
                ui.sw2(currenttab, tab);
                currenttab = tab;
                const tabbtn = tk.cb('b4', 'novafurry.win', function () {
                    ui.sw2(currenttab, tab);
                    currenttab = tab;
                    currentbtn = tabtitle;
                }, btnnest);
                const tabtitle = tk.c('span', tabbtn);
                currentbtn = tabtitle;
                const closetab = tk.cb('browserclosetab', 'X', function () {
                    ui.dest(tabbtn); ui.dest(currenttab);
                }, tabbtn);
            }, btnnest);
            const okiedokie = tk.c('div', tabs, 'browsertitle')
            const searchbtns = tk.c('div', okiedokie, 'tnav');
            const close = tk.cb('b4 rb browserbutton', 'x', function () {
                ui.dest(win.win, 150);
                ui.dest(win.tbn, 150);
            }, searchbtns);
            const rel = tk.cb('b4 browserbutton', '⟳', function () {
            }, searchbtns);
            const back = tk.cb('b4 browserbutton', '<', function () {
            }, searchbtns);
            const rev = tk.cb('b4 browserbutton', '>', function () {

            }, searchbtns);
            const searchnest = tk.c('div', tabs, 'title');
            const search = tk.c('input', okiedokie, 'i1 browserbutton');
            search.placeholder = "Enter URL";
            const go = tk.cb('b4 browserbutton', 'Go!', function () {
                currenttab.src = `https://corsproxy.io/?${search.value.startsWith('http') ? encodeURIComponent(search.value) : 'https://' + encodeURIComponent(search.value)}`;
                console.log(`https://corsproxy.io/?${search.value.startsWith('http') ? encodeURIComponent(search.value) : 'https://' + encodeURIComponent(search.value)}`);
                currentbtn.innerHTML = search.value;
            }, okiedokie);
            wd.win();
        }
    },
    sysqna: {
        runs: false,
        name: 'DocAI ML Models',
        onstartup: async function() {
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
    txter:{
        runs: true,
        name: 'txter editor',
        icon: './assets/img/systemIcons/txter.svg',
        init: async function () {
            const win = tk.mbw('txter', 'fit-content', 'fit-content', true, true, true, undefined, './assets/img/systemIcons/txter.svg');
            const txtarea = tk.c('textarea', win.main, 'i1');
            const bruh = tk.c('br', win.main);
            txtarea.style.height = 'calc(82vh - 120px)';
            txtarea.style.width = '300px';
            const savebtn = tk.cb('b1', 'Save', async function () {
                await fs.write(`${prompt("Enter a path to save file as", "/user/Documents/txter.txt")}`, txtarea.value);
                wm.wal('Saved!');
            }, win.main);
            const loadbtn = tk.cb('b1', 'Load', async function () {
                txtarea.value = await fs.read(`${prompt("Enter a path to load a file from", "/user/Documents/txter.txt")}`);
            }, win.main);
        }
    },
    docai: {
        runs: true,
        name: 'DocAI',
        requiresServices: ["sysqna"],
        icon: './assets/img/systemIcons/Docai.svg',
        init: async function (query = "") {
            const win = tk.mbw('DocAI', '500px', 'auto', false, true, true, undefined, './assets/img/systemIcons/Docai.svg');
            var div = tk.c('div', win.main);
            // div.innerText = "DocAI is not yet available in this version of NovaOS.";
            div.innerHTML = `
            <h2>DocAI</h2>
            <i>Your personal AI.</i><br>
            <b>DocAI <u>NEVER HALLUCINATES</u></b><br>
            <input class="i1" id="question" placeholder="Ask your documents!" value="${query}">
            <button id="ask" class="b1">Answer</button>
            <h3>Answers:</h3>
            <div id="answers"></div>
            `
            var askBtn = document.getElementById('ask');
            var question = document.getElementById('question');
            if(window.docAImodel){
                var model = window.docAImodel
                askBtn.removeAttribute('disabled');
                async function ask() {
                    window.ans = []
                    var resp = await fs.ls('/user/Documents/')
                    console.log(resp)
                    var documents = resp.items;
                    console.log(documents)
                    var contentsForAi = ""
                    var contentsDisplay = []
                    documents.forEach(
                        async function (v, i) {
                            var fc = await fs.read(v.path)
                            contentsForAi = contentsForAi + fc + "\n\n";
                            contentsDisplay.push(v.path + ": \n" + fc + "\n\n");
                        }
                    )
                    document.querySelector("#answers").innerHTML = "<p>Thinking...</p>";
                    console.log(question.value)
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

                                    })
                                }
                            } catch (error) {
                                console.error('Error processing document:', error);
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
                        var grouped = []
                        for(key in grpd){
                            grouped.push({path: key, answers: grpd[key]})
                        }
                        console.log(grouped);
                        // Display answers
                        window.answersFormatted = []
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
                            var sentenceEnd = txtFile.substr(highestEndIndex).split(".")[0]
                            var lineEnd = txtFile.substr(highestEndIndex).split(".")[0]
                            var bestOutput = sentenceEnd.length < lineEnd.length ? sentenceEnd : lineEnd;
                            // highestEndIndex = lowestStartIndex+Math.min(txtFile.substr(highestEndIndex).indexOf("."), txtFile.substr(highestEndIndex).indexOf("\n"))
                            answersFormatted.push({text: txtFile.substring(lowestStartIndex, highestEndIndex)+bestOutput, score: ans.answers[0].score, path: ans.path});
                        });
                        var undefineds = 0
                        var count = 0
                        setTimeout(function(){
                            document.querySelector("#answers").innerHTML = "";
                            answersFormatted.forEach(a => {
                                if (a !== undefined && count < 3) {
                                    var p = document.createElement('p');
                                    p.innerHTML = `${a.text}<br><small>(score: ${Math.round(a.score)}; found in: ${a.path})</small>`;
                                    console.log(`${a.text}<br><small>(score: ${Math.round(a.score)}; found in: ${a.path})</small>`);
                                    document.querySelector("#answers").appendChild(p);
                                    count++;
                                } else {
                                    undefineds++
                                }
                            });
                        }, 1000)
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
                            document.querySelector("#answers").innerHTML = `No answers found.`;
                        }
                    }

                    // Call the function with the documents array
                    processDocuments(documents);


                }
                if(query !== ""){ask()}
                // Find the answers
                askBtn.addEventListener('click', ask);
            } else {
                document.querySelector("#docai").remove();
                document.querySelector("#docaitbn").remove();
                const load = tk.mbw('DocAi Model Loader', '500px', 'auto', true, undefined, undefined, undefined, "docaiml");
                wm.wal("The sysqna model failed to load on boot. Please wait.")
                var div = tk.c('p', load.main);
                div.innerHTML = `DocAI is reloading the model...<br><progress></progress>`;
                try {
                    await app.sysqna.onstartup();
                } catch (error) {
                    document.querySelector("#docaiml").remove()
                    document.querySelector("#docaimltbn").remove()
                    app.docai.init();
                }
                document.querySelector("#docaiml").remove()
                document.querySelector("#docaimltbn").remove()
                app.docai.init();
            }
            }
    },
    cast: {
        runs: true, 
        name: 'Cast',
        icon: './assets/img/systemIcons/cast.svg',
        init: async function(id = false, username = "NovaOS User"){
            var p;
            const win = tk.mbw('Cast', '300px', 'auto', false, true, true, "ncast", './assets/img/systemIcons/cast.svg');
            win.win.id= "ncast"
            tk.mkel('h1',[], "Cast", win.main)
            tk.p("enter the deskID of another user with the cast app open to share your screen.", "", win.main)
            var recepient = tk.c("input", win.main, "i1")
            recepient.required = true
            var send = tk.cb("b1", "Start", async function(){
                var conn =  peer.connect(id)
                conn.on('open', async function() {
                    // Receive messages
                
                    // Send messages
                    var castpeer = new Peer(await fs.read('/user/info/deskid')+"-cast")
                    castpeer.on('open', async function (id) {
                        conn.send({name:"osAppConnect-cast",id:await fs.read('/system/deskid'),uname:await fs.read('/user/info/name') || "NovaOS User"});
                        
                    })
                    castpeer.on('connection', (conn) => {
                        conn.on('data', (data) => {
                            console.log(data)
                        });
                    });
                  });
            },win.main)
            var stop = tk.cb("b1", "Stop", function(){},win.main)
            stop.style.display = "none"
            console.log(id)
            if(id !== false){
                var ic = tk.mkel("div", ["notif"],"",win.main)
                ic.id = "ncastNotizone"
                tk.mkel('b',[],"Incoming Request<br>",ic)
                var req = tk.mkel('span',[],`ID: ${id.toString()}<br>Username: ${username.toString()}<br>`,ic)
                var ac = tk.cb("b1 smallb", "Accept", async function(){
                    p = new Peer(await fs.read('/system/deskid')+"-cast");
                    p.on('open', function(id) {
                        console.log('My peer ID is: ' + id);
                        var c = p.connect(id+"-cast");
                        c.on('open', function() {
                            // Receive messages
                            c.on('data', function(data) {
                              console.log('Received', data);
                            });
                        
                            // Send messages
                            c.send('connAccept');
                          });
                        
                    });
                    ui.dest(ic)
                    const recv = tk.mbw(`Cast Reciever: ${username.toString()}#${id.toString()}`, '850px', '490px', false, true, true, './assets/img/systemIcons/cast.svg')
                    const video = tk.c('video', recv.main)
                    video.setAttribute("controls", "yes")
                    video.style.width = "100%"
                    video.style.height = "100%"
                    const stop = tk.cb('b4', "Stop", function(){}, recv.title.children[0])
                    p.on('call', function(call) {
                        // Answer the call, providing our mediaStream
                        call.answer(null);
                        call.on('stream', function(stream) {
                            // `stream` is the MediaStream of the remote peer.
                            // Here you'd add it to an HTML video/canvas element.
                            video.srcObject = stream;
                            video.play()
                          });
                    });
                },ic)
                var de = tk.cb("b1 smallb", "Deny", function(){ui.dest(ic)},ic)
            }
        },
        connection: async function (id, uname) {
            if(document.querySelector("#ncast")){
                document.querySelector("#ncast .winb.red").click()
                app.cast.init(id, uname)
            } 
            else{
                app.cast.init(id, uname)
            }
        }
    },
}

app.cast.connection(30012)