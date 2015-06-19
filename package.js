/**
 * Created by WQ on 2015/6/18.
 */
(function () {


    var scripts = [];


    function loadScript( src, done ) {
        var script = document.createElement( "script" );
        script.src = src;
        document.head.appendChild( script );
        script.onload = function () {
            done();
            script.onload = null;
        }
    }

    function getBetween( str, start, end ) {
        var s = str.indexOf( start ) + 1;
        str = str.replace( "\"", "%" );
        return str.substring( s, str.indexOf( end ) );
    }

    //   /imports((a-z|A-Z|"|.)*);/g

    function reverseArray( array, func ) {
        // 反转数组
        var a = [];
        for ( var i = array.length - 1; i >= 0; i-- ) {
            a.push( func( array[i] ) );
        }
        return a;
    }

    function getScript( str ) {
        var ss = str.match( /imports((a-z|A-Z|"|.)*);/g );
        if ( ss ) {
            scripts = scripts.concat( reverseArray( ss, function ( item ) {
                return getBetween( item, "\"", "\"" );
            } ) );
        }
    }

    function parse( str ) {
        getScript( str );
        function doit() {
            var s = scripts.pop();
            if ( s ) {
                loadScript( s, function () {
                    doit();
                } );
            }
        }

        doit();

    }

    function main( func ) {
        parse( func.toString() );
    }

    function Package( func ) {
        getScript( func.toString() );
    }

    function imports() {

    }

    window.main = main;
    window.Package = Package;
    window.imports = imports;

})();