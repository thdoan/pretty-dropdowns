/*!
 * jQuery Pretty Dropdowns Plugin v3.1.1 by T. H. Doan (http://thdoan.github.io/pretty-dropdowns/)
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
      nLastIndex,
      nTimer,
      aKeys = [
        '0','1','2','3','4','5','6','7','8','9',,,,,,,,
        'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'
      ],
      $current,
      handleKeypress = function(e) {
        var $dropdown = $('.prettydropdown > ul.active'),
          nItemsHeight = $dropdown.height()/(oOptions.height-2),
          nItemsPerPage = nItemsHeight%1<0.5 ? Math.floor(nItemsHeight) : Math.ceil(nItemsHeight),
          sKey;
        if (!$dropdown.length) return;
        e.preventDefault();
        e.stopPropagation();
        nHoverIndex = $dropdown.children('li.hover').index();
        nLastIndex = $dropdown.children().length-1;
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
            toggleHover($current, 0);
            toggleHover($dropdown.children().eq(Math.max(nHoverIndex-nItemsPerPage-1, 0)), 1);
            return;
          case 34: // Page Down
            toggleHover($current, 0);
            toggleHover($dropdown.children().eq(Math.min(nHoverIndex+nItemsPerPage-1, nLastIndex)), 1);
            return;
          case 35: // End
            toggleHover($current, 0);
            toggleHover($dropdown.children().eq(nLastIndex), 1);
            return;
          case 36: // Home
            toggleHover($current, 0);
            toggleHover($dropdown.children().eq(0), 1);
            return;
          case 38: // Up
            toggleHover($current, 0);
            // If not already key-navigated or first item is selected, cycle to the last item;
            // else select the previous item
            toggleHover(nHoverIndex ? $dropdown.children().eq(nHoverIndex-1) : $dropdown.children().eq(nLastIndex), 1);
            return;
          case 40: // Down
            toggleHover($current, 0);
            // If last item is selected, cycle to the first item;
            // else select the next item
            toggleHover(nHoverIndex===nLastIndex ? $dropdown.children().eq(0) : $dropdown.children().eq(nHoverIndex+1), 1);
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
          // Build index of matches
          var aMatches = [],
            nCurrentIndex = $current.index(),
            $items = $dropdown.children();
          $items.each(function(nIndex) {
            if ($(this).text().toLowerCase().indexOf($dropdown.data('keysPressed'))===0) aMatches.push(nIndex);
          });
          if (aMatches.length) {
            // Cycle through items matching key(s) pressed
            for (var i=0; i<aMatches.length; ++i) {
              if (aMatches[i]>nCurrentIndex) {
                toggleHover($items, 0);
                toggleHover($items.eq(aMatches[i]), 1);
                break;
              }
              if (i===aMatches.length-1) {
                toggleHover($items, 0);
                toggleHover($items.eq(aMatches[0]), 1);
              }
            }
          }
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
            $(window).off('keydown', handleKeypress);
          }
        }, (o.type==='mouseleave' && !$dropdown.data('clicked')) ? oOptions.hoverIntent : 0);
      },
      hoverDropdownItem = function(e) {
        var $dropdown = $(e.currentTarget);
        if (!$dropdown.hasClass('active') || new Date()-$dropdown.data('lastKeypress')<200) return;
        toggleHover($dropdown.children(), 0, 1);
        toggleHover($(e.target), 1, 1);
      },
      toggleHover = function($el, bOn, bNoScroll) {
        if (bOn) {
          $el.removeClass('nohover').addClass('hover');
          if ($el.length===1 && $current && !bNoScroll) {
            // Ensure items are always in view
            var $dropdown = $el.parent(),
              nDropdownHeight = $dropdown.outerHeight(),
              nItemOffset = $el.offset().top-$dropdown.offset().top-1; // -1px for top border
            if ($el.index()===0) {
              $dropdown.scrollTop(0);
            } else if ($el.index()===nLastIndex) {
              $dropdown.scrollTop($dropdown.children().length*oOptions.height);
            } else {
              if (nItemOffset+oOptions.height>nDropdownHeight) $dropdown.scrollTop($dropdown.scrollTop()+oOptions.height+nItemOffset-nDropdownHeight);
              else if (nItemOffset<0) $dropdown.scrollTop($dropdown.scrollTop()+nItemOffset);
            }
          }
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
        // Height - 2px for borders
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
          $(window).on('keydown', handleKeypress);
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
