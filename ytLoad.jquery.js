(function ( $ ) {
    var PLUGIN_IDENTIFIER = 'ytLoad';
    var settings;
    var ajaxError;

    function injectProgressBar() {
        var $progressBar = $('#'+settings.progressBarId);

        if ($progressBar.length == 0) {
            $('body').append('<div id="'+settings.progressBarId+'" class="'+settings.progressBarId+'"><dt></dt><dd></dd></div>');
            $progressBar = $('#'+settings.progressBarId);
        }

        return $progressBar;
    }

    function completeProgressBar() {
        var $progressBar = $('#'+settings.progressBarId);

        $progressBar.remove();
        settings.onComplete();
    }

    var methods = {
        init: function(options) {
            ajaxError = false;

            settings = $.extend({
                registerAjaxHandlers: true,
                startPercentage: 30,
                startDuration: null,
                completeDuration: 100,
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
            var $progressBar = injectProgressBar();
            ajaxError = false;

            methods.setProgress(settings.startPercentage, settings.startDuration);
            settings.onStart();
        },

        complete: function() {
            var $progressBar = injectProgressBar();
            methods.setProgress(100, settings.completeDuration, function() {
                $progressBar.delay(settings.fadeDelay);
                $progressBar.fadeOut({
                    duration: settings.fadeDuration
                });
            });
        },

        setProgress: function(progress, duration, finished) {
            var $progressBar = injectProgressBar();
            if(!duration) {
                duration = progress * 5;
            }
            var width = (101 / 100) * progress;
            width = Math.round(width * 100) / 100;

            if(width > 99) {
                // TODO: Bug in jquery.transit? Further research needed to submit bug report.
                var doubleCompleteHack = false;
            }

            $progressBar.transit({
                width: width+'%',
                duration: duration,
                complete: function() {
                    if(width > 99) {
                        if(doubleCompleteHack == true) {
                            completeProgressBar();
                        }
                        doubleCompleteHack = true;
                    }
                    if(finished) {
                        finished();
                    }
                }
            });
        },

        error: function() {
            var $progressBar = $('#'+settings.progressBarId);
            $progressBar.addClass('error');

            settings.onError();
        },

        destroy: function() {
            if(settings.registerAjaxHandlers) {
                $(document).off('ajaxStart.'+PLUGIN_IDENTIFIER);
                $(document).off('ajaxComplete.'+PLUGIN_IDENTIFIER);
                $(document).off('ajaxError.'+PLUGIN_IDENTIFIER);
            }
            var $progressBar = $('#'+settings.progressBarId);

            if ($progressBar.length != 0) {
                $progressBar.remove();
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