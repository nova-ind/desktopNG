var wm = {
    wal: function (content, btn1, name, opt) {
        const win = tk.mbw('Erase Confirmation', '300px', 'auto', undefined, undefined, undefined);
        win.win.querySelector('.tb').remove();
        win.main.className = "d";
        wd.win();
        win.main.style.padding = "12px";
        const thing = document.createElement('div');
        thing.innerHTML = content;
        const thing2 = document.createElement('div');
        win.main.appendChild(thing);
        win.main.appendChild(thing2);
        if (opt !== "noclose") {
            tk.cb('b1', 'Close', function () { ui.dest(win.win, 100); ui.dest(win.tbn, 100); }, thing2);
        }

        if (btn1 !== undefined) {
            const btn = tk.cb('b1', name, function () { ui.dest(win.win, 100); ui.dest(win.tbn, 100); }, thing2);
            btn.addEventListener('click', btn1);
        }
    },

    open: function el(name, ele) {

    },

    center: function (element) {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const elementWidth = element.offsetWidth;
        const elementHeight = element.offsetHeight;
        const leftPosition = (screenWidth - elementWidth) / 2;
        const topPosition = (screenHeight - elementHeight) / 2;
        element.style.left = `${leftPosition}px`;
        element.style.top = `${topPosition}px`;
    },

    notif: function (name, cont, mode) {
        const div = tk.c('div', document.getElementById('notif'), 'notif');
        tk.p(name, 'bold', div);
        tk.p(cont, undefined, div);
        $(div).fadeIn(80);
        div.addEventListener('click', function () { div.remove() });
        const note2 = document.createElement('div');
        note2.classList = "notif";
        const id2 = gen(7);
        note2.id = id2;
        note2.innerHTML = `<b>${name}</b>
<br>
${cont}`;
        if(localStorage.getItem("doNotDisturb") !== "true") {
            ui.play('./assets/audio/notif.mp3');
            document.getElementById('desktopNotificationsArea').appendChild(note2);
        }
        note2.addEventListener('click', function () { ui.dest(note2, 140); });
        setTimeout(() => {
            ui.dest("#"+note2.id, 140);
        }, 5000);
    },
    
    notifSys: function (name, cont, mode) {
        const note2 = document.createElement('div');
        note2.classList = "notif";
        const id2 = gen(7);
        note2.id = id2;
        note2.innerHTML = `<b>${name}</b>
<br>
${cont}`;
        if(localStorage.getItem("doNotDisturb") !== "true") {ui.play('./assets/audio/notif.mp3')};
        document.getElementById('desktopNotificationsArea').appendChild(note2);
        note2.addEventListener('click', function () { ui.dest(note2, 140); });
        setTimeout(() => {
            ui.dest("#"+note2.id, 140);
        }, 5000);
    },
    cm: function () {
        const div = document.createElement('div');
        div.classList = "cm";
        document.body.appendChild(div);
        div.addEventListener('click', () => ui.dest(div));
        return div;
    },
    close: function (id) {
        const div = document.getElementById(id);
        if (div) {
            hidef(id);
            const fuck = "btn_" + id;
            if (document.getElementById(fuck)) {
                dest(fuck);
            }
        } else {
            log(`<!> Error closing window. Window: ${div} - Button: ${document.getElementById(fuck)}`);
        }
    },

    max: function (id) {
        const wid = document.getElementById(id);
        if (wid) {
            wid.classList.toggle('max');
            if (!wid.classList.contains('max')) {
                wid.classList.add('unmax');
                setTimeout(() => {
                    wid.classList.remove('unmax');
                }, 301);
            }
        }
    },

    mini: function (window) {
        hidef(window, 120);
    },

    mini: function (window) {
        showf(window, 0);
    },

    // notif: function (name, cont, mode) {
        // const div = tk.c('div', document.getElementById('notif'), 'notif');
        // tk.p(name, 'bold', div);
        // tk.p(cont, undefined, div);
        // $(div).fadeIn(80);
        // div.addEventListener('click', function () { div.remove() });
    // }
}
