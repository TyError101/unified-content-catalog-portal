sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/ui/export/Spreadsheet",
    "sap/ui/unified/FileUploader"
], function (
    Controller,
    Fragment,
    Filter,
    FilterOperator,
    MessageToast,
    Spreadsheet,
    FileUploader

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

            onExportCSV: function () {

                var oModel =
                    this.getView()
                        .getModel("catalog");

                var aItems =
                    oModel.getProperty("/items");

                var sCSV =
                    "ID,Name,Category\n";

                aItems.forEach(function (
                    oItem
                ) {

                    sCSV +=
                        '"' + oItem.id + '",' +
                        '"' + oItem.name + '",' +
                        '"' + oItem.category + '"\n';
                });

                var oBlob =
                    new Blob(
                        [sCSV],
                        {
                            type:
                                "text/csv;charset=utf-8;"
                        }
                    );

                var sUrl =
                    URL.createObjectURL(
                        oBlob
                    );

                var oLink =
                    document.createElement("a");

                oLink.href =
                    sUrl;

                oLink.download =
                    "catalog.csv";

                document.body.appendChild(
                    oLink
                );

                oLink.click();

                document.body.removeChild(
                    oLink
                );

                URL.revokeObjectURL(
                    sUrl
                );

                MessageToast.show(
                    "Catalog exported successfully"
                );
            },

            onExportExcel: function () {

                var oModel =
                    this.getView()
                        .getModel("catalog");

                var aItems =
                    oModel.getProperty("/items");

                var aCols = [

                    {
                        label: "ID",
                        property: "id",
                        type: "string"
                    },

                    {
                        label: "Name",
                        property: "name",
                        type: "string"
                    },

                    {
                        label: "Category",
                        property: "category",
                        type: "string"
                    }
                ];

                var oSettings = {

                    workbook: {

                        columns: aCols
                    },

                    dataSource:
                        aItems,

                    fileName:
                        "catalog.xlsx"
                };

                var oSpreadsheet =
                    new Spreadsheet(
                        oSettings
                    );

                oSpreadsheet
                    .build()
                    .finally(function () {

                        oSpreadsheet.destroy();
                    });

                MessageToast.show(
                    "Excel export started"
                );
            },

            onImportCSV: function () {

                var oInput =
                    document.createElement("input");

                oInput.type = "file";
                oInput.accept = ".csv";

                oInput.onchange = function (oEvent) {

                    var oFile =
                        oEvent.target.files[0];

                    if (!oFile) {
                        return;
                    }

                    var oReader =
                        new FileReader();

                    oReader.onload =
                        function (e) {

                            var sCSV =
                                e.target.result;

                            var aRows =
                                sCSV.split("\n");

                            var oModel =
                                this.getView()
                                    .getModel("catalog");

                            var aItems =
                                oModel.getProperty(
                                    "/items"
                                );

                            for (
                                var i = 1;
                                i < aRows.length;
                                i++
                            ) {

                                var sRow =
                                    aRows[i].trim();

                                if (!sRow) {
                                    continue;
                                }

                                var aCols =
                                    sRow.replaceAll(
                                        "\"",
                                        ""
                                    ).split(",");

                                if (
                                    aCols.length >= 3
                                ) {

                                    aItems.push({

                                        id: aCols[0],

                                        name: aCols[1],

                                        category: aCols[2]
                                    });
                                }
                            }

                            oModel.setProperty(
                                "/items",
                                aItems
                            );

                            this.saveCatalogToStorage();

                            MessageToast.show(
                                "CSV imported successfully"
                            );

                        }.bind(this);

                    oReader.readAsText(
                        oFile
                    );

                }.bind(this);

                oInput.click();
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