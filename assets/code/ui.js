/**
 * NovaOS's UI tools (not toolkit, just UI tools)
 * @namespace
*/
var ui = {
    /**
     * Changes a CSS variable value.
     * @param {string} varName - The name of the CSS variable to change.
     * @param {string} varValue - The value to set the CSS variable to.
     */
    cv: function (varName, varValue) {
        const root = document.documentElement;
        root.style.setProperty(`--${varName}`, `${varValue}`);
    },
    /**
     * Changes the theme of the UI.
     * @param {string} background1 - The primary background color.
     * @param {string} background2 - The secondary background color.
     * @param {string} shade1 - The primary shade color.
     * @param {string} shade2 - The secondary shade color.
     * @param {string} accent - The accent color.
        */
    theme: function (background1, background2, shade1, shade2, accent) {
        ui.cv('bg1', background1); ui.cv('bg2', background2); ui.cv('sh1', shade1); ui.cv('sh2', shade2);
        ui.cv('accent', accent);
    },
    /**
     * Changes the theme of the UI to a color.
     * @param {string} hex - The hex color to set the theme to.
     */
    crtheme: async function (hex) {
        const a = ui.hextool(hex, 20)
        ui.theme(ui.hextool(hex, 10), a, ui.hextool(hex, 30), ui.hextool(hex, 40), ui.hextorgb(hex));
        await fs.write('/user/info/color', hex);
        if (sys.autodarkacc === true) {
            const silly = ui.hexdark(a);
            if (silly === true) {
                wd.dark();
            } else {
                wd.light();
            }
        }
    },
    /**
     * Fades between two elements.
     * @param {string} d1 - The ID of the first element.
     * @param {string} d2 - The ID of the second element.
        */
    sw: function (d1, d2) {
        const dr1 = document.getElementById(d1);
        const dr2 = document.getElementById(d2);
        $(dr1).fadeOut(160, function () { $(dr2).fadeIn(160); });
    },
    /**
     * Fades between two elements.
     * @param {String} d1 - A reference to an existing element, in JQUERY format
        * @param {String} d2 - A reference to an existing element, in JQUERY format
    */
    sw2: function (d1, d2) {
        $(d1).fadeOut(160, function () { $(d2).fadeIn(160); });
    },
    /**
     * Hides an element.
     * @param {String} dr1 - A reference to an existing element, in JQUERY format
     * @param {Number} [anim=210] - The duration of the animation in milliseconds.
     * @returns {void}
     */
    hide: function (dr1, anim) {
        if (dr1) {
            if (anim) {
                $(dr1).fadeOut(anim);
            } else {
                $(dr1).fadeOut(210);
            }
        }
    },
    /**
     * Plays an audio file from an HTTP server.
     * @param {String} filename - The path to the audio file.
     * @param {Number} [volume=1] - The volume to play the audio at.
     * @returns {void}
        */
    play: function (filename, volume = 1) {
        const audio = new Audio(filename);
        audio.volume = volume;
        audio.play();
    },
    /**
     * Shows an element.
     * @param {String} dr1 - A reference to an existing element, in JQUERY format
     * @param {Number} [anim=210] - The duration of the animation in milliseconds.
     * @returns {void}
        */
    show: function (dr1, anim) {
        if (dr1) {
            if (anim) {
                $(dr1).fadeIn(anim);
            } else {
                $(dr1).fadeIn(210);
            }
        }
        console.log(dr1)
        if(dr1.classList.contains("winf") && dr1.classList.contains("window")){
            dr1.classList.remove("winf");
        } else {
            document.querySelectorAll(".winf").forEach(function (item) {
                item.classList.remove("winf");
            })
            dr1.classList.add("winf");
        }
    },
    /**
     * Fades in an an element with a custom animation duration.
     * @param {String} dr1 - A reference to an existing element, in JQUERY format
     * @param {Number} [anim=170] - The duration of the animation in milliseconds.
     * @returns {void}
     */
    showfi: function (dr1, anim=170) {
        if (dr1) {
            if (anim) {
                $(dr1).fadeIn(anim).css("display", "inline-block");
            } else {
                $(dr1).fadeIn(170).css("display", "inline-block");
            }
        }
    },
    /**
     * Fades out an element with a custom animation duration.
     * @param {String} dr1 - A reference to an existing element, in JQUERY format
     * @param {Number} [anim=170] - The duration of the animation in milliseconds.
     */
    dest: function (dr1, anim) {
        if (dr1) {
            if (anim) {
                $(dr1).fadeOut(anim, function () { $(dr1).remove(); });
            } else {
                $(dr1).fadeOut(170, function () { $(dr1).remove(); });
            }
        }
    },
    /**
     * Toggles the visibility of an element.
     * @param {String} elementId - The ID of the element to toggle.
     * @param {Number} [time3=210] - The duration of the animation in milliseconds.
     * @returns {void}
     */
    toggle: function (elementId, time3) {
        var element = document.getElementById(elementId);
        if (element) {
            if (element.style.display === '' || element.style.display === 'none') {
                element.style.display = 'block';
            } else {
                hidef(elementId, time3);
            }
        }
    },
    /**
     * Hides an element with a custom animation duration.
     * @param {String} className - The Classname of the element to hide.
     */
    hidecls: function (className) {
        var elements = document.getElementsByClassName(className);
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.display = 'none';
        }
    },
    /**
     * Shows an element with a custom animation duration.
     * @param {String} className - The Classname of the element to show.
     */
    showcls: function (className) {
        var elements = document.getElementsByClassName(className);
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.display = 'inline';
        }
    },
    /**
     * Mass changes the text content of elements with a specific class.
     * @param {String} classn - The class of the elements to change.
     * @param {String} val - The value to set the text content to.
     */
    masschange: function (classn, val) {
        const usernameElements = document.getElementsByClassName(classn);
        for (let i = 0; i < usernameElements.length; i++) {
            usernameElements[i].textContent = val;
        }
    },
    /**
     * Centers an element on the screen.
     * @param {HTMLElement} element - The element to center.
     */
    center: function (element) {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const elementWidth = element.offsetWidth;
        const elementHeight = element.offsetHeight;
        element.style.left = `${(screenWidth - elementWidth) / 2}px`;
        element.style.top = `${(screenHeight - elementHeight) / 2}px`;
    },
    /**
     * Adjusts brightness of a HEX Colour by a specific percent value
     * @param {String} hex 
     * @param {Number} percent 
     * @returns {String} Adjusted HEX Colour
     */
    hextool: function (hex, percent) {
        if (hex.startsWith('#')) {
            hex = hex.slice(1);
        }

        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);

        percent = percent / 100;
        let adjustment = percent < 0.5 ? 255 * (0.5 - percent) : 255 * (percent - 0.5);

        if (percent < 0.5) {
            r = Math.min(255, r + adjustment);
            g = Math.min(255, g + adjustment);
            b = Math.min(255, b + adjustment);
        } else {
            r = Math.max(0, r - adjustment);
            g = Math.max(0, g - adjustment);
            b = Math.max(0, b - adjustment);
        }

        r = Math.round(r).toString(16).padStart(2, '0');
        g = Math.round(g).toString(16).padStart(2, '0');
        b = Math.round(b).toString(16).padStart(2, '0');

        return `#${r}${g}${b}`;
    },
    /**
     * Determines if a HEX Colour is dark or light
     * @param {String} hex
     * @returns {Boolean} True if the colour is dark, false if the colour is light
     */
    hexdark: function (hex) {
        hex = hex.replace(/^#/, '');

        let bigint = parseInt(hex, 16);
        let r = (bigint >> 16) & 255;
        let g = (bigint >> 8) & 255;
        let b = bigint & 255;

        let luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        return luminance < 128;
    },
    /**
     * Converts a HEX Colour to RGB
     * @param {String} hex
     * @returns {String} RGB Colour
     */
    hextorgb: function (hex) {
        hex = hex.replace(/^#/, '');
        let bigint = parseInt(hex, 16);
        let r = (bigint >> 16) & 255;
        let g = (bigint >> 8) & 255;
        let b = bigint & 255;
        return `${r}, ${g}, ${b}`;
    }
}

var tk = {
    c: function (type, ele, classn) {
        const ok = document.createElement(type);
        if (ele) {
            ele.appendChild(ok);
        }
        if (classn) {
            ok.classList = classn;
        }
        return ok;
    },
    g: function (element) {
        return document.getElementById(element);
    },
    t: function (ele, text) {
        ele.innerHTML = text;
    },
    p: function (contents, classn, div) {
        const fuck = document.createElement('p');
        fuck.innerHTML = contents;
        if (classn) {
            fuck.classList = classn;
        }
        div.appendChild(fuck);
        return fuck;
    },
    img: function (src, classn, div) {
        const fuck = document.createElement('img');
        fuck.src = src;
        if (classn) {
            fuck.classList = classn;
        }
        div.appendChild(fuck);
        return fuck;
    },
    css: function (href) {
        const existingLink = Array.from(document.getElementsByTagName('link')).find(
            link => link.rel === 'stylesheet' && link.href === href
        );

        if (!existingLink) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = href;
            document.head.appendChild(link);
        }
    },
    cb: function (classn, name, func, ele) {
        const button = document.createElement('button');
        button.className = classn;
        button.innerText = name;
        if (func) {
            button.addEventListener('click', function(){
                func()
            });
        }
        if (ele) {
            ele.appendChild(button);
        }
        return button;
    },
    a: function (ele1, ele2) {
        ele1.appendChild(ele2);
    },
    mbw: function (title, wid, hei, full, min, quit, id, icon = './assets/img/systemIcons/noicon.svg') {
        var windowDiv = document.createElement('div');
        windowDiv.classList.add('window');
        windowDiv.classList.add('winf');
        windowDiv.style.width = wid;
        windowDiv.style.height = hei;
        if(id){
            windowDiv.id = id;
        }
        var titlebarDiv = document.createElement('div');
        titlebarDiv.classList.add('d');
        titlebarDiv.classList.add('tb');
        var winbtns = document.createElement('div');
        winbtns.classList.add('tnav');
        var closeButton = document.createElement('div');
        closeButton.classList.add('winb');
        const tbn = tk.cb('b1', title, () => ui.show(windowDiv, 100), el.tr);
        tbn.innerHTML = `<img src="${icon}" height=24 class="icon"/> <span class="label">${title}</span>`;
        if(id){
            tbn.id = id + "tbn";
        }
        if (quit === true) {
            closeButton.classList.add('red');
            closeButton.addEventListener('mousedown', function () {
                ui.dest(windowDiv, 100);
                ui.dest(tbn, 100);
            });
        }

        var minimizeButton = document.createElement('div');
        minimizeButton.classList.add('winb');
        if (min === true) {
            minimizeButton.classList.add('yel');
            minimizeButton.addEventListener('mousedown', function () {
                ui.hide(windowDiv, 100);
            });
        }
        var maximizeButton = document.createElement('div');
        maximizeButton.classList.add('winb');
        if (full === true) {
            maximizeButton.classList.add('gre');
            maximizeButton.addEventListener('mousedown', function () {
                max(windowDiv.id);
            });
        }

        winbtns.appendChild(closeButton);
        winbtns.appendChild(minimizeButton);
        winbtns.appendChild(maximizeButton);
        titlebarDiv.appendChild(winbtns);
        var titleDiv = document.createElement('div');
        titleDiv.classList.add('title');
        titleDiv.innerHTML = `<img src="${icon}" height=24 class="icon"/> <span class="label">${title}</span>`;
        titlebarDiv.appendChild(titleDiv);
        windowDiv.appendChild(titlebarDiv);
        var contentDiv = document.createElement('div');
        contentDiv.classList.add('content');
        windowDiv.appendChild(contentDiv);
        document.body.appendChild(windowDiv);
        wd.win(); $(windowDiv).fadeIn(130); ui.center(windowDiv);
        return { win: windowDiv, main: contentDiv, tbn, title: titlebarDiv };
    },
    mkel: function(element, classes, innerHtml, parent){
        const el = document.createElement(element);
        if(typeof classes === "string"){
            el.classList.add(classes);
        } else{
            classes.forEach(function (item) {
                el.classList.add(item);
            });
        }
        el.innerHTML = innerHtml;
        parent.appendChild(el);
        return el;
    }
}
