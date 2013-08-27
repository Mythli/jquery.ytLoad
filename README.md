jquery.ytLoad
=============

A youtube inspired, simple, lightweight jQuery plugin to visualize ajax progress.

[Try it out now!](http://ytload.mythli.net)

## Installation

Include the default stylesheet:
```html
<link href="ytLoad.jquery.css" rel="stylesheet" type="text/css">
```

Include [jquery.transit](http://ricostacruz.com/jquery.transit/) (for smooth CSS3 transitions) and the script *after* jQuery (unless you are packaging scripts somehow else):
```html
<script src="/path/to/jquery.transit.js"></script>
<script src="/path/to/jquery.ytLoad.js"></script>
```

**Do not include the script directly from GitHub (http://raw.github.com/...).** The file is being served as text/plain and as such being blocked
in Internet Explorer on Windows 7 for instance (because of the wrong MIME type). Bottom line: GitHub is not a CDN.

## Features

- Developer friendly - Extensible through callbacks to make anything possible
- Designer friendly - Use *your* CSS for Layout and Styling
- Translator/i18n friendly - No hardcoded English strings

## Usage

1.  **Initialize ytLoad.**  ytLoad has to be called once before it can be used ``$.ytLoad()``.

2.  **Trigger ytLoad.** ytLoad is automatically triggered on ajax calls ``$.load('ajax.html')`` or can be triggered manually ``$.ytLoad('show')``.

For examples see the [demo](https://github.com/Mythli/jquery.ytload/blob/master/index.html) source code.

## Reference

### Parameters

**registerAjaxHandlers** *= true*  
Boolean. If true progress of ajax requests is automatically visualized in the loading bar. 

**startPercentage** *= 30*  
Number. Sets how much progress is displayed as accomplished for starting ajax calls.  

**startDuration** *= 200*  
Number. Sets how much time it should take to show the first progress push.  

**completeDuration** *= 50*  
Number. Sets how much time it should take to show the remaining 70 percent after the ajax call is completed.  

**fadeDelay** *= 200*  
Number. Sets how long the loading bar should be shown after it reached 100 percent.  

**fadeDuration** *= 200*  
Number. Sets how much time it should take to fade the loading bar.

### Functions

**start** ``$.ytLoad('start');``  
Shows the loading bar and starts the first progress push.  

**complete** ``$.ytLoad('complete');``   
Starts the remaining progress push and hides the loading bar.  

**error** ``$.ytLoad('error');``  
Applies error style to the loading bar.

**destroy** ``$.ytLoad('destroy');``   
Destroys everything associated with the plugin (state, registered event listeners).  

### Callbacks

**onStart**  *function(overlay)*  
Called when the loading bar is shown.  

**onComplete**  *function(overlay)*  
Called when the loading bar finished progress visualization.  

**onError**  *function(overlay)*  
Called when the loading bar enters error state(failed ajax calls, manual call).
