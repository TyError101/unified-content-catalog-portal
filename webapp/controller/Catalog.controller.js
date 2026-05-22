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

                var oCatalogModel =
                    sap.ui.getCore()
                        .getModel("catalog");

                this.getView().setModel(
                    oCatalogModel,
                    "catalog"
                );

                /* =========================
                   SHARED MEDIA INTEGRATION
                ========================== */

                var oSharedModel =
                    sap.ui.getCore()
                        .getModel("shared");

                var aUploadedFiles =
                    oSharedModel.getProperty(
                        "/uploadedFiles"
                    );

                var aCatalogItems =
                    oCatalogModel.getProperty(
                        "/items"
                    );

                aUploadedFiles.forEach(function (
                    oFile,
                    iIndex
                ) {

                    var bExists =
                        aCatalogItems.some(function (
                            oItem
                        ) {

                            return (
                                oItem.name ===
                                oFile.fileName
                            );
                        });

                    if (!bExists) {

                        aCatalogItems.push({

                            id:
                                "UP" +
                                (iIndex + 1),

                            name:
                                oFile.fileName,

                            category:
                                oFile.fileType
                                    .startsWith(
                                        "image/"
                                    )
                                    ? "Image"
                                    : "Video"
                        });
                    }
                });

                oCatalogModel.setProperty(
                    "/items",
                    aCatalogItems
                );

                this.editIndex = null;
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

                var oItem = {

                    id: sId,
                    name: sName,
                    category: sCategory
                };

                /* =========================
                   EDIT MODE
                ========================== */

                if (this.editIndex !== null) {

                    aItems[this.editIndex] =
                        oItem;

                    this.editIndex = null;
                }

                /* =========================
                   ADD MODE
                ========================== */

                else {

                    aItems.push(oItem);
                }

                oModel.setProperty(
                    "/items",
                    aItems
                );

                /* =========================
                   CLEAR FIELDS
                ========================== */

                sap.ui.getCore()
                    .byId("dialogInputId")
                    .setValue("");

                sap.ui.getCore()
                    .byId("dialogInputName")
                    .setValue("");

                sap.ui.getCore()
                    .byId("dialogSelectCategory")
                    .setSelectedKey("Image");

                this.oDialog.close();
            },

            onDeleteItem: function (oEvent) {

                var oModel =
                    this.getView()
                        .getModel("catalog");

                var aItems =
                    oModel.getProperty("/items");

                var oItem =
                    oEvent.getSource()
                        .getParent()
                        .getParent();

                var oContext =
                    oItem.getBindingContext(
                        "catalog"
                    );

                var sPath =
                    oContext.getPath();

                var iIndex =
                    parseInt(
                        sPath.split("/")[2]
                    );

                aItems.splice(iIndex, 1);

                oModel.setProperty(
                    "/items",
                    aItems
                );
            },

            onEditItem: async function (
                oEvent
            ) {

                var oItem =
                    oEvent.getSource()
                        .getParent()
                        .getParent();

                var oContext =
                    oItem.getBindingContext(
                        "catalog"
                    );

                var sPath =
                    oContext.getPath();

                this.editIndex =
                    parseInt(
                        sPath.split("/")[2]
                    );

                var oModel =
                    this.getView()
                        .getModel("catalog");

                var aItems =
                    oModel.getProperty("/items");

                var oData =
                    aItems[this.editIndex];

                await this.onOpenDialog();

                sap.ui.getCore()
                    .byId("dialogInputId")
                    .setValue(oData.id);

                sap.ui.getCore()
                    .byId("dialogInputName")
                    .setValue(oData.name);

                sap.ui.getCore()
                    .byId("dialogSelectCategory")
                    .setSelectedKey(
                        oData.category
                    );
            }
        }
    );
});