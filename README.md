# 贺凯老师主页（three.js 樱花盆景）

仿照 Zara Zhang 的 “What if your Linktree were an actual tree”：一棵用 three.js 实时渲染的樱花盆景，八个链接挂在八簇花冠旁。悬停时对应花冠发亮、落下花瓣；点“个人简介 / 科研项目 / 代表论文 / 招生招聘”会从右侧滑出详情面板。内容整理自 [中山大学土木工程学院教师主页](https://civil.sysu.edu.cn/teacher/938)。

## 运行

```bash
npm install      # 安装 three.js、Vite 和字体
npm run dev      # 本地预览 http://localhost:5173
npm run build    # 打包到 dist/，整个文件夹可直接放到任意静态服务器
```

## 修改内容

| 想改的 | 文件 |
| --- | --- |
| 链接、简介、项目、论文、招生信息 | `src/content.js` |
| 花冠的位置和大小（与链接一一对应） | `src/scene/tree.js` 里的 `PADS` |
| 树干形状 | `src/scene/tree.js` 里的 `TRUNK_POINTS` |
| 花盆、桌面、背景墙 | `src/scene/environment.js` |
| 飘落花瓣 | `src/scene/petals.js` |
| 文字样式、面板排版 | `src/style.css` |
| 图片（照片、实验室） | `public/images/` |

字体（Noto Serif SC、Cinzel）通过 npm 本地打包，不依赖 Google Fonts，国内访问也能正常显示。
