
# 浏览器端javascript包管理系统

by [wangqun](http://weibo.com/u/2003234792)
                
该系统的目的是为了实现js的包管理,实际使用时候只要引用package.js即可，<strong>不需要配置</strong>，使用极为方便

##包管理用法：
**example文件夹中有一个完整示例可供参考**
### main
每个项目都需要有一个main函数，表示执行的入口，可以写在script中，也可以用script的src引用。
写在script中：
```js
<script>
    main(function(){
        /* 
            do something
        */
    });
</script>
```
或者是引用一个外部的脚本，<strong>假设</strong>该脚本名字是main.js
```js
<script src="main.js"></script>

// >>>>main.js

main(function(){
    /* 
        do something
    */
});
```

###　Package

自己编写的模块需要用关键字<strong>Package</strong>包装起来，如果需要导出接口，还要给函数传递一个参数，一般命名为exports，但也<strong>可以自选</strong>(这一点和某些库不一样)，该用法如下
```js
// 在main.js中引用util.js，路径按照util.js相对于main.js的路径
// >>>>main.js

main(function(){
    var util=imports("util");
    util.say();
});

// >>>>util.js

Package(function(exports){
    function say(){
        console.log("hello word");
    }

    // 注意exports名字本身没有要求，可以随意起，只要和上面传进来的匹配即可
    exports.say=say;
});

// 如果一个模块包只导出一个接口，则可以用module.exports
// >>>>util2.js

Package(function(exports,module){
    function say(){
        console.log("hello word");
    }
    
    module.exports.say=say;
});

```

## 文件合并用法
如果模块过多，不利于http优化，Imports提供文件合并的方法，需要安装
[Node.js](https://nodejs.org/)
，然后调用merge.js。
merge的用法很简单，有两个参数，一个是包含main函数的脚本src，另一个输出文件路径。
例如在example文件夹中的doMerge.js中是这样调用的：
```js
var merge = require( "../merge.js" );
merge( "main.js", "../out/main.min.js" );
```
**需要注意，如果想用Imports提供的合并功能，则main函数需要独立提取出来放在一个js脚本文件中，不能放在script标签中间**

## 说明

* package.js会对脚本引用做分析，会按照顺序进行下载脚本。
* merge.js是一个node.js脚本，其中提供一个merge接口，供调用者合并模块文件用。
* package.js因为要在浏览器端运行，所以可能存在兼容性问题。目前在ie模拟器上测试结果是兼容ie5+，但是没有在实际对应版本上进行过测试。
* merge.js只提供合并的接口，不能直接执行，如果需要写能够执行的node代码，方法详见example文件夹中的doMerge.js。
* Imports系统中有两个全局变量：main和imports，尽量不要覆盖、修改这两个变量，否则可能会产生错误。

