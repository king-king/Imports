/**
 * Created by WQ on 2015/6/24.
 */
Package( function () {
    var loopArray = imports( "util.js" ).loopArray;
    var img = [
        "img/1.jpg",
        "img/2.jpg",
        "img/3.jpg"
    ];

    loopArray( img, function ( src ) {
        var div = document.createElement( "div" );
        div.innerHTML = src;
        document.body.appendChild( div );
    } );
} );