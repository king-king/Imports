/**
 * Created by WQ on 2015/6/18.
 */
(function () {
    var scripts = [];
    var map = {};
    var curScriptContent;
    var start;
    var curPath;// 记录当前路径，处理路径问题
    var startPath;

    function loadScript( src, done ) {
        var script = document.createElement( "script" );
        script.src = src;
        curPath = src;
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
                return resolve( curPath, getBetween( item, "\"", "\"" ) );
            } ) );
        }
    }

    function parse( str ) {
        getScript( str );
        function justDoIt() {
            var s = scripts.pop();
            if ( s ) {
                loadScript( s, function () {
                    map[s] = curScriptContent;
                    justDoIt();
                } );
            }
            else {
                // 全都下载完毕,从main开始执行
                curPath = startPath;
                scripts = [curPath];// scripts有多重含义，下载和执行的时候都会保存一些路径
                run( start );
            }
        }

        justDoIt();
    }

    function run( func ) {
        func();
    }

    function resolve( base, path ) {
        function clearFileName( path ) {
            if ( path.indexOf( "." ) != -1 ) {
                path = path.split( "/" ).slice( 0, -1 ).join( "/" );
            }
            return path;
        }

        base = clearFileName( base );
        var block = path.split( "/" );
        if ( block.length == 1 ) {
            // path单纯是个文件名
            return base + "/" + block[0];
        }
        else {
            for ( var i = 0; i < block.length; i++ ) {
                if ( block[i] == ".." ) {
                    // 回退
                    base = back( base );
                }
                else {
                    if ( base == "" ) {
                        base = block[i];
                    }
                    else {
                        base = base + "/" + block[i];
                    }
                }
            }
            return base;
        }
    }

    function back( path ) {
        var block = path.split( "/" );
        if ( block.length > 2 ) {
            block = block.slice( 0, -1 );
            return block.join( "/" );
        }
        else {
            return "";
        }
    }

    function main( func ) {
        // 处理路径问题
        var ss = document.querySelectorAll( "script" ),
            inner = ss[ss.length - 1].innerHTML;
        if ( inner && inner.match( /main/g ).length == 2 ) {
            //  说明main函数是内嵌在script标签中的
            curPath = "";
        }
        else {
            //  说明包含main函数的脚本是通过src引用的,main中imports的脚本路径都是相对于
            //  包含main函数的脚本来说的
            curPath = ss[ss.length - 1].src;
        }
        startPath = curPath;
        parse( func.toString() );
        start = func;
    }

    function Package( func ) {
        var content = func.toString();
        getScript( content );
        curScriptContent = func;
    }

    function imports( src ) {
        curPath = resolve( scripts[scripts.length - 1], src );
        scripts.push( curPath );
        if ( map[curPath] ) {
            var exports = {};
            var module = {exports : null};
            map[curPath]( exports, module );
        }
        scripts.pop();
        return module.exports ? module.exports : exports;
    }

    window.main = main;
    window.Package = Package;
    window.imports = imports;
})();