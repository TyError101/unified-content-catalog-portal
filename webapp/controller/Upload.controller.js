sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
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

            onFileChange: function (oEvent) {

                var oFile =
                    oEvent.getParameter("files")[0];

                if (!oFile) {
                    return;
                }

                var oUploadModel =
                    this.getView().getModel("upload");

                var aUploads =
                    oUploadModel.getProperty("/uploads");

                var oUploadData = {

                    fileName: oFile.name,

                    fileType: oFile.type,

                    fileSize:
                        (oFile.size / 1024).toFixed(2) + " KB",

                    uploadDate:
                        new Date().toLocaleString()
                };

                aUploads.push(oUploadData);

                oUploadModel.setProperty(
                    "/uploads",
                    aUploads
                );
            }
        }
    );
});