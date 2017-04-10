// animations will be added soon
var modal = angular.module('scotchApp', []);

// I think that each dialog should have its own controller
function ModalDialogController($scope, ModalDialog) {

  this.id = $scope.id;

  this.close = function() {
    $scope.shown = false;
    $scope.$apply();
  }

  this.open = function() {
    $scope.shown = true;
    $scope.$apply();
  }

  this.toggle = function() {
    $scope.shown = !$scope.shown;
    $scope.$apply();
  }

  this.init = function(controller) {
    ModalDialog.add(controller);
  }

}

modal.controller('ModalDialogController', ModalDialogController);

// so here's a singleton service to store those dialog controllers
// and it exposes APIs to the application to control the modal dialogs
function ModalDialogService() {
  var dialogControllers = [],
    service = {};

  service.add = function(dialogController) {
    // TODO duplicated ids
    dialogControllers.push({
      id: dialogController.id,
      controller: dialogController
    });
  }

  service.open = function(dialogId) {
    handleTargetDialog(dialogId, 'open');
  }

  service.close = function(dialogId) {
    handleTargetDialog(dialogId, 'close');
  }

  service.toggle = function(dialogId) {
    handleTargetDialog(dialogId, 'toggle');
  }

  function handleTargetDialog(targetId, action) {
/*    var found = false;
    // TODO any good solutions for this iteration ?
    for (var i = 0; i < dialogControllers.length; i++) {
      if (dialogControllers[i].id !== targetId) continue;
      found = true;
      dialogControllers[i].controller[action]();
      break;
    }*/

    var targetDialogController = dialogControllers.filter(function(dialogCtrl) {
      return dialogCtrl.id === targetId;
    }).pop();

    if (!targetDialogController) console.error('dialog error : ' + dialogId + ' not found !');

    targetDialogController.controller[action]();
  }

  return service;
}

modal.service('ModalDialog', ModalDialogService);

// here is the directive
// create a controller and inject ModalDialog into it
// then use the ModalDialog APIs to control the modal dialogs.
function modalDialog() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: {
      id: '@'
    },
    link: function(scope, elem, attrs, ctrl) {
      elem.addClass(attrs.theme || 'dr-modal-default-theme');
      ctrl.init(ctrl);
    },
    controller: 'ModalDialogController',
    controllerAs: 'mdctrl',
    template: '<div class="dr-modal" ng-show="shown"> \
                <div class="modal-overlay" ng-click="mdctrl.close()"></div> \
                <div class="modal-dialog">\
                  <div class="modal-dialog-close" ng-click="mdctrl.close()"><i class="fa fa-times"></i></div>\
                  <div class="modal-dialog-content" ng-transclude></div>\
                </div>\
              </div>'
  };
}

modal.directive('modalDialog', modalDialog);

// another way to use this directive
// simply write :
// <modal-dialog-trigger trigger-on='target-id'>...</modal-dialog-trigger>
// or
// <a modal-dialog-trigger trigger-on='target-id'>...</a>
function modalDialogTrigger(ModalDialog) {
  return {
    restrict: 'EA',
    link: function(scope, elem, attrs) {
      elem.bind('click', function() {
        ModalDialog.toggle(attrs.triggerOn);
      });
    }
  }
}

modal.directive('modalDialogTrigger', modalDialogTrigger);

/*****************************
 * a sample controller
 *****************************/
var sample = angular.module('ModalDialogSample', ['dx.ModalDialog']);

function ModalDialogSampleController($scope, ModalDialog) {
  this.open = function(id) {
    ModalDialog.open(id);
  }
}

sample.controller('ModalDialogSampleController', ModalDialogSampleController);
