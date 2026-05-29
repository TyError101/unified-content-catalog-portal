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
                                    : "Video",

                            thumbnail:
                                oFile.thumbnail || ""
                        });
                    }
                });

                oCatalogModel.setProperty(
                    "/items",
                    aCatalogItems
                );

                this.editIndex = null;
            },

            /* =========================
               SAVE TO LOCAL STORAGE
            ========================== */

            saveCatalogToStorage:
            function () {

                var oCatalogModel =
                    this.getView()
                        .getModel("catalog");

                localStorage.setItem(

                    "catalogItems",

                    JSON.stringify(

                        oCatalogModel.getProperty(
                            "/items"
                        )
                    )
                );
            },

            onOpenDialog:
            async function () {

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

            onCloseDialog:
            function () {

                this.oDialog.close();
            },

            onSaveItem:
            function () {

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

                if (this.editIndex !== null) {

                    aItems[this.editIndex] =
                        oItem;

                    this.editIndex = null;
                }

                else {

                    aItems.push(oItem);
                }

                oModel.setProperty(
                    "/items",
                    aItems
                );

                this.saveCatalogToStorage();

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

            onDeleteItem:
            function (oEvent) {

                var oCatalogModel =
                    this.getView()
                        .getModel("catalog");

                var aCatalogItems =
                    oCatalogModel.getProperty(
                        "/items"
                    );

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

                var oDeletedItem =
                    aCatalogItems[iIndex];

                /* =========================
                   REMOVE FROM CATALOG
                ========================== */

                aCatalogItems.splice(
                    iIndex,
                    1
                );

                oCatalogModel.setProperty(
                    "/items",
                    aCatalogItems
                );

                this.saveCatalogToStorage();

                /* =========================
                   REMOVE FROM SHARED MODEL
                ========================== */

                var oSharedModel =
                    sap.ui.getCore()
                        .getModel("shared");

                var aSharedFiles =
                    oSharedModel.getProperty(
                        "/uploadedFiles"
                    );

                aSharedFiles =
                    aSharedFiles.filter(function (
                        oFile
                    ) {

                        return (
                            oFile.fileName !==
                            oDeletedItem.name
                        );
                    });

                oSharedModel.setProperty(
                    "/uploadedFiles",
                    aSharedFiles
                );

                localStorage.setItem(

                    "sharedUploads",

                    JSON.stringify(
                        aSharedFiles
                    )
                );

                /* =========================
                   REMOVE FROM UPLOAD HISTORY
                ========================== */

                var oUploadModel =
                    sap.ui.getCore()
                        .getModel("upload");

                if (oUploadModel) {

                    var aUploads =
                        oUploadModel.getProperty(
                            "/uploads"
                        );

                    aUploads =
                        aUploads.filter(function (
                            oUpload
                        ) {

                            return (
                                oUpload.fileName !==
                                oDeletedItem.name
                            );
                        });

                    oUploadModel.setProperty(
                        "/uploads",
                        aUploads
                    );

                    localStorage.setItem(

                        "uploadHistory",

                        JSON.stringify(
                            aUploads
                        )
                    );
                }
            },

            onEditItem:
            async function (oEvent) {

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
            },

            onOpenImagePreview:
            async function (oEvent) {

                var sImageURL =
                    oEvent.getSource()
                        .getSrc();

                if (!this.oPreviewDialog) {

                    this.oPreviewDialog =
                        await Fragment.load({

                            name:
                            "com.rishi.contentcatalogportal.view.fragments.ImagePreview",

                            controller: this
                        });

                    this.getView()
                        .addDependent(
                            this.oPreviewDialog
                        );
                }

                sap.ui.getCore()
                    .byId("previewImage")
                    .setSrc(sImageURL);

                this.oPreviewDialog.open();
            },

            onClosePreviewDialog:
            function () {

                this.oPreviewDialog.close();
            },

            onSearchCatalog:
            function () {

                this.onFilterCategory();
            },

            onFilterCategory:
            function () {

                var sSearchValue =
                    this.byId(
                        "_IDGenSearchField"
                    ).getValue();

                var sCategory =
                    this.byId(
                        "categoryFilter"
                    ).getSelectedKey();

                var oTable =
                    this.byId("catalogTable");

                var oBinding =
                    oTable.getBinding("items");

                var aFilters = [];

                /* =========================
                   SEARCH FILTER
                ========================== */

                if (sSearchValue) {

                    var oNameFilter =
                        new Filter(

                            "name",

                            FilterOperator.Contains,

                            sSearchValue
                        );

                    var oCategorySearchFilter =
                        new Filter(

                            "category",

                            FilterOperator.Contains,

                            sSearchValue
                        );

                    aFilters.push(

                        new Filter({

                            filters: [

                                oNameFilter,
                                oCategorySearchFilter
                            ],

                            and: false
                        })
                    );
                }

                /* =========================
                   CATEGORY FILTER
                ========================== */

                if (
                    sCategory &&
                    sCategory !== "All"
                ) {

                    aFilters.push(

                        new Filter(

                            "category",

                            FilterOperator.EQ,

                            sCategory
                        )
                    );
                }

                oBinding.filter(aFilters);
            }
        }
    );
});