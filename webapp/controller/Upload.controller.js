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

                var oData = {

                    uploads: []
                };

                var oModel =
                    new JSONModel(oData);

                this.getView().setModel(
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

                MessageToast.show(
                    "File Uploaded Successfully"
                );
            }
        }
    );
});