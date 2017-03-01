/*!
 * jQuery Pretty Dropdowns Plugin v4.5.0 by T. H. Doan (http://thdoan.github.io/pretty-dropdowns/)
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
      hoverIntent: 200,
      selectedDelimiter: '; ',
      selectedMarker: '&#10003;'
    }, oOptions);
    var $current,
      aKeys = [
        '0','1','2','3','4','5','6','7','8','9',,,,,,,,
        'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'
      ],
      nCount,
      nHoverIndex,
      nLastIndex,
      nTimer,
      nTimestamp,
      handleKeypress = function(e) {
        var $dropdown = $('.prettydropdown > ul.active, .prettydropdown > ul:focus');
        if (!$dropdown.length) return;
        if (e.which===9) { // Tab
          resetDropdown($dropdown[0]);
          return;
        } else {
          // Intercept non-Tab keys only
          e.preventDefault();
          e.stopPropagation();
        }
        var $items = $dropdown.children(),
          bOpen = $dropdown.hasClass('active'),
          nItemsHeight = $dropdown.height()/(oOptions.height-2),
          nItemsPerPage = nItemsHeight%1<0.5 ? Math.floor(nItemsHeight) : Math.ceil(nItemsHeight),
          sKey;
        nHoverIndex = Math.max(0, $dropdown.children('.hover').index());
        nLastIndex = $items.length-1;
        $current = $items.eq(nHoverIndex);
        $dropdown.data('lastKeypress', +new Date());
        switch (e.which) {
          case 13: // Enter
            if (!bOpen) toggleHover($current, 1);
            $current.click();
            break;
          case 27: // Esc
            if (bOpen) resetDropdown($dropdown[0]);
            break;
          case 32: // Space
            if (bOpen) {
              sKey = ' ';
            } else {
              toggleHover($current, 1);
              $current.click();
            }
            break;
          case 33: // Page Up
            if (bOpen) {
              toggleHover($current, 0);
              toggleHover($items.eq(Math.max(nHoverIndex-nItemsPerPage-1, 0)), 1);
            }
            break;
          case 34: // Page Down
            if (bOpen) {
              toggleHover($current, 0);
              toggleHover($items.eq(Math.min(nHoverIndex+nItemsPerPage-1, nLastIndex)), 1);
            }
            break;
          case 35: // End
            if (bOpen) {
              toggleHover($current, 0);
              toggleHover($items.eq(nLastIndex), 1);
            }
            break;
          case 36: // Home
            if (bOpen) {
              toggleHover($current, 0);
              toggleHover($items.eq(0), 1);
            }
            break;
          case 38: // Up
            if (bOpen) {
              toggleHover($current, 0);
              // If not already key-navigated or first item is selected, cycle to
              // the last item; or else select the previous item
              toggleHover(nHoverIndex ? $items.eq(nHoverIndex-1) : $items.eq(nLastIndex), 1);
            }
            break;
          case 40: // Down
            if (bOpen) {
              toggleHover($current, 0);
              // If last item is selected, cycle to the first item; or else select
              // the next item
              toggleHover(nHoverIndex===nLastIndex ? $items.eq(0) : $items.eq(nHoverIndex+1), 1);
            }
            break;
          default:
            if (bOpen) sKey = aKeys[e.which-48];
        }
        if (sKey) { // Alphanumeric key pressed
          clearTimeout(nTimer);
          $dropdown.data('keysPressed', $dropdown.data('keysPressed')===undefined ? sKey : $dropdown.data('keysPressed') + sKey);
          nTimer = setTimeout(function() {
            $dropdown.removeData('keysPressed');
            // NOTE: Windows keyboard repeat delay is 250-1000 ms. See
            // https://technet.microsoft.com/en-us/library/cc978658.aspx
          }, 300);
          // Build index of matches
          var aMatches = [],
            nCurrentIndex = $current.index();
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
      // Highlight menu item
      hoverDropdownItem = function(e) {
        var $dropdown = $(e.currentTarget);
        if (e.target.nodeName!=='LI' || !$dropdown.hasClass('active') || new Date()-$dropdown.data('lastKeypress')<200) return;
        toggleHover($dropdown.children(), 0, 1);
        toggleHover($(e.target), 1, 1);
      },
      // Construct menu item
      renderItem = function(el, sClass, bSelected, bOptGroup) {
        var sGroup = '',
          sText;
        sClass = sClass || '';
        if (el) {
          switch (el.nodeName) {
            case 'OPTION':
              if (el.parentNode.nodeName==='OPTGROUP') sGroup = el.parentNode.getAttribute('label');
              sText = el.text;
              break;
            case 'OPTGROUP':
              sClass += ' label';
              sText = el.getAttribute('label');
              break;
          }
          if (el.disabled) sClass += ' disabled';
        }
        ++nCount;
        return '<li id="item' + nTimestamp + '-' + nCount + '"'
          + (sGroup ? ' data-group="' + sGroup + '"' : '')
          + (el && el.value ? ' data-value="' + el.value + '"' : '')
          + (el && el.nodeName==='OPTION' ? ' role="option"' : '')
          + (el && el.title ? ' title="' + el.title + '" aria-label="' + el.title + '"' : '')
          + (sClass ? ' class="' + $.trim(sClass) + '"' : '')
          + ((oOptions.height!==50) ? ' style="height:' + (oOptions.height-2)
          + 'px;line-height:' + (oOptions.height-2) + 'px"' : '') + '>' + sText
          + (bSelected ? oOptions.selectedMarker : '') + '</li>';
      },
      // Reset menu state
      resetDropdown = function(o) {
        var $dropdown = $(o.currentTarget||o);
        // NOTE: Sometimes it's possible for $dropdown to point to the wrong
        // element when you quickly hover over another menu. To prevent this, we
        // need to check for .active as a backup and manually reassign $dropdown.
        // This also requires that it's not clicked on because in rare cases the
        // reassignment fails and the reverse menu will not get reset.
        if (o.type==='mouseleave' && !$dropdown.hasClass('active') && !$dropdown.data('clicked')) $dropdown = $('.prettydropdown > ul.active');
        $dropdown.data('hover', false);
        clearTimeout(nTimer);
        nTimer = setTimeout(function() {
          if ($dropdown.data('hover')) return;
          if ($dropdown.hasClass('reverse')) $dropdown.prepend($dropdown.children(':last-child'));
          $dropdown.removeClass('active reverse').removeData('clicked').attr('aria-expanded', 'false').css('height', '');
          $dropdown.children().removeClass('hover nohover');
        }, (o.type==='mouseleave' && !$dropdown.data('clicked')) ? oOptions.hoverIntent : 0);
      },
      // Set menu item hover state
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
      },
      // Update selected values for multi-select menu
      updateSelected = function($dropdown) {
        var $select = $dropdown.parent().children('select'),
          sSelected = $('option', $select).map(function() {
            if (this.selected) return this.text;
          }).get().join(oOptions.selectedDelimiter);
        if (sSelected) {
          var sTitle = ($select.attr('title') ? $select.attr('title') + '\n' : '') + 'Selected: ' + sSelected;
          $dropdown.children('.selected').text(sSelected);
          $dropdown.attr({
            'title': sTitle,
            'aria-label': sTitle
          });
        } else {
          $dropdown.children('.selected').empty();
          $dropdown.attr({
            'title': $select.attr('title'),
            'aria-label': $select.attr('title')
          });
        }
      };
    oOptions.selectedMarker = ' <span aria-hidden="true">' + oOptions.selectedMarker + '</span>';
    // Validate options
    if (isNaN(oOptions.height) || oOptions.height<8) oOptions.height = 8;
    if (isNaN(oOptions.hoverIntent) || oOptions.hoverIntent<0) oOptions.hoverIntent = 200;
    return this.each(function() {
      var $select = $(this),
        sId = this.name || this.id || '',
        sLabelId;
      if ($select.data('loaded')) return true; // Continue
      $select.css('visibility', 'hidden').outerHeight(oOptions.height);
      nTimestamp = +new Date();
      // Test whether to add 'aria-labelledby'
      if (this.id) {
        // Look for <label>
        var $label = $('label[for=' + this.id + ']');
        if ($label.length) {
          // Add 'id' to <label> if necessary
          if ($label.attr('id')) sLabelId = $label.attr('id');
          else $label.attr('id', (sLabelId = 'menu' + nTimestamp));
        }
      }
      nCount = 0;
      var $items = $('optgroup, option', $select),
        bMultiple = $select.prop('multiple'),
        nWidth = $select.outerWidth(),
        // Height - 2px for borders
        sHtml = '<ul' + (this.disabled ? '' : ' tabindex="0"') + ' role="listbox"'
          + (this.title ? ' title="' + this.title + '" aria-label="' + this.title + '"' : '')
          + (sLabelId ? ' aria-labelledby="' + sLabelId + '"' : '')
          + ' aria-activedescendant="item' + nTimestamp + '-1" aria-expanded="false"'
          + ' style="max-height:' + (oOptions.height-2) + 'px;margin:'
          // NOTE: $select.css('margin') returns an empty string in Firefox, so
          // we have to get each margin individually. See
          // https://github.com/jquery/jquery/issues/3383
          + $select.css('margin-top') + ' '
          + $select.css('margin-right') + ' '
          + $select.css('margin-bottom') + ' '
          + $select.css('margin-left') + ';">';
      if (bMultiple) {
        sHtml += renderItem(null, 'selected');
        $items.each(function() {
          if (this.selected) {
            sHtml += renderItem(this, '', true)
          } else {
            sHtml += renderItem(this);
          }
        });
      } else {
        $items.filter(':selected').each(function() {
          sHtml += renderItem(this, 'selected');
        });
        $items.filter(':not(:selected)').each(function() {
          sHtml += renderItem(this);
        });
      }
      sHtml += '</ul>';
      $select.wrap('<div ' + (sId ? 'id="prettydropdown-' + sId + '" ' : '')
        + 'class="prettydropdown ' + (this.disabled ? 'disabled ' : '') + (bMultiple ? 'multiple ' : '')
        + oOptions.customClass + ' loading"></div>').before(sHtml).data('loaded', true);
      var $dropdown = $select.parent().children('ul'),
        nWidth = $dropdown.outerWidth(true),
        nOuterWidth;
      $items = $dropdown.children();
      // Update default selected values for multi-select menu
      if (bMultiple) updateSelected($dropdown);
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
      $items.width(nWidth).css('width', $items.css('width')).click(function() {
        var $li = $(this);
        // Ignore disabled menu or menu item
        if ($dropdown.parent().hasClass('disabled') || $li.hasClass('disabled') || $li.hasClass('label')) return;
        // Only update if different value selected
        if ($dropdown.hasClass('active') && $(this).data('value')!==$dropdown.children('.selected').data('value')) {
          // Select highlighted item
          if ($select.prop('multiple')) {
            if ($li.children('span').length) $li.children('span').remove();
            else $li.append(oOptions.selectedMarker);
            // Sync <select> element
            $dropdown.children(':not(.selected)').each(function(nIndex) {
              $('optgroup, option', $select).eq(nIndex).prop('selected', $(this).children('span').length>0);
            });
            // Update selected values for multi-select menu
            updateSelected($dropdown);
          } else {
            var $selected = $dropdown.children('.selected');
            $selected.removeClass('selected');
            $dropdown.prepend($li.addClass('selected')).removeClass('reverse').attr('aria-activedescendant', $li.attr('id'));
            if ($selected.data('group')) $dropdown.children('.label').filter(function() {
              return $(this).text()===$selected.data('group');
            }).after($selected);
            // Sync <select> element
            $('optgroup, option', $select).filter(function() {
              return (this.value===$li.data('value') || this.text===$li.text());
            }).prop('selected', true);
          }
          $select.trigger('change');
        }
        if ($li.hasClass('selected') || !bMultiple || !$dropdown.hasClass('active')) {
          $dropdown.toggleClass('active');
          $dropdown.attr('aria-expanded', $dropdown.hasClass('active'));
        }
        // Try to keep drop-down menu within viewport
        if ($dropdown.hasClass('active')) {
          // Ensure the selected item is in view
          $dropdown.scrollTop(0);
          // Close any other open menus
          if ($('.prettydropdown > ul.active').length>1) resetDropdown($('.prettydropdown > ul.active').not($dropdown)[0]);
          var nWinHeight = window.innerHeight,
            nOffsetTop = $dropdown.offset().top,
            nScrollTop = document.body.scrollTop,
            nDropdownHeight = $dropdown.outerHeight(),
            nDropdownBottom = nOffsetTop-nScrollTop+nDropdownHeight;
          if (nDropdownBottom>nWinHeight) {
            // Expand to direction that has the most space
            if (nOffsetTop-nScrollTop>nWinHeight-(nOffsetTop-nScrollTop+oOptions.height)) {
              $dropdown.addClass('reverse').append($dropdown.children('.selected'));
              if (nOffsetTop-nScrollTop+oOptions.height<nDropdownHeight) {
                $dropdown.outerHeight(nOffsetTop-nScrollTop+oOptions.height);
                $dropdown.scrollTop(nDropdownHeight);
              }
            } else {
              $dropdown.height($dropdown.height()-(nDropdownBottom-nWinHeight));
            }
          }
        } else {
          $dropdown.data('clicked', true);
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
      // Put focus on menu when user clicks on label
      if (sLabelId) $('#' + sLabelId).click(function() {
        $dropdown.focus();
      });
      // Done with everything!
      $dropdown.parent().width(nOuterWidth||$dropdown.outerWidth(true)).removeClass('loading');
    });
  };
}(jQuery));
