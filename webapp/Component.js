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

                // DEVICE MODEL

                this.setModel(
                    models.createDeviceModel(),
                    "device"
                );

                // CATALOG MODEL

                var oCatalogData = {

                    items: [
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
                    ]
                };

                var oCatalogModel =
                    new JSONModel(oCatalogData);

                // COMPONENT MODEL

                this.setModel(
                    oCatalogModel,
                    "catalog"
                );

                // GLOBAL MODEL

                sap.ui.getCore().setModel(
                    oCatalogModel,
                    "catalog"
                );

                // ROUTER

                this.getRouter().initialize();
            }
        }
    );
});