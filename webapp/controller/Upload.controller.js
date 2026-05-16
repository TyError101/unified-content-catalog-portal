sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/Image",
    "sap/ui/core/HTML",
    "sap/ui/model/json/JSONModel"
], function (Controller, Image, HTML, JSONModel) {
    "use strict";

    return Controller.extend("com.rishi.contentcatalogportal.controller.Upload", {

        onInit: function () {

            var oData = {

                uploads: []
            };

            var oModel = new JSONModel(oData);

            this.getView().setModel(oModel, "upload");
        },

        onFileChange: function (oEvent) {

            var oFile = oEvent.getParameter("files")[0];

            if (!oFile) {
                return;
            }

            var oReader = new FileReader();

            var oUploadModel = this.getView().getModel("upload");

            var aUploads = oUploadModel.getProperty("/uploads");

            var oPreviewContainer = this.byId("previewContainer");

            oPreviewContainer.removeAllItems();

            // Upload Metadata

            var oUploadData = {

                fileName: oFile.name,

                fileType: oFile.type,

                fileSize: (oFile.size / 1024).toFixed(2) + " KB",

                uploadDate: new Date().toLocaleString()
            };

            aUploads.push(oUploadData);

            oUploadModel.setProperty("/uploads", aUploads);

            // File Preview

            oReader.onload = function (e) {

                var sResult = e.target.result;

                // IMAGE PREVIEW

                if (oFile.type.startsWith("image/")) {

                    var oImage = new Image({

                        src: sResult,
                        width: "500px"
                    });

                    oPreviewContainer.addItem(oImage);
                }

                // VIDEO PREVIEW

                else if (oFile.type.startsWith("video/")) {

                    var oHTML = new HTML({

                        content:
                            "<video width='600' controls>" +
                            "<source src='" + sResult + "' type='" + oFile.type + "'>" +
                            "</video>"
                    });

                    oPreviewContainer.addItem(oHTML);
                }
            };

            oReader.readAsDataURL(oFile);
        }

    });
});