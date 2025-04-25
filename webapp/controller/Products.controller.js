sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function (Controller, History, JSONModel, MessageToast) {
	"use strict";

	return Controller.extend("sap.ui.demo.toolpageapp.controller.Products", {
		onInit: function () {
			var oModel = new JSONModel();
			this.getView().setModel(oModel);
			
			// Charger les produits depuis le proxy défini dans ui5.yaml
			this._loadProducts("/products", true);
		},

		_loadProducts: function(sUrl, bTryFallback) {
			var oModel = new JSONModel();
			var that = this;

			console.log("Tentative de chargement depuis:", sUrl);
			oModel.loadData(sUrl);

			oModel.attachRequestCompleted(function() {
				var aProducts = oModel.getData();
				console.log("Données reçues:", aProducts);

				if (aProducts && Array.isArray(aProducts)) {
					var aFormattedProducts = aProducts.map(function(oProduct) {
						return {
							ProductID: oProduct.id,
							Name: oProduct.title,
							Price: oProduct.price,
							Description: oProduct.description,
							Category: oProduct.category,
							Image: oProduct.image
						};
					});

					that.getView().getModel().setData({ Products: aFormattedProducts });
					MessageToast.show(aFormattedProducts.length + " produits chargés avec succès");
				} else {
					MessageToast.show("Format de données incorrect");
				}
			});

			oModel.attachRequestFailed(function() {
				console.error("Erreur lors du chargement depuis", sUrl);
				if (bTryFallback) {
					// Si le proxy initial échoue, essayer l'API directement
					MessageToast.show("Échec du proxy, tentative directe via FakeStore API...");
					that._loadProducts("https://fakestoreapi.com/products", false);
				} else {
					MessageToast.show("Impossible de charger les produits");
				}
			});
		},

		onRefresh: function() {
			this._loadProducts("/products", true);
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
