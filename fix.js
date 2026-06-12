const fs = require('fs');
const p = 'C:/Users/Administrator/Documents/个人网站2.0/jpeng-portfolio/backend/admin/admin.js';
let t = fs.readFileSync(p, 'utf-8');
console.log('Original file length:', t.length);

// Fix the garbled characters - replace with proper Chinese
const replacements = {
  '宸蹭繚瀛?': '已保存',
  '宸蹭繚瀛': '已保存',
  '缃戠珯璁剧疆': '网站设置',
  'Logo 鏂囧瓧': 'Logo 文字',
  '搴曢儴鐗堟潈鏂囧瓧': '底部版权文字',
  '淇濆瓨璁剧疆': '保存设置',
  '閫€鍑虹櫥褰�': '退出登录',
  '瀵艰埅鑿滃崟': '导航菜单',
  '缂栬緫': '编辑',
  '娣诲姞瀵艰埅': '添加导航',
  '淇濆瓨瀵艰埅': '保存导航',
  '鍚嶇О': '名称',
  '閾炬帴': '链接',
  '鍙栨秷': '取消',
  '涓绘寜閽枃瀛�': '主按钮文字',
  '娆℃寜閽枃瀛�': '次按钮文字',
  '鍩庡競': '城市',
  '缂栬緫浣滃搧': '编辑作品',
  '娣诲姞浣滃搧': '添加作品',
  '娣诲姞浼樺娍': '添加优势',
  '缂栬緫浼樺娍': '编辑优势',
  '鐏垫劅鏀惰棌': '灵感收藏',
  '娣诲姞鐏垫劅': '添加灵感',
  '缂栬緫鐏垫劅': '编辑灵感',
  '鏍囬': '标题',
  '鑻辨枃鍓爣棰�': '英文副标题',
  '鍒嗙被': '分类',
  '鏉ユ簮閾炬帴': '来源链接',
  '姝ｆ枃鍐呭': '正文内容',
  '鑱旂郴鏂瑰紡': '联系方式',
  '鐢佃瘽': '电话',
  '鎻忚堪鏂囧瓧': '描述文字',
  '鏂颁紭鍔�': '新优势',
  '鎻忚堪': '描述',
  '鏂扮伒鎰�': '新灵感',
  '璁捐': '设计',
  '纭畾鍒犻櫎锛�': '确定删除？',
  '宸蹭繚瀛�': '已保存',
  '宸叉洿鏂�': '已更新',
  '宸插垹闄�': '已删除',
  '宸茶繛鎺�': '已连接',
  '宸茶В闄よ繛鎺�': '解除连接',
  '宸茬粡淇濆瓨': '已经保存',
  '镄勬柊椤圭洰': '的新项目',
  '椤圭洰': '项目',
  '鏂扮殑鎻愮ず': '新的提示',
};

for (const [garbled, correct] of Object.entries(replacements)) {
  t = t.split(garbled).join(correct);
}

// Also fix the broken string with ? char
t = t.replace(/toast\("([^"]*)\?[^"]*"\)/g, 'toast("已保存")');

fs.writeFileSync(p, t, 'utf-8');
console.log('Fixed ✅ New length:', t.length);
