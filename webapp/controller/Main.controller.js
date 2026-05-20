sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend(
        "com.rishi.contentcatalogportal.controller.Main",
        {

            onDashboardPress: function () {

                this._loadPage("Dashboard");
            },

            onCatalogPress: function () {

                this._loadPage("Catalog");
            },

            onUploadPress: function () {

                this._loadPage("Upload");
            },

            _loadPage: function (sPage) {

                var oPageContainer =
                    this.byId("pageContainer");

                var oView =
                    sap.ui.xmlview({

                        viewName:
                            "com.rishi.contentcatalogportal.view." + sPage
                    });

                oPageContainer.removeAllPages();

                oPageContainer.addPage(oView);

                oPageContainer.to(oView);
            }
        }
    );
});