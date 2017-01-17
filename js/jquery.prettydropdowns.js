/*!
 * jQuery Pretty Dropdowns Plugin v3.0.0 by T. H. Doan (http://thdoan.github.io/pretty-dropdowns/)
 *
 * jQuery Pretty Dropdowns by T. H. Doan is licensed under the MIT License.
 * Read a copy of the license in the LICENSE file or at
 * http://choosealicense.com/licenses/mit
 */

(function($) {
  $.fn.prettyDropdown = function(oOptions) {
    // Default options
    oOptions = $.extend({
      customClass: 'arrow',
      height: 50,
      hoverIntent: 200
    }, oOptions);
    var nHoverIndex,
      nTimer,
      aKeys = [
        '0','1','2','3','4','5','6','7','8','9',,,,,,,,
        'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'
      ],
      $current,
      $target,
      handleKeypress = function(e) {
        var sKey,
          $dropdown = $('.prettydropdown > ul.active');
        if (!$dropdown.length) return;
        nHoverIndex = $dropdown.children('li.hover').index();
        if (nHoverIndex===-1) nHoverIndex = $dropdown.children('li.selected').index();
        $current = $dropdown.children().eq(nHoverIndex);
        $dropdown.data('lastKeypress', +new Date());
        switch (e.which) {
          case 13: // Enter
            $current.click();
            return;
          case 27: // Esc
            resetDropdown($dropdown[0]);
            return;
          case 32: // Space
            sKey = ' ';
            break;
          case 33: // Page Up
            return;
          case 34: // Page Down
          //console.log(
            return;
          case 35: // End
            toggleHover($current, 0);
            toggleHover($dropdown.children('li:last-child'), 1);
            return;
          case 36: // Home
            toggleHover($current, 0);
            toggleHover($dropdown.children('li:first-child'), 1);
            return;
          case 38: // Up
            $target = nHoverIndex ? $dropdown.children().eq(nHoverIndex-1) : $dropdown.children('li:last-child');
            toggleHover($current, 0);
            // If not already key-navigated or first item is selected, cycle to the last item;
            // else select the previous item
            toggleHover($target, 1);
            return;
          case 40: // Down
            $target = nHoverIndex===$dropdown.children().length-1 ? $dropdown.children('li:first-child') : $dropdown.children().eq(nHoverIndex+1);
            toggleHover($current, 0);
            // If last item is selected, cycle to the first item;
            // else select the next item
            toggleHover($target, 1);
            return;
          default:
            sKey = aKeys[e.which-48];
        }
        if (sKey) { // Alphanumeric key pressed
          clearTimeout(nTimer);
          $dropdown.data('keysPressed', $dropdown.data('keysPressed')===undefined ? sKey : $dropdown.data('keysPressed') + sKey);
          nTimer = setTimeout(function() {
            $dropdown.removeData('keysPressed');
          }, 300);
          $dropdown.children().each(function() {
            if (this===$current[0]) return true;
            var $this = $(this);
            if ($this.text().toLowerCase().indexOf($dropdown.data('keysPressed'))===0) {
              toggleHover($dropdown.children(), 0);
              toggleHover($this, 1);
              return false;
            }
          });
        }
      },
      resetDropdown = function(o) {
        var $dropdown = $(o.currentTarget||o);
        $dropdown.data('hover', false);
        clearTimeout(nTimer);
        nTimer = setTimeout(function() {
          if (!$dropdown.data('hover')) {
            if ($dropdown.hasClass('reverse')) $dropdown.prepend($dropdown.children('li:last-child'));
            $dropdown.removeClass('active changing reverse').css('height', '');
            $dropdown.children().removeClass('hover nohover');
            $dropdown.removeData('clicked');
            $('body').off('keydown', handleKeypress);
          }
        }, (o.type==='mouseleave' && !$dropdown.data('clicked')) ? oOptions.hoverIntent : 0);
      },
      hoverDropdownItem = function(e) {
        var $dropdown = $(e.currentTarget);
        if (!$dropdown.hasClass('active') || new Date()-$dropdown.data('lastKeypress')<200) return;
        toggleHover($dropdown.children(), 0, false);
        toggleHover($(e.target), 1, false);
      },
      toggleHover = function($el, bOn, bScroll) {
        if (bOn) {
          $el.removeClass('nohover').addClass('hover');
          if ($el.length===1 && $current && bScroll!==false) $el[0].scrollIntoView($el.index()<$current.index());
        } else {
          $el.removeClass('hover').addClass('nohover');
        }
      };
    // Validate options
    if (isNaN(oOptions.height) || oOptions.height<8) oOptions.height = 8;
    if (isNaN(oOptions.hoverIntent) || oOptions.hoverIntent<0) oOptions.hoverIntent = 200;
    return this.each(function() {
      var $this = $(this);
      if ($this.data('loaded')) return true; // Continue
      $this.outerHeight(oOptions.height);
      // NOTE: $this.css('margin') returns empty string in Firefox.
      // See https://github.com/jquery/jquery/issues/3383
      var nWidth = $this.outerWidth(),
        sHtml = '<ul' + ($this.attr('title')?' title="'+$this.attr('title')+'"':'') + ' style="max-height:' + (oOptions.height-2) + 'px;margin:'
          + $this.css('margin-top') + ' '
          + $this.css('margin-right') + ' '
          + $this.css('margin-bottom') + ' '
          + $this.css('margin-left') + ';">',
        renderItem = function(el, sClass) {
          return '<li data-value="' + el.value + '"'
            + (el.title ? ' title="' + el.title + '"' : '')
            + (sClass ? ' class="' + sClass + '"' : '')
            + ((oOptions.height!==50) ? ' style="height:' + (oOptions.height-2) + 'px;line-height:' + (oOptions.height-2) + 'px"' : '')
            + '>' + el.text + '</li>';
        };
      $this.children('option:selected').each(function() {
        sHtml += renderItem(this, 'selected');
      });
      $this.children('option:not(:selected)').each(function() {
        sHtml += renderItem(this);
      });
      sHtml += '</ul>';
      $this.css('visibility', 'hidden').wrap('<div class="prettydropdown ' + oOptions.customClass + ' loading"></div>').before(sHtml).data('loaded', true);
      var $dropdown = $this.parent().children('ul'),
        nWidth = $dropdown.outerWidth(true),
        nOuterWidth;
      // Calculate width if initially hidden
      if ($dropdown.width()<=0) {
        var $clone = $dropdown.parent().clone().css({
            position: 'absolute',
            top: '-100%'
          });
        $('body').append($clone);
        nWidth = $clone.children('ul').outerWidth(true);
        $('li', $clone).width(nWidth);
        nOuterWidth = $clone.children('ul').outerWidth(true);
        $clone.remove();
      }
      // Set dropdown width and event handler
      $dropdown.children('li').width(nWidth).click(function() {
        var $li = $(this);
        // Only update if different value selected
        if ($dropdown.hasClass('active') && $li.data('value')!==$dropdown.children('li.selected').data('value')) {
          $dropdown.children('li.selected').removeClass('selected');
          $dropdown.prepend($li.addClass('selected')).removeClass('reverse');
          // Sync <select> element
          $this.children('option[value="' + $li.data('value') +'"]').prop('selected', true);
          $this.trigger('change');
        }
        $dropdown.toggleClass('active');
        // Try to keep drop-down menu within viewport
        if ($dropdown.hasClass('active')) {
          var nWinHeight = window.innerHeight,
            nOffsetTop = $dropdown.offset().top,
            nScrollTop = document.body.scrollTop,
            nDropdownHeight = $dropdown.outerHeight(),
            nDropdownBottom = nOffsetTop-nScrollTop+nDropdownHeight;
          if (nDropdownBottom>nWinHeight) {
            // Expand to direction that has the most space
            if (nOffsetTop-nScrollTop>nWinHeight-(nOffsetTop-nScrollTop+oOptions.height)) {
              $dropdown.addClass('reverse').append($dropdown.children('li.selected'));
              if (nOffsetTop-nScrollTop+oOptions.height<nDropdownHeight) {
                $dropdown.outerHeight(nOffsetTop-nScrollTop+oOptions.height);
                $dropdown.scrollTop(nDropdownHeight);
              }
            } else {
              $dropdown.height($dropdown.height()-(nDropdownBottom-nWinHeight));
            }
          }
          $('body').on('keydown', handleKeypress);
        } else {
          $dropdown.addClass('changing').data('clicked', true); // Prevent FOUC
          resetDropdown($dropdown[0]);
        }
      });
      $dropdown.on({
        mouseenter: function() {
          $dropdown.data('hover', true);
        },
        mouseleave: resetDropdown,
        mousemove:  hoverDropdownItem
      });
      // Done with everything!
      $dropdown.parent().width(nOuterWidth||$dropdown.outerWidth(true)).removeClass('loading');
    });
  };
}(jQuery));
