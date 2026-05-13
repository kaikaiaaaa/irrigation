# 放心灌 Web版

## What This Is

一个面向农民和灌溉管理人员的天气感知型灌溉决策助手网页应用。基于实时天气数据（降雨、温度、湿度）为每个设备/地块提供智能灌溉建议，帮助用户做出更科学的浇水决策。

## Core Value

用户打开应用就能看到每个设备的当前状态以及基于天气的灌溉建议，无需专业知识即可做出正确的浇水决策。

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] 设备管理：添加、编辑、删除灌溉设备/地块
- [ ] 设备列表：查看所有设备状态（在线/离线、土壤湿度等）
- [ ] 天气集成：获取实时天气数据（温度、湿度、降雨预报）
- [ ] 灌溉建议：基于天气数据给出浇水建议（建议浇水/建议等待/今日已下雨）
- [ ] 数据持久化：使用 LocalStorage 保存所有设备数据和用户设置
- [ ] 响应式设计：适配桌面端和移动端

### Out of Scope

- 后端服务器/数据库 — 纯前端应用，使用 LocalStorage
- 用户认证/登录 — 单机使用，无需账号
- 历史数据图表 — v1 简化，仅显示当前状态
- 推送通知 — 浏览器通知或微信订阅消息
- 多用户协作 — 单机版，数据不共享
- 扫码添加设备 — 网页端不支持微信小程序扫码

## Context

- 参考项目：微信小程序版"放心灌"（Taro 3.6 + React + TypeScript）
- 目标平台：网页端（桌面 + 移动端浏览器）
- 技术栈：React 18 + Vite + TypeScript + Tailwind CSS
- 数据存储：浏览器 LocalStorage
- 天气 API：Open-Meteo（免费，无需 API Key）
- 代码仓库：https://github.com/insentek/irrigation-website

## Constraints

- **无后端**：所有数据存储在浏览器 LocalStorage，数据量受限（约 5MB）
- **天气 API**：需要外部 API 密钥，可能有调用频率限制
- **单机使用**：数据不会跨设备同步
- **浏览器兼容**：需要支持现代浏览器（Chrome、Safari、Edge、Firefox）

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| React + Vite | 用户熟悉，生态成熟，构建快速 | — Pending |
| LocalStorage | 无需后端，部署简单 | — Pending |
| 响应式设计 | 同时支持手机和电脑访问 | — Pending |
| 天气驱动建议 | 核心差异化功能，解决用户痛点 | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2025-05-13 after initialization*
