/*!
 * jQuery Pretty Dropdowns Plugin v1.0.2 by T. H. Doan (http://thdoan.github.io/pretty-dropdowns/)
 *
 * jQuery Pretty Dropdowns by T. H. Doan is licensed under the MIT License.
 * Read a copy of the license in the LICENSE file or at
 * http://choosealicense.com/licenses/mit
 */

(function($) {
  $.fn.prettyDropdown = function() {
    return this.each(function() {
      var $this = $(this);
      if ($this.data('loaded') || $this.hasClass('plain')) return true; // Continue
      // NOTE: $this.css('margin') returns empty string in Firefox.
      // See https://github.com/jquery/jquery/issues/3383
      var nWidth = $this.outerWidth(),
        nMarginL = $this.css('margin-left'),
        nMarginR = $this.css('margin-right'),
        sHtml = '<ul' + ($this.attr('title')?' title="'+$this.attr('title')+'"':'') + ' style="margin:'
          + $this.css('margin-top') + ' '
          + nMarginR + ' '
          + $this.css('margin-bottom') + ' '
          + nMarginL + ';">',
        resetDropdown = function(o) {
          var $dropdown = $(o.currentTarget||o);
          if ($dropdown.hasClass('reverse')) $dropdown.prepend($('li:last-child', $dropdown));
          $dropdown.removeClass('active reverse').css('height', '');
        };
      $('option:selected', $this).each(function() {
        sHtml += '<li class="chevron" data-value="' + this.value + '">' + this.text + '</li>';
      });
      $('option:not(:selected)', $this).each(function() {
        sHtml += '<li data-value="' + this.value + '">' + this.text + '</li>';
      });
      sHtml += '</ul>';
      $this.css('visibility', 'hidden').wrap('<div class="prettydropdown loading"></div>').before(sHtml).data('loaded', true);
      var $dropdown = $('ul', $this.parent()),
        nWidth = $dropdown.width();
      // Calculate width if initially hidden
      if (!nWidth) {
        var $clone = $dropdown.parent().clone().css({
            position: 'absolute',
            top: '-100%'
          });
        $('body').append($clone);
        nWidth = $('ul', $clone).width();
        $clone.remove();
      }
      // Set dropdown width and event handler
      $('li', $dropdown).width(nWidth).click(function() {
        var $li = $(this);
        // Only update if different value selected
        if ($dropdown.hasClass('active') && $li.data('value')!==$('li.chevron', $dropdown).data('value')) {
          $('.chevron', $dropdown).removeClass('chevron');
          $dropdown.prepend($li.addClass('chevron')).removeClass('reverse');
          // Sync <select> element
          $('option[value="' + $li.data('value') +'"]', $this).prop('selected', true);
          $this.trigger('change');
        }
        $dropdown.toggleClass('active');
        // Try to keep drop-down menu within viewport
        if ($dropdown.hasClass('active')) {
          var nWinHeight = window.innerHeight,
            nOffsetTop = $dropdown.offset().top,
            nScrollTop = document.body.scrollTop,
            nDropdownHeight = $dropdown.outerHeight(),
            nDropdownBottom = nOffsetTop + nDropdownHeight - nScrollTop;
          if (nDropdownBottom>nWinHeight) {
            if (nOffsetTop-nScrollTop>=nDropdownHeight-50) $dropdown.addClass('reverse').append($('li.chevron', $dropdown));
            else $dropdown.height($dropdown.height()-(nDropdownBottom-nWinHeight));
          }
        } else {
          resetDropdown($dropdown[0]);
        }
      });
      $dropdown.on('mouseleave', resetDropdown);
      $dropdown.parent().width($('li', $dropdown).outerWidth()+parseFloat(nMarginL)+parseFloat(nMarginR)+2).removeClass('loading');
    });
  };
}(jQuery));
