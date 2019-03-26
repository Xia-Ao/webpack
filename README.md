# webpack
基本配置
```js
let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',    // 模式，默认两种，开发环境和生产环境
  entry: './src/index',   // 入口
  output: {               // 输出
    filename: "bundle.js",
    path: path.resolve(__dirname, 'build'),
  },
  devServer: {
    port: 3000,
    progress: true,
    contentBase: path.join(__dirname, "build"),
    compress: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      minify: {}
    })
  ]
};
```

## Configuration
* 通过[`webpack-merge`](https://webpack.js.org/guides/production/#setup)来将区分开发环境和生产环境分离的webpack配置文件merge

### Development
* webpack-dev-server 开发时启动一个server
	* 使用 `webpack-dev-server`命令时，打包出来的文件在内存中，server启动从内存中读取的文件，在打包目录中没有文件，只有使用 `webpack`命令打包出来的文件在目录中
* source-map 源码映射
	* [配置](https://www.webpackjs.com/configuration/devtool/) 
	* `devtool:'source-map'`, 会产生一个单独的sourcemap文件，如果报错，会标识当前报错的列和行
	* `devtool: 'eval-source-map'` 不会产生单独的文件，会标识列和行
	* `devtool: 'cheap-module-source-map` 不标识列，但是产生一个单独的映射文件
	* `dev-tool: cheap-module-eval-source-map` 不产生文件，集成在打包后的文件中，不会产生列

### devServer
* proxy [代理](https://www.webpackjs.com/configuration/dev-server/#devserver-proxy)，解决跨域
* [Hot Module Replacement](https://www.webpackjs.com/guides/hot-module-replacement/#%E5%90%AF%E7%94%A8-hmr) 热更新，webpack非常有用的功能， 使用时需要用一下两个内置插件
	* `webpack.NamedModulesPlugin`
	* `webpack.HotModuleReplacementPlugin`
	

### resolve
包或者文件的[解析方式](https://www.webpackjs.com/configuration/resolve/#resolve)

* alias : 创建别名
* extensions： 扩展
* mainFields：解析包时从`package.json`中使用哪个字段导入文件 


### Optimization

* `minimizer` 可以对文件进行压缩
* [`splitChunks`](https://webpack.js.org/plugins/split-chunks-plugin/) 抽离公用代码,详细中文[实例](https://imweb.io/topic/5b66dd601402769b60847149)


##  plugin

* `webpack.DefinePlugin` : 允许创建一个在编译时可以配置的全局常量
* `dllPlugin` `DLLReferencePlugin` 用来拆分打包文件，生成一个`minifest.json`文件，产生映射关系。典型应用就是React
* `happypack`多线程打包，适合大型项目，文件比较多的情况，能优化性
* 


##  loader

* loader的特点： 希望单一，所以每个loader负责一项事情，
* loader的使用是有顺序的，默认是**从右向左执行，从下到上执行**
	* loader的执行顺序非常重要，在开发中经常因为习惯性从左到右，从上到下，导致webpack使用loader时报找不到对应的loader错误，越先使用loader解析的，需要将loader放在下面最后的位置。
	* `enforce: 'pre/post'` loader执行顺序，默认为normal


###  Module

## File build

### css
css文件打包处理
* `style-loader` 将css文件插入到head中
* `css-loader` 处理css文件中 `@import`语法
* `less-loader` 处理less， 需要依赖less包
* `postcss-loader` 配合 `autoprefixer`使用加上浏览器前缀

在使用的过程中，css不仅仅只限于上述功能，需要将css打包成为一个独立的文件，通过link引用插入刀片head中，要使用 `MiniCssExtractPlugin`插件， 此插件和 `style-loader`之间冲突，只能用一个
```js
module: {
	rules: [
		{
			test: /\.css$/,
			use: [
				{
					loader: MiniCssExtractPlugin.loader,
					options: {insertAt: 'top'}
				},
				'css-loader',
				'postcss-loader'
			]
		},
	]
}
plugins: [
	// html模板
	// 独立css文件
	new MiniCssExtractPlugin({
		filename: "[name].css",
		chunkFilename: "[id].css"
	}),
]
```

css文件压缩在MiniCssExtractPlugin插件的配置环境中介绍到使用 `optimize-css-assets-webpack-plugin`,使用说明 [`mini-css-extract-plugin`](https://www.npmjs.com/package/mini-css-extract-plugin)




### js
#### 压缩js
* `uglifyjs-webpack-plugin`压缩
```js
optimization: {
	minimizer: [
		new UglifyJsPlugin({
			cache: true,
			parallel: true,
			sourceMap: true // set to true if you want JS source maps
		})
	]
}
```
#### babel编译
对基本的webpack4+中 [babel编译配置](https://webpack.js.org/loaders/babel-loader/),满足将一些常用的es6语法转成es5

对于一些高级的es6语法例如generator等，需要使用`@babel/transform-runtime`插件，`@babel/transform-runtime`插件能将大部分高级语法转化成es5语法，优点是不污染全局对象，但是对于ES7 ES8语法，并没有实现，可能需要使用`polyfill`。

* `babel-plugin-transform-runtime` 不改写全局对象，并且无全局污染、极高代码库适用性，但是对于一些新的实例方法如`Array.includes()`并没有实现，只能依赖于运行环境，对于chrome或者node环境，对这些已经实现了该方法的环境，并不影响。使用时注意环境是否需要加入 `polyfill`
* `polyfill` babel-polyfill则是通过改写全局prototype的方式实现，比较适合单独运行的项目。开启babel-polyfill的方式，可以直接在代码中require，或者在webpack的entry中添加，也可以在babel的env中设置useBuildins为true来开启。但是babel-polyfill会有近100K，打包后代码冗余量比较大，对于现代的浏览器,有些不需要polyfill，造成流量浪费.污染了全局对象
             
            

### html

#### HtmlWebpackPlugin
* `HtmlWebpackPlugin`插件，使用自定义html模板，option选项配置	
* `minify`压缩, 内部集成了`html-minifier`，使用该插件的属性
* `meta`配置


### 图片
1. 图片通过JS创建
	* 推荐使用使用`url-loader`来处理，
	* `url-loader`中有配置项，可以配置文件大小超过多少时使用`file-loader`生成真实文件，小图片生成base64位格式的，减少http请求
	* 在js中使用时，要使用`import`语法将图片文件引入.
2. 图片在css中使用，如background-image
	* css-loader已经具备处理css中的图片
3. 图片在html中通过img标签使用
	* 使用`html-loader`处理

### 引入全局变量
在ES6中，可以使用`import`语法在文件中引入变量，但不是全局变量，只在该文件内生效。对于全局变量，即window对象上的变量，以 `jquery`为例，可以使用以下三种方法：
* `expose-loader`：通过`expose-loader`将jquery暴露给window
	```js
	module: {
		rules: [{
			test: require.resolve('jquery'),
			use: [{
				loader: 'expose-loader',
				options: '$'
			}]
		}]
	}
	```
* `ProvidePlugin`: 插件，自动加载模块，而不必到处 import 或 require
	```js
	plugins:[
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery'
		})
	]
	```
* 通过配置`externals`， 将引入的模块不打包进去

## webpack内部实现
webpack本质上是一种事件流的机制，它的工作流程就是将各个插件串联起来，而实现这一切的核心就是`Tapable`，webpack中最核心的负责编译的Compiler和负责创建bundles的Compilation都是`Tapable`的实例

[`tapable`](https://juejin.im/post/5abf33f16fb9a028e46ec352#heading-0)介绍
