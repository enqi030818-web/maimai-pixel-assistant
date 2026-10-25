/* Historical-prototype state only. No network or order operations. */
(function(root) {
  "use strict";
  function toCents(value) {
    if (!/^\d+(\.\d{1,2})?$/.test(String(value).trim())) throw Error("请输入最多两位小数的正数预算。");
    const [yuan, fraction = ""] = String(value).trim().split(".");
    const result = Number(yuan) * 100 + Number(fraction.padEnd(2,"0"));
    if (!Number.isSafeInteger(result) || result <= 0 || result > 1000000) throw Error("预算需大于零，且不超过 10000 元。");
    return result;
  }
  function makeDraft(data, index) {
    const item = data.candidates[index];
    if (!item) throw Error("找不到这份历史样例。");
    return {index,storeCode:data.store.code,large:false,priceCents:item.priceCents,quotedAt:item.quotedAt,status:"historical"};
  }
  function changeDrink(draft, large) {
    if (draft.index !== 1) throw Error("原型只提供吉士汉堡套餐的已验证饮料替换。");
    if (draft.large === large) return {...draft};
    return {...draft,large,status:"needs-quote",previousPriceCents:draft.priceCents,priceCents:null,quotedAt:null};
  }
  function historicalQuote(data, draft) {
    if (draft.storeCode !== data.store.code) throw Error("换店后需要重新查询，不能复用旧门店的报价。");
    const record = draft.large && draft.index === 1 ? data.revision : data.candidates[draft.index];
    if (draft.large && draft.index !== 1) throw Error("没有这个选择的历史核价记录。");
    if (!Number.isInteger(record?.priceCents)) throw Error("历史报价缺失。");
    return {...draft,priceCents:record.priceCents,quotedAt:record.quotedAt,status:"historical"};
  }
  function selectWithinBudget(data, budget, people, preference) {
    if (String(people) !== "1") throw Error("当前原型只收录单人餐历史样例，多人配餐将在实时查询版本实现。人数与预算已保留。");
    if (/不要.*(薯条|汉堡)|不吃.*(薯条|汉堡)|无薯条|无汉堡/.test(preference)) throw Error("这三份历史样例均含汉堡和薯条，无法满足这个排除条件。需要重新查询实时菜单。");
    return data.candidates.map((_,index)=>index).filter(index=>data.candidates[index].priceCents<=budget);
  }
  const api={toCents,makeDraft,changeDrink,historicalQuote,selectWithinBudget};
  if (typeof module !== "undefined" && module.exports) module.exports=api;
  else root.MaimaiOrderingModel=Object.freeze(api);
})(typeof window !== "undefined" ? window : {});
