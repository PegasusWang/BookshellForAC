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
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(18);

	$(document).ready(function() {
	  return $(".aclib-form").submit(function(e) {
	    var $password, $self, $username, form_data, validation;
	    e.preventDefault();
	    $self = $(this);
	    validation = true;
	    $username = $self.find("input[name='username']");
	    $password = $self.find("input[name='password']");
	    if (!$.trim($password.val())) {
	      $password.focus().next().show();
	      validation = false;
	      false;
	    } else {
	      $password.next().hide();
	    }
	    if (!$.trim($username.val())) {
	      $username.focus().next().show();
	      validation = false;
	      false;
	    } else {
	      $username.next().hide();
	    }
	    if (validation) {
	      form_data = $self.serialize();
	      return $.ajax({
	        url: '/login',
	        type: 'POST',
	        data: form_data,
	        dataType: 'json',
	        success: function(data) {
	          if (data.status === 'admin') {
	            return window.location.href = "/admin?user=" + data.user;
	          } else if (data.status === 'user') {
	            return window.location.href = "/?user=" + data.user;
	          }
	        },
	        error: function() {
	          $password.focus().next().show();
	          return $username.focus().next().show();
	        }
	      });
	    }
	  });
	});


/***/ },

/***/ 18:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }

/******/ });