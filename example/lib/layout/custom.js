/**
 * Created by WQ on 2015/6/23.
 */
//console.log( "download custom" );
Package( function ( exports ) {
    console.log( "execute custom" );

    function say() {
        console.log( "hello" )
    }

    function see() {
        console.log( "i see" )
    }

    exports.say = say;
    exports.see = see;

} );