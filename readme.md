
# javascript包管理系统

                by wangqun
                
该系统的目的是为了实现js的包管理

用法：

### main
每个项目都需要有一个main函数，表示执行的入口，可以写在script中，也可以用script引用。
写在script中：
```
<script>
    main(function(){
        /* 
            do something
        */
    });
</script>
```
或者是引用一个外部的脚本，假设该脚本名字是main.js
```
<script src="main.js"></script>

>>>>main.js
main(function(){
    /* 
        do something
    */
});
```

###　Package

自己编写的模块需要用Package包装起来，如果需要导出接口，还要给函数传递一个exports参数，用法如下
```
// 在main.js中引用util.js，路径按照util.js相对于main.js的路径
>>>>main.js
main(function(){
    var util=imports("util");
    util.say();
});

>>>>util.js
Package(function(exports){
    function say(){
        console.log("hello word);
    }
    
    exports.say=say;
});

```


