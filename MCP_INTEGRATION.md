# 麦当劳 MCP 接入

服务：`https://mcp.mcd.cn`，Streamable HTTP，`Authorization: Bearer <MCD_MCP_TOKEN>`。凭证由宿主环境或 Windows 当前用户环境变量提供，不保存到项目文件。示例见 `mcp-config.example.json`。

2026-10-24 实测协议 `2025-03-26`、服务 `mcd-mcp` / `1.0.0`，`tools/list` 共 35 个工具。核心 schema 保存于 `docs/mcp-tools.snapshot.json`；调用前重新发现，避免假定接口永远不变。

## 实际使用的工具

| 工具 | 已验证用途 |
| --- | --- |
| query-nearby-stores | 按北京市、地标和到店自取查找测试门店，读取营业状态 |
| query-meals | 获取测试门店 categories 与 meals 字典 |
| query-meal-detail | 获取三份套餐的轮次、默认项、饮料替换项和商品编码 |
| calculate-price | 三份整单核价，及中杯无糖饮料改大杯后完整整单重新核价 |

`now-time-info` 在交接前已被验证；本项目本轮业务证据采用接口返回 datetime。优惠券工具 schema 已读取，但本轮没有查询个人券、门店券或执行领券；不把这些写成已实测能力。

## 调用流程

1. initialize → notifications/initialized → tools/list。
2. 搜索测试地标。王府井附近返回门店已停止营业，改搜北京站；选择结果中营业的北京崇外新世界餐厅（1950072），明确仅为开发测试。
3. 用 storeCode、orderType=1、beType=1 查询菜单，不传 beCode。
4. 从真实菜单获取编码，查询套餐详情。为每份套餐选择完整轮次，并把饮料改为实际提供的无糖中杯选项。
5. 对三份完整 items 分别调用 calculate-price。读取 data.price，整数分转元。
6. 第二份选大杯无糖饮料，保留其他全部轮次，重新计算完整整单。
7. 输出本轮比较与确认单；流程在创建订单之前结束。

业务价值是把“喜欢某个套餐”和“特定门店、选项下实际要付多少钱”联系起来，避免只展示套餐起价、猜测替换差价或默认享受会员权益。宠物提供入口与陪伴形象；模型推理、会话和任务状态由宿主提供。

## 实现与限制

`scripts/mcd_readonly.py` 处理 JSON 或 SSE、会话头、初始化和工具发现，以及纯 JSON/Markdown 代码块/structuredContent 响应。HTTP 错误、MCP isError、业务失败及无效金额都不能成为有效报价。客户端不自动重试，不记录认证头，白名单在发请求之前拒绝写工具。

Skill 提供餐单决策流程，客户端提供兼容的只读工具调用；不能把客户端连通等同于宿主自然语言对话已经验收。未验证实际宿主宠物入口发起会话、跨会话记忆、配送、会员券组合和全菜单最优解。价格、可售和预约时间均以每次实时查询为准。
