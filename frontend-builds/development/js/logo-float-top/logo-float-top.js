//?/**
// * Created by taksenov@gmail.com on 19.09.2015.
// */


;(function() {

    var app = {

        // -- инициализаци€ при загрузке js
        initialize : function () {
            var _this = this;

            _this.setUpListeners();

        },
         // -- инициализаци€ при загрузке js

        // -- обработчик событий над DOM элементами на странице
        setUpListeners: function () {

            // скролл окна (показываем/пр€чем блочок с корзиной)
            $(window).on('scroll', app.scroll);

        },
        // -- обработчик событий над DOM элементами на странице

        // -- функции вызываемые из setUpListeners ===============

        // показывает/пр€чет блок с навигацией
        scroll: function () {
            //var doc_w = $(document).width();

            var logoblock_height = $('.wss-logo-block').outerHeight();

            var top = $(window).scrollTop(),
                cart = $(".wss-logo-block__float");

            if (top > logoblock_height) {
                cart.addClass("wss-logo-block__float_top");
                cart.css(
                    {"display": "block"}
                );
            } else {
                cart.removeClass("wss-logo-block__float_top");
                cart.css(
                    {"display": "none"}
                );
            }
        }
        /* ------------------------------------------------ */

        // -- функции вызываемые из setUpListeners ===============

    };

    app.initialize();

}());














