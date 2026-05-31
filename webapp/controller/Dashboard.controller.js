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

                var oChart =
                    this.byId("mediaChart");

                if (oChart) {

                    oChart.setVizProperties({

                        title: {
                            visible: false
                        },

                        legend: {
                            visible: true
                        },

                        plotArea: {
                            dataLabel: {
                                visible: true
                            }
                        }
                    });
                }
            },

            _loadAnalytics: function () {

                var oCatalogModel =
                    sap.ui.getCore()
                        .getModel("catalog");

                var oUploadModel =
                    sap.ui.getCore()
                        .getModel("upload");

                if (!oCatalogModel) {
                    return;
                }

                var aItems =
                    oCatalogModel.getProperty(
                        "/items"
                    ) || [];

                var aUploads = [];

                if (oUploadModel) {

                    aUploads =
                        oUploadModel.getProperty(
                            "/uploads"
                        ) || [];
                }

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
                            iDocuments,

                        recentUploads:
                            aUploads.slice().reverse(),

                        mediaDistribution: [

                            {
                                category: "Images",
                                count: iImages
                            },

                            {
                                category: "Videos",
                                count: iVideos
                            },

                            {
                                category: "Documents",
                                count: iDocuments
                            }

                        ]
                    });

                this.getView().setModel(
                    oAnalytics,
                    "analytics"
                );
            }
        }
    );
});