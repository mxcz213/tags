/**
  chenjuanhe created on 2017/10/23
  @containerDOM string (domId)
  @inputName  string (input arrtibute of name)
  @tagData Array ([])
  @onValidate function (return true or false )
*/

;(function(exports){
	var doc = document,
		addDomEvent = UTIL.addDomEvent,
		addClass = UTIL.dom.addClass;

	var _initComp = function(){
		var containerDOM = this.containerDOM;
		/*if(!hasClass(containerDOM,'ppTag')){
			addClass(containerDOM,'ppTag');
		}*/
		this.tagInput = doc.createElement('input');
		this.tagInput.className = 'input-tag';
		this.tagInput.setAttribute('data-action','input.data-action.addTag');
		this.tagInput.setAttribute('name',this.inputName);
		this.warningTips = doc.createElement('div');
		this.warningTips.className = 'warning-tips';
		this.warningText = this.initWorningTips || '';
		_setWarningTips.call(this);
		this.ppTagContainer = document.createElement('div');
		this.ppTagContainer.className = 'ppTagContainer';
		this.containerDOM.appendChild(this.tagInput);	
		this.containerDOM.appendChild(this.warningTips);
		this.containerDOM.appendChild(this.ppTagContainer);
	}

	var _initEvents = function(){
		var self = this;
		addDomEvent(this.tagInput,'keypress',function(e){
			if(e.keyCode === 13 || e.keyCode === 32){
				e.preventDefault();
				_checkInputValue.call(self,'keypress');
			}
		});
		addDomEvent(this.tagInput,'blur',function(e){
			_checkInputValue.call(self,this.value,'blur');
		});

		new EventService({
			parent:this.containerDOM,
			actionMap:{
				'a.data-action.delete':function(target,e){
					var index = target.getAttribute('data-index');
					var item = self.tagData[index];
					var ppTagItem = item.ele;
					self.ppTagContainer.removeChild(ppTagItem);
					self.tagData[index] = null;
					self.warningText = '';
					self.tagCount--;
				}
			}
		});
	}

	var _checkInputValue = function(value,eventType){
		var inputValue = this.tagInput.value.trim();
		var isValid = true;
		if(this.onValidate){
			isValid = this.onValidate(inputValue);
		}
		if(isValid){
			_setTagItems.call(this,inputValue);
		}else{
			if(this.errValidate){
				this.errValidate(this.warningText,eventType);
			}
		}
	}
	var _setWarningTips = function(warningTips){
		var tips = this.initWorningTips;
		this.warningTips.innerHTML = tips;
	}

	var _setTagItems = function(inputValue){
		var index = this.tagData.length;
		var tagItem = doc.createElement('div');
		tagItem.className = 'ppTag-item';
		var innerTpl = '<div class="tag-text">' + inputValue + '</div><a data-action="a.data-action.delete" data-index="'+ index +'" class="ppTag-delete">×</a>';
		tagItem.innerHTML = innerTpl;
		this.ppTagContainer.appendChild(tagItem);
		this.tagInput.value = '';
		this.tagData.push({
			ele:tagItem,
			val:inputValue
		});
		this.tagCount++;
	}

	var _clearTagItems = function(){
		for(var i = 0; i < this.tagData.length; i++){
			var item = this.tagData[i];
			if(!item) continue;
			this.ppTagContainer.removeChild(item.ele);
			this.tagData[i] = null;
		}
		this.tagData = [];
		this.tagCount = 0;
	}

	var ppTag = function(opts){
		this.containerDOM = opts.containerDOM;
		addClass(this.containerDOM,'ppTag');
		this.inputName = opts.inputName || 'tagName';
		this.initWorningTips = opts.initWorningTips || '填写与当前视频有关的标签，最多不超过6个标签，使用回车键确认标签。';
		this.tagData = opts.tagData || [];		
		this.onValidate = opts.onValidate || null;
		this.errValidate = opts.errValidate || null;
		this.errValidateDOM = doc.createElement('div');
		this.tagCount = 0;
		_initComp.call(this);
		_initEvents.call(this);
	}

	ppTag.prototype = {
		getValue:function(){
			var result = [];
			for(var i = 0; i < this.tagData.length; i++){
				var item = this.tagData[i];
				if(item){
					result.push(item.val);
				}
			}
			return result;
		},
		setValue:function(vals){
			if(!vals) return;
			_clearTagItems.call(this);
			for(var i = 0 ; i < vals.length;i++){
				_setTagItems.call(this,vals[i]);
			}
		}
	}
	window.myTags = window.myTags || ppTag;
})(window);