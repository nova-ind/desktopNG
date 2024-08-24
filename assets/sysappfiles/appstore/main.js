document.addEventListener('DOMContentLoaded', async function() {
    var repoResponse = await fetch('https://pkgs.os.novafurry.win/allapps.json');
    repoResponse = await repoResponse.json();
    var featuredApps = []
    var officialApps = []
    repoResponse.forEach(app => {
        if(app.specialTags.includes("Featured") && featuredApps.length < 4){
            featuredApps.push(app)
        }
        else if(app.specialTags.includes("Official")){
            officialApps.push(app)
        }
    });
    var featuredAppsContainer = document.querySelector('.carousel__container');
    featuredApps.forEach((app, index) => {
        featuredAppsContainer.children[index].querySelector('img').src = app.banner;
        featuredAppsContainer.children[index].classList.remove('hidden');
    })
    document.querySelectorAll('.carousel__item.hidden').forEach(item => {   
        item.remove();
    });
    document.querySelector('.carouselArea').style.display = featuredAppsContainer.children.length > 0 ? 'block' : 'none';
    var officialAppsContainer = document.querySelector('.officialApps');
    officialApps.forEach(app => {
        // design for app cards
        // <div class="application">
        //         <img src="Frame 3.png" alt="image1">
        //         <h3>Application 1</h3>
        //         <p>Description of Application 1</p>
        //     </div>
        var appDiv = document.createElement('div');
        appDiv.classList.add('application');
        var appImg = document.createElement('img');
        appImg.src = app.banner;
        appImg.alt = app.name;
        var appName = document.createElement('h3');
        appName.innerText = app.name;
        var appDesc = document.createElement('p');
        appDesc.innerText = app.description;
        appDiv.appendChild(appImg);
        appDiv.appendChild(appName);
        appDiv.appendChild(appDesc);
        officialAppsContainer.appendChild(appDiv);
    })
    
})