# 已验证的 MCP 约定

来源：2026-10-24 实际 tools/list；服务 https://mcp.mcd.cn，Streamable HTTP，Bearer 环境变量 MCD_MCP_TOKEN。协议协商 2025-03-26，服务 mcd-mcp 1.0.0，35 个工具。项目 docs/mcp-tools.snapshot.json 保存核心工具 schema；以运行时为准。

到店自取：beType=1、orderType=1，不传 beCode。搜索必传 searchType=2、city、keyword。不要默认 searchType=1（收藏门店）。

```json
{"beType":1,"searchType":2,"city":"北京市","keyword":"北京站"}
```

取用户确认门店返回的 storeCode，传给 query-meals；query-meal-detail 额外传 code。例子中的编码是历史测试数据，实际使用需重新查菜单。

核价完整套餐：

```json
{
  "storeCode":"由门店查询返回",
  "orderType":1,
  "beType":1,
  "items":[{
    "productCode":"由菜单返回",
    "quantity":1,
    "roundList":[{
      "round":"详情中轮次id转字符串",
      "comboItemList":[{"code":"该轮choice编码","quantity":1}]
    }]
  }]
}
```

items[].roundList 中每轮都按详情的 minQuantity/maxQuantity 选够，不能只传更改的饮料。特调 modification.values 中，选择项 key 使用 selectedKey；有 unselectedKey 的未选项也传入，key 使用 unselectedKey。数量规则以详情为准。

已实际观察：菜单是 categories 加 meals 字典，categories 中只有 code，名称在 meals[code]。currentPrice/originalPrice 是元字符串，核价金额字段是分。工具可能返回 structuredContent、纯 JSON 文本或包含 Original Response 的 JSON 代码块；外层 MCP 成功不代表业务成功。

## 交互示例

用户：“麦麦，一人 30 元以内，想吃汉堡，不要含糖饮料。”

先确认城市/门店/到店自取，读菜单和套餐详情，选择实际存在的无糖饮料，给两到三份完整官方核价餐单。若这时默认饮料含糖，不得把它列为满足要求。

用户：“第二份饮料换大杯。”

核实第二份套餐支持的大杯无糖选项，替换对应轮次并提交完整整单重新核价。展示新总价和相对上次报价的整单变化。

用户：“就这个。”

输出确认单并停止。无订单号，无付款链接，无自动领券。
