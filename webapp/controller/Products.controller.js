sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/demo/toolpageapp/services/ProductService"
], function (Controller, History, JSONModel, MessageToast, ProductService) {
	"use strict";

	return Controller.extend("sap.ui.demo.toolpageapp.controller.Products", {
		onInit: function () {
			var oModel = new JSONModel();
			this.getView().setModel(oModel);
			this._loadProducts();
		},

		_loadProducts: function() {
			var that = this;
			ProductService.getProducts("/fakestore/products")
				.then(function(aFormattedProducts) {
					that.getView().getModel().setData({ Products: aFormattedProducts });
					MessageToast.show(aFormattedProducts.length + " produits chargés avec succès");
				})
				.catch(function(err) {
					MessageToast.show(err.message);
				});
		},

		onRefresh: function() {
			this._loadProducts();
		},

		onAddProduct: function () {
			MessageToast.show("Fonctionnalité d'ajout de produit à implémenter");
		},

		onNavBack: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("home", {}, true);
			}
		},
		
		getRouter: function() {
			return this.getOwnerComponent().getRouter();
		}
	});
});
