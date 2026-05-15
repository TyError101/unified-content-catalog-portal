sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("com.rishi.contentcatalogportal.controller.Main", {

        onDashboardPress: function () {

            this._loadPage("dashboard");

        },

        onCatalogPress: function () {

            this._loadPage("catalog");

        },

        _loadPage: function (sPage) {

            var oPageContainer = this.byId("pageContainer");

            oPageContainer.removeAllPages();

            var oView = sap.ui.xmlview({
                viewName:
                    "com.rishi.contentcatalogportal.view." + sPage
            });

            oPageContainer.addPage(oView);

            oPageContainer.to(oView);
        },

        onUploadPress: function () {

            this._loadPage("Upload");
        },

    });
});