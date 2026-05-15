sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/Image",
    "sap/ui/core/HTML"
], function (Controller, Image, HTML) {
    "use strict";

    return Controller.extend("com.rishi.contentcatalogportal.controller.Upload", {

        onFileChange: function (oEvent) {

            var oFile = oEvent.getParameter("files")[0];

            if (!oFile) {
                return;
            }

            var oReader = new FileReader();

            var oPreviewContainer = this.byId("previewContainer");

            oPreviewContainer.removeAllItems();

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