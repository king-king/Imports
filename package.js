/**
 * Created by WQ on 2015/6/18.
 */
(function () {


    var scripts = [];
    var map = {};
    var curScriptContent;
    var start;

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
                    map[s] = curScriptContent;
                    doit();
                } );
            }
            else {
                // 全都下载完毕,从main开始执行
                execute( start );
            }
        }

        doit();

    }

    function execute( func ) {
        func();
    }

    function main( func ) {
        parse( func.toString() );
        start = func;
    }

    function Package( func ) {
        var content = func.toString();
        getScript( content );
        curScriptContent = func;
    }

    function imports( src ) {
        if ( map[src] ) {
            map[src]();
        }
    }

    window.main = main;
    window.Package = Package;
    window.imports = imports;

})();