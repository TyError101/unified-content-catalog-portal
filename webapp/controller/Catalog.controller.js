sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (
    Controller,
    Fragment,
    Filter,
    FilterOperator
) {
    "use strict";

    return Controller.extend(
        "com.rishi.contentcatalogportal.controller.Catalog",
        {

            onInit: function () {

                this.getView().setModel(
                    this.getOwnerComponent().getModel("catalog"),
                    "catalog"
                );

                this.editIndex = null;
            },

            onOpenDialog: async function () {

                if (!this.oDialog) {

                    this.oDialog =
                        await Fragment.load({

                            name:
                                "com.rishi.contentcatalogportal.fragments.AddItem",

                            controller: this
                        });

                    this.getView().addDependent(
                        this.oDialog
                    );
                }

                this.oDialog.open();
            },

            onCloseDialog: function () {

                this.oDialog.close();
            },

            onAddItem: function () {

                var oModel =
                    this.getView().getModel("catalog");

                var aItems =
                    oModel.getProperty("/items");

                var aInputs =
                    this.oDialog.getContent()[0].getItems();

                var sId =
                    aInputs[0].getValue();

                var sName =
                    aInputs[1].getValue();

                var sCategory =
                    sap.ui.getCore()
                        .byId("categorySelect")
                        .getSelectedKey();

                var oNewItem = {

                    id: sId,

                    name: sName,

                    category: sCategory
                };

                if (this.editIndex !== null) {

                    aItems[this.editIndex] =
                        oNewItem;

                    this.editIndex = null;

                } else {

                    aItems.push(oNewItem);
                }

                oModel.setProperty(
                    "/items",
                    aItems
                );

                this.oDialog.close();

                aInputs[0].setValue("");

                aInputs[1].setValue("");
            },

            onDeleteItem: function (oEvent) {

                var oModel =
                    this.getView().getModel("catalog");

                var aItems =
                    oModel.getProperty("/items");

                var oItem =
                    oEvent.getSource().getParent();

                var oContext =
                    oItem.getBindingContext("catalog");

                var sPath =
                    oContext.getPath();

                var iIndex =
                    parseInt(sPath.split("/")[2]);

                aItems.splice(iIndex, 1);

                oModel.setProperty(
                    "/items",
                    aItems
                );
            },

            onEditItem: function (oEvent) {

                var oItem =
                    oEvent.getSource().getParent();

                var oContext =
                    oItem.getBindingContext("catalog");

                var sPath =
                    oContext.getPath();

                this.editIndex =
                    parseInt(sPath.split("/")[2]);

                var oModel =
                    this.getView().getModel("catalog");

                var aItems =
                    oModel.getProperty("/items");

                var oData =
                    aItems[this.editIndex];

                this.onOpenDialog();

                setTimeout(function () {

                    var aInputs =
                        this.oDialog
                            .getContent()[0]
                            .getItems();

                    aInputs[0].setValue(oData.id);

                    aInputs[1].setValue(oData.name);

                    sap.ui.getCore()
                        .byId("categorySelect")
                        .setSelectedKey(oData.category);

                }.bind(this), 100);
            },

            onSearch: function (oEvent) {

                var sValue =
                    oEvent.getParameter("newValue");

                var oTable =
                    this.byId("catalogTable");

                var oBinding =
                    oTable.getBinding("items");

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
        }
    );
});