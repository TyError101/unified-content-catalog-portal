sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (
    Controller,
    Fragment,
    JSONModel,
    Filter,
    FilterOperator
) {
    "use strict";

    return Controller.extend("com.rishi.contentcatalogportal.controller.Catalog", {

        onInit: function () {

            var oData = {

                items: [
                    {
                        id: "P1001",
                        name: "Marketing Banner",
                        category: "Image"
                    }
                ]
            };

            var oModel = new JSONModel(oData);

            this.getView().setModel(oModel, "catalog");
        },

        onOpenDialog: async function () {

            if (!this.oDialog) {

                this.oDialog = await Fragment.load({
                    name: "com.rishi.contentcatalogportal.fragments.AddItem",
                    controller: this
                });

                this.getView().addDependent(this.oDialog);
            }

            this.oDialog.open();
        },

        onCloseDialog: function () {

            this.oDialog.close();
        },

        onAddItem: function () {

            var oModel = this.getView().getModel("catalog");

            var aItems = oModel.getProperty("/items");

            var aInputs = this.oDialog.getContent()[0].getItems();

            var sId = aInputs[0].getValue();

            var sName = aInputs[1].getValue();

            var oNewItem = {

                id: sId,
                name: sName,
                category: "General"
            };

            aItems.push(oNewItem);

            oModel.setProperty("/items", aItems);

            this.oDialog.close();

            aInputs[0].setValue("");
            aInputs[1].setValue("");
        },

        onDeleteItem: function (oEvent) {

            var oModel = this.getView().getModel("catalog");

            var aItems = oModel.getProperty("/items");

            var oItem = oEvent.getSource().getParent();

            var oContext = oItem.getBindingContext("catalog");

            var sPath = oContext.getPath();

            var iIndex = parseInt(sPath.split("/")[2]);

            aItems.splice(iIndex, 1);

            oModel.setProperty("/items", aItems);
        },

        onSearch: function (oEvent) {

            var sValue = oEvent.getParameter("newValue");

            var oTable = this.byId("catalogTable");

            var oBinding = oTable.getBinding("items");

            var aFilters = [];

            if (sValue) {

                aFilters.push(
                    new Filter(
                        "name",
                        FilterOperator.Contains,
                        sValue
                    )
                );
            }

            oBinding.filter(aFilters);
        }

    });
});