var appid = window.location.search.split("?")[1]
console.log(appid)
document.addEventListener('DOMContentLoaded', async function() {
    document.querySelector("iframe").src=`https://pkgs.os.novafurry.win/${appid}/desc`
    var repoResponse = await fetch(`https://pkgs.os.novafurry.win/${appid}/meta.json`);
    document.querySelector('.loader').remove()
    document.querySelector('main').classList.remove("hide")
    console.log(repoResponse)
    app = await repoResponse.json();
            document.querySelector('#appn').innerText = app.name
            document.querySelector('#appico').src = app.icon
            document.querySelector('#appdesc').innerText = app.description
            document.querySelector('#appdev').innerText = `${app.developer} - `
            document.querySelector('#appcat').innerText = `${app.category} - ${app.specialTags.includes("Official") ? "Official" : ""} - ${app.specialTags.includes("Featured") ? "Featured" : ""}`
            if(app.specialTags.includes('quickRun')){

            }
            else{
                document.querySelector('#qr').remove()
            }
})