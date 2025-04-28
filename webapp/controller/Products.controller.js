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
		},

		onProductSearch: function(oEvent) {
			var sQuery = oEvent.getParameter("query");
			var oTable = this.getView().byId("productsTable");
			var oBinding = oTable.getBinding("items");
			var aFilters = [];
			if (sQuery) {
				aFilters.push(new sap.ui.model.Filter({
					filters: [
						new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, sQuery),
						new sap.ui.model.Filter("Category", sap.ui.model.FilterOperator.Contains, sQuery)
					],
					and: false
				}));
			}
			oBinding.filter(aFilters);
		}
	});
});
