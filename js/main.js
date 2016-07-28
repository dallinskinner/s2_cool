$(document).ready(function(){
    
    function initHome() {
        var $body = $('body');
        var $homeNav = $('#home-nav');
        var $homeNavList = $homeNav.children('ul');
        var content = $homeNavList.html();

        for (var i = 0; i < 30; i++) {
            $homeNavList.append(content);
        }

        var className;

        $homeNav.find('a').hover(function(){
            className = $(this).attr('class');
            $('.'+className).addClass('hover');

            $body.addClass(className+'-color');

        }, function(){
            $body.removeClass(className+'-color');
            $('.'+className).removeClass('hover');
        });
    }
    
    function initSoundCloud() {
        
        var audioPlayers = {};
        
        var $scIframes = $('.sc-widget');
        
        $scIframes.each(function(){
            
            var $wavebars;
            
            var $audioPlayer = $(this).next();
            
            var widget = SC.Widget(this);
            audioPlayers[$audioPlayer.attr('id')] = widget;
            
            widget.bind(SC.Widget.Events.READY, function() {
                widget.getCurrentSound(function(data){
                    $audioPlayer.find('.track-name').html(data.user.full_name+' &mdash; '+data.title);
                    $audioPlayer.find('.reposts').append(' '+data.reposts_count);
                    $audioPlayer.find('.comments').append(' '+data.comment_count);
                    $audioPlayer.find('.plays').append(' '+data.playback_count);
                    
                    $.get(data.waveform_url, function(waveformData) {
                        var processed = processWaveform(waveformData);
                        buildWaveForm(processed, $audioPlayer);
                        $wavebars = $audioPlayer.find('.wavebar');
                    });
                });
            });
            
            widget.bind(SC.Widget.Events.PLAY_PROGRESS, function(data) {
                
                var progress = data.relativePosition * 65;
                
                $wavebars.slice(0, progress).each(function(){
                    $(this).css('opacity', 1);
                });
            });
            
            widget.bind(SC.Widget.Events.FINISH, function(data) {
                widget.seekTo(0);
                widget.pause();
                $audioPlayer.removeClass('playing');
            })
        });
        
        $('.play-button').click(scPlay);
        $('.pause-button').click(scPause);
        
        function scPlay() {
            var $audioPlayer = $(this).closest('.audio-player');
            
            $audioPlayer.find('.wavebar').css('opacity', '.5');
            
            var widget = audioPlayers[$audioPlayer.attr('id')];
            
            widget.play();
            
            $audioPlayer.addClass('playing');
        }
        
        function scPause() {
            var $audioPlayer = $(this).closest('.audio-player');
            
            var widget = audioPlayers[$audioPlayer.attr('id')];
            
            widget.pause();
            
            $audioPlayer.removeClass('playing');
        }
        
        function processWaveform(data) {
            var width = data.width;
            var height = data.height;
            var samples = data.samples;
            
            var targetWidth = 65;
            
            var chunkSize = width / targetWidth;
            
            var averagedSamples = [];
            
            var chunkTotal = 0;
            var chunkIndex = 0;
            for (var sampleIndex = 0; sampleIndex < samples.length; sampleIndex++) {
                
                var sample = samples[sampleIndex];
                
                chunkTotal += sample;
                chunkIndex++;
                
                if (chunkIndex > chunkSize) {
                    averagedSamples.push((chunkTotal / chunkSize) / height);
                    chunkTotal = 0;
                    chunkIndex = 0;
                }
                
            }
        
            return averagedSamples;
        }
        
        function buildWaveForm(data, $audioPlayer) {
            var $waveform = $audioPlayer.find('.waveform');
            
            for (var i=0; i < data.length; i++) {
                $waveform.append('<div class="wavebar" style="height: '+(data[i]*100)+'% "></div>')
            }
        }
    }
    
    
    
    initHome();
    initSoundCloud();
});