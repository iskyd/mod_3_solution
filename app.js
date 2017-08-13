(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', foundItemsDirective)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");

function foundItemsDirective() {
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      items: '<',
      onRemove: '&'
    },
    controller: foundItemsDirectiveController,
    controllerAs: 'ctrl',
    bindToController: true
  };

  return ddo;
}

function foundItemsDirectiveController() {
  var vm = this;

  vm.removeItem = function(index) {
    vm.items.splice(index, 1);
  }
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var vm = this;

  vm.name = '';
  vm.items = [];

  vm.searchMenu = function() {
    if(vm.name === '') {
      return;
    }
    var promise = MenuSearchService.getMatchedMenuItems(vm.name);

    promise.then(function(result) {
      vm.items = result;
    });
  }

}


MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
  var service = this;

  service.getMatchedMenuItems = function (searchTerm) {
    return $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json")
    }).then(function(result) {
      var menuItems = result.data.menu_items;
      var matchedMenuItems = [];
      menuItems.forEach(function(element) {
        if(element.description.search(searchTerm) !== -1) {
          matchedMenuItems.push(element);
        }
      });

      return matchedMenuItems;
    });
  };
}

})();
