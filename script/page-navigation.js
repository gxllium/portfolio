const pageNavigation          = document.querySelector('.page-navigation');
const pageNavigationHider     = document.querySelector('.page-navigation .nav-hider');
const pageNavigationMenuHider = document.querySelector('.page-navigation .nav-mobile-menu .menu-hider');

function toggleNavigation() {
    pageNavigation.classList.toggle('open');
}

pageNavigationHider.addEventListener('click', toggleNavigation);
pageNavigationMenuHider.addEventListener('click', toggleNavigation);
