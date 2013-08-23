(function ( $ ) {
    var PLUGIN_IDENTIFIER = 'ytLoad';

    var methods = {
        init: function(options) {
            var settings = $.extend({
                startPercentage: 30,
                startDuration: 200,
                completeDuration: 50,
                fadeDelay: 200,
                fadeDuration: 200,
                progressBarId: PLUGIN_IDENTIFIER
            }, options);

            $progressBar = null;

            $(document).on('ajaxStart.'+PLUGIN_IDENTIFIER, function() {
                $progressBar = $('#'+settings.progressBarId);
                if ($progressBar.length == 0) {
                    $('body').append('<div id="'+settings.progressBarId+'" class="'+settings.progressBarId+'"><dt></dt><dd></dd></div>');
                    $progressBar = $('#'+settings.progressBarId);
                }

                $progressBar.transit({
                   width: settings.startPercentage+'%'
                }, settings.startDuration);
            });

            $(document).on('ajaxComplete.'+PLUGIN_IDENTIFIER, function() {
                $progressBar.transit({
                    width: '101%',
                    complete: function() {
                        $progressBar.delay(settings.fadeDelay);
                        $progressBar.fadeOut({
                          complete: function() {
                              $progressBar.remove();
                          }
                        }, settings.fadeDuration);
                    }
                }, settings.completeDuration);
            });
        },

        destroy: function() {
            $(document).off('ajaxStart.'+PLUGIN_IDENTIFIER);
            $(document).off('ajaxComplete.'+PLUGIN_IDENTIFIER);
        }
    };

    $.ytLoad = function(methodOrOptions) {
        if ( methods[methodOrOptions] ) {
            return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.'+PLUGIN_IDENTIFIER );
        }
    };
}( jQuery ));