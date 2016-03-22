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
/******/ 	__webpack_require__.p = "http://127.0.0.1:8080/static/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(27);

	window.render_log_list = function(data) {
	  var vm_log_list;
	  return vm_log_list = avalon.define({
	    $id: "log_list",
	    data: data,
	    giveback: function(elem) {
	      var book;
	      if (avalon.vmodels.nav.uid) {
	        book = elem.$model;
	        console.log(elem);
	        return swal({
	          title: "还书确认",
	          text: "《" + book.bname + "》",
	          type: "info",
	          showCancelButton: true,
	          confirmButtonText: "确认还书",
	          cancelButtonText: "取消",
	          closeOnConfirm: false,
	          html: false
	        }, function() {
	          return $.ajax({
	            url: '/book/giveback',
	            method: 'POST',
	            data: {
	              bid: book.bid
	            },
	            success: function(data) {
	              if (data.status === 'ok') {
	                return swal({
	                  title: "还书成功!",
	                  text: "《" + book.bname + "》",
	                  type: "success"
	                }, function() {
	                  return window.location.reload();
	                });
	              } else {
	                return swal("还书失败!", data.err, "error");
	              }
	            }
	          });
	        });
	      } else {
	        return window.location.href = "/auth/login";
	      }
	    }
	  });
	};


/***/ },

/***/ 27:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }

/******/ });