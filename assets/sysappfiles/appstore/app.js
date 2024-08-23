var appid = window.location.search.split("?")[1]
document.addEventListener('DOMContentLoaded', async function() {
    document.querySelector("iframe").src=`https://novaos-appstore-repo.pages.dev/app/${appid}`
    var repoResponse = await fetch('https://novaos-appstore-repo.pages.dev/appstore.json');
    repoResponse = await repoResponse.json();
    repoResponse.applications.forEach(app => {
        if(app.id == appid){
            console.log(app)
            var categories = app.category.split(",")
            // filter categories to remove all starting with "backend"
            categories = categories.filter(category => !category.startsWith("backend"))
            // make all categories sentence case
            categories = categories.map(category => category.charAt(0).toUpperCase() + category.slice(1))
            // remove empty categories
            categories = categories.filter(category => category != "")
            // join categories with a comma
            categories = categories.join(", ")
            console.log(categories)
            document.querySelector('#appn').innerText = app.name
            document.querySelector('#appdesc').innerText = app.description
            document.querySelector('#appdev').innerText = `${app.author}`
            document.querySelector('#appcat').innerText = `${categories}`
        }
    });
})