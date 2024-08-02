var app = {
    settings: {
        runs: true,
        name: 'Settings',
        init: async function () {
            const main = tk.mbw('Settings', '300px', 'auto', true, undefined, undefined);
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
            new JSColor(bg1, undefined);
            tk.p('UI Theme', undefined, appearPane);
            tk.cb('b1 b2', 'Dark mode', function () {
                fs.del('/user/info/lightdarkpref');
                wd.dark();
            }, appearPane);
            tk.cb('b1 b2', 'Auto (based off color picker)', async function () {
                fs.write('/user/info/lightdarkpref', 'auto');
                const killyourselfapplesheep = await fs.read('/user/info/color');
                ui.crtheme(killyourselfapplesheep);
                sys.autodarkacc = true;
            }, appearPane);
            tk.cb('b1 b2', 'Light mode', function () {
                fs.del('/user/info/lightdarkpref');
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
    setup: {
        runs: false,
        init: async function () {
            const main = tk.c('div', document.getElementById('setuparea'), 'setupbox');
            // create setup menubar
            const bar = tk.c('div', main, 'setupbar');
            const tnav = tk.c('div', bar, 'tnav');
            const title = tk.c('div', bar, 'title');
            tk.cb('b4', 'Start Over', () => fs.erase('reboot'), tnav);
            tk.cb('b4 time', 'what', undefined, title);
            // first menu
            const first = tk.c('div', main, 'setb');
            tk.img('./assets/img/setup/first.svg', 'setupi', first);
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
            tk.img('./assets/img/noround.png', 'setupi', warn);
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
            var docFolder = await fs.ls("/user/Documents")
            if (docFolder.items.length == 0) {
                fs.write("/user/Documents/.", '');
            }
        }
    },
    files: {
        runs: true,
        name: 'Files',
        init: async function () {
            const win = tk.mbw(`Files`, '340px', 'auto', true, undefined, undefined);
            const breadcrumbs = tk.c('div', win.main);
            const items = tk.c('div', win.main);
            async function navto(path) {
                items.innerHTML = "";
                breadcrumbs.innerHTML = "";
                let crumbs = path.split('/').filter(Boolean);
                let currentp = '/';
                tk.cb('flist', 'Root', () => navto('/'), breadcrumbs);
                crumbs.forEach((crumb, index) => {
                    currentp += crumb + '/';
                    tk.cb('flists', '/', undefined, breadcrumbs);
                    tk.cb('flist', crumb, () => {
                        let newPath = crumbs.slice(0, index + 1).join('/');
                        navto('/' + newPath + "/");
                    }, breadcrumbs);
                });
                var createFolder = document.createElement('button');
                createFolder.innerText = "New Folder";
                createFolder.addEventListener('click', async function () {
                    fs.write(`${path}${prompt("enter folder name here", "New Folder")}/.`, '');
                })
                breadcrumbs.appendChild(createFolder);
                const thing = await fs.ls(path);
                thing.items.forEach(function (thing) {
                    if (thing.type === "folder") {
                        tk.cb('flist width', "Folder: " + thing.name, () => navto(thing.path + "/"), items);
                    } else if (thing.name.startsWith('.')) {
                        void (0)
                    } else {
                        tk.cb('flist width', "File: " + thing.name, async function () { const yeah = await fs.read(thing.path); wm.wal(yeah); }, items);
                    }
                });
            }

            navto('/');
        }
    },
    about: {
        runs: true,
        name: 'About',
        init: async function () {
            const win = tk.mbw('About', '300px', 'auto', true, undefined, undefined);
            var aboutTxt = tk.c('div', win.main);
            aboutTxt.innerHTML = `
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
        init: async function () {
            const win = tk.mbw('Browser', '80vw', '82vh', true, undefined, undefined);
            ui.dest(win.title, 0);
            const tabs = tk.c('div', win.main, 'tabbar d');
            let currenttab = tk.c('div', win.main, 'hide');
            let currentbtn = tk.c('div', win.main, 'hide');
            win.main.classList = "browsercont";
            tk.css('./assets/lib/browse.css');
            const btnnest = tk.c('div', tabs, 'tnav');
            const addbtn = tk.cb('b4 browserbutton', '+', function () {
                const tab = tk.c('embed', win.main, 'browsertab');
                tab.src = "https://meower.xyz";
                ui.sw2(currenttab, tab);
                currenttab = tab;
                const tabbtn = tk.cb('b4', 'meower.xyz', function () {
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
                currenttab.src = search.value;
                currentbtn.innerText = search.value;
            }, okiedokie);
            wd.win();
        }
    },
    docai: {
        runs: true,
        name: 'DocAI',
        init: async function () {
            const win = tk.mbw('DocAI', '500px', 'auto', true, undefined, undefined);
            var div = tk.c('div', win.main);
            // div.innerText = "DocAI is not yet available in this version of NovaOS.";
            div.innerHTML = `
            <h2>DocAI</h2>
            <i>Your personal AI.</i><br>
            <b>DocAI <u>NEVER HALLUCINATES</u></b><br>
            <input class="i1" id="question" placeholder="Ask your documents!">
            <button disabled="true" id="ask" class="b1">Answer</button>
            <span id="loading">Model is loading...</span>
            <h3>Answers:</h3>
            <div id="answers"></div>
            `
            var askBtn = document.getElementById('ask');
            var question = document.getElementById('question');
            qna.load().then(async function (model) {
                console.log("Model loaded")
                document.querySelector("#loading").innerHTML = "";
                askBtn.removeAttribute('disabled');
                // Find the answers
                askBtn.addEventListener('click', async function () {
                    window.ans = []
                    var resp = await fs.ls('/user/Documents/');
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
                                    console.log(fc);
                                    const answers = await model.findAnswers(question.value, fc);
                                    answers.forEach((a, i) => {
                                        a.path = v.path;
                                        ans.push(answers[i]);

                                    })
                                    console.log(answers);
                                }
                            } catch (error) {
                                console.error('Error processing document:', error);
                            }
                        }

                        console.log("Processing done uwu");

                        // Sort answers by highest to lowest score
                        console.log(ans);
                        ans = ans.sort((a, b) => b.score - a.score);
                        console.log(ans);

                        // Display answers
                        var undefineds = 0
                        var count = 0 
                        document.querySelector("#answers").innerHTML = "";
                        ans.forEach(a => {
                            if (a !== undefined && count < 3) {
                                console.log(a);
                                var p = document.createElement('p');
                                p.innerHTML = `${a.text}<br><small>(score: ${Math.round(a.score)}; found in: ${a.path})</small>`;
                                document.querySelector("#answers").appendChild(p);
                                count++;
                            } else{
                                undefineds++
                            }
                        });
                        if (undefineds == ans.length) {
                            document.querySelector("#answers").innerHTML = `No answers found.`;
                        }
                    }

                    // Call the function with the documents array
                    processDocuments(documents);


                });

            });
        }
    }
}
