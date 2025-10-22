function setScrollPadding(){
    const nav=document.querySelector("nav");
    if (nav) document.documentElement.style.scrollPaddingTop = (nav.offsetHeight) + "px";
}
window.addEventListener("load", setScrollPadding);
window.addEventListener("resize", setScrollPadding);

const app = document.getElementById("app");
const routes = {
    "#/a":"a",
    "#/b":"b",
    "#/c":"c"
}

function loadPage(path){
    const templateId = routes[path];
    const template = document.getElementById(templateId);
    if (template){
        app.innerHTML='';
        app.appendChild(template.content.cloneNode(true));
    }
}
const links = document.querySelectorAll("[data-link]");

window.addEventListener("hashchange", () => {
  loadPage(location.hash);
});

loadPage(location.hash||(location.hash="#/a"));