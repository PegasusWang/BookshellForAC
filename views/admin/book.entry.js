/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "static/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);

	$(document).ready(function() {
	  $("#add-submit").click(function() {
	    var $self, form_data, validation;
	    $self = $(this);
	    validation = true;
	    $(".fa-check-circle").hide();
	    $self.parent().find(".aclib-form-item").each(function() {
	      if ($(this).find("input").attr("name") === "count") {
	        if (!$.isNumeric($(this).find("input").val())) {
	          $(this).find("input").focus();
	          $(this).find(".aclib-form-tip").show();
	          validation = false;
	          return false;
	        } else {
	          return $(this).find(".aclib-form-tip").hide();
	        }
	      } else {
	        if (!$.trim($(this).find("input").val())) {
	          $(this).find("input").focus();
	          $(this).find(".aclib-form-tip").show();
	          validation = false;
	          return false;
	        } else {
	          return $(this).find(".aclib-form-tip").hide();
	        }
	      }
	    });
	    if (validation) {
	      $(".fa-spinner").show();
	      form_data = $self.parent().serialize();
	      return $.ajax({
	        url: '/admin/addbook',
	        type: 'POST',
	        data: form_data,
	        dataType: 'json',
	        success: function() {
	          $(".fa-spinner").hide();
	          return $(".fa-check-circle").show();
	        }
	      });
	    }
	  });
	  return $("#excel").change(function() {
	    return $(this).parent().submit();
	  });
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ]);