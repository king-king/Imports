/**
 * Created by WQ on 2015/6/18.
 */
(function () {

    var scripts = {};

    var curScript = null;

    function loadScript( src, done ) {
        var script = document.createElement( "script" );
        script.src = src;
        document.head.appendChild( script );
        script.onload = function () {
            done( script );
            script.onload = null;
        }
    }

    function getBetween( str, start, end ) {
        var s = str.indexOf( start ) + 1;
        str = str.replace( "\"", "%" );
        return str.substring( s, str.indexOf( end ) );
    }

    function filterImports( str ) {
        var ss = [].concat( str.match( /imports((a-z|A-Z|"|.)*);/g ) );
        // 得到当前脚本的所有引用的脚本
        var index = 0;
        while ( ss[index] ) {
            loadScript( getBetween( ss[index], "\"", "\"" ), function ( script ) {
                filterImports( script.text );
            } );
            index += 1;
        }
    }

    function main( func ) {
        filterImports( func.toString() );
    }

    var imports = function () {

    };

    window.main = main;
    window.imports = imports;

})();