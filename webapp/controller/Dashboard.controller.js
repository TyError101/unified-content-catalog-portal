sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (
    Controller,
    JSONModel
) {
    "use strict";

    return Controller.extend(
        "com.rishi.contentcatalogportal.controller.Dashboard",
        {

            onInit: function () {

                this._loadAnalytics();
            },

            onAfterRendering: function () {

                this._loadAnalytics();
            },

            _loadAnalytics: function () {

                var oCatalogModel =
                    sap.ui.getCore()
                        .getModel("catalog");

                if (!oCatalogModel) {
                    return;
                }

                var aItems =
                    oCatalogModel.getProperty(
                        "/items"
                    ) || [];

                var iImages = 0;
                var iVideos = 0;
                var iDocuments = 0;

                aItems.forEach(function (
                    oItem
                ) {

                    if (
                        oItem.category ===
                        "Image"
                    ) {
                        iImages++;
                    }

                    else if (
                        oItem.category ===
                        "Video"
                    ) {
                        iVideos++;
                    }

                    else if (
                        oItem.category ===
                        "Document"
                    ) {
                        iDocuments++;
                    }
                });

                var oAnalytics =
                    new JSONModel({

                        totalItems:
                            aItems.length,

                        totalImages:
                            iImages,

                        totalVideos:
                            iVideos,

                        totalDocuments:
                            iDocuments
                    });

                this.getView().setModel(
                    oAnalytics,
                    "analytics"
                );
            }
        }
    );
});