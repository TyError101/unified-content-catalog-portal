sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "com/rishi/contentcatalogportal/model/models",
    "sap/ui/model/json/JSONModel"
], function (
    UIComponent,
    Device,
    models,
    JSONModel
) {
    "use strict";

    return UIComponent.extend(
        "com.rishi.contentcatalogportal.Component",
        {

            metadata: {
                manifest: "json"
            },

            init: function () {

                UIComponent.prototype.init.apply(
                    this,
                    arguments
                );

                /* =========================
                   DEVICE MODEL
                ========================== */

                this.setModel(
                    models.createDeviceModel(),
                    "device"
                );

                /* =========================
                   LOAD LOCAL STORAGE
                ========================== */

                var aSavedCatalog =
                    JSON.parse(

                        localStorage.getItem(
                            "catalogItems"
                        )

                    ) || [

                        {
                            id: "P1001",
                            name: "Marketing Banner",
                            category: "Image"
                        },

                        {
                            id: "P1002",
                            name: "Company Brochure",
                            category: "Document"
                        }
                    ];

                /* =========================
                   CATALOG MODEL
                ========================== */

                var oCatalogData = {

                    items: aSavedCatalog
                };

                var oCatalogModel =
                    new JSONModel(oCatalogData);

                this.setModel(
                    oCatalogModel,
                    "catalog"
                );

                sap.ui.getCore().setModel(
                    oCatalogModel,
                    "catalog"
                );

                /* =========================
                   SHARED MODEL
                ========================== */

                var aSavedUploads =
                    JSON.parse(

                        localStorage.getItem(
                            "sharedUploads"
                        )

                    ) || [];

                var oSharedModel =
                    new JSONModel({

                        uploadedFiles:
                            aSavedUploads
                    });

                sap.ui.getCore().setModel(
                    oSharedModel,
                    "shared"
                );

                /* =========================
                   ROUTER
                ========================== */

                this.getRouter().initialize();
            }
        }
    );
});