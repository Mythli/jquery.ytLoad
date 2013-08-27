(function ( $ ) {
    var PLUGIN_IDENTIFIER = 'ytLoad';
    var settings;
    var ajaxError;

    function injectProgressBar() {
        $progressBar = $('#'+settings.progressBarId);

        if ($progressBar.length == 0) {
            $('body').append('<div id="'+settings.progressBarId+'" class="'+settings.progressBarId+'"><dt></dt><dd></dd></div>');
            $progressBar = $('#'+settings.progressBarId);
        }

        return $progressBar;
    }

    function completeProgressBar() {
        settings.onComplete();
        $progressBar.remove();
    }

    var methods = {
        init: function(options) {
            ajaxError = false;

            settings = $.extend({
                registerAjaxHandlers: true,
                startPercentage: 30,
                startDuration: 200,
                completeDuration: 50,
                fadeDelay: 200,
                fadeDuration: 200,
                progressBarId: PLUGIN_IDENTIFIER,
                onStart: function() { },
                onComplete: function() { },
                onError: function() { }
            }, options);

            if(settings.registerAjaxHandlers) {
                $(document).on('ajaxStart.'+PLUGIN_IDENTIFIER, function() {
                    methods.start();
                });

                $(document).on('ajaxComplete.'+PLUGIN_IDENTIFIER, function() {
                    if($.active < 2) {
                        methods.complete();
                    }
                });

                $(document).on('ajaxError.'+PLUGIN_IDENTIFIER, function() {
                    methods.error();
                });
            }
        },

        start: function() {
            $progressBar = injectProgressBar();
            ajaxError = false;

            $progressBar.transit({
                width: settings.startPercentage+'%'
            }, settings.startDuration);

            settings.onStart();
        },

        complete: function() {
            $progressBar = injectProgressBar();
            methods.setProgress(100, settings.completeDuration, function() {
                $progressBar.delay(settings.fadeDelay);
                $progressBar.fadeOut({
                    duration: settings.fadeDuration,
                    complete: function() {
                        completeProgressBar();
                    }
                });
            });
        },

        setProgress: function(progress, duration, finished) {
            $progressBar = injectProgressBar();
            if(!duration) {
                duration = progress * 5;
            }
            var width = (101 / 100) * progress;
            width = Math.round(width * 100) / 100;

            $progressBar.transit({
                width: width+'%',
                complete: function() {
                    if(finished) {
                        finished();
                    }
                }
            }, duration);
        },

        error: function() {
            $progressBar = $('#'+settings.progressBarId);
            $progressBar.addClass('error');

            settings.onError();
        },

        destroy: function() {
            if(settings.registerAjaxHandlers) {
                $(document).off('ajaxStart.'+PLUGIN_IDENTIFIER);
                $(document).off('ajaxComplete.'+PLUGIN_IDENTIFIER);
                $(document).off('ajaxError.'+PLUGIN_IDENTIFIER);
            }
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