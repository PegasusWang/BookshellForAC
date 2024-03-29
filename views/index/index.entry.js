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

	__webpack_require__(29);

	window.render_book_list = function(data) {
	  var $book_panel, vm_book, vm_book_list;
	  $book_panel = $(".book-panel");
	  $(window).scroll(function() {
	    return $book_panel.fadeOut(300);
	  });
	  vm_book = avalon.define({
	    $id: "book",
	    data: void 0,
	    action: "",
	    borrow: function() {
	      var book;
	      if (avalon.vmodels.nav.$model.uid) {
	        book = vm_book.data.$model;
	        return swal({
	          title: "借阅确认",
	          text: "《" + book.title + "》",
	          type: "info",
	          showCancelButton: true,
	          confirmButtonText: "确认借阅",
	          cancelButtonText: "取消",
	          closeOnConfirm: false,
	          html: false
	        }, function() {
	          return $.ajax({
	            url: '/book/borrow',
	            method: 'POST',
	            data: {
	              bid: book._id
	            },
	            success: function(data) {
	              console.log(data);
	              if (data.status === 'ok') {
	                book.locate = data.locate;
	                vm_book.action = "giveback";
	                swal("借阅成功!", "《" + book.title + "》", "success");
	                return vm_book.hide();
	              } else {
	                return swal("借阅失败!", data.err, "error");
	              }
	            }
	          });
	        });
	      } else {
	        return window.location.href = "/auth/login";
	      }
	    },
	    giveback: function() {
	      var book;
	      if (avalon.vmodels.nav.uid) {
	        book = vm_book.data.$model;
	        return swal({
	          title: "还书确认",
	          text: "《" + book.title + "》",
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
	              bid: book._id
	            },
	            success: function(data) {
	              if (data.status === 'ok') {
	                book.locate = data.locate;
	                vm_book.action = "borrow";
	                return swal("还书成功!", "《" + book.title + "》", "success");
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
	  vm_book_list = avalon.define({
	    $id: "book_list",
	    data: data,
	    search_data: [],
	    searching: false,
	    go: function(item) {
	      if (vm_book.data && item.$model._id === vm_book.data.$model._id) {
	        $book_panel.fadeToggle(100);
	      } else {
	        vm_book.data = item;
	        $book_panel.fadeIn(100);
	      }
	      if (vm_book.data.locate.indexOf(avalon.vmodels.nav.uid) < 0) {
	        return vm_book.action = "borrow";
	      } else {
	        return vm_book.action = "giveback";
	      }
	    }
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
	        window.loading('start');
	        return $.ajax({
	          url: '/loadmore',
	          method: 'POST',
	          data: {
	            skip: vm_book_list.data.$model.length
	          },
	          success: function(data) {
	            window.loading('end');
	            vm_book_list.data.pushArray(data.data_books);
	            if (data.data_books.length === 30) {
	              return $(document).scroll(scrollLoad);
	            } else {
	              return $(".nomore").show();
	            }
	          }
	        });
	      }
	    };
	    return $(document).scroll(scrollLoad);
	  });
	  return $(document).ready(function() {
	    var search;
	    search = function(query) {
	      if (query) {
	        if ($(".nomore")) {
	          $(".nomore").hide();
	        }
	        vm_book_list.searching = true;
	        window.loading('start');
	        return $.ajax({
	          url: '/search',
	          method: 'POST',
	          data: {
	            q: query
	          },
	          success: function(data) {
	            vm_book_list.search_data = data.data_books;
	            $(".noresult").hide();
	            if (data.data_books.length === 0) {
	              $(".noresult").show();
	            }
	            return window.loading('end');
	          }
	        });
	      } else {
	        vm_book_list.searching = false;
	        if ($(".nomore")) {
	          return $(".nomore").show();
	        }
	      }
	    };
	    $(".nav-search-input input").keyup(function() {
	      return search($(this).val());
	    });
	    return $(".cat-link").parent().click(function() {
	      var query;
	      if (!$(this).hasClass("active")) {
	        $(this).siblings().removeClass("active");
	        $(this).addClass("active");
	        query = $(this).find(".cat-link").text();
	        if (query === "全部") {
	          query = "";
	        }
	        return search(query);
	      }
	    });
	  });
	};


/***/ },

/***/ 29:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }

/******/ });