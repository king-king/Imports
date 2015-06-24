/**
 * Created by WQ on 2015/6/24.
 */


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

function map( array, func ) {
    var mapArray = [];
    array.forEach( function ( item, i ) {
        mapArray.push( func( item, i ) );
    } );
    return mapArray;
}

// 顺序执行
function serialTask( tasks, callback ) {
    var index = 0;
    tasks[index] && tasks[index]( function () {
        ++index == tasks.length ? callback() : tasks[index]( arguments.callee );
    } );
}


var fs = require( "fs" );

function merge( path, outputPath ) {
    var scripts = [];
    var map = {};
    var curPath = path;
    // 添加min标记
    function readFile( path, callback ) {
        fs.readFile( path, function ( err, data ) {
            if ( err ) {
                console.log( "err" + err );
                callback( "" );
            }
            else {
                callback( data );
            }
        } )
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

    function parse() {
        function justDoIt() {
            var s = scripts.pop();
            curPath = s;
            if ( s ) {
                readFile( s, function ( data ) {
                    getScript( data.toString() );
                    map[s] = data.toString();
                    justDoIt();
                } );
            }
            else {
                var content = "var map={";

                function Package( func ) {
                    // 在下面的eval()中会调用这个函数，不能删掉
                    content = content + func.toString() + ","
                }

                for ( var key in map ) {
                    content = content + "\"" + key + "\":";
                    eval( map[key].toString() );
                }
                content = content + "};";

                // 将驱动代码和main中的代码放到content中，结束之后写到outputPath中。注意二者的顺序
                serialTask(
                    [
                        function ( done ) {
                            var driver = function () {
                                window.main = function ( func ) {
                                    func();
                                };

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

                                curPath = "main.js";
                                var scripts = [curPath];

                                window.imports = function ( src ) {
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
                            };
                            content = content + "(" + driver.toString() + ")();";
                            done();
                            // 写驱动代码
                        },
                        function ( done ) {
                            // 写main文件
                            readFile( path, function ( data ) {
                                content = content + data.toString();
                                done();
                            } );
                        }
                    ], function () {
                        console.log( "ok" );
                        // 全都处理完成，写入
                        fs.writeFile( outputPath, content, function ( err ) {
                            if ( err ) {
                                console.log( err );
                            }
                        } );
                    } );
            }
        }

        justDoIt();
    }


    readFile( path, function ( data ) {
        getScript( data.toString() );
        parse();
    } );

}

module.exports = merge;

