/* Template Name: Techwind - Tailwind CSS Multipurpose Landing & Admin Dashboard Template
   Author: Shreethemes
   Email: support@shreethemes.in
   Website: https://shreethemes.in
   Version: 2.2.0
   Created: May 2022
   File Description: Main JS file of the template
*/

/*********************************/
/*         INDEX                 */
/*================================
 *     01.  Loader               *
 *     02.  Toggle Menus         *
 *     03.  Menu Active          *
 *     04.  Clickable Menu       *
 *     05.  Menu Sticky          *
 *     06.  Back to top          *
 *     07.  Active Sidebar       *
 *     08.  Feather icon         *
 *     09.  Small Menu           *
 *     10.  Wow Animation JS     *
 *     11.  Contact us           *
 *     12.  Dark & Light Mode    *
 *     13.  LTR & RTL Mode       *
 *     14.  PriceSlider          *
 *     15. Rating Star           *
 ================================*/

window.addEventListener('load', fn, false);

//  window.onload = function loader() {
function fn() {
    // Preloader
    if (document.getElementById('preloader')) {
        setTimeout(() => {
            document.getElementById('preloader').style.visibility = 'hidden';
            document.getElementById('preloader').style.opacity = '0';
        }, 350);
    }
    // Menus
    activateMenu();
}

//Menu
/*********************/
/* Toggle Menu */
/*********************/
function toggleMenu() {
    document.getElementById('isToggle').classList.toggle('open');
    var isOpen = document.getElementById('navigation');
    if (isOpen.style.display === 'block') {
        isOpen.style.display = 'none';
    } else {
        isOpen.style.display = 'block';
    }
}
/*********************/
/*    Menu Active    */
/*********************/
function getClosest(elem, selector) {
    // Element.matches() polyfill
    if (!Element.prototype.matches) {
        Element.prototype.matches =
            Element.prototype.matchesSelector ||
            Element.prototype.mozMatchesSelector ||
            Element.prototype.msMatchesSelector ||
            Element.prototype.oMatchesSelector ||
            Element.prototype.webkitMatchesSelector ||
            function (s) {
                var matches = (
                        this.document || this.ownerDocument
                    ).querySelectorAll(s),
                    i = matches.length;
                while (--i >= 0 && matches.item(i) !== this) {}
                return i > -1;
            };
    }

    // Get the closest matching element
    for (; elem && elem !== document; elem = elem.parentNode) {
        if (elem.matches(selector)) return elem;
    }
    return null;
}

function activateMenu() {
    var menuItems = document.getElementsByClassName('sub-menu-item');
    if (menuItems) {
        var matchingMenuItem = null;
        for (var idx = 0; idx < menuItems.length; idx++) {
            if (menuItems[idx].href === window.location.href) {
                matchingMenuItem = menuItems[idx];
            }
        }

        if (matchingMenuItem) {
            matchingMenuItem.classList.add('active');

            var immediateParent = getClosest(matchingMenuItem, 'li');

            if (immediateParent) {
                immediateParent.classList.add('active');
            }

            var parent = getClosest(immediateParent, '.child-menu-item');
            if (parent) {
                parent.classList.add('active');
            }

            var parent = getClosest(
                parent || immediateParent,
                '.parent-menu-item',
            );

            if (parent) {
                parent.classList.add('active');

                var parentMenuitem = parent.querySelector('.menu-item');
                if (parentMenuitem) {
                    parentMenuitem.classList.add('active');
                }

                var parentOfParent = getClosest(
                    parent,
                    '.parent-parent-menu-item',
                );
                if (parentOfParent) {
                    parentOfParent.classList.add('active');
                }
            } else {
                var parentOfParent = getClosest(
                    matchingMenuItem,
                    '.parent-parent-menu-item',
                );
                if (parentOfParent) {
                    parentOfParent.classList.add('active');
                }
            }
        }
    }
}
/*********************/
/*  Clickable manu   */
/*********************/
if (document.getElementById('navigation')) {
    var elements = document
        .getElementById('navigation')
        .getElementsByTagName('a');
    for (var i = 0, len = elements.length; i < len; i++) {
        elements[i].onclick = function (elem) {
            if (elem.target.getAttribute('href') === 'javascript:void(0)') {
                var submenu = elem.target.nextElementSibling.nextElementSibling;
                submenu.classList.toggle('open');
            }
        };
    }
}
/*********************/
/*   Menu Sticky     */
/*********************/
function windowScroll() {
    const navbar = document.getElementById('topnav');
    if (navbar != null) {
        if (
            document.body.scrollTop >= 50 ||
            document.documentElement.scrollTop >= 50
        ) {
            navbar.classList.add('nav-sticky');
        } else {
            navbar.classList.remove('nav-sticky');
        }
    }
}

window.addEventListener('scroll', (ev) => {
    ev.preventDefault();
    windowScroll();
});
/*********************/
/*    Back To TOp    */
/*********************/

window.onscroll = function () {
    scrollFunction();
};

function scrollFunction() {
    var mybutton = document.getElementById('back-to-top');
    if (mybutton != null) {
        if (
            document.body.scrollTop > 500 ||
            document.documentElement.scrollTop > 500
        ) {
            mybutton.classList.add('block');
            mybutton.classList.remove('hidden');
        } else {
            mybutton.classList.add('hidden');
            mybutton.classList.remove('block');
        }
    }
}

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

/*********************/
/*  Active Sidebar   */
/*********************/
(function () {
    var current = location.pathname.substring(
        location.pathname.lastIndexOf('/') + 1,
    );
    if (current === '') return;
    var menuItems = document.querySelectorAll('.sidebar-nav a');
    for (var i = 0, len = menuItems.length; i < len; i++) {
        if (menuItems[i].getAttribute('href').indexOf(current) !== -1) {
            menuItems[i].parentElement.className += ' active';
        }
    }
})();

/*********************/
/*   Feather Icons   */
/*********************/
feather.replace();

/*********************/
/*     Small Menu    */
/*********************/
try {
    var spy = new Gumshoe('#navmenu-nav a');
} catch (err) {}

/*********************/
/*      WoW Js       */
/*********************/
try {
    new WOW().init();
} catch (error) {}

/*************************/
/*      Contact Js       */
/*************************/

try {
    function validateForm() {
        var name = document.forms['myForm']['name'].value;
        var email = document.forms['myForm']['email'].value;
        var subject = document.forms['myForm']['subject'].value;
        var comments = document.forms['myForm']['comments'].value;
        document.getElementById('error-msg').style.opacity = 0;
        document.getElementById('error-msg').innerHTML = '';
        if (name == '' || name == null) {
            document.getElementById('error-msg').innerHTML =
                "<div class='alert alert-warning error_message'>*Please enter a Name*</div>";
            fadeIn();
            return false;
        }
        if (email == '' || email == null) {
            document.getElementById('error-msg').innerHTML =
                "<div class='alert alert-warning error_message'>*Please enter a Email*</div>";
            fadeIn();
            return false;
        }
        if (subject == '' || subject == null) {
            document.getElementById('error-msg').innerHTML =
                "<div class='alert alert-warning error_message'>*Please enter a Subject*</div>";
            fadeIn();
            return false;
        }
        if (comments == '' || comments == null) {
            document.getElementById('error-msg').innerHTML =
                "<div class='alert alert-warning error_message'>*Please enter a Comments*</div>";
            fadeIn();
            return false;
        }
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById('simple-msg').innerHTML =
                    this.responseText;
                document.forms['myForm']['name'].value = '';
                document.forms['myForm']['email'].value = '';
                document.forms['myForm']['subject'].value = '';
                document.forms['myForm']['comments'].value = '';
            }
        };
        xhttp.open('POST', 'php/contact.php', true);
        xhttp.setRequestHeader(
            'Content-type',
            'application/x-www-form-urlencoded',
        );
        xhttp.send(
            'name=' +
                name +
                '&email=' +
                email +
                '&subject=' +
                subject +
                '&comments=' +
                comments,
        );
        return false;
    }

    function fadeIn() {
        var fade = document.getElementById('error-msg');
        var opacity = 0;
        var intervalID = setInterval(function () {
            if (opacity < 1) {
                opacity = opacity + 0.5;
                fade.style.opacity = opacity;
            } else {
                clearInterval(intervalID);
            }
        }, 200);
    }
} catch (error) {}

/*********************/
/* Dark & Light Mode */
/*********************/
try {
    document.addEventListener("DOMContentLoaded", function () {
        const checkbox = document.getElementById("chk");
        const html = document.documentElement;

        // Function to apply the theme based on localStorage
        const applyTheme = () => {
            if (localStorage.getItem("theme") === "dark") {
                html.classList.add("dark");
                checkbox.checked = true;
            } else {
                html.classList.remove("dark");
                checkbox.checked = false;
            }
        };

        // Apply theme on page load
        applyTheme();

        // Add an event listener for the switch
        checkbox.addEventListener("change", function () {
            if (this.checked) {
                localStorage.setItem("theme", "dark");
                html.classList.add("dark");
            } else {
                localStorage.setItem("theme", "light");
                html.classList.remove("dark");
            }
        });
    });
} catch (err) {}

/*********************/
/* LTR & RTL Mode */
/*********************/
try {
    const htmlTag = document.getElementsByTagName('html')[0];
    function changeLayout(e) {
        e.preventDefault();
        const switcherRtl = document.getElementById('switchRtl');
        if (switcherRtl.innerText === 'LTR') {
            htmlTag.dir = 'ltr';
        } else {
            htmlTag.dir = 'rtl';
        }
    }
    const switcherRtl = document.getElementById('switchRtl');
    switcherRtl?.addEventListener('click', changeLayout);
} catch (err) {}



/*********************/
/*   Price Slider    */
/*********************/
const rangevalue = 
    document.querySelector(".slider-container .price-slider");
const rangeInputvalue = 
    document.querySelectorAll(".range-input input");

// Set the price gap
let priceGap = 10;

// Adding event listners to price input elements
const priceInputvalue = 
    document.querySelectorAll(".price-input input");
for (let i = 0; i < priceInputvalue.length; i++) {
    priceInputvalue[i].addEventListener("input", e => {

        // Parse min and max values of the range input
        let minp = parseInt(priceInputvalue[0].value);
        let maxp = parseInt(priceInputvalue[1].value);
        let diff = maxp - minp

        if (minp < 0) {
            alert("minimum price cannot be less than 0");
            priceInputvalue[0].value = 0;
            minp = 0;
        }

        // Validate the input values
        if (maxp > 1000) {
            alert("maximum price cannot be greater than 10000");
            priceInputvalue[1].value = 1000;
            maxp = 1000;
        }

        if (minp > maxp - priceGap) {
            priceInputvalue[0].value = maxp - priceGap;
            minp = maxp - priceGap;

            if (minp < 0) {
                priceInputvalue[0].value = 0;
                minp = 0;
            }
        }

        // Check if the price gap is met 
        // and max price is within the range
        if (diff >= priceGap && maxp <= rangeInputvalue[1].max) {
            if (e.target.className === "min-input") {
                rangeInputvalue[0].value = minp;
                let value1 = rangeInputvalue[0].max;
                rangevalue.style.left = `${(minp / value1) * 100}%`;
            }
            else {
                rangeInputvalue[1].value = maxp;
                let value2 = rangeInputvalue[1].max;
                rangevalue.style.right = 
                    `${100 - (maxp / value2) * 100}%`;
            }
        }
    });

    // Add event listeners to range input elements
    for (let i = 0; i < rangeInputvalue.length; i++) {
        rangeInputvalue[i].addEventListener("input", e => {
            let minVal = 
                parseInt(rangeInputvalue[0].value);
            let maxVal = 
                parseInt(rangeInputvalue[1].value);

            let diff = maxVal - minVal
            
            // Check if the price gap is exceeded
            if (diff < priceGap) {
            
                // Check if the input is the min range input
                if (e.target.className === "min-range") {
                    rangeInputvalue[0].value = maxVal - priceGap;
                }
                else {
                    rangeInputvalue[1].value = minVal + priceGap;
                }
            }
            else {
            
                // Update price inputs and range progress
                priceInputvalue[0].value = minVal;
                priceInputvalue[1].value = maxVal;
                rangevalue.style.left =
                    `${(minVal / rangeInputvalue[0].max) * 100}%`;
                rangevalue.style.right =
                    `${100 - (maxVal / rangeInputvalue[1].max) * 100}%`;
            }
        });
    }
}

/*********************/
/*   Rating Star     */
/*********************/
document.addEventListener("DOMContentLoaded", () => {
    const stars = document.querySelectorAll("#rating .star");
    const ratingInput = document.getElementById("ratingInput");

    stars.forEach((star, index) => {
        star.addEventListener("click", () => {
            const rating = index + 1;

            // Update hidden input value
            ratingInput.value = rating;

            // Update star colors
            stars.forEach((s, i) => {
                s.classList.toggle("text-yellow-500", i < rating);
                s.classList.toggle("text-gray-300", i >= rating);
            });
        });
    });
});