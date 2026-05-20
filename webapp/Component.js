sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "com/rishi/contentcatalogportal/model/models",
    "sap/ui/model/json/JSONModel"
], function (UIComponent, Device, models, JSONModel) {
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
                        }
                    ]
                };

                var oCatalogModel =
                    new JSONModel(oCatalogData);

                this.setModel(
                    oCatalogModel,
                    "catalog"
                );

                this.getRouter().initialize();
            }
        }
    );
});