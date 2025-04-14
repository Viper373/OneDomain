# OneDomain

一个基于 Next.js 的现代化域名管理应用，使用最新的 React 19 和 TypeScript 构建。

## 技术栈

- **框架**: Next.js 15.2.4
- **UI 组件**: shadcn/ui
- **样式**: Tailwind CSS
- **状态管理**: React Hooks
- **表单处理**: React Hook Form
- **类型检查**: TypeScript
- **包管理**: pnpm
- **图标**: Lucide React
- **动画**: Tailwind CSS Animate
- **工具库**: 
  - date-fns
  - recharts
  - sonner
  - zod

## 项目结构

```
OneDomain/
├── app/                    # Next.js 应用目录
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局组件
│   └── page.tsx           # 主页面
├── components/            # 组件目录
│   ├── ui/               # UI 组件
│   ├── command-examples.tsx
│   ├── command-input.tsx
│   ├── domain-table.tsx
│   ├── footer.tsx
│   ├── profile-info.tsx
│   ├── terminal.tsx
│   └── theme-provider.tsx
├── hooks/                 # 自定义 Hooks
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/                   # 工具函数
│   └── utils.ts
├── public/               # 静态资源
│   ├── placeholder-logo.png
│   ├── placeholder-logo.svg
│   ├── placeholder-user.jpg
│   ├── placeholder.jpg
│   └── placeholder.svg
└── styles/               # 样式文件
    └── globals.css
```

## 功能特性

- 现代化的用户界面
- 响应式设计
- 深色模式支持
- 命令行界面集成
- 域名管理功能
- 实时数据展示
- 用户配置文件
- 主题定制

## 开发环境设置

### 前提条件

- Node.js
- pnpm
- Git

### 安装步骤

1. 克隆仓库
```bash
git clone [repository-url]
cd OneDomain
```

2. 安装依赖
```bash
pnpm install
```

3. 启动开发服务器
```bash
pnpm dev
```

4. 构建生产版本
```bash
pnpm build
```

5. 启动生产服务器
```bash
pnpm start
```

## 配置说明

### Next.js 配置

项目使用 Next.js 15.2.4，配置了以下特性：
- 并行服务器构建
- 并行服务器编译
- 优化的 Webpack 构建
- 图片优化
- TypeScript 和 ESLint 配置

### Tailwind CSS 配置

使用 Tailwind CSS 进行样式管理，配置了：
- 自定义颜色系统
- 响应式设计
- 动画效果
- 主题变量

### TypeScript 配置

项目使用严格的 TypeScript 配置：
- ES6 目标
- 模块解析
- 路径别名
- 类型检查

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件。

## 联系方式

如有任何问题或建议，请通过以下方式联系：

- 项目 Issues
- 电子邮件：[2483523414@qq.com]

## 致谢

v0.dev（提供免费前端代码生成额度）