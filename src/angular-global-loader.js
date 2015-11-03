'use strict';

/**
 * @ngdoc overview
 * @name fradinni.angular-global-loader
 * @description
 * Angular global loader
 */
angular.module('fradinni.angular-global-loader', []);

/**
 * @ngdoc service
 * @name fradinni.angular-global-loader.service:AngularGlobalLoader
 * @description Angular global loader service.
 */
angular.module('fradinni.angular-global-loader').service('AngularGlobalLoader', function($rootScope, $timeout) {

  // Loader events
  this.Events = new (function() {
    this.EVENT_OPEN = 'fradinni.angularGlobalLoader.open';
    this.EVENT_CLOSE = 'fradinni.angularGlobalLoader.close';
    this.EVENT_ON_OPENED = 'fradinni.angularGlobalLoader.opened';
    this.EVENT_ON_CLOSED = 'fradinni.angularGlobalLoader.closed';
    this.EVENT_UPDATE_PROGRESS = 'fradinni.angularGlobalLoader.updateProgress';
  })();

  this.show = function(options) {
    var self = this;
    $timeout(function() {
      $rootScope.$broadcast(self.Events.EVENT_OPEN, options);
    });
  };

  this.hide = function() {
    var self = this;
    $timeout(function() {
      $rootScope.$broadcast(self.Events.EVENT_CLOSE, {});
    }, 300);
  };

  this.updateProgress = function(progress) {
    $rootScope.$broadcast(this.Events.EVENT_UPDATE_PROGRESS, progress);
  };
});

/**
 * @ngdoc directive
 * @name fradinni.angular-global-loader.directive:globalLoader
 * @description Angular global loader directive.
 */
angular.module('fradinni.angular-global-loader').directive('angularGlobalLoader',
function($rootScope, $timeout, AngularGlobalLoader) {

  function show(element, fade, fadeDelay) {
    element.css('display', 'block');
    $timeout(function() {
      element.addClass('opened');
      $timeout(function() {
        $rootScope.$broadcast(AngularGlobalLoader.Events.EVENT_ON_OPENED);
      }, fade ? fadeDelay + 50 : 30);
    }, 50);
  }

  function hide(element, fade, fadeDelay) {
    element.removeClass('opened');
    $timeout(function() {
      element.css('display', 'none');
      $rootScope.$broadcast(AngularGlobalLoader.Events.EVENT_ON_CLOSED);
    }, fade ? fadeDelay + 50 : 30);
  }

  function updateProgress(progress, colorProgressLimit, color1, color2) {
    if (progress > 100) {
      progress = 100;
    }
    colorProgressLimit = colorProgressLimit || 50;
    var progressbar = document.getElementById('angular-global-loader-content-progressbar');
    var totalWidth = progressbar.offsetWidth - 8;
    var width = Math.floor((progress * totalWidth) / 100);
    if (width > totalWidth) {
      width = totalWidth;
    }
    var progressLine = document.getElementById('angular-global-loader-content-progressbar-progress');
    angular.element(progressLine).css('width', width + 'px');

    var percentage = document.getElementById('angular-global-loader-content-progressbar-percentage');
    if (progress > colorProgressLimit) {
      angular.element(percentage).css('color', color2 || 'black');
    } else {
      angular.element(percentage).css('color', color1 || 'white');
    }
  }

  /**
   * Initialize directive
   */
  function init(scope, element) {

    var container = angular.element(document.getElementById('angular-global-loader'));

    // Initialize options
    var defaultOptions = {
      fade: false,
      fadeDelay: 400,
      autoShow: false,
      backgroundImage: {
        url: null,  // Background image url
        blur: 10    // Blur in px
      },
      overlay: {
        color: 'rgba(0,0,0,0.85)'
      },
      label: {
        visible: true,
        text: 'Loading...',
        color: 'white'
      },
      progressBar: {
        height: 25,
        color: 'white',
        borderSize: 4,
        roundCorners: false,
        roundCornersSize: 0,
        progressColor: 'white',
        percentage: {
          visible: true,
          color1: 'white',
          color2: 'black',
          colorPercentLimit: 50,
          fontSize: '1em',
          fontWeight: 'normal',
          textAlign: 'center'
        }
      }
    };
    scope.options = scope.options || {};
    scope.options = angular.merge(defaultOptions, scope.options);

    // Init variables
    scope.text = null;
    scope.percentage = 0;

    //
    // Background image settings
    //
    if (scope.options.backgroundImage.url) {
      // Append bg image
      var image = angular.element(document.getElementById('angular-global-loader-bg-image'));
      image.attr('src', scope.options.backgroundImage.url);
      container.prepend(image);

      // Style image
      image.css('filter', 'blur(' + scope.options.backgroundImage.blur + 'px)');
      image.css('-o-filter', 'blur(' + scope.options.backgroundImage.blur + 'px)');
      image.css('-moz-filter', 'blur(' + scope.options.backgroundImage.blur + 'px)');
      image.css('-webkit-filter', 'blur(' + scope.options.backgroundImage.blur + 'px)');
      image.css('width', '100%');
      image.css('height', '100%');
    }

    //
    // Overlay settings
    //
    if (scope.options.overlay.color) {
      // Set overlay color
      var overlay = angular.element(document.getElementById('angular-global-loader-overlay'));
      overlay.css('background-color', scope.options.overlay.color);
    }

    //
    // Label settings
    //
    if (scope.options.label) {
      var labelOpt = scope.options.label;
      var label = angular.element(document.getElementById('angular-global-loader-content-label'));
      var content = angular.element(document.getElementById('angular-global-loader-content'));
      // Set label text
      if (labelOpt.text) {
        scope.text = labelOpt.text;
      }
      // Set label color
      if (labelOpt.color) {
        label.css('color', labelOpt.color);
      }
      // Set label visibility
      if (labelOpt.visible === true) {
        label.css('display', 'block');
        content.css('margin-top', '-92px');
      } else {
        label.css('display', 'none');
        content.css('margin-top', '-36px');
      }
    }

    //
    // Progress bar settings
    //
    if (scope.options.progressBar) {
      var pBarOpt = scope.options.progressBar;
      var pBar = angular.element(document.getElementById('angular-global-loader-content-progressbar'));
      var pBarProgress = angular.element(document.getElementById('angular-global-loader-content-progressbar-progress'));

      // Progress bar border style
      pBar.css('border', pBarOpt.borderSize + 'px solid ' + pBarOpt.color);

      if (pBarOpt.height) {
        pBar.css('height', pBarOpt.height + 'px');
        pBarProgress.css('height', pBarOpt.height + 'px');
      }

      // Progress bar round corners
      if (pBarOpt.roundCorners === true) {
        var radius = (pBarOpt.roundCornersSize || 0);
        pBar.css('border-radius', radius + 'px');
        pBarProgress.css('border-radius', ((radius > 0 && radius < 15) ? (radius * 0.6) : radius) + 'px');
      } else {
        pBar.css('border-radius', '0');
        pBarProgress.css('border-radius', '0');
      }

      if (pBarOpt.roundCornersSize) {

      }

      // Progress color
      if (pBarOpt.progressColor) {
        pBarProgress.css('background-color', pBarOpt.progressColor);
      }

      // Percentage settings
      if (pBarOpt.percentage) {
        var percentageOpt = pBarOpt.percentage;
        var percentage = angular.element(document.getElementById('angular-global-loader-content-progressbar-percentage'));

        // Percentage visibility
        if (percentageOpt.visible === true) {
          percentage.css('display', 'block');
        } else {
          percentage.css('display', 'none');
        }
        // Percentage color
        if (percentageOpt.color) {
          percentageOpt.color1 = percentageOpt.color2 = percentageOpt.color;
        }
        // Percentage font weight
        if (percentageOpt.fontWeight) {
          percentage.css('font-weight', percentageOpt.fontWeight);
        }
        // Percentage font size
        if (percentageOpt.fontSize) {
          percentage.css('font-size', percentageOpt.fontSize);
        }
        // Percentage text align
        if (percentageOpt.textAlign) {
          percentage.css('text-align', percentageOpt.textAlign);
        }
        percentage.css('color', percentageOpt.color1);
      }
    }

    if (scope.options.fade) {

      scope.options.fadeDelay = scope.options.fadeDelay || 300;

      var addTransition = function(element, enable, prop, delay, ease) {
        if (enable === true) {
          element.css('opacity', '0');
          element.css('transition', prop + ' ' + (delay/1000) + 's ' + ease);
          element.css('-o-transition', prop + ' ' + (delay/1000) + 's ' + ease);
          element.css('-moz-transition', prop + ' ' + (delay/1000) + 's ' + ease);
          element.css('-webkit-transition', prop + ' ' + (delay/1000) + 's ' + ease);
        } else {
          element.css('opacity', '1');
          element.css('transition', null);
          element.css('-o-transition', null);
          element.css('-moz-transition', null);
          element.css('-webkit-transition', null);
        }
      }

      // Get element that can fade
      var bgImg = angular.element(document.getElementById('angular-global-loader-bg-image'));
      var overlay = angular.element(document.getElementById('angular-global-loader-overlay'));
      var content = angular.element(document.getElementById('angular-global-loader-content'));

      // Set transition on these elements
      addTransition(bgImg, scope.options.fade, 'opacity', scope.options.fadeDelay/2, 'linear');
      addTransition(overlay, scope.options.fade, 'opacity', scope.options.fadeDelay, 'linear');
      addTransition(content, scope.options.fade, 'opacity', scope.options.fadeDelay, 'linear');
    }


    // Auto show loader
    if (scope.options.autoShow === true) {
      show(element, scope.options.fadeDelay);
    }
  }

  /**
   * Link directive
   */
  function link(scope, element, attrs) {

    // Initialize directive
    init(scope, element);

    // Open loader event
    scope.$on(AngularGlobalLoader.Events.EVENT_OPEN, function(event, data) {
      if (data) {
        scope.options = data;
        init(scope, element);
      }
      show(element, scope.options.fade, scope.options.fadeDelay);
    });

    // Close loader event
    scope.$on(AngularGlobalLoader.Events.EVENT_CLOSE, function() {
      hide(element, scope.options.fade, scope.options.fadeDelay);
      scope.options = null;
    });

    // Update loader event
    scope.$on(AngularGlobalLoader.Events.EVENT_UPDATE_PROGRESS, function(event, progress) {
      scope.percentage = progress;
      var percentageOpt = scope.options.progressBar.percentage;
      updateProgress(progress, percentageOpt.colorPercentLimit, percentageOpt.color1, percentageOpt.color2);
    });

  }

  return {
    restrict: 'AEC',
    templateUrl: 'fradinni/angular-global-loader/angular-global-loader.html',
    link: link,
    scope: {
      options: '='
    }
  }
});
