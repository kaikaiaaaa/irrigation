# 技术栈研究：React + Vite + TypeScript + Tailwind CSS

> 针对"放心灌"灌溉订阅H5/Web应用的技术选型研究。
> 原小程序基于 Taro 3.6 + React + TypeScript，迁移至 Web 端需调整技术栈。

---

## 1. 推荐项目结构

```
├── public/                     # 静态资源（favicon, manifest.json）
│   └── favicon.ico
├── src/
│   ├── main.tsx                # 应用入口
│   ├── App.tsx                 # 根组件（Provider 包裹）
│   ├── index.css               # Tailwind 入口 + 全局样式
│   │
│   ├── pages/                  # 页面级组件（按路由划分）
│   │   ├── Home/
│   │   │   ├── index.tsx       # 页面组件
│   │   │   └── components/     # 页面私有组件（如 SearchBar, FilterModal）
│   │   ├── Explore/
│   │   ├── Subscribe/
│   │   ├── ShareImage/
│   │   ├── Launch/
│   │   └── NotFound/
│   │
│   ├── components/
│   │   ├── common/             # 通用基础组件
│   │   │   ├── AppHeader/
│   │   │   ├── AppNavigation/
│   │   │   ├── ConfirmModal/
│   │   │   ├── DeviceCard/
│   │   │   ├── ScanCodeButton/
│   │   │   ├── UChartsPrecipitation/
│   │   │   └── UChartsMoisture/
│   │   └── business/           # 业务组件（跨页面复用）
│   │       ├── CropAnalysis/
│   │       ├── IrrigationStatistics/
│   │       └── PlotFilters/
│   │
│   ├── hooks/                  # 自定义 Hooks
│   │   ├── useAuth.ts          # 认证状态
│   │   ├── useLocalStorage.ts  # LocalStorage 同步
│   │   ├── useDeviceList.ts    # 设备列表数据获取
│   │   └── useDebounce.ts      # 防抖
│   │
│   ├── stores/                 # 状态管理（见第2节）
│   │   ├── authStore.ts
│   │   ├── deviceStore.ts
│   │   └── uiStore.ts
│   │
│   ├── services/               # API 服务层（复用原小程序结构）
│   │   ├── http/
│   │   │   ├── index.ts        # axios/fetch 封装
│   │   │   ├── interceptors.ts # 请求/响应拦截器
│   │   │   └── types.ts        # HTTP 类型
│   │   ├── api/
│   │   │   ├── subscribe.ts    # 订阅相关 API
│   │   │   ├── plot.ts         # 地块相关 API
│   │   │   ├── auth.ts         # 认证相关 API
│   │   │   └── index.ts        # API 统一导出
│   │   └── types/
│   │       ├── auth.ts
│   │       └── api.ts
│   │
│   ├── utils/                  # 工具函数
│   │   ├── config.ts           # 应用配置（复用原 AppConfig）
│   │   ├── storage.ts          # LocalStorage 封装
│   │   ├── logger.ts           # 日志工具
│   │   ├── qrcode.ts           # 二维码解析
│   │   └── date.ts             # 日期格式化
│   │
│   ├── types/                  # 全局类型定义
│   │   ├── device.ts
│   │   └── map.d.ts
│   │
│   ├── contexts/               # React Context（如需）
│   │   └── AuthContext.tsx     # 认证上下文（可选，可用 Zustand 替代）
│   │
│   └── assets/                 # 静态资源
│       ├── icons/
│       ├── images/
│       └── styles/
│           └── theme.css       # CSS 变量/主题色
│
├── .env                        # 环境变量
├── .env.production
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── package.json
```

### 关键设计决策

- **pages/** 按路由组织，每个页面可有自己的 `components/` 子目录
- **components/common/** vs **components/business/**：通用组件（按钮、模态框）与业务组件（作物分析卡片）分离
- **services/** 层完全复用原小程序的 API 组织方式，只需替换 Taro 的 `http` 为 `axios`
- **hooks/** 提取可复用的逻辑（如搜索防抖、下拉刷新）

---

## 2. 状态管理方案

### 推荐：Zustand（首选）

对于本项目，**Zustand** 是最优选择：

| 维度 | React Context + useReducer | Zustand |
|------|---------------------------|---------|
| 学习成本 | 低（原生） | 极低（比 Redux 简单 10 倍） |
| 代码量 | 多（需写 Provider、Reducer、Action） | 极少 |
| 性能 | 差（任何状态变化导致所有消费者重渲染） | 优（按需订阅，细粒度更新） |
| TypeScript 支持 | 需手动定义类型 | 完美推断 |
| 持久化 | 需自行实现 | 有官方中间件 `persist` |
| 适用规模 | 极小（<3 个共享状态） | 小到中（完美匹配本项目） |

### 为什么不选 Redux Toolkit？

项目明确说明"no Redux needed"。Redux Toolkit 虽然已简化很多，但对于仅有以下状态需求的项目仍过重：
- 用户认证状态（isLoggedIn, user, token）
- 设备列表（deviceList, filters, pagination）
- UI 状态（modal 显隐、加载状态）

### Zustand 使用示例

```typescript
// stores/authStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  isLoggedIn: boolean
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      token: null,
      login: (token, user) => set({ isLoggedIn: true, token, user }),
      logout: () => set({ isLoggedIn: false, token: null, user: null }),
    }),
    {
      name: 'irrigation_auth', // LocalStorage key
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
)
```

### 状态拆分建议

```
stores/
├── authStore.ts      # 认证状态（持久化）
├── deviceStore.ts    # 设备列表 + 筛选条件（部分持久化）
├── uiStore.ts        # UI 状态（不持久化）
└── index.ts          # 统一导出
```

---

## 3. 路由方案

### 推荐：React Router v7 (Data API)

React Router v7 已发布，但 v6 的 `<BrowserRouter>` + `useRoutes` 模式对本项目完全足够。

```typescript
// router/index.ts
import { createBrowserRouter } from 'react-router-dom'
import { HomePage } from '@/pages/Home'
import { ExplorePage } from '@/pages/Explore'
import { SubscribePage } from '@/pages/Subscribe'
import { LaunchPage } from '@/pages/Launch'
import { AuthGuard } from '@/components/common/AuthGuard'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LaunchPage />,  // 扫码入口/启动页
  },
  {
    path: '/home',
    element: <AuthGuard><HomePage /></AuthGuard>,
  },
  {
    path: '/explore',
    element: <AuthGuard><ExplorePage /></AuthGuard>,
  },
  {
    path: '/subscribe',
    element: <AuthGuard><SubscribePage /></AuthGuard>,
  },
  {
    path: '/share-image',
    element: <ShareImagePage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
```

### 路由守卫实现

```typescript
// components/common/AuthGuard.tsx
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuthStore()
  const location = useLocation()

  if (!isLoggedIn) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  return <>{children}</>
}
```

### 底部导航栏（TabBar）

Web 端需自行实现底部导航（原小程序使用 custom-tab-bar）：

```typescript
// components/common/AppTabBar.tsx
import { NavLink } from 'react-router-dom'

export const AppTabBar = () => (
  <nav className="fixed bottom-0 w-full bg-[#05070f] border-t border-gray-800">
    <NavLink to="/home" className={({ isActive }) => isActive ? 'text-white' : 'text-gray-400'}>
      我的订阅
    </NavLink>
    <NavLink to="/explore" className={({ isActive }) => isActive ? 'text-white' : 'text-gray-400'}>
      服务点探索
    </NavLink>
  </nav>
)
```

---

## 4. LocalStorage 持久化模式

### 分层策略

| 数据类型 | 存储方式 | 示例 |
|---------|---------|------|
| 认证信息 | Zustand `persist` 中间件 | token, userInfo |
| 用户偏好 | Zustand `persist` 中间件 | 筛选条件、主题设置 |
| 缓存数据 | 自定义 Hook + LocalStorage | 搜索历史、设备列表缓存 |
| 临时状态 | 不持久化 | 当前页码、加载状态 |

### 封装 LocalStorage（兼容原小程序 storage.ts）

```typescript
// utils/storage.ts
const PREFIX = 'irrigation_'

export const storage = {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(`${PREFIX}${key}`)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value))
    } catch (error) {
      console.error('Storage set error:', error)
    }
  },

  remove(key: string): void {
    localStorage.removeItem(`${PREFIX}${key}`)
  },

  clear(): void {
    Object.keys(localStorage)
      .filter(k => k.startsWith(PREFIX))
      .forEach(k => localStorage.removeItem(k))
  },
}
```

### 同步 Hook（替代原小程序的同步 Storage）

```typescript
// hooks/useLocalStorage.ts
import { useState, useEffect, useCallback } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : initialValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  const remove = useCallback(() => {
    localStorage.removeItem(key)
    setValue(initialValue)
  }, [key, initialValue])

  return [value, setValue, remove] as const
}
```

---

## 5. 响应式设计（Tailwind CSS）

### 断点策略

```javascript
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        'xs': '375px',      // 小屏手机
        'sm': '640px',      // 大屏手机
        'md': '768px',      // 平板竖屏
        'lg': '1024px',     // 平板横屏/小桌面
        'xl': '1280px',     // 桌面
      },
      colors: {
        // 复用原小程序深色主题
        'app-bg': '#0a0e1a',
        'app-surface': '#111827',
        'app-border': '#1f2937',
      },
    },
  },
}
```

### 移动端优先的响应式模式

```tsx
// 示例：设备卡片响应式布局
<div className="
  grid
  grid-cols-1        /* 默认：单列（手机） */
  sm:grid-cols-2     /* ≥640px：双列 */
  lg:grid-cols-3     /* ≥1024px：三列 */
  gap-4
  p-4
">
  {devices.map(device => <DeviceCard key={device.plotUuid} {...device} />)}
</div>

// 示例：搜索栏响应式
<div className="
  flex
  flex-col           /* 手机：垂直排列 */
  sm:flex-row        /* ≥640px：水平排列 */
  gap-2
  sm:gap-4
">
  <input className="flex-1 ..." />
  <button className="w-full sm:w-auto ...">筛选</button>
</div>
```

### 安全区域适配（替代小程序的导航栏计算）

```css
/* 使用 CSS 环境变量处理刘海屏 */
.app-container {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}
```

### 触摸优化

```css
/* index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /* 禁用双击缩放 */
  html {
    touch-action: manipulation;
  }

  /* 统一触摸高亮 */
  button, a {
    -webkit-tap-highlight-color: transparent;
  }

  /* 滚动回弹（iOS） */
  body {
    overscroll-behavior-y: contain;
  }
}
```

---

## 6. 其他推荐库

### 必备库

| 库 | 用途 | 安装 |
|---|------|------|
| **lucide-react** | 图标（替代小程序的 iconPath） | `npm i lucide-react` |
| **date-fns** | 日期格式化（比 moment.js 小 20 倍） | `npm i date-fns` |
| **clsx + tailwind-merge** | 条件类名合并 | `npm i clsx tailwind-merge` |
| **axios** | HTTP 请求（替代 Taro.request） | `npm i axios` |

### 可选库

| 库 | 用途 | 场景 |
|---|------|------|
| **react-hot-toast** | Toast 通知（替代 Taro.showToast） | 需要轻量提示时 |
| **@tanstack/react-query** | 服务端状态管理 | 数据获取复杂时（推荐） |
| **zod** | 运行时类型校验 | API 响应校验 |
| **react-virtuoso** | 虚拟列表 | 设备列表 >100 条时 |

### 工具函数封装（clsx + tailwind-merge）

```typescript
// utils/cn.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 使用
<button className={cn(
  'px-4 py-2 rounded',
  isActive && 'bg-blue-500 text-white',
  isDisabled && 'opacity-50 cursor-not-allowed'
)}>
```

### 日期格式化（date-fns）

```typescript
import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'

// 替代原小程序的日期显示
format(parseISO(device.updateTime), 'MM-dd HH:mm', { locale: zhCN })
// => "10-10 15:30"
```

---

## 7. Vite 配置要点

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://your-api-server.com',
        changeOrigin: true,
      },
    },
  },
  build: {
    target: 'es2015',
    rollupOptions: {
      output: {
        manualChunks: {
          // 代码分割
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['lucide-react'],
        },
      },
    },
  },
})
```

---

## 8. 迁移检查清单

从原小程序迁移到 Web 端的关键变更点：

- [ ] **路由**：Taro 页面配置 → React Router
- [ ] **存储**：Taro.setStorageSync → LocalStorage / Zustand persist
- [ ] **HTTP**：Taro.request → axios
- [ ] **UI 组件**：Taro UI / 自定义组件 → 纯 Tailwind + 自定义组件
- [ ] **导航栏**：小程序原生导航栏 → 自定义 HTML/CSS 导航栏
- [ ] **TabBar**：小程序 custom-tab-bar → 自定义 React 组件
- [ ] **扫码**：Taro.scanCode → Web 端二维码扫描库（如 `html5-qrcode`）或仅支持手动输入
- [ ] **分享**：小程序分享 API → Web 端 Web Share API（兼容性有限）
- [ ] **地图**：小程序 Map 组件 → 高德/百度 Web 地图 SDK
- [ ] **图表**：uCharts/echarts-for-weixin → echarts（Web 版）
- [ ] **定位**：Taro.getLocation → 浏览器 Geolocation API
- [ ] **生命周期**：useDidShow/useDidHide → useEffect + react-router 的 useLocation

---

## 总结

| 层面 | 选择 | 理由 |
|------|------|------|
| 构建工具 | Vite | 极速 HMR，生态成熟 |
| 状态管理 | Zustand + persist | 极简 API，内置持久化，TS 友好 |
| 路由 | React Router v6/v7 | 行业标准，Data API 强大 |
| 样式 | Tailwind CSS | 原子化，响应式，与小程序样式思路兼容 |
| 图标 | lucide-react | 轻量，现代，Tree-shaking |
| 日期 | date-fns | 模块化，体积小 |
| HTTP | axios | 拦截器，兼容性好 |
| 类名工具 | clsx + tailwind-merge | 条件类名，避免冲突 |

**核心原则**：保持与原小程序的代码结构一致，最小化迁移成本。services/、types/、utils/ 层几乎可直接复用，只需替换 Taro 相关 API。
