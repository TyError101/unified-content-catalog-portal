sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend(
        "com.rishi.contentcatalogportal.controller.Main",
        {

            onInit: function () {

                var oSharedModel =
                    new sap.ui.model.json.JSONModel({

                        uploadedFiles: []

                    });

                sap.ui.getCore().setModel(
                    oSharedModel,
                    "shared"
                );

                this._loadPage("Dashboard");
            },

            onAfterRendering: function () {

                if (!this._bInitialPageLoaded) {

                    this._loadPage("Dashboard");

                    this._bInitialPageLoaded = true;
                }
            },

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