/**
 * Created by WQ on 2015/6/23.
 */
Package( function () {
    var loopArray = imports( "util.js" ).loopArray;
    var img = [
        "img/1.jpg",
        "img/2.jpg",
        "img/3.jpg"
    ];

    loopArray( img, function ( src ) {
        var image = new Image();
        image.src = src;
        document.body.appendChild( image );
    } );

} );