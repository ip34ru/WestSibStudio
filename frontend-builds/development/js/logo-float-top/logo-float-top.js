//?/**
// * Created by taksenov@gmail.com on 19.09.2015.
// */


;(function() {

    var app = {

        // -- ������������� ��� �������� js
        initialize : function () {
            var _this = this;

            _this.setUpListeners();

        },
         // -- ������������� ��� �������� js

        // -- ���������� ������� ��� DOM ���������� �� ��������
        setUpListeners: function () {

            // ������ ���� (����������/������ ������ � ��������)
            $(window).on('scroll', app.scroll);

        },
        // -- ���������� ������� ��� DOM ���������� �� ��������

        // -- ������� ���������� �� setUpListeners ===============

        // ����������/������ ���� � ����������
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

        // -- ������� ���������� �� setUpListeners ===============

    };

    app.initialize();

}());














