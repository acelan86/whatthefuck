//为什么sinaads的买点代码中用
<script>
    (sinaads = window.sinaads || []).push({});
</script>
而不是
<script>
    (var sinaads = window.sinaads || []).push({});
</script>


ie6-8不同的script块会造成var glo的生命覆盖 window.glo的初始化，造成
var glo ＝ window.glo || {a : 2}, 这种语句的window.glo永远是undefined，即使再前面的script块中已经对window.glo进行赋值

见下面的例子：


例子：
<!doctype html>
<html>
    <head>
        <meta charset="utf-8" />
        <title> </title>
    </head>
    <body>
        <script>
          window.glo = {a : 1}; 
        </script>
        <script>
          var glo = window.glo || {a : 2}; //ie 2, other 1
          alert(glo.a);
        </script>
    </body>
</html>

例子：
<!doctype html>
<html>
    <head>
        <meta charset="utf-8" />
        <title> </title>
    </head>
    <body>
        <script>
          window.glo = {a : 1}; 
          var glo = window.glo || {a : 2}; //ie 1, other 1
          alert(glo.a);
        </script>
    </body>
</html>

例子：
<!doctype html>
<html>
    <head>
        <meta charset="utf-8" />
        <title> </title>
    </head>
    <body>
        <script>
          window.glo = {a : 1};
        </script>
        <script>
          glo = window.glo || {a : 2};
          alert(glo.a);
        </script>
    </body>
</html>


