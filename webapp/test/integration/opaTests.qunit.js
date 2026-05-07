/* global QUnit */
QUnit.config.autostart = false;

sap.ui.require(["com/rishi/contentcatalogportal/test/integration/AllJourneys"
], function () {
	QUnit.start();
});
