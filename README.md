# 流界 FlowAcross

**一套键鼠，自由跨屏。**

[流界官网：Mac、Windows、Linux 键鼠共享软件下载](https://flow.bapihou.com/)

把几台电脑放在桌上，鼠标从一台的屏幕边缘移出，就出现在相邻电脑的屏幕上，键盘随之切换，复制的文字、文件和截图也能直接在另一台粘贴。支持 Windows、macOS 和 Linux（X11，以及 Wayland 的 Hyprland、Sway、GNOME、KDE）互相控制，局域网直连、端到端加密，不需要注册账号。

## 下载

到 [**最新版本**](https://github.com/Hearion/FlowAcross-releases/releases/latest) 页面，在 Assets 里下载对应的安装包：

| 系统 | 下载文件 | 说明 |
|---|---|---|
| Windows 10 / 11（64 位） | `FlowAcross_x.y.z_x64-setup.exe` | 安装程序 |
| macOS（Intel 和 Apple 芯片通用） | `FlowAcross_x.y.z_universal.dmg` | 打开后把 FlowAcross 拖进「应用程序」 |
| Debian / Ubuntu（x86_64） | `FlowAcross_x.y.z_amd64.deb` | `sudo apt install ./文件名.deb` |
| Arch、CachyOS、Manjaro 等（x86_64） | `FlowAcross_x.y.z_x86_64.pkg.tar.zst` | `sudo pacman -U 文件名.pkg.tar.zst` |
| 其他 Linux 发行版（x86_64） | `FlowAcross_x.y.z_amd64.AppImage` | `chmod +x` 后直接运行 |

其他文件（`.sig`、`.app.tar.gz`、`latest.json`）供应用内自动更新使用，不用下载。

Linux 版从 v0.2.2 起和 Windows、macOS 一起发布。[版本列表](https://github.com/Hearion/FlowAcross-releases/releases)里带 Pre-release 标记的是测试版（版本号带后缀，如 `v0.3.0-beta.1`），想提前试新功能可以装。

## 安装

### Windows

1. 运行安装程序。目前没有代码签名，SmartScreen 会提示「Windows 已保护你的电脑」，点「更多信息 → 仍要运行」。
2. 第一次打开时，Windows 防火墙会询问是否允许访问网络：勾选**专用网络**，点「允许访问」。
3. 网络要设为「专用网络」（设置 → 网络和 Internet → 当前网络 → 属性），公用网络下 Windows 会拦截局域网发现。

### macOS

1. 打开 `.dmg`，把 FlowAcross 拖进「应用程序」。
2. 第一次打开时会提示「无法验证开发者」：到「系统设置 → 隐私与安全性」，在页面下方点「仍要打开」。
3. 按引导授予「辅助功能」和「输入监控」权限（用于捕获和模拟键盘鼠标），以及「本地网络」权限（用于发现其他电脑）。授予「输入监控」后可能需要退出并重新打开流界。

### Linux

1. 安装：
   - Debian / Ubuntu：`sudo apt install ./下载的文件.deb`
   - Arch 系：`sudo pacman -U 下载的文件.pkg.tar.zst`
   - 其他发行版：`.AppImage`，`chmod +x` 后直接运行
2. X11 和 Wayland 会话都可以直接用，流界启动时自动识别：
   - **Hyprland、Sway** 等 wlroots 系合成器：不需要授权。
   - **GNOME（45 以上）、KDE Plasma（6.1 以上）的 Wayland 会话**：通过系统的 portal 实现。第一次使用会弹出系统授权窗口，请点允许；键鼠捕获的授权每次启动流界都要再点一次。这部分还没有在真机上验证，可能有问题。
   - **X11 会话**：不需要授权。
3. Wayland 上暂时不起作用的功能（系统不让普通程序看到全局键盘），对应的选项在设置里不显示：
   - 「按住修饰键才切换」。
   - 在 Linux 这台电脑上按 Ctrl + Alt + ←/→ 切到其他电脑。用鼠标推屏幕边切过去之后，再按这个快捷键切回来是可以的。
   - GNOME / KDE 上「停留一会儿才切换」不起作用，GNOME 上没有边缘浮光。
4. Hyprland / Sway 上，通往其他电脑的那条屏幕边最外 1 个像素的点击会被流界挡住。
5. GNOME 默认不显示托盘图标，需要安装 AppIndicator 扩展；开着防火墙时要手动放行流界。
6. Linux 版暂时没有应用内自动更新，新版本要回到[最新版本](https://github.com/Hearion/FlowAcross-releases/releases/latest)页面手动下载。

Linux 版仍在完善中：Hyprland 有用户实测可用，其他桌面还没有在真机上充分验证。遇到问题欢迎到 [Issues](https://github.com/Hearion/FlowAcross-releases/issues) 反馈，请附上发行版、桌面环境（合成器）及其版本。

## 开始使用

1. 在每台电脑上安装并打开流界，确保它们连在**同一个局域网**。
2. 点「添加设备」，选择另一台电脑，核对两边显示的 6 位配对码一致后都点确认。
3. 在「设备布局」里按真实摆放拖动屏幕，让相邻的屏幕边贴在一起（会出现发光的边）。
4. 把鼠标推过相贴的边，就切到了另一台电脑。也可以用快捷键 Ctrl + Alt + ←/→（Mac 上 ⌃⌥←/→）切换。

配对一次之后，两台电脑打开流界就会自动连接。关闭窗口时流界会缩到托盘（菜单栏）继续运行。在「设置 → 通用」里打开「开机时自动启动」，登录系统后流界会自动在后台运行。

- **复制文件和图片**：在一台电脑上复制文字、文件或截图，把键鼠切到另一台直接粘贴，文件会自动传过去（超过 1 GB 的在侧栏点「接收」）。
- **用 Windows 键盘控制 Mac**：在 Mac 的「设置 → 跨屏与键鼠 → Windows 键盘的修饰键」里选择 Ctrl、Win、Alt 对应 Mac 的哪个键。
- **屏幕熄灭了也能切过去**（0.2.3 起）：被控制的电脑熄屏后，键鼠照样能切过去，屏幕会自动亮起来。切不过去的时候，在主界面选中那台设备点「唤醒屏幕」（两台电脑都要是 0.2.3 或更新的版本）。
- **保持屏幕常亮**（0.2.3 起）：不想让某台电脑自动熄屏，就在那台电脑的「设置 → 通用」里打开「保持屏幕常亮」，连着其他电脑时它的屏幕不会自己熄灭，不影响手动锁屏。Linux 上需要桌面提供屏幕保护服务（GNOME、KDE、Xfce 等都有）；做不到时开关是灰的，旁边会写明原因。
- **暂停与锁定**：暂停共享或暂停某台设备时，双向的键鼠、剪贴板和文件共享都会停下，其他电脑控制不了这台。「锁定在本机」只阻止键鼠从这台切出去，其他电脑仍然可以切过来，剪贴板和文件照常共享。

配对新设备需要两台电脑都更新到最新版本；已经配对过的设备不受影响。

## 自动更新

流界会在启动后和之后每隔 6 小时检查新版本，有更新时在主界面提示，点「立即更新」即可，安装完成后自动重新打开。也可以在「设置 → 软件更新」里手动检查，或关掉自动检查。

更新包都带签名，流界下载后会先校验，确认来自官方发布才安装。两台电脑请尽量保持相同版本。

## 已知限制

- Windows 上无法操作「以管理员身份运行」的窗口和 UAC 弹窗（除非流界也以管理员身份运行），Ctrl+Alt+Del 无法传递。
- 控制其他电脑期间，Windows 的光标会停在离开的屏幕边上（暂不隐藏），回来后恢复。
- macOS 输入密码时（安全输入模式）系统会屏蔽键盘捕获。
- 屏幕被唤醒后如果停在锁屏界面，密码要在那台电脑上自己输，其他电脑的键盘输不进去。
- 公司网络、酒店和公共 Wi‑Fi 常会屏蔽设备发现，可以先用家里的网络或手机热点测试。
- Mac 使用 Wi‑Fi 时，跨屏可能每秒卡一下。这是 macOS 的 AWDL（隔空投送、接力、通用控制用的点对点 Wi‑Fi）定期切换信道造成的网络停顿。在 Mac 的流界里打开「设置 → 跨屏与键鼠 → 低延迟模式」即可解决：有电脑连着时自动关闭 AWDL，断开后恢复（开启期间隔空投送、接力、通用控制暂不可用，第一次开启需要输入一次 Mac 密码）。Mac 接有线网络时不需要开启。
- Linux 版仍在完善中：没有应用内自动更新；Wayland 上的限制见上面的「安装 › Linux」。
- 剪贴板同步文字、文件和图片（截图），富文本格式暂不同步。图片直接粘贴需要两台电脑都是 0.2.0 或更新的版本，单张不超过 64 MB；旧版设备收到的是一个 PNG 文件。

## 遇到问题

托盘（菜单栏）图标 → 打开日志文件夹，或「设置 → 关于 → 打开日志文件夹」，把两台电脑的日志一起发给开发者。

- Windows：`%APPDATA%\app.flowacross.desktop\logs\`
- macOS：`~/Library/Application Support/app.flowacross.desktop/logs/`
- Linux：`~/.local/share/app.flowacross.desktop/logs/`

---

本仓库只存放安装包、更新文件和官网页面（`docs/`），不包含源代码。

## 官网维护

官网是 `docs/` 下的静态页面，部署在阿里云服务器上（宝塔面板管理的 nginx 站点），域名 flow.bapihou.com。

- 页面由 `docs/index.html`（内容与结构）、`docs/styles.css`（样式，跟随系统浅色 / 深色）和 `docs/main.js`（首屏交互演示、按访问者系统推荐下载、滚动淡入等效果）组成，没有构建步骤。
- **自动部署**：`docs/` 有改动推送到 `main` 后，GitHub Actions 的「部署官网」（`.github/workflows/deploy-site.yml`）通过 SSH 用 rsync 把 `docs/` 同步到服务器的网站目录，再检查首页能打开，一般一分钟内完成。也可以在 Actions 页面手动运行。
  - 同步会删除网站目录里 `docs/` 没有的文件；`.user.ini`、`.well-known/`、`.htaccess`、`404.html` 受保护不删。要在服务器上额外放文件，先在工作流的 `--filter` 里加保护。
  - `docs/CNAME`、`docs/.nojekyll` 是以前用 GitHub Pages 时留下的，不会传到服务器。
  - 需要的仓库密钥（Settings → Secrets and variables → Actions）：`DEPLOY_HOST`（服务器公网 IP）、`DEPLOY_PORT`（SSH 端口，默认 22 可不填）、`DEPLOY_USER`（部署用户，不用 root）、`DEPLOY_PATH`（网站目录，必须在 `/www/wwwroot/` 下）、`DEPLOY_KEY`（部署私钥全文）、`DEPLOY_KNOWN_HOSTS`（服务器主机公钥，`ssh-keyscan` 的输出）。
  - 部署失败时看 Actions 里的日志：「检查配置」报缺哪个密钥；「同步网站文件」失败多半是 SSH 连不上（安全组、端口、宝塔的 SSH 设置）或部署用户没有网站目录的写权限。
- 官网的视觉比应用多一层表现（网格、光晕、渐变、卡片动效），只用在官网，说明见 `docs/styles.css` 开头的注释。改样式后在浅色、深色和手机宽度下各看一遍。
- 首页标题、描述、分享信息和 JSON-LD 结构化数据集中在 `docs/index.html`，修改产品能力时同步维护，保持与可见正文一致。
- JSON-LD 里的 `FAQPage` 与页面上的「常见问题」逐条对应：增删或改写问答时，同步改 JSON-LD 里对应的 `name` / `text`（纯文本，去掉链接标签）。
- 首页内容有实质修改时，同步更新 JSON-LD 里 `WebPage` 的 `dateModified` 和 `docs/sitemap.xml` 的 `lastmod`，两处日期保持一致。
- `docs/llms.txt` 是给 AI 搜索 / 问答引擎读的纯文本产品说明，内容只取自官网可见正文；修改产品能力、系统支持或下载地址时一并更新。服务器返回 `.txt` 时如果不带 `charset`（nginx 默认就不带），中文系统的浏览器会按 GBK 显示成乱码，所以 `llms.txt` 开头保留 UTF-8 BOM（编辑器保存时别去掉），`robots.txt` 只写 ASCII。
- `docs/robots.txt` 声明抓取入口，并明确放行主要 AI 爬虫；`docs/sitemap.xml` 只列出正式域名下的可索引页面。新增页面时补入 sitemap，不加入页面锚点或安装包链接；`lastmod` 按上一条维护。
- 发布后检查 `/robots.txt`、`/sitemap.xml` 和分享图片能正常访问。在 Google Search Console / Bing Webmaster Tools 验证域名后提交 `https://flow.bapihou.com/sitemap.xml`，通过 URL 检查确认首页可抓取及 canonical。
- JSON-LD 可用 Schema Markup Validator 检查。软件信息只描述已提供的能力，不虚构价格、评分或评论；结构化数据不代表一定获得富媒体搜索结果。
