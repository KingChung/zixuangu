require([
    'jquery',
    'backbone', 
    'doT', 
    'view/main',
    'bootstrap', 
    'layoutmanager'
    ],
    function($, Backbone, doT, Main) {

        Backbone.Layout.configure({
            // Allow LayoutManager to augment Backbone.View.prototype.
            manage: true
        });

        Main();
    });
