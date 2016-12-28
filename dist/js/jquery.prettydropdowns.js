/*!
 * jQuery Pretty Dropdowns Plugin v2.0.0 by T. H. Doan (http://thdoan.github.io/pretty-dropdowns/)
 *
 * jQuery Pretty Dropdowns by T. H. Doan is licensed under the MIT License.
 * Read a copy of the license in the LICENSE file or at
 * http://choosealicense.com/licenses/mit
 */

(function($) {
  $.fn.prettyDropdown = function(oOptions) {
    var resetDropdown = function(o) {
        var $dropdown = $(o.currentTarget||o);
        if ($dropdown.hasClass('reverse')) $dropdown.prepend($('li:last-child', $dropdown));
        $dropdown.removeClass('active reverse').css('height', '');
      };
    // Default options
    oOptions = $.extend({
      arrowStyle: 'chevron',
      height: 50
    }, oOptions);
    // Validate height; enforce minimum height
    if (isNaN(oOptions.height) || oOptions.height<8) oOptions.height = 8;
    return this.each(function() {
      var $this = $(this);
      if ($this.data('loaded')) return true; // Continue
      $this.outerHeight(oOptions.height);
      // NOTE: $this.css('margin') returns empty string in Firefox.
      // See https://github.com/jquery/jquery/issues/3383
      var nWidth = $this.outerWidth(),
        sHtml = '<ul' + ($this.attr('title')?' title="'+$this.attr('title')+'"':'') + ' style="margin:'
          + $this.css('margin-top') + ' '
          + $this.css('margin-right') + ' '
          + $this.css('margin-bottom') + ' '
          + $this.css('margin-left') + ';">',
        sStyle = (oOptions.height!==50) ? ' style="height:' + (oOptions.height-2) + 'px;line-height:' + (oOptions.height-2) + 'px"' : '';
      $('option:selected', $this).each(function() {
        sHtml += '<li data-value="' + this.value + '" class="selected"' + sStyle + '>' + this.text + '</li>';
      });
      $('option:not(:selected)', $this).each(function() {
        sHtml += '<li data-value="' + this.value + '"' + sStyle + '>' + this.text + '</li>';
      });
      sHtml += '</ul>';
      $this.css('visibility', 'hidden').wrap('<div class="prettydropdown' + (oOptions.arrowStyle?' '+oOptions.arrowStyle:'') + ' loading"></div>').before(sHtml).data('loaded', true);
      var $dropdown = $('ul', $this.parent()),
        nWidth = $dropdown.outerWidth(true),
        nOuterWidth;
      // Calculate width if initially hidden
      if ($dropdown.width()<=0) {
        var $clone = $dropdown.parent().clone().css({
            position: 'absolute',
            top: '-100%'
          });
        $('body').append($clone);
        nWidth = $('ul', $clone).outerWidth(true);
        $('li', $clone).width(nWidth);
        nOuterWidth = $('ul', $clone).outerWidth(true);
        $clone.remove();
      }
      // Set dropdown width and event handler
      $('li', $dropdown).width(nWidth).click(function() {
        var $li = $(this);
        // Only update if different value selected
        if ($dropdown.hasClass('active') && $li.data('value')!==$('li.selected', $dropdown).data('value')) {
          $('.selected', $dropdown).removeClass('selected');
          $dropdown.prepend($li.addClass('selected')).removeClass('reverse');
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
            if (nOffsetTop-nScrollTop>=nDropdownHeight-oOptions.height) $dropdown.addClass('reverse').append($('li.selected', $dropdown));
            else $dropdown.height($dropdown.height()-(nDropdownBottom-nWinHeight));
          }
        } else {
          resetDropdown($dropdown[0]);
        }
      });
      $dropdown.on('mouseleave', resetDropdown);
      $dropdown.parent().width(nOuterWidth||$dropdown.outerWidth(true)).removeClass('loading');
    });
  };
}(jQuery));
