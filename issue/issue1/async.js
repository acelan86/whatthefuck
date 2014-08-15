(function () {
    "use strict";

    var innerGlo = window.glo = window.glo || {};

    window.getGloA = function () {
        alert(innerGlo.a);
    }
})();