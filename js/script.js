import {icons} from './icons.js';
icons.sort((a, b) => a.id.localeCompare(b.id));
// const sprite = () => {
//     let output = `<?xml version="1.0" encoding="utf-8"?>
//          <svg xmlns="http://www.w3.org/2000/svg">
//            <defs>`;
//            icons.forEach(icon => {
//             output+=`<symbol id="${icon.id}" viewBox="0 0 24 24">${icon.symbol}</symbol>`
//             });
//             output += `</defs>
//          </svg>`
//             return output;
// }

// const mySprite = document.getElementById('mySprite');
// mySprite.innerHTML = sprite();

const listIcons = document.getElementById('listIcons');
const searchResult = document.getElementById('searchResult');

// Skriver ut ikonerna
function renderIcons(myIcons) {
    let output = '';
    myIcons.forEach(icon => {
        // output +=  `<div class="listIcons__item" data-icon="${icon.id}"><svg class="icon"><use href="#${icon.id}" /></svg><pre>${icon.id}</pre></div>`;
        output +=  `<div class="listIcons__item" data-icon="${icon.id}"><svg class="icon"><use xlink:href="/dist/sprite.svg#${icon.id}" /></svg><pre>${icon.id}</pre></div>`;
    })
    listIcons.innerHTML=output;
}
renderIcons(icons);

searchResult.innerHTML=`${icons.length} icons`;
document.getElementById('darkmodeSwitch').addEventListener('click', function(){
    document.body.classList.toggle('dark');
})

// Storlek
const r = document.querySelector(':root');
const rangeValueText = document.getElementById('rangeValue');
document.getElementById('iconSizeRange').addEventListener('input', function(e){
    let value = this.value;    
    rangeValueText.innerHTML=value;
    r.style.setProperty('--icon-size', value+'px')      
});

// SEARCH
const searchTags = (searchString) => {
    return icons
        .filter(icon => 
            icon.tags.some(tag => tag.toLowerCase().includes(searchString.toLowerCase()))
        )
        .map(icon => icon);
};

// Lyssnar på sökning
document.getElementById('searchForm').addEventListener('keyup', function(e) {
    if (this.value.length > 2) {
        let result = searchTags(this.value);        
        renderIcons(result);
        putListenersOnAllTheIcons();
        document.getElementById('searchResult').innerHTML=`Your search "${this.value}" resulted in ${result.length} hits`;
    }
 });

 // Rensa sökfätet
document.getElementById('clearSearch').addEventListener('click', function() {
    renderIcons(icons);
    document.getElementById('searchForm').value='';
    searchResult.innerHTML=`${icons.length} icons`;
    putListenersOnAllTheIcons();
});

const getTagsById = (id) => {
    const icon = icons.find(icon => icon.id === id);
    return icon ? icon.tags : null;
}
const getSinceById = (id) => {
    const icon = icons.find(icon => icon.id === id);
    return icon ? icon.since : null;
}

// Download - use direct link to svg instead
// function downloadIcon(id){
//     const getSymbolById = (id) => {
//         const icon = icons.find(icon => icon.id === id);
//         return icon ? icon.symbol : null;
//     };
//     const svgStart = `<?xml version="1.0" encoding="UTF-8"?><svg id="${id}" data-name="${id}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">`;
//     const svgEnd = `</svg>`;
//     let symbolData = svgStart; 
//     symbolData += getSymbolById(id);
//     symbolData += svgEnd;
//     const blob = new Blob([symbolData], {type: 'imgage/svg+xml'})
//     const fileURL = URL.createObjectURL(blob);
//     const downloadLink = document.createElement('a');
//     downloadLink.href = fileURL;
//     downloadLink.download = `${id}.svg`;
//     document.body.appendChild(downloadLink);
//     downloadLink.click();
//     URL.revokeObjectURL(fileURL);
// }
// function putListenerOnTheDownLoadButton(){
//     const btn = document.getElementById('btnDownloadSvg').addEventListener('click', function(){
//         downloadIcon(this.dataset.icon);
//     })
// }
const focusArea = document.getElementById('focusArea');
const allIconItems = document.getElementsByClassName('listIcons__item');

function giveFocus(i, e){        
    for (let q = 0; q < allIconItems.length; q++) {
        allIconItems[q].classList.remove('foo')
    }      
    const tagElements = (i) => {
        const tagsArray = getTagsById(i);
        let tags ='';
            for(let n=0; n < tagsArray.length; n++) {
                tags += `<button class="tag" data-tag="${tagsArray[n]}">${tagsArray[n]}</button>`
            }
        return tags;
        }    
    let content = `<div class="innerFocusArea">
        <h2>${i}</h2>
        <svg class="focusIcon"><use xlink:href="/dist/sprite.svg#${i}" /></svg>     
        
        <div class="innerFocusArea__p">
        <div class="tagsContainer"><h3>Tags</h3><div class="tags">${tagElements(i)}</div></div>
        <div class="since"><h3>Sitevision since</h3><pre> ${getSinceById(i)}</pre></div>
        <div><h3>Showcase</h3>
        <div class="inuse">
            <div class="inuse-icon inuse__16"><svg class="icon"><use xlink:href="/dist/sprite.svg#${i}" /></svg></div>
            <div class="inuse-icon inuse__24"><svg class="icon"><use xlink:href="/dist/sprite.svg#${i}" /></svg></div>
            <div class="inuse-icon inuse__32"><svg class="icon"><use xlink:href="/dist/sprite.svg#${i}" /></svg></div>
            <div class="inuse-icon inuse__48"><svg class="icon"><use xlink:href="/dist/sprite.svg#${i}" /></svg></div>
        </div>
        </div>
        <div class="download">
        <h3>Download SVG</h3>
        <a class="dl" href="/assets/${i}.svg" download id="btnDownloadSvg"><svg class="icon"><use xlink:href="/dist/sprite.svg#download"/></svg> <span>${i}.svg</span></a></div>
        </div>
        </div>`;
    focusArea.innerHTML=content;
    e.classList.add('foo');
    putListenersOnAllTheTagButtons();
    // putListenerOnTheDownLoadButton();
}
    function filterByTag(tag){
        let result = 'foo';
            result = icons.filter(icon => icon.tags.includes(tag));            
            renderIcons(result);
            const noOfIcons = () => {
                if (result.length>1) {
                    return 'icons'
                }
                else return 'icon';
            }
            document.getElementById('searchResult').innerHTML=`Found ${result.length} ${noOfIcons()} with tag "${tag}" <button class="btnClearTagFilter" id="btnResetTagFilter"><svg class="icon"><use href="#undo"/></svg>Clear filter</button>`;
          putListenerOnResetTagFilterButton();
          putListenersOnAllTheIcons();
    }
    // Ändra färg på ikoner
document.getElementById("iconColorPicker").addEventListener('input', function(){
    const r = document.querySelector(':root');
    const d = document.querySelector('.dark');
    if (d) {
        d.style.setProperty('--icon-color', this.value);
    }
    else r.style.setProperty('--icon-color', this.value);
})

//Återställa färg på ikoner
document.getElementById("resetIconColor").addEventListener('click', function(){
    const colorPicker = document.getElementById('iconColorPicker');
    const r = document.querySelector(':root');
    const d = document.querySelector('.dark');
    if (d) {
        d.style.setProperty('--icon-color', '#dddddd');
        colorPicker.value="#dddddd";
    }
    colorPicker.value="#333333";        
    document.documentElement.attributeStyleMap.clear();
    document.body.attributeStyleMap.clear();
})

// Sätter eventlyssnare på alla ikoner
function putListenersOnAllTheIcons(){
    const iconElements = document.querySelectorAll('.listIcons__item');
    iconElements.forEach(icon => {
        icon.addEventListener('click', (event) => {            
            const id = event.currentTarget.dataset.icon;         
            giveFocus(id, event.currentTarget)
        })
    })
};

function putListenerOnResetTagFilterButton() {
document.getElementById("btnResetTagFilter").addEventListener('click', function(){
    renderIcons(icons);
    searchResult.innerHTML=`${icons.length} icons`;
    putListenersOnAllTheIcons();
})
}


function putListenersOnAllTheTagButtons(){
    const tagElements = document.querySelectorAll('button.tag')
    tagElements.forEach(btn => {
        
        let t = btn.dataset.tag;
        btn.addEventListener('click', function(){
            filterByTag(t);
        })
    })
}

putListenersOnAllTheIcons();

// document.getElementById('btnSpriteDownload').addEventListener('click', function(event){
//     const blob = new Blob([sprite()], {type: 'imgage/svg+xml'})
//     const fileURL = URL.createObjectURL(blob);
//     const downloadLink = document.createElement('a');
//     downloadLink.href = fileURL;
//     downloadLink.download = `sprite.svg`;
//     document.body.appendChild(downloadLink);
//     downloadLink.click();
//     URL.revokeObjectURL(fileURL);
//     event.preventDefault();
// })