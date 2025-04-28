sap.ui.define([], function () {
    "use strict";

    function getProducts() {
        return new Promise(function (resolve, reject) {
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.attachRequestCompleted(function () {
                var aProducts = oModel.getData();
                if (aProducts && Array.isArray(aProducts)) {
                    var aFormattedProducts = aProducts.map(function (oProduct) {
                        return {
                            ProductID: oProduct.id,
                            Name: oProduct.title,
                            Price: oProduct.price,
                            Description: oProduct.description,
                            Category: oProduct.category,
                            Image: oProduct.image
                        };
                    });
                    resolve(aFormattedProducts);
                } else {
                    reject(new Error("Format de données incorrect"));
                }
            });
            oModel.attachRequestFailed(function () {
                reject(new Error("Impossible de charger les produits"));
            });
            oModel.loadData("/fakestore/products");
        });
    }

    function filterProducts(aProducts, sQuery) {
        if (!sQuery) {
            return aProducts;
        }
        sQuery = sQuery.toLowerCase();
        return aProducts.filter(function (oProduct) {
            return (
                (oProduct.Name && oProduct.Name.toLowerCase().includes(sQuery)) ||
                (oProduct.Category && oProduct.Category.toLowerCase().includes(sQuery))
            );
        });
    }

    return {
        getProducts: getProducts,
        filterProducts: filterProducts
    };
}); 