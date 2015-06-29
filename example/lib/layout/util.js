/**
 * Created by WQ on 2015/6/29.
 */

Package( function ( exports ) {
    function loopArray( arr, func ) {
        for ( var i = 0; i < arr.length; i++ ) {
            func( arr[i], i );
        }
    }

    exports.loopArray = loopArray;
} );