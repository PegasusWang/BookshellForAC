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

	__webpack_require__(16);

	window.render_book_list = function(data) {
	  var vm_book_list;
	  vm_book_list = avalon.define({
	    $id: "book_list",
	    data: data,
	    search_data: [],
	    searching: false
	  });
	  avalon.ready(function() {
	    var scrollLoad;
	    scrollLoad = function() {
	      var domHeight, scrollTop, winHeight;
	      domHeight = $(document).height();
	      scrollTop = $(document).scrollTop();
	      winHeight = $(window).height();
	      if (scrollTop + 200 + winHeight >= domHeight) {
	        $(document).unbind("scroll");
	        window.loading(50, 1000);
	        return $.ajax({
	          url: '/loadmore',
	          method: 'POST',
	          data: {
	            skip: vm_book_list.data.$model.length
	          },
	          success: function(data) {
	            window.loading(100, 400);
	            vm_book_list.data.pushArray(data.data_books);
	            if (data.data_books.length === 30) {
	              return $(document).scroll(scrollLoad);
	            } else {
	              return $(".book-list").after("<p class='nomore'>╮(╯_╰)╭只有这些了，再翻也没有啦</p>");
	            }
	          }
	        });
	      }
	    };
	    return $(document).scroll(scrollLoad);
	  });
	  return $(document).ready(function() {
	    return $(".nav-search-input input").keyup(function() {
	      var query;
	      query = $(this).val();
	      if (query) {
	        if ($(".nomore")) {
	          $(".nomore").hide();
	        }
	        vm_book_list.searching = true;
	        window.loading(50, 1000);
	        return $.ajax({
	          url: '/search',
	          method: 'POST',
	          data: {
	            q: query
	          },
	          success: function(data) {
	            window.loading(100, 400);
	            vm_book_list.search_data = data.data_books;
	            if ($(".noresult")) {
	              $(".noresult").remove();
	            }
	            if (data.data_books.length === 0) {
	              return $(".search-results").after("<p class='noresult'>╮(╯_╰)╭没搜到啊~，换个词试试</p>");
	            }
	          }
	        });
	      } else {
	        vm_book_list.searching = false;
	        if ($(".nomore")) {
	          return $(".nomore").show();
	        }
	      }
	    });
	  });
	};


/***/ },

/***/ 16:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }

/******/ });