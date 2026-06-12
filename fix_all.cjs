const fs = require("fs");
const p = "C:/Users/Administrator/Documents/个人网站2.0/jpeng-portfolio/backend/admin/admin.js";
let t = fs.readFileSync(p, "utf-8");

// Fix ALL toast calls that have broken closing quotes
// Pattern: toast("...); where the closing " was replaced by ?
t = t.replace(/toast\("([^"]*?)\?\)/g, 'toast("$1")');
// Also fix toast("...); where closing " is missing entirely (already)
// The "已保存) pattern after previous fix
t = t.replace(/toast\("已保存\);/g, 'toast("已保存");');
t = t.replace(/toast\("瀵艰埅已保存\);/g, 'toast("导航已保存");');
t = t.replace(/toast\("Banner 已保存\);/g, 'toast("Banner 已保存");');
t = t.replace(/toast\("鑱旂郴鏂瑰紡宸叉洿鏂?\);/g, 'toast("联系方式已更新");');

// Fix remaining garbled Chinese
t = t.replace(/瀵艰埅鑿滃崟/g, "导航菜单");
t = t.replace(/鐏垫劅鏀惰棌/g, "灵感收藏");
t = t.replace(/缃戠珯璁剧疆/g, "网站设置");
t = t.replace(/淇濆瓨璁剧疆/g, "保存设置");
t = t.replace(/缂栬緫/g, "编辑");
t = t.replace(/娣诲姞瀵艰埅/g, "添加导航");
t = t.replace(/淇濆瓨瀵艰埅/g, "保存导航");
t = t.replace(/鍚嶇О/g, "名称");
t = t.replace(/閾炬帴/g, "链接");
t = t.replace(/鍙栨秷/g, "取消");
t = t.replace(/娣诲姞浣滃搧/g, "添加作品");
t = t.replace(/娣诲姞浼樺娍/g, "添加优势");
t = t.replace(/娣诲姞鐏垫劅/g, "添加灵感");
t = t.replace(/鏍囬/g, "标题");
t = t.replace(/鍒嗙被/g, "分类");
t = t.replace(/鏉ユ簮閾炬帴/g, "来源链接");
t = t.replace(/姝ｆ枃鍐呭/g, "正文内容");
t = t.replace(/鑱旂郴鏂瑰紡/g, "联系方式");
t = t.replace(/鐢佃瘽/g, "电话");
t = t.replace(/鎻忚堪/g, "描述");
t = t.replace(/纭畾鍒犻櫎锛�/g, "确定删除？");
t = t.replace(/宸叉洿鏂�/g, "已更新");
t = t.replace(/宸插垹闄�/g, "已删除");
t = t.replace(/Logo 鏂囧瓧/g, "Logo 文字");
t = t.replace(/搴曢儴鐗堟潈鏂囧瓧/g, "底部版权文字");
t = t.replace(/閫€鍑虹櫥褰�/g, "退出登录");
t = t.replace(/涓绘寜閽枃瀛�/g, "主按钮文字");
t = t.replace(/娆℃寜閽枃瀛�/g, "次按钮文字");
t = t.replace(/鍩庡競/g, "城市");
t = t.replace(/鑻辨枃鍓爣棰�/g, "英文副标题");
t = t.replace(/鎻忚堪鏂囧瓧/g, "描述文字");
t = t.replace(/鏂颁紭鍔�/g, "新优势");
t = t.replace(/鏂扮伒鎰�/g, "新灵感");
t = t.replace(/璁捐/g, "设计");
t = t.replace(/缂栬緫浣滃搧/g, "编辑作品");
t = t.replace(/缂栬緫浼樺娍/g, "编辑优势");
t = t.replace(/缂栬緫鐏垫劅/g, "编辑灵感");

fs.writeFileSync(p, t, "utf-8");
console.log("All fixes applied");

// Verify syntax
const { execSync } = require("child_process");
try {
  execSync('node --check "' + p + '"', { stdio: "pipe" });
  console.log("Syntax check PASSED");
} catch(e) {
  console.log("Syntax FAILED:", e.stderr.toString().substring(0, 500));
}
