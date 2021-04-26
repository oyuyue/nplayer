# 参与贡献

首先非常感谢您能贡献该项目~

## Pull Request

从 main 分支拉去代码，然后再合并到 main 分支即可。

## 本地开发

拉取代码后，执行：

```bash
yarn
```

来安装项目依赖。

该项目采用 monorepo 的形式，由 typescript 和 sass 编写，eslint 来控制代码风格，jest 运行测试，webpack 打包。

## 项目结构

```
- .vscode  cSpell 插件检测拼写白名单
- fixtures 本地开发调试
    |
    |- danmaku 弹幕插件本
    |- nplayer 播放器
    |- react   react 组件
    |- vue     vue 插件
    |
- packages 播放器和相关生态源码
    |
    |- nplayer         播放器
    |- nplayer-danmaku 弹幕插件
    |- nplayer-react   react 组件
    |- nplayer-vue     vue 插件
    |
- scripts  项目本地调试和打包发布脚本
- website  官网和文档
```

## 脚本

你可以通过运行 `serve:{项目名}` 来运行相关项目的本地开发服务器，它会检测整个 `fixtures` 和 `相关项目源码` 文件夹，如果有代码改动会自动刷新浏览器。

如果你要开发弹幕插件可以运行：

```bash
yarn serve:nplayer-danmaku
```

然后在浏览器中访问 [http://localhost:8080/](http://localhost:8080/) 即可。（当本地调试播放器时，播放器网页前面添加 1000px 高的 div，需要把鼠标往下滑动才能看见播放器）。

你还可以通过 `build:nplayer` 来打包播放器代码，目前只有这一个打包命令，如果需要打包其他项目可以自行添加相关脚本。

## 导入别名

由于 `nplayer` 项目，目录比较深，你可以使用 `src` 访问它的源码根目录，比如你在比较深的目录下想导入 `Player` 类。

```typescript
import { Player } from 'src/ts/player'
// 而不是 import { Player } from '../../../../../../player'
```

其他项目比较简单所以没有别名，请使用相对路径导入。

## 代码结构

每个项目都有 `src` 文件夹和其中的入口文件 `index.ts`。其他代码则在 `ts` 目录下，css 在 `scss` 目录下（本来想 css 跟着组件拆分，在一个目录，但是现在样式并不多所以直接完全拆开了）。

项目中除了入口文件，其他文件都不用 `export default`，因为这样可以让你不用手动写导入代码，你只需要写相关变量名 vscode 就会自动提示，回车就可以自动导入，或者用 vscode 自动修复功能里面的自动导入。

## 测试

测试文件都在项目代码下的 `__tests__` 文件夹，测试文件名后缀是 `.spec.js`（感觉用 ts 写测试比较麻烦。。）。

目前测试代码并不多，后续慢慢补上✊。

## 文档 & 官网

NPlayer 使用的是 [Docusaurus](https://docusaurus.io/docs/)。

如果要编写文档或修改官网，请进入到 `website` 文件夹，运行：

```bash
yarn
```

安装依赖。

然后运行：

```bash
yarn start
```

启动本地开发，它会自动打开 [http://localhost:3000/](http://localhost:3000/)。

文档在 `docs` 文件夹，官网在 `src` 文件夹。

更多请参考 [Docusaurus 官方文档](https://docusaurus.io/docs/)。
