/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

 define(function(require){

	var App 			= require('App');
	var vBreadCrumbs 	= require('views/common/BreadCrumbs');
	var XAEnums			= require('utils/XAEnums');
	
	require('backgrid');
	require('jquery-toggles');

	window.onbeforeunload = function(e) {
		if (window._preventNavigation) {
			var message = 'Are you sure you want to refresh the page? Unsaved changes will be lost.';
			if (typeof e == 'undefined') {
				e = window.event;
			}
			if (e) {
				e.returnValue = message;
			}
			return message;
		}
	};
	
	/**
	HtmlCell renders any html code

	@class Backgrid.HtmlCell
	@extends Backgrid.Cell
	*/
	var HtmlCell = Backgrid.HtmlCell = Backgrid.Cell.extend({
	
		 /** @property */
		 className: "html-cell",
	
		 render: function () {
		     this.$el.empty();
		     var rawValue = this.model.get(this.column.get("name"));
		     var formattedValue = this.formatter.fromRaw(rawValue, this.model);
		     this.$el.append(formattedValue);
		     this.delegateEvents();
		     return this;
		 }
	});
	
	/**
	SwitchCell renders Switch Button

	@class Backgrid.SwitchCell
	@extends Backgrid.Cell
	*/
	
	var SwitchCell = Backgrid.SwitchCell = Backgrid.Cell.extend({
		
		 /** @property */
		 className: "switch-cell",
	
		 initialize: function (options) {
			    UriCell.__super__.initialize.apply(this, arguments);
			    this.switchStatus = options.switchStatus || false;
			    this.click = this.column.get('click') || false;
			    this.drag = this.column.get('drag') || false;
			    this.onText = this.column.get('onText') || 'ON';
			    this.offText = this.column.get('offText') || 'OFF';
			    if (this.column.get("cellClass")) this.$el.addClass(this.column.get("cellClass"));
		  },
			  
		 render: function () {
		     this.$el.empty();
		     if(this.model.get(this.column.get("name")) != undefined){
		    	 rawValue = (this.model.get(this.column.get("name")));
		    	 this.switchStatus = this.formatter.fromRaw(rawValue, this.model);
		     }
		     
		     this.$el.append('<div class="toggle-xa"><div  class="toggle"></div></div>');
		     this.$el.find('.toggle').toggles({on : this.switchStatus,click :this.click,drag:this.drag,
   	    	 								text : {on :this.onText ,off : this.offText}
		     });
		     this.delegateEvents();
		     return this;
		 }
	});

	var UriCell = Backgrid.UriCell = Backgrid.Cell.extend({

		  className: "uri-cell",
		  title: null,
		  target: "_blank",

		  initialize: function (options) {
		    UriCell.__super__.initialize.apply(this, arguments);
		    this.title = options.title || this.title;
		    this.target = options.target || this.target;
		  },

		  render: function () {
		    this.$el.empty();
		    var rawValue = this.model.get(this.column.get("name"));
		    var href = _.isFunction(this.column.get("href")) ? this.column.get('href')(this.model) : this.column.get('href');
		    var klass = this.column.get("klass");
		    var formattedValue = this.formatter.fromRaw(rawValue, this.model);
		    this.$el.append($("<a>", {
		      tabIndex: -1,
		      href: href,
		      title: this.title || formattedValue,
		      'class' : klass 
		    }).text(formattedValue));
		    
		    if(this.column.has("iconKlass")){
		    	var iconKlass = this.column.get("iconKlass");
		    	var iconTitle = this.column.get("iconTitle");
		    	this.$el.find('a').append('<i class="'+iconKlass+'" title="'+iconTitle+'"></i>');
		    }
		    this.delegateEvents();
		    return this;
		  }

	});
	
	 /**
    Renders a checkbox for Provision Table Cell.
    @class Backgrid.SelectCell
    @extends Backgrid.Cell
 */
	 Backgrid.SelectCell = Backgrid.Cell.extend({
	
	   /** @property */
	   className: "select-cell",
	
	   /** @property */
	   tagName: "td",
	
	   /** @property */
	   events: {
	     //"keydown input[type=checkbox]": "onKeydown",
	     "change input[type=checkbox]": "onChange",
	     "click input[type=checkbox]": "enterEditMode"
	   },
	
	   /**
	      Initializer. If the underlying model triggers a `select` event, this cell
	      will change its checked value according to the event's `selected` value.
	
	      @param {Object} options
	      @param {Backgrid.Column} options.column
	      @param {Backbone.Model} options.model
	   */
	   initialize: function (options) {
	
	     this.column = options.column;
	     if (!(this.column instanceof Backgrid.Column)) {
	       this.column = new Backgrid.Column(this.column);
	     }
	
	     if(!this.column.has("enabledVal")){
	     	this.column.set("enabledVal", "true"); // it is not a boolean value for EPM
	     	this.column.set("disabledVal", "false");
	     }
	
	     var column = this.column, model = this.model, $el = this.$el;
	     this.listenTo(column, "change:renderable", function (column, renderable) {
	       $el.toggleClass("renderable", renderable);
	     });
	
	     if (Backgrid.callByNeed(column.renderable(), column, model)) $el.addClass("renderable");
	
	     this.listenTo(model, "change:" + column.get("name"), function () {
	   	if (!$el.hasClass("editor")) this.render();
	     });
	
	     this.listenTo(model, "backgrid:select", function (model, selected) {
	       this.$el.find("input[type=checkbox]").prop("checked", selected).change();
	     });
	
	
	   },
	
	   /**
	      Focuses the checkbox.
	   */
	   enterEditMode: function () {
	     this.$el.find("input[type=checkbox]").focus();
	   },
	
	   /**
	      Unfocuses the checkbox.
	   */
	   exitEditMode: function () {
	     this.$el.find("input[type=checkbox]").blur();
	   },
	
	   /**
	      When the checkbox's value changes, this method will trigger a Backbone
	      `backgrid:selected` event with a reference of the model and the
	      checkbox's `checked` value.
	   */
	   onChange: function () {
	     var checked = this.$el.find("input[type=checkbox]").prop("checked");
	     //this.$el.parent().toggleClass("selected", checked);
	     if(checked)
	    	 this.model.set(this.column.get("name"), XAEnums.ActivationStatus.ACT_STATUS_ACTIVE.value);
	     else
	    	 this.model.set(this.column.get("name"), XAEnums.ActivationStatus.ACT_STATUS_DISABLED.value);
	     this.model.trigger("backgrid:selected", this.model, checked);
	   },
	
	   /**
	      Renders a checkbox in a table cell.
	   */
	   render: function () {
	     var model = this.model, column = this.column;
		  var val = (model.get(column.get("name")) === column.get("enabledVal") || 
				  		model.get(column.get("name")) === XAEnums.ActivationStatus.ACT_STATUS_ACTIVE.value) ? true : false;
	     
	     // this.$el.empty().append('<input tabindex="-1" type="checkbox" />');
	     this.$el.empty();
	
	     // this.$el.find("input[type=checkbox]").prop('checked', val);
	     this.$el.append($("<input>", {
	       tabIndex: -1,
	       type: "checkbox",
	       checked: val
	     }));
	     this.delegateEvents();
	     return this;
	   }
	  });


	
	
	
	 /**
	   * SELECT2
	   *
	   * Renders Select2 - jQuery based replacement for select boxes
	   *
	   * Requires an 'options.values' value on the schema.
	   *  Can be an array of options, a function that calls back with the array of options, a string of HTML
	   *  or a Backbone collection. If a collection, the models must implement a toString() method
	   */
	  var Form =  require('backbone-forms');
	  require('select2');
	  
	  Form.editors.Select2 = Form.editors.Select.extend({		 
	    initialize : function(options){
	      this.pluginAttr = _.extend( {'width' : 'resolve'}, options.schema.pluginAttr || {});
	      Form.editors.Select.prototype.initialize.call(this,options);
	    },
	 
		render: function() {
			var self = this;
			this.setOptions(this.schema.options);
			setTimeout(function () {
			    self.$el.select2(self.pluginAttr);
			},0);			

			return this;
		}
	 
	  });
	  
	  /**
	   * TOGGLE SWITCH
	   * https://github.com/simontabor/jquery-toggles
	   *
	   */
	  Form.editors.Switch = Form.editors.Base.extend({
			ui : {
				
			},
			  events: {
			    'click':  function(event) {
			  this.trigger('change', this);
			},
			'focus':  function(event) {
			  this.trigger('focus', this);
			},
			'blur':   function(event) {
			  this.trigger('blur', this);
			    }
			  },
			
			  initialize: function(options) {
			    Form.editors.Base.prototype.initialize.call(this, options);
				this.template = _.template('<div class="toggle-xa"><div  class="toggle"></div></div>');			
			    //this.$el.attr('type', 'checkbox');
		    	this.switchOn = _.has(this.schema,'switchOn') ?  this.schema.switchOn : false;
		    	this.onText = _.has(this.schema,'onText') ?  this.schema.onText : 'ON';
		    	this.offText = _.has(this.schema,'offText') ?  this.schema.offText : 'OFF';
		    	this.width = _.has(this.schema,'width') ?  this.schema.width : 50;
		    	this.height = _.has(this.schema,'height') ?  this.schema.height : 20;
			  },
			
			  /**
			   * Adds the editor to the DOM
			   */
			  render: function() {
			  	this.$el.html( this.template );
			    this.$el.find('.toggle').toggles({
			    	on:this.switchOn,
			    	text : {on : this.onText, off : this.offText },
			    	width: this.width,
			    	height: this.height
			    });
			
			    return this;
			  },
			
			  getValue: function() {
				  return this.$el.find('.toggle-slide').hasClass('active')? true:  false;
				  //return this.$el.find('.active').text() == "ON" ? true : false;
			  },
			
			  setValue: function(switchOn) {
				  this.$el.find('.toggle').toggles({on:switchOn,text : {on : this.onText, off : this.offText }});
				  /*if(switchOn){
					  this.$el.find('.active').removeClass('active');
					  this.$el.find('.toggle-on').addClass('active');
				  }else{
					  this.$el.find('.active').removeClass('active');
					  this.$el.find('.toggle-off').addClass('active');
				  }*/
				  return true;
			  },
			
			  focus: function() {
			    if (this.hasFocus) return;
			
			    this.$el.focus();
			  },
			
			  blur: function() {
			    if (!this.hasFocus) return;
			
			    this.$el.blur();
			  }
			
			});
	  
	  /**
	   * #RANGER RESOURCE
	   * https://github.com/simontabor/jquery-toggles
	   *
	   */
	  Form.editors.Resource = Form.editors.Base.extend({
		  ui : {
				'resource' : '[data-js="resource"]',
				'excludeSupport' : '[data-js="include"]',
				'recursiveSupport' : '[data-js="recursive"]',
				'resourceType' : '[data-js="resourceType"]',
		  },
		  events: {
			  'click':  function(event) {
			  },
		  },
		  initialize: function(options) {
		    Form.editors.Base.prototype.initialize.call(this, options);
		    //default options
		    this.excludeSupport 		= false;
		    this.recursiveSupport 		= false;
		    this.resourcesAtSameLevel 	= false;
		    this.initilializePathPlugin = false;
		    this.resourceOpts = {};
		    _.extend(this, _.pick(this.schema,'excludeSupport','recursiveSupport','resourceOpts','resourcesAtSameLevel','sameLevelOpts',
		    									'initilializePathPlugin', 'validators','name','formView'));
		    this.template = this.getTemplate();
		  },
		  initializeElements : function() {
			  this.$resource = this.$el.find(this.ui.resource)
			  this.$excludeSupport = this.$el.find(this.ui.excludeSupport)
			  this.$recursiveSupport = this.$el.find(this.ui.recursiveSupport)
			  this.$resourceType = this.$el.find(this.ui.resourceType)
			  if(_.isUndefined(this.value) || _.isNull(this.value)){
			    	this.value = {};
			  }
		  },
		  /**
		   * Adds the editor to the DOM
		   */
		  render: function() {
			//render template
		  	this.$el.html( this.template );
		  	this.initializeElements();
		  	this.renderResource();
		  	this.renderToggles();
		  	this.renderSameLevelResource();
		    return this;
		  },
		  renderResource : function() {
			  var that = this;
			  if(!_.isNull(this.value) && !_.isEmpty(this.value)){
			    	this.$resource.val(this.value.values.toString())
			    	//to preserve resources values to text field
			    	if(!_.isUndefined(this.value.resourceType)){
			    		this.preserveResourceValues[this.value.resourceType] = this.value.values.toString();	
			    	}else{
			    		this.preserveResourceValues[this.name] = this.value.values.toString(); 
			    	}
			    }
			  	//check dirtyField for input
			  	this.$resource.on('change', function(e) {
			  		if(_.isUndefined(that.resourceOpts.select2Opts)){
//			  			that.checkDirtyFieldForSelect2($(e.currentTarget), that, this.value);
			  		}
			  	});
			  	//create select2 if select2Opts is specified
			    if(!_.isUndefined(this.resourceOpts.select2Opts)){
			    	this.$resource.select2(this.resourceOpts.select2Opts).on('change',function(e){
			    		console.log(e)
			    		that.preserveResourceValues[that.$resourceType.val()] = e.currentTarget.value;
			    		//check dirty field value for select2 resource field
			    		that.checkDirtyFieldForSelect2($(e.currentTarget), that, this.value);
		    			
			    	});
			    }
		  },
		  renderToggles	: function() {
			  var XAUtil = require('utils/XAUtils');
			  var that = this, isExcludes = false, isRecursive = true;
			  	if(this.excludeSupport){
			  		if(!_.isNull(this.value)){
			  			this.value.isExcludes = _.isUndefined(this.value.isExcludes) ? false : this.value.isExcludes;
			  			isExcludes = this.value.isExcludes
			  		}
			  		this.$excludeSupport.toggles({
			  			on: !isExcludes,
			  			text : {on : 'include', off : 'exclude' },
			  			width: 80,
			  		}).on('toggle', function (e, active) {
			  		    that.value.isExcludes = !active;
			  		    XAUtil.checkDirtyFieldForToggle($(e.currentTarget))
			  		});
			  	}
			  	if(this.recursiveSupport){
			  		if(!_.isNull(this.value)){
			  			this.value.isRecursive = _.isUndefined(this.value.isRecursive) ? true : this.value.isRecursive;
			  			isRecursive = this.value.isRecursive;
			  		}
			  		this.$recursiveSupport.toggles({
			  			on: isRecursive,
			  			text : {on : 'recursive', off : 'nonrecursive' },
			  			width: 105
//				  		height: 20
			  		}).on('toggle', function (e, active) {
			  		    that.value.isRecursive = active;
			  		    XAUtil.checkDirtyFieldForToggle($(e.currentTarget))
			  		});
			  	}
		  },
		  renderSameLevelResource : function() {
			  var that = this, dirtyFieldValue = null
			  if(!_.isUndefined(this.$resourceType) && this.$resourceType.length > 0){
			  		if(!_.isNull(this.value) && !_.isEmpty(this.value)){
			  			this.$resourceType.val(this.value.resourceType);
			  		}
			  		this.$resourceType.on('change', function(e) {
		  				if(!_.isUndefined(that.preserveResourceValues[e.currentTarget.value])){
		  					var val = _.isEmpty(that.preserveResourceValues[e.currentTarget.value]) ? '' : that.preserveResourceValues[e.currentTarget.value].split(','); 
		  					that.$resource.select2('val', val)
		  				}else{
		  					that.$resource.select2('val', '')
		  				}
			  			//reset values
			  			that.value.isExcludes = false;
			  			that.value.isRecursive = false;
			  			that.$excludeSupport.trigger('toggleOn');
			  			that.$recursiveSupport.trigger('toggleOn');
			  			($(e.currentTarget).addClass('dirtyField'))
			  			
			  			//resource are shown if parent is selected or showned
			  			that.$el.parents('.control-group').attr('data-name', 'field-'+this.value);
			  			that.formView.trigger('policyForm:parentChildHideShow',true);
					});
			  	}
		  },
		  getValue: function() {
			  var that = this;
			  //checkParent
			  if(this.$el.parents('.control-group').hasClass('hideResource')){
				  return null;
			  }
			  this.value['resource'] = this.$resource.val();
			  //validation
			  
			  
			  if(!_.isUndefined(this.validators)){
				  if(($.inArray('required',this.validators) != -1)){
					  if(_.isEmpty(this.value.resource))
						  return null;
				  }
			  } 
			  
			  
			  
			  if(!_.isUndefined(this.$resourceType) && this.$resourceType.length > 0){
				  this.value['resourceType'] = this.$resourceType.val();  
			  }
			  return this.value;
		  },
		
		  setValue: function(val) {
			  return true;
		  },
		  checkDirtyFieldForSelect2 : function($el,that,value) {
			  var defaultResourceValue = _.isUndefined(that.value.values) ? [] : that.value.values;  
	    		
			  if($el.hasClass('dirtyField')){
				  var tmpValue={};
				  tmpValue.values = _.isEmpty(value) ? [] : value.split(','); 
				  tmpValue.isExcludes = that.value.isExcludes;
				  tmpValue.isRecursive = that.value.isRecursive;
				  if(_.isEqual(tmpValue, dirtyFieldValue)){
					  $el.removeClass('dirtyField');
				  }
			  }else if(!$el.hasClass('dirtyField')){
				  $el.addClass('dirtyField');
    			  if(!_.isNull(that.value)){
    				  that.value.values = defaultResourceValue;
    				  if(_.isUndefined(that.value.isExcludes)){
    					  that.value.isExcludes = that.excludeSupport ? true : false;
    				  }
    				  if(_.isUndefined(that.value.isRecursive)){
    					  that.value.isRecursive = that.RecursiveSupport ? true : false;
    				  }
    			  }
    			  dirtyFieldValue =  that.value
			  }
		  	},
		  	getTemplate : function() {
				  var optionsHtml="", selectTemplate = '',excludeSupportToggleDiv='', recursiveSupportToggleDiv='';
				  this.preserveResourceValues = {};
				    if(this.resourcesAtSameLevel){
				    	_.each(this.sameLevelOpts, function(option){ return optionsHtml += "<option value='"+option+"'>"+option+"</option>"; },this);
				    	selectTemplate = '<select data-js="resourceType" class="btn dropdown-toggle sameLevelDropdown" >\
				    						'+optionsHtml+'\
				    					</select>';
				    }
				    if(this.excludeSupport){
				    	excludeSupportToggleDiv = '<div class="toggle-xa include-toggle" data-js="include"><div  class="toggle"></div></div>';
				    }
				    if(this.recursiveSupport){
				    	kclass = !_.isEmpty(excludeSupportToggleDiv) ?  'recursive-toggle' : 'include-toggle';
				    	if(this.initilializePathPlugin){
				    		kclass = "recursive-toggle-path";
				    	}
				    	recursiveSupportToggleDiv = '<div class="toggle-xa '+kclass+'" data-js="recursive"><div  class="toggle"></div></div>';
				    }
				    return _.template(selectTemplate+'<input data-js="resource" type="text">'+
				    					excludeSupportToggleDiv+''+recursiveSupportToggleDiv);
			  },
			});
	  
	  
	  	
	//Scroll to top functionality on all views -- if the scroll height is > 500 px.
	 $(window).scroll(function() {
		if ($(this).scrollTop() > 300) {
				$('#back-top').show();
				$('#back-top').tooltip();
			} else {
				$('#back-top').hide();
			}
		});

		$('#back-top').click(function() {
			$('body,html').animate({
				scrollTop : 0
			}, 800);
			return false;
		});
	  	
	  	
	  
	  
	  /*
		 * Backbone.View override for implementing Breadcrumbs
		 */
		Backbone.View = (function(View) {
		  // Define the new constructor
		  Backbone.View = function(options) {
		    // Call the original constructor
		    View.apply(this, arguments);
		    // Add the render callback
		    if(this.breadCrumbs){
		    	var breadCrumbsArr = [];
		    	if(_.isFunction(this.breadCrumbs))
		    		breadCrumbsArr = this.breadCrumbs();
		    	else
		    		breadCrumbsArr = this.breadCrumbs;
		    		
		    	if(App.rBreadcrumbs.currentView)
		    		App.rBreadcrumbs.close();
			    App.rBreadcrumbs.show(new vBreadCrumbs({breadcrumb:breadCrumbsArr}));
		    }
		  };
		  // 1lone static properties
		  _.extend(Backbone.View, View);
		  // Clone prototype
		  Backbone.View.prototype = (function(Prototype) {
		    Prototype.prototype = View.prototype;
		    return new Prototype;
		  })(function() {});
		  // Update constructor in prototype
		  Backbone.View.prototype.constructor = Backbone.View;
		  return Backbone.View;
		})(Backbone.View);
		
		
		/*
		 * Override val() of jquery to trim values
		 */
		(function ($) {
			var originalVal = $.fn.val;
			 $.fn.val = function(value) { 
			 	if (_.isUndefined(value)) 
					return originalVal.call(this); 
			 	else { 
			 		return originalVal.call(this,(_.isString(value))? $.trim(value):value); 
			 	}
			}; 
		})(jQuery);
		
		/***************   Block UI   ************************/
		/*! Copyright 2011, Ben Lin (http://dreamerslab.com/)
		* Licensed under the MIT License (LICENSE.txt).
		*
		* Version: 1.1.1
		*
		* Requires: jQuery 1.2.6+
		* https://github.com/dreamerslab/jquery.msg/
		*/
		;(function($,window){var get_win_size=function(){if(window.innerWidth!=undefined)return[window.innerWidth,window.innerHeight];else{var B=document.body;var D=document.documentElement;return[Math.max(D.clientWidth,B.clientWidth),Math.max(D.clientHeight,B.clientHeight)]}};$.fn.center=function(opt){var $w=$(window);var scrollTop=$w.scrollTop();return this.each(function(){var $this=$(this);var configs=$.extend({against:"window",top:false,topPercentage:0.5,resize:true},opt);var centerize=function(){var against=configs.against;var against_w_n_h;var $against;if(against==="window")against_w_n_h=get_win_size();else if(against==="parent"){$against=$this.parent();against_w_n_h=[$against.width(),$against.height()];scrollTop=0}else{$against=$this.parents(against);against_w_n_h=[$against.width(),$against.height()];scrollTop=0}var x=(against_w_n_h[0]-$this.outerWidth())*0.5;var y=(against_w_n_h[1]-$this.outerHeight())*configs.topPercentage+scrollTop;if(configs.top)y=configs.top+scrollTop;$this.css({"left":x,"top":y})};centerize();if(configs.resize===true)$w.resize(centerize)})}})(jQuery,window);
		
		/* Copyright 2011, Ben Lin (http://dreamerslab.com/)
		* Licensed under the MIT License (LICENSE.txt).
		*
		* Version: 1.0.7
		*
		* Requires: 
		* jQuery 1.3.0+, 
		* jQuery Center plugin 1.0.0+ https://github.com/dreamerslab/jquery.center
		*/
		;(function(d,e){var a={},c=0,f,b=[function(){}];d.msg=function(){var g,k,j,l,m,i,h;j=[].shift.call(arguments);l={}.toString.call(j);m=d.extend({afterBlock:function(){},autoUnblock:true,center:{topPercentage:0.4},css:{},clickUnblock:true,content:"Please wait...",fadeIn:200,fadeOut:300,bgPath:"",klass:"black-on-white",method:"appendTo",target:"body",timeOut:2400,z:1000},a);l==="[object Object]"&&d.extend(m,j);i={unblock:function(){g=d("#jquery-msg-overlay").fadeOut(m.fadeOut,function(){b[m.msgID](g);g.remove();});clearTimeout(f);}};h={unblock:function(o,n){var p=o===undefined?0:o;m.msgID=n===undefined?c:n;setTimeout(function(){i.unblock();},p);},replace:function(n){if({}.toString.call(n)!=="[object String]"){throw"$.msg('replace'); error: second argument has to be a string";}d("#jquery-msg-content").empty().html(n).center(m.center);},overwriteGlobal:function(o,n){a[o]=n;}};c--;m.msgID=m.msgID===undefined?c:m.msgID;b[m.msgID]=m.beforeUnblock===undefined?function(){}:m.beforeUnblock;if(l==="[object String]"){h[j].apply(h,arguments);}else{g=d('<div id="jquery-msg-overlay" class="'+m.klass+'" style="position:absolute; z-index:'+m.z+"; top:0px; right:0px; left:0px; height:"+d(e).height()+'px;"><img src="'+m.bgPath+'blank.gif" id="jquery-msg-bg" style="width: 100%; height: 100%; top: 0px; left: 0px;"/><div id="jquery-msg-content" class="jquery-msg-content" style="position:absolute;">'+m.content+"</div></div>");g[m.method](m.target);k=d("#jquery-msg-content").center(m.center).css(m.css).hide();g.hide().fadeIn(m.fadeIn,function(){k.fadeIn("fast").children().andSelf().bind("click",function(n){n.stopPropagation();});m.afterBlock.call(h,g);m.clickUnblock&&g.bind("click",function(n){n.stopPropagation();i.unblock();});if(m.autoUnblock){f=setTimeout(i.unblock,m.timeOut);}});}return this;};})(jQuery,document);
		
		/*
		 * BASICS
			**********
			
			dirtyFields is a jQuery plugin that makes a user aware of which form elements have been updated on an HTML form and can reset the form values back to their previous state.
			
			The main website for the plugin (which includes documentation, demos, and a download file) is currently at:
	
			http://www.thoughtdelimited.org/dirtyFields/index.cfm
		 * 
		 */
		
		(function(e){function t(t,n,r){var i=n.data("dF").dirtyFieldsDataProperty;var s=e.inArray(t,i);if(r=="dirty"&&s==-1){i.push(t);n.data("dF").dirtyFieldsDataProperty=i}else if(r=="clean"&&s>-1){i.splice(s,1);n.data("dF").dirtyFieldsDataProperty=i}}function n(t){if(t.data("dF").dirtyFieldsDataProperty.length>0){t.addClass(t.data("dF").dirtyFormClass);if(e.isFunction(t.data("dF").formChangeCallback)){t.data("dF").formChangeCallback.call(t,true,t.data("dF").dirtyFieldsDataProperty)}}else{t.removeClass(t.data("dF").dirtyFormClass);if(e.isFunction(t.data("dF").formChangeCallback)){t.data("dF").formChangeCallback.call(t,false,t.data("dF").dirtyFieldsDataProperty)}}}function r(t,n,r,i){if(i.data("dF").denoteDirtyFields){var s=i.data("dF").fieldOverrides;var o=n.attr("id");var u=false;for(var a in s){if(o==a){if(r=="changed"){e("#"+s[a]).addClass(i.data("dF").dirtyFieldClass)}else{e("#"+s[a]).removeClass(i.data("dF").dirtyFieldClass)}u=true}}if(u==false){var f=i.data("dF")[t];var l=f.split("-");switch(l[0]){case"next":if(r=="changed"){n.next(l[1]).addClass(i.data("dF").dirtyFieldClass)}else{n.next(l[1]).removeClass(i.data("dF").dirtyFieldClass)}break;case"previous":if(r=="changed"){n.prev(l[1]).addClass(i.data("dF").dirtyFieldClass)}else{n.prev(l[1]).removeClass(i.data("dF").dirtyFieldClass)}break;case"closest":if(r=="changed"){n.closest(l[1]).addClass(i.data("dF").dirtyFieldClass)}else{n.closest(l[1]).removeClass(i.data("dF").dirtyFieldClass)}break;case"self":if(r=="changed"){n.addClass(i.data("dF").dirtyFieldClass)}else{n.removeClass(i.data("dF").dirtyFieldClass)}break;default:if(l[0]=="id"||l[0]=="name"){switch(l[1]){case"class":if(r=="changed"){e("."+n.attr(l[0]),i).addClass(i.data("dF").dirtyFieldClass)}else{e("."+n.attr(l[0]),i).removeClass(i.data("dF").dirtyFieldClass)}break;case"title":if(r=="changed"){e("*[title='"+n.attr(l[0])+"']",i).addClass(i.data("dF").dirtyFieldClass)}else{e("*[title='"+n.attr(l[0])+"']",i).removeClass(i.data("dF").dirtyFieldClass)}break;case"for":if(r=="changed"){e("label[for='"+n.attr(l[0])+"']",i).addClass(i.data("dF").dirtyFieldClass)}else{e("label[for='"+n.attr(l[0])+"']",i).removeClass(i.data("dF").dirtyFieldClass)}break}}break}}}}function i(i,s){var o=i.attr("name");var u=false;if(s.data("dF").trimText){var a=jQuery.trim(i.val())}else{var a=i.val()}if(i.hasClass(s.data("dF").ignoreCaseClass)){var a=a.toUpperCase();var f=i.data(s.data("dF").startingValueDataProperty).toUpperCase()}else{var f=i.data(s.data("dF").startingValueDataProperty)}if(a!=f){r("textboxContext",i,"changed",s);t(o,s,"dirty");u=true}else{r("textboxContext",i,"unchanged",s);t(o,s,"clean")}if(e.isFunction(s.data("dF").fieldChangeCallback)){s.data("dF").fieldChangeCallback.call(i,i.data(s.data("dF").startingValueDataProperty),u)}if(s.data("dF").denoteDirtyForm){n(s)}}function s(i,s){var o=i.attr("name");var u=false;if(s.data("dF").denoteDirtyOptions==false&&i.attr("multiple")!=true){if(i.hasClass(s.data("dF").ignoreCaseClass)){var a=i.val().toUpperCase();var f=i.data(s.data("dF").startingValueDataProperty).toUpperCase()}else{var a=i.val();var f=i.data(s.data("dF").startingValueDataProperty)}if(a!=f){r("selectContext",i,"changed",s);t(o,s,"dirty");u=true}else{r("selectContext",i,"unchanged",s);t(o,s,"clean")}}else{var l=false;i.children("option").each(function(t){var n=e(this);var r=n.is(":selected");if(r!=n.data(s.data("dF").startingValueDataProperty)){if(s.data("dF").denoteDirtyOptions){n.addClass(s.data("dF").dirtyOptionClass)}l=true}else{if(s.data("dF").denoteDirtyOptions){n.removeClass(s.data("dF").dirtyOptionClass)}}});if(l){r("selectContext",i,"changed",s);t(o,s,"dirty");u=true}else{r("selectContext",i,"unchanged",s);t(o,s,"clean")}}if(e.isFunction(s.data("dF").fieldChangeCallback)){s.data("dF").fieldChangeCallback.call(i,i.data(s.data("dF").startingValueDataProperty),u)}if(s.data("dF").denoteDirtyForm){n(s)}}function o(i,s){var o=i.attr("name");var u=false;var a=i.attr("type");e(":"+a+"[name='"+o+"']",s).each(function(t){var n=e(this);var i=n.is(":checked");if(i!=n.data(s.data("dF").startingValueDataProperty)){r("checkboxRadioContext",n,"changed",s);u=true}else{r("checkboxRadioContext",n,"unchanged",s)}});if(u){t(o,s,"dirty")}else{t(o,s,"clean")}if(e.isFunction(s.data("dF").fieldChangeCallback)){s.data("dF").fieldChangeCallback.call(i,i.data(s.data("dF").startingValueDataProperty),u)}if(s.data("dF").denoteDirtyForm){n(s)}}e.fn.dirtyFields=function(t){var n=e.extend({},e.fn.dirtyFields.defaults,t);return this.each(function(){var t=e(this);t.data("dF",n);t.data("dF").dirtyFieldsDataProperty=new Array;e("input[type='text'],input[type='file'],input[type='password'],textarea",t).not("."+t.data("dF").exclusionClass).each(function(n){e.fn.dirtyFields.configureField(e(this),t,"text")});e("select",t).not("."+t.data("dF").exclusionClass).each(function(n){e.fn.dirtyFields.configureField(e(this),t,"select")});e(":checkbox,:radio",t).not("."+t.data("dF").exclusionClass).each(function(n){e.fn.dirtyFields.configureField(e(this),t,"checkRadio")});e.fn.dirtyFields.setStartingValues(t)})};e.fn.dirtyFields.defaults={checkboxRadioContext:"next-span",denoteDirtyOptions:false,denoteDirtyFields:true,denoteDirtyForm:false,dirtyFieldClass:"dirtyField",dirtyFieldsDataProperty:"dirtyFields",dirtyFormClass:"dirtyForm",dirtyOptionClass:"dirtyOption",exclusionClass:"dirtyExclude",fieldChangeCallback:"",fieldOverrides:{none:"none"},formChangeCallback:"",ignoreCaseClass:"dirtyIgnoreCase",preFieldChangeCallback:"",selectContext:"id-for",startingValueDataProperty:"startingValue",textboxContext:"id-for",trimText:false};e.fn.dirtyFields.configureField=function(t,n,r,u){if(!t.hasClass(n.data("dF").exclusionClass)){if(typeof u!="undefined"){n.data("dF").fieldOverrides[t.attr("id")]=u}switch(r){case"text":t.change(function(){if(e.isFunction(n.data("dF").preFieldChangeCallback)){if(n.data("dF").preFieldChangeCallback.call(t,t.data(n.data("dF").startingValueDataProperty))==false){return false}}i(t,n)});break;case"select":t.change(function(){if(e.isFunction(n.data("dF").preFieldChangeCallback)){if(n.data("dF").preFieldChangeCallback.call(t,t.data(n.data("dF").startingValueDataProperty))==false){return false}}s(t,n)});break;case"checkRadio":t.change(function(){if(e.isFunction(n.data("dF").preFieldChangeCallback)){if(n.data("dF").preFieldChangeCallback.call(t,t.data(n.data("dF").startingValueDataProperty))==false){return false}}o(t,n)});break}}};e.fn.dirtyFields.formSaved=function(t){e.fn.dirtyFields.setStartingValues(t);e.fn.dirtyFields.markContainerFieldsClean(t)};e.fn.dirtyFields.markContainerFieldsClean=function(t){var n=new Array;t.data("dF").dirtyFieldsDataProperty=n;e("."+t.data("dF").dirtyFieldClass,t).removeClass(t.data("dF").dirtyFieldClass);if(t.data("dF").denoteDirtyOptions){e("."+t.data("dF").dirtyOptionClass,t).removeClass(t.data("dF").dirtyOptionClass)}if(t.data("dF").denoteDirtyForm){t.removeClass(t.data("dF").dirtyFormClass)}};e.fn.dirtyFields.setStartingValues=function(t,n){e("input[type='text'],input[type='file'],input[type='password'],:checkbox,:radio,textarea",t).not("."+t.data("dF").exclusionClass).each(function(n){var r=e(this);if(r.attr("type")=="radio"||r.attr("type")=="checkbox"){e.fn.dirtyFields.setStartingCheckboxRadioValue(r,t)}else{e.fn.dirtyFields.setStartingTextValue(r,t)}});e("select",t).not("."+t.data("dF").exclusionClass).each(function(n){e.fn.dirtyFields.setStartingSelectValue(e(this),t)})};e.fn.dirtyFields.setStartingTextValue=function(t,n){return t.not("."+n.data("dF").exclusionClass).each(function(){var t=e(this);t.data(n.data("dF").startingValueDataProperty,t.val())})};e.fn.dirtyFields.setStartingCheckboxRadioValue=function(t,n){return t.not("."+n.data("dF").exclusionClass).each(function(){var t=e(this);var r;if(t.is(":checked")){t.data(n.data("dF").startingValueDataProperty,true)}else{t.data(n.data("dF").startingValueDataProperty,false)}})};e.fn.dirtyFields.setStartingSelectValue=function(t,n){return t.not("."+n.data("dF").exclusionClass).each(function(){var t=e(this);if(n.data("dF").denoteDirtyOptions==false&&t.attr("multiple")!=true){t.data(n.data("dF").startingValueDataProperty,t.val())}else{var r=new Array;t.children("option").each(function(t){var i=e(this);if(i.is(":selected")){i.data(n.data("dF").startingValueDataProperty,true);r.push(i.val())}else{i.data(n.data("dF").startingValueDataProperty,false)}});t.data(n.data("dF").startingValueDataProperty,r)}})};e.fn.dirtyFields.rollbackTextValue=function(t,n,r){if(typeof r=="undefined"){r=true}return t.not("."+n.data("dF").exclusionClass).each(function(){var t=e(this);t.val(t.data(n.data("dF").startingValueDataProperty));if(r){i(t,n)}})};e.fn.dirtyFields.updateTextState=function(t,n){return t.not("."+n.data("dF").exclusionClass).each(function(){i(e(this),n)})};e.fn.dirtyFields.rollbackCheckboxRadioState=function(t,n,r){if(typeof r=="undefined"){r=true}return t.not("."+n.data("dF").exclusionClass).each(function(){var t=e(this);if(t.data(n.data("dF").startingValueDataProperty)){t.attr("checked",true)}else{t.attr("checked",false)}if(r){o(t,n)}})};e.fn.dirtyFields.updateCheckboxRadioState=function(t,n){return t.not("."+n.data("dF").exclusionClass).each(function(){o(e(this),n)})};e.fn.dirtyFields.rollbackSelectState=function(t,n,r){if(typeof r=="undefined"){r=true}return t.not("."+n.data("dF").exclusionClass).each(function(){var t=e(this);if(n.data("dF").denoteDirtyOptions==false&&t.attr("multiple")!=true){t.val(t.data(n.data("dF").startingValueDataProperty))}else{t.children("option").each(function(t){var r=e(this);if(r.data(n.data("dF").startingValueDataProperty)){r.attr("selected",true)}else{r.attr("selected",false)}})}if(r){s(t,n)}})};e.fn.dirtyFields.updateSelectState=function(t,n){return t.not("."+n.data("dF").exclusionClass).each(function(){s(e(this),n)})};e.fn.dirtyFields.rollbackForm=function(t){e("input[type='text'],input[type='file'],input[type='password'],:checkbox,:radio,textarea",t).not("."+t.data("dF").exclusionClass).each(function(n){$object=e(this);if($object.attr("type")=="radio"||$object.attr("type")=="checkbox"){e.fn.dirtyFields.rollbackCheckboxRadioState($object,t,false)}else{e.fn.dirtyFields.rollbackTextValue($object,t,false)}});e("select",t).not("."+t.data("dF").exclusionClass).each(function(n){e.fn.dirtyFields.rollbackSelectState(e(this),t,false)});e.fn.dirtyFields.markContainerFieldsClean(t)};e.fn.dirtyFields.updateFormState=function(t){e("input[type='text'],input[type='file'],input[type='password'],:checkbox,:radio,textarea",t).not("."+t.data("dF").exclusionClass).each(function(n){$object=e(this);if($object.attr("type")=="radio"||$object.attr("type")=="checkbox"){e.fn.dirtyFields.updateCheckboxRadioState($object,t)}else{e.fn.dirtyFields.updateTextState($object,t)}});e("select",t).not("."+t.data("dF").exclusionClass).each(function(n){$object=e(this);e.fn.dirtyFields.updateSelectState($object,t)})};e.fn.dirtyFields.getDirtyFieldNames=function(e){return e.data("dF").dirtyFieldsDataProperty};})(jQuery)

		var SelectRowCell = Backgrid.Extension.SelectRowCell = Backbone.View.extend({

		    /** @property */
		    className: "select-row-cell",

		    /** @property */
		    tagName: "td",

		    /** @property */
		    events: {
		      "keydown input[type=checkbox]": "onKeydown",
		      "change input[type=checkbox]": "onChange",
		      "click input[type=checkbox]": "enterEditMode"
		    },

		    /**
		       Initializer. If the underlying model triggers a `select` event, this cell
		       will change its checked value according to the event's `selected` value.
		       @param {Object} options
		       @param {Backgrid.Column} options.column
		       @param {Backbone.Model} options.model
		    */
		    initialize: function (options) {

		      this.column = options.column;
		      if (!(this.column instanceof Backgrid.Column)) {
		        this.column = new Backgrid.Column(this.column);
		      }

		      var column = this.column, model = this.model, $el = this.$el;
		      this.listenTo(column, "change:renderable", function (column, renderable) {
		        $el.toggleClass("renderable", renderable);
		      });

		      if (Backgrid.callByNeed(column.renderable(), column, model)) $el.addClass("renderable");

		      this.listenTo(model, "backgrid:select", function (model, selected) {
		        this.checkbox().prop("checked", selected).change();
		      });
		    },

		    /**
		       Returns the checkbox.
		     */
		    checkbox: function () {
		      return this.$el.find("input[type=checkbox]");
		    },

		    /**
		       Focuses the checkbox.
		    */
		    enterEditMode: function () {
		      this.checkbox().focus();
		    },

		    /**
		       Unfocuses the checkbox.
		    */
		    exitEditMode: function () {
		      this.checkbox().blur();
		    },

		    /**
		       Process keyboard navigation.
		    */
		    onKeydown: function (e) {
		      var command = new Backgrid.Command(e);
		      if (command.passThru()) return true; // skip ahead to `change`
		      if (command.cancel()) {
		        e.stopPropagation();
		        this.checkbox().blur();
		      }
		      else if (command.save() || command.moveLeft() || command.moveRight() ||
		               command.moveUp() || command.moveDown()) {
		        e.preventDefault();
		        e.stopPropagation();
		        this.model.trigger("backgrid:edited", this.model, this.column, command);
		      }
		    },

		    /**
		       When the checkbox's value changes, this method will trigger a Backbone
		       `backgrid:selected` event with a reference of the model and the
		       checkbox's `checked` value.
		    */
		    onChange: function () {
		      var checked = this.checkbox().prop("checked");
		      this.$el.parent().toggleClass("selected", checked);
		      if(checked){
		      	this.model.select();
		      }else{
		      	this.model.deselect();
		      }
		      this.model.trigger("backgrid:selected", this.model, checked);
		    },

		    /**
		       Renders a checkbox in a table cell.
		    */
		    render: function () {
		    	var val;
		    	if(_.has(this, 'model'))
		    		val = (this.model.get(this.column.get('name'))) ? 'checked' : '';
		      this.$el.empty().append('<input tabindex="-1" type="checkbox" '+ val +'/>');
		      this.delegateEvents();
		      return this;
		    }

		  });

		  /**
		     Renders a checkbox to select all rows on the current page.
		     @class Backgrid.Extension.SelectAllHeaderCell
		     @extends Backgrid.Extension.SelectRowCell
		  */
		  var SelectAllHeaderCell = Backgrid.Extension.SelectAllHeaderCell = SelectRowCell.extend({

		    /** @property */
		    className: "select-all-header-cell",

		    /** @property */
		    tagName: "th",

		    /**
		       Initializer. When this cell's checkbox is checked, a Backbone
		       `backgrid:select` event will be triggered for each model for the current
		       page in the underlying collection. If a `SelectRowCell` instance exists
		       for the rows representing the models, they will check themselves. If any
		       of the SelectRowCell instances trigger a Backbone `backgrid:selected`
		       event with a `false` value, this cell will uncheck its checkbox. In the
		       event of a Backbone `backgrid:refresh` event, which is triggered when the
		       body refreshes its rows, which can happen under a number of conditions
		       such as paging or the columns were reset, this cell will still remember
		       the previously selected models and trigger a Backbone `backgrid:select`
		       event on them such that the SelectRowCells can recheck themselves upon
		       refreshing.
		       @param {Object} options
		       @param {Backgrid.Column} options.column
		       @param {Backbone.Collection} options.collection
		    */
		    initialize: function (options) {

		      this.column = options.column;
		      if (!(this.column instanceof Backgrid.Column)) {
		        this.column = new Backgrid.Column(this.column);
		      }

		      var collection = this.collection;
		      var selectedModels = this.selectedModels = {};
		      this.listenTo(collection.fullCollection || collection,
		                    "backgrid:selected", function (model, selected) {
		        if (selected) selectedModels[model.id || model.cid] = 1;
		        else {
		          delete selectedModels[model.id || model.cid];
		          this.checkbox().prop("checked", false);
		        }
		        if (_.keys(selectedModels).length === (collection.fullCollection|| collection).length) {
		          this.checkbox().prop("checked", true);
		        }
		      });

		      this.listenTo(collection.fullCollection || collection, "remove", function (model) {
		        delete selectedModels[model.id || model.cid];
		        if ((collection.fullCollection || collection).length === 0) {
		          this.checkbox().prop("checked", false);
		        }
		      });

		      this.listenTo(collection, "backgrid:refresh", function () {
		        if ((collection.fullCollection || collection).length === 0) {
		          this.checkbox().prop("checked", false);
		        }
		        else {
		          var checked = this.checkbox().prop("checked");
		          for (var i = 0; i < collection.length; i++) {
		            var model = collection.at(i);
		            if (checked || selectedModels[model.id || model.cid]) {
		              model.trigger("backgrid:select", model, true);
		            }
		          }
		        }
		      });

		      var column = this.column, $el = this.$el;
		      this.listenTo(column, "change:renderable", function (column, renderable) {
		        $el.toggleClass("renderable", renderable);
		      });

		      if (Backgrid.callByNeed(column.renderable(), column, collection)) $el.addClass("renderable");
		    },

		    /**
		       Propagates the checked value of this checkbox to all the models of the
		       underlying collection by triggering a Backbone `backgrid:select` event on
		       the models on the current page, passing each model and the current
		       `checked` value of the checkbox in each event.
		       A `backgrid:selected` event will also be triggered with the current
		       `checked` value on all the models regardless of whether they are on the
		       current page.
		       This method triggers a 'backgrid:select-all' event on the collection
		       afterwards.
		    */
		    onChange: function () {
		      var checked = this.checkbox().prop("checked");

		      var collection = this.collection;
		      collection.each(function (model) {
		        model.trigger("backgrid:select", model, checked);
		      });

		      if (collection.fullCollection) {
		        collection.fullCollection.each(function (model) {
		          if (!collection.get(model.cid)) {
		            model.trigger("backgrid:selected", model, checked);
		          }
		        });
		      }

		      this.collection.trigger("backgrid:select-all", this.collection, checked);
		    }

		  });

		  /**
		     Convenient method to retrieve a list of selected models. This method only
		     exists when the `SelectAll` extension has been included. Selected models
		     are retained across pagination.
		     @member Backgrid.Grid
		     @return {Array.<Backbone.Model>}
		  */
		  Backgrid.Grid.prototype.getSelectedModels = function () {
		    var selectAllHeaderCell;
		    var headerCells = this.header.row.cells;
		    for (var i = 0, l = headerCells.length; i < l; i++) {
		      var headerCell = headerCells[i];
		      if (headerCell instanceof SelectAllHeaderCell) {
		        selectAllHeaderCell = headerCell;
		        break;
		      }
		    }

		    var result = [];
		    if (selectAllHeaderCell) {
		      var selectedModels = selectAllHeaderCell.selectedModels;
		      var collection = this.collection.fullCollection || this.collection;
		      for (var modelId in selectedModels) {
		        result.push(collection.get(modelId));
		      }
		    }

		    return result;
		  };

		  /**
		     Convenient method to deselect the selected models. This method is only
		     available when the `SelectAll` extension has been included.
		     @member Backgrid.Grid
		   */
		  Backgrid.Grid.prototype.clearSelectedModels = function () {
		    var selectedModels = this.getSelectedModels();
		    for (var i = 0, l = selectedModels.length; i < l; i++) {
		      var model = selectedModels[i];
		      model.trigger("backgrid:select", model, false);
		    }
		  };

	Backbone.Picky = (function(Backbone, _) {
		var Picky = {};

		// Picky.SingleSelect
		// ------------------
		// A single-select mixin for Backbone.Collection, allowing a single
		// model to be selected within a collection. Selection of another
		// model within the collection causes the previous model to be
		// deselected.

		Picky.SingleSelect = function(collection) {
			this.collection = collection;
		};

		_.extend(Picky.SingleSelect.prototype, {

			// Select a model, deselecting any previously
			// selected model
			select: function(model) {
				if (model && this.selected === model) {
					return;
				}

				this.deselect();

				this.selected = model;
				this.selected.select();
				this.trigger("select:one", model);
			},

			// Deselect a model, resulting in no model
			// being selected
			deselect: function(model) {
				if (!this.selected) {
					return;
				}

				model = model || this.selected;
				if (this.selected !== model) {
					return;
				}

				this.selected.deselect();
				this.trigger("deselect:one", this.selected);
				delete this.selected;
			}

		});

		// Picky.MultiSelect
		// -----------------
		// A mult-select mixin for Backbone.Collection, allowing a collection to
		// have multiple items selected, including `selectAll` and `selectNone`
		// capabilities.

		Picky.MultiSelect = function(collection) {
			this.collection = collection;
			this.selected = {};
		};

		_.extend(Picky.MultiSelect.prototype, {

			// Select a specified model, make sure the
			// model knows it's selected, and hold on to
			// the selected model.
			select: function(model) {
				if (this.selected[model.id]) {
					return;
				}

				this.selected[model.id] = model;
				model.select();
				calculateSelectedLength(this);
			},

			// Deselect a specified model, make sure the
			// model knows it has been deselected, and remove
			// the model from the selected list.
			deselect: function(model) {
				if (!this.selected[model.id]) {
					return;
				}

				delete this.selected[model.id];
				model.deselect();
				calculateSelectedLength(this);
			},

			// Select all models in this collection
			selectAll: function() {
				this.each(function(model) {
					model.select();
				});
				calculateSelectedLength(this);
			},

			// Deselect all models in this collection
			selectNone: function() {
				if (this.selectedLength === 0) {
					return;
				}
				this.each(function(model) {
					model.deselect();
				});
				calculateSelectedLength(this);
			},

			// Toggle select all / none. If some are selected, it
			// will select all. If all are selected, it will select 
			// none. If none are selected, it will select all.
			toggleSelectAll: function() {
				if (this.selectedLength === this.length) {
					this.selectNone();
				} else {
					this.selectAll();
				}
			}
		});

		// Picky.Selectable
		// ----------------
		// A selectable mixin for Backbone.Model, allowing a model to be selected,
		// enabling it to work with Picky.MultiSelect or on it's own

		Picky.Selectable = function(model) {
			this.model = model;
		};

		_.extend(Picky.Selectable.prototype, {

			// Select this model, and tell our
			// collection that we're selected
			select: function() {
				if (this.selected) {
					return;
				}

				this.selected = true;
				this.trigger("selected", this);

				if (this.collection) {
					this.collection.select(this);
				}
			},

			// Deselect this model, and tell our
			// collection that we're deselected
			deselect: function() {
				if (!this.selected) {
					return;
				}

				this.selected = false;
				this.trigger("deselected", this);

				if (this.collection) {
					this.collection.deselect(this);
				}
			},

			// Change selected to the opposite of what
			// it currently is
			toggleSelected: function() {
				if (this.selected) {
					this.deselect();
				} else {
					this.select();
				}
			}
		});

		// Helper Methods
		// --------------

		// Calculate the number of selected items in a collection
		// and update the collection with that length. Trigger events
		// from the collection based on the number of selected items.
		var calculateSelectedLength = function(collection) {
			collection.selectedLength = _.size(collection.selected);

			var selectedLength = collection.selectedLength;
			var length = collection.length;

			if (selectedLength === length) {
				collection.trigger("select:all", collection);
				return;
			}

			if (selectedLength === 0) {
				collection.trigger("select:none", collection);
				return;
			}

			if (selectedLength > 0 && selectedLength < length) {
				collection.trigger("select:some", collection);
				return;
			}
		};

		return Picky;
	})(Backbone, _);

});
