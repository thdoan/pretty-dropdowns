/*!
 * jQuery Pretty Dropdowns Plugin v3.1.3 by T. H. Doan (http://thdoan.github.io/pretty-dropdowns/)
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
        var $dropdown = $('.prettydropdown > ul.active, .prettydropdown > ul:focus'),
          isOpen = $dropdown.hasClass('active'),
          nItemsHeight = $dropdown.height()/(oOptions.height-2),
          nItemsPerPage = nItemsHeight%1<0.5 ? Math.floor(nItemsHeight) : Math.ceil(nItemsHeight),
          sKey;
        if (!$dropdown.length) return;
        if (e.which!==9) {
          // Intercept non-Tab keys
          e.preventDefault();
          e.stopPropagation();
        }
        nHoverIndex = Math.max(0, $dropdown.children('li.hover').index());
        nLastIndex = $dropdown.children().length-1;
        $current = $dropdown.children().eq(nHoverIndex);
        $dropdown.data('lastKeypress', +new Date());
        switch (e.which) {
          case 13: // Enter
            if (!isOpen) toggleHover($current, 1);
            $current.click();
            return;
          case 27: // Esc
            resetDropdown($dropdown[0]);
            return;
          case 32: // Space
            if (isOpen) {
              sKey = ' ';
            } else {
              toggleHover($current, 1);
              $current.click();
            }
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
      hoverDropdownItem = function(e) {
        var $dropdown = $(e.currentTarget);
        if (!$dropdown.hasClass('active') || new Date()-$dropdown.data('lastKeypress')<200) return;
        toggleHover($dropdown.children(), 0, 1);
        toggleHover($(e.target), 1, 1);
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
          }
        }, (o.type==='mouseleave' && !$dropdown.data('clicked')) ? oOptions.hoverIntent : 0);
      },
      selectDropdownItem = function($li) {
        var $dropdown = $li.parent(),
          $select = $dropdown.parent().find('select');
        $dropdown.children('li.selected').removeClass('selected');
        $dropdown.prepend($li.addClass('selected')).removeClass('reverse');
        // Sync <select> element
        $select.children('option[value="' + $li.data('value') +'"]').prop('selected', true);
        $select.trigger('change');
      },
      toggleHover = function($li, bOn, bNoScroll) {
        if (bOn) {
          $li.removeClass('nohover').addClass('hover');
          if ($li.length===1 && $current && !bNoScroll) {
            // Ensure items are always in view
            var $dropdown = $li.parent(),
              nDropdownHeight = $dropdown.outerHeight(),
              nItemOffset = $li.offset().top-$dropdown.offset().top-1; // -1px for top border
            if ($li.index()===0) {
              $dropdown.scrollTop(0);
            } else if ($li.index()===nLastIndex) {
              $dropdown.scrollTop($dropdown.children().length*oOptions.height);
            } else {
              if (nItemOffset+oOptions.height>nDropdownHeight) $dropdown.scrollTop($dropdown.scrollTop()+oOptions.height+nItemOffset-nDropdownHeight);
              else if (nItemOffset<0) $dropdown.scrollTop($dropdown.scrollTop()+nItemOffset);
            }
          }
        } else {
          $li.removeClass('hover').addClass('nohover');
        }
      };
    // Validate options
    if (isNaN(oOptions.height) || oOptions.height<8) oOptions.height = 8;
    if (isNaN(oOptions.hoverIntent) || oOptions.hoverIntent<0) oOptions.hoverIntent = 200;
    return this.each(function() {
      var $select = $(this);
      if ($select.data('loaded')) return true; // Continue
      $select.outerHeight(oOptions.height);
      var nWidth = $select.outerWidth(),
        // Height - 2px for borders
        sHtml = '<ul' + ($select.attr('title')?' title="'+$select.attr('title')+'"':'') + ' tabindex="0" style="max-height:' + (oOptions.height-2) + 'px;margin:'
          // NOTE: $select.css('margin') returns empty string in Firefox.
          // See https://github.com/jquery/jquery/issues/3383
          + $select.css('margin-top') + ' '
          + $select.css('margin-right') + ' '
          + $select.css('margin-bottom') + ' '
          + $select.css('margin-left') + ';">',
        renderItem = function(el, sClass) {
          return '<li data-value="' + el.value + '"'
            + (el.title ? ' title="' + el.title + '"' : '')
            + (sClass ? ' class="' + sClass + '"' : '')
            + ((oOptions.height!==50) ? ' style="height:' + (oOptions.height-2) + 'px;line-height:' + (oOptions.height-2) + 'px"' : '')
            + '>' + el.text + '</li>';
        };
      $select.children('option:selected').each(function() {
        sHtml += renderItem(this, 'selected');
      });
      $select.children('option:not(:selected)').each(function() {
        sHtml += renderItem(this);
      });
      sHtml += '</ul>';
      $select.css('visibility', 'hidden').wrap('<div class="prettydropdown ' + oOptions.customClass + ' loading"></div>').before(sHtml).data('loaded', true);
      var $dropdown = $select.parent().children('ul'),
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
      // NOTE: Setting width using width(), then css() because width() only can
      // return a float, which can result in a missing right border when there
      // is a scrollbar.
      $dropdown.children('li').width(nWidth);
      $dropdown.children('li').css('width', $dropdown.children('li').css('width')).click(function() {
        // Only update if different value selected
        if ($dropdown.hasClass('active') && $(this).data('value')!==$dropdown.children('li.selected').data('value')) {
          selectDropdownItem($(this));
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
        } else {
          $dropdown.addClass('changing').data('clicked', true); // Prevent FOUC in reverse menu
          resetDropdown($dropdown[0]);
        }
      });
      $dropdown.on({
        focusin: function() {
          // Unregister any existing handlers first to prevent duplicate firings
          $(window).off('keydown', handleKeypress).on('keydown', handleKeypress);
        },
        focusout: function() {
          $(window).off('keydown', handleKeypress);
        },
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
