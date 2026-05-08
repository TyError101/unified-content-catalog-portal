sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "com/rishi/contentcatalogportal/model/models",
    "sap/ui/model/json/JSONModel"
], function (UIComponent, Device, models, JSONModel) {
    "use strict";

    return UIComponent.extend("com.rishi.contentcatalogportal.Component", {

        metadata: {
            manifest: "json"
        },

        init: function () {

            UIComponent.prototype.init.apply(this, arguments);

            this.setModel(models.createDeviceModel(), "device");

            // Load Catalog Data
            var oCatalogModel = new JSONModel();
            oCatalogModel.loadData(sap.ui.require.toUrl("com/rishi/contentcatalogportal/model/catalogData.json"));

            this.setModel(oCatalogModel, "catalog");

        }
    });
});