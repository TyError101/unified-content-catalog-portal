sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend(
        "com.rishi.contentcatalogportal.controller.Catalog",
        {

            onInit: function () {

                this.getView().setModel(

                    sap.ui.getCore()
                        .getModel("catalog"),

                    "catalog"
                );
            }
        }
    );
});