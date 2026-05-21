sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment"
], function (
    Controller,
    Fragment
) {
    "use strict";

    return Controller.extend(
        "com.rishi.contentcatalogportal.controller.Catalog",
        {

            onInit: function () {

                this.getView().setModel(

                    sap.ui.getCore()
                        .getModel("catalog"),

                    "catalog"
                );
            },

            onOpenDialog: async function () {

                if (!this.oDialog) {

                    this.oDialog =
                        await Fragment.load({

                            name:
                            "com.rishi.contentcatalogportal.view.fragments.AddItem",

                            controller: this
                        });

                    this.getView()
                        .addDependent(this.oDialog);
                }

                this.oDialog.open();
            },

            onCloseDialog: function () {

                this.oDialog.close();
            },

            onSaveItem: function () {

                var oModel =
                    this.getView()
                        .getModel("catalog");

                var aItems =
                    oModel.getProperty("/items");

                var sId =
                    sap.ui.getCore()
                        .byId("dialogInputId")
                        .getValue();

                var sName =
                    sap.ui.getCore()
                        .byId("dialogInputName")
                        .getValue();

                var sCategory =
                    sap.ui.getCore()
                        .byId("dialogSelectCategory")
                        .getSelectedKey();

                var oNewItem = {

                    id: sId,
                    name: sName,
                    category: sCategory
                };

                aItems.push(oNewItem);

                oModel.setProperty(
                    "/items",
                    aItems
                );

                this.oDialog.close();
            }
        }
    );
});