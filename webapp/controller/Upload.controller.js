sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (
    Controller,
    JSONModel,
    MessageToast
) {
    "use strict";

    return Controller.extend(
        "com.rishi.contentcatalogportal.controller.Upload",
        {

            onInit: function () {

                var aSavedUploads =
                    JSON.parse(

                        localStorage.getItem(
                            "uploadHistory"
                        )

                    ) || [];

                var oData = {

                    uploads: aSavedUploads
                };

                var oModel =
                    new JSONModel(oData);

                this.getView().setModel(
                    oModel,
                    "upload"
                );

                sap.ui.getCore().setModel(
                    oModel,
                    "upload"
                );
            },

            onProcessUpload: function () {

                var oInput =
                    document.getElementById(
                        "realFileInput"
                    );

                var oFile =
                    oInput.files[0];

                if (!oFile) {

                    MessageToast.show(
                        "Please select a file"
                    );

                    return;
                }

                var sFileURL =
                    URL.createObjectURL(oFile);

                /* =========================
                   UPLOAD HISTORY
                ========================== */

                var oModel =
                    this.getView()
                        .getModel("upload");

                var aUploads =
                    oModel.getProperty("/uploads");

                var oUploadData = {

                    fileName: oFile.name,

                    fileType: oFile.type,

                    fileSize:
                        (oFile.size / 1024)
                        .toFixed(2) + " KB",

                    uploadDate:
                        new Date()
                        .toLocaleString()
                };

                aUploads.push(oUploadData);

                oModel.setProperty(
                    "/uploads",
                    aUploads
                );

                /* =========================
                   SAVE UPLOAD HISTORY
                ========================== */

                localStorage.setItem(

                    "uploadHistory",

                    JSON.stringify(aUploads)
                );

                /* =========================
                   SHARED MODEL
                ========================== */

                var oSharedModel =
                    sap.ui.getCore()
                        .getModel("shared");

                var aSharedFiles =
                    oSharedModel.getProperty(
                        "/uploadedFiles"
                    );

                aSharedFiles.push({

                    fileName: oFile.name,

                    fileType: oFile.type,

                    fileSize:
                        (oFile.size / 1024)
                        .toFixed(2) + " KB",

                    uploadDate:
                        new Date()
                        .toLocaleString(),

                    fileURL: sFileURL,

                    thumbnail: sFileURL
                });

                oSharedModel.setProperty(
                    "/uploadedFiles",
                    aSharedFiles
                );

                /* =========================
                   SAVE SHARED MODEL
                ========================== */

                localStorage.setItem(

                    "sharedUploads",

                    JSON.stringify(aSharedFiles)
                );

                /* =========================
                   PREVIEW
                ========================== */

                var oPreviewBox =
                    this.byId("previewBox");

                oPreviewBox.removeAllItems();

                if (
                    oFile.type.startsWith("image/")
                ) {

                    var oImage =
                        new sap.m.Image({

                            src: sFileURL,

                            width: "400px"
                        });

                    oPreviewBox.addItem(oImage);
                }

                else if (
                    oFile.type.startsWith("video/")
                ) {

                    var oHTML =
                        new sap.ui.core.HTML({

                            content:
                                "<video width='500' controls>" +
                                "<source src='" +
                                sFileURL +
                                "' type='" +
                                oFile.type +
                                "'>" +
                                "</video>"
                        });

                    oPreviewBox.addItem(oHTML);
                }

                /* =========================
                   SAVE CATALOG
                ========================== */

                var oCatalogModel =
                    sap.ui.getCore()
                        .getModel("catalog");

                localStorage.setItem(

                    "catalogItems",

                    JSON.stringify(

                        oCatalogModel.getProperty(
                            "/items"
                        )
                    )
                );

                MessageToast.show(
                    "File Uploaded Successfully"
                );
            }
        }
    );
});