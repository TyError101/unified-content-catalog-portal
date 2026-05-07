sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("com.rishi.contentcatalogportal.controller.Main", {

        onNavToDashboard: function () {
            this._navigateTo("Dashboard");
        },

        onNavToCatalog: function () {
            this._navigateTo("Catalog");
        },

        onNavToUpload: function () {
            this._navigateTo("Upload");
        },

        _navigateTo: function (sViewName) {

            var oNavContainer = this.byId("navContainer");

            var oView = sap.ui.xmlview({
                viewName: "com.rishi.contentcatalogportal.view." + sViewName
            });

            oNavContainer.removeAllPages();
            oNavContainer.addPage(oView);
            oNavContainer.to(oView);

        }

    });
});