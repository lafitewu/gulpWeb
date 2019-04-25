(function($) {
  "use strict";

  $.fn.fireOnDisable = function(settings) {
    // Only perform this DOM change if we have to watch changes with propertychange
    // Also only perform if getOwnPropertyDescriptor exists - IE>=8
    // I suppose I could test for "propertychange fires, but not when form element is disabled" - but it would be overkill
    if (!('onpropertychange' in document.createElement('input')) || Object.getOwnPropertyDescriptor === undefined) {
      return this;
    }

    // IE9-10 use HTMLElement proto, IE8 uses Element proto
    var someProto = window.HTMLElement === undefined ? window.Element.prototype : window.HTMLElement.prototype,
      someTrigger = function() {},
      origDisabled = Object.getOwnPropertyDescriptor(someProto, 'disabled');

    if (document.createEvent) {
      someTrigger = function(newVal) {
        var event = document.createEvent('MutationEvent');
        /*
        Instantiate the event as close to native as possible:
        event.initMutationEvent(eventType, canBubble, cancelable, relatedNodeArg, prevValueArg, newValueArg, attrNameArg, attrChangeArg);
        */
        event.initMutationEvent('DOMAttrModified', true, false, this.getAttributeNode('disabled'), '', '', 'disabled', 1);
        this.dispatchEvent(event);
      };
    } else if (document.fireEvent) {
      someTrigger = function() {
        this.fireEvent('onpropertychange');
      };
    }

    return this.each(function() {
      // call prototype's set, and then trigger the change.
      Object.defineProperty(this, 'disabled', {
        set: function(isDisabled) {
          // We store preDisabled here, so that when we inquire as to the result after throwing the event, it will be accurate
          // We can't throw the event after the native send, because it won't be be sent.
          // We must do a native fire/dispatch, because native listeners don't catch jquery trigger 'propertychange' events
          $.data(this, 'preDisabled', isDisabled);
          if (isDisabled) {
            // Trigger with dispatchEvent
            someTrigger.call(this, isDisabled);
          }

          return origDisabled.set.call(this, isDisabled);
        },
        get: function() {
          var isDisabled = $.data(this, 'preDisabled');
          if (isDisabled === undefined) {
            isDisabled = origDisabled.get.call(this);
          }
          return isDisabled;
        }
      });
    });
  };
})(jQuery);

jQuery.browser = {};
jQuery.browser.msie = false;
jQuery.browser.version = 0;
if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
  jQuery.browser.msie = true;
  jQuery.browser.version = RegExp.$1;
}

$(function() {
  $(".lazy").lazyload();

  if (typeof template != 'undefined') {
    template.config('openTag', '<%');
    template.config('closeTag', '%>');
  }

  if(typeof alertify != "undefined"){
    alertify.logPosition('center').maxLogItems(1);
  }

  moment.locale('zh-cn');

  if ($.fn.select2) {
    $.fn.select2.defaults.set("minimumResultsForSearch", "Infinity");
    $.fn.select2.defaults.set("language", "zh-CN");
    $('.select2-select').length && $('.select2-select').fireOnDisable().select2({});
  }

  function isIe8() {
    var b_version = navigator.appVersion;
    var version = b_version.split(";");
    if (version && version.length > 1) {
      var trim_Version = parseInt(version[1].replace(/[ ]/g, "").replace(/MSIE/g, ""));
      if (trim_Version <= 9) {

        return true;
      }
    }
    return false;
  }

  if (window.swal) {
    var swalDefualtPram = {
      allowOutsideClick: true,
      showConfirmButton: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    };

    swal.setDefaults(swalDefualtPram);
  }

  if (isIe8()) {
    $('input[type=text]').focus(function() {
      var input = $(this);
      if (input.val() == input.attr('placeholder')) {
        input.val('');
        input.removeClass('placeholder');
      }
    }).blur(function() {
      var input = $(this);
      if (input.val() == '' || input.val() == input.attr('placeholder')) {
        input.addClass('placeholder');
        input.val(input.attr('placeholder'));
      }
    }).blur();
  };
});



//大全banner
if( $(".a-close").length !=0 )
{
  $(".a-close").click(function()
  {
    $(".daquan-img3").hide();
  })
}
