(function ( $ ) {
    var PLUGIN_IDENTIFIER = 'ytLoad';
    var settings;
    var ajaxError;
    var barProgress;


    function injectProgressBar() {
        var $progressBar = $('#'+settings.progressBarId);

        if ($progressBar.length == 0) {
            $('body').append('<div id="'+settings.progressBarId+'" class="'+settings.progressBarId+'"><dt></dt><dd></dd></div>');
            $progressBar = $('#'+settings.progressBarId);
        }

        return $progressBar;
    }

    function getProgress() {
        return barProgress;
    }

    function setProgress(progress, duration, finished) {
        var $progressBar = injectProgressBar();
        if(!duration) {
            duration = (progress - barProgress) * settings.durationSeed;
        }
        barProgress = progress;
        var width = (101 / 100) * progress;
        width = Math.round(width * 100) / 100;

        // TODO: Is this a jquery.transit bug? Research error cause further and fill out proper bug report.
        var doubleCompletePrevention = false;

        $progressBar.transit({
            width: width+'%',
            duration: duration,
            complete: function() {
                if(doubleCompletePrevention) {
                    if(width > 99) {
                        $progressBar.delay(settings.fadeDelay);
                        $progressBar.fadeOut({
                            duration: settings.fadeDuration,
                            complete: function() {
                                $progressBar.remove();
                            }
                        });
                        settings.onComplete();
                    }
                    if(finished) {
                        finished();
                    }
                } else {
                    doubleCompletePrevention = true;
                }
            }
        });
    }

    var methods = {
        init: function(options) {
            ajaxError = false;
            progress = 0;

            settings = $.extend({
                registerAjaxHandlers: true,
                startPercentage: 30,
                startDuration: 200,
                completeDuration: 50,
                fadeDelay: 200,
                fadeDuration: 200,
                progressBarId: PLUGIN_IDENTIFIER,
                durationSeed: 8,
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

        progress: function(progress, duration, finished) {
            if(!progress) {
                return getProgress();
            } else {
                setProgress(progress, duration, finished);
            }
        },

        start: function() {
            var $progressBar = injectProgressBar();
            ajaxError = false;

            methods.progress(settings.startPercentage, settings.startDuration);
            settings.onStart();
        },

        complete: function() {
            var $progressBar = injectProgressBar();
            methods.progress(100, settings.completeDuration);
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