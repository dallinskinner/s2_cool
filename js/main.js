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
            
            var $audioPlayer = $(this).next();
            
            var widget = SC.Widget(this);
            audioPlayers[$audioPlayer.attr('id')] = widget;
        });
        
        $('.play-button').click(function(){
            
            var $audioPlayer = $(this).parent();
            
            var widget = audioPlayers[$audioPlayer.attr('id')];
            
            widget.play();
            widget.getCurrentSound(function(data){
                console.log(data);
            });
        });
    }
    
    
    
    initHome();
    initSoundCloud();
});