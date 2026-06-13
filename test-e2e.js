async function test() {
  console.log('=== 开始端到端测试 ===\n');
  
  // 1. 登录获取token
  console.log('1. 登录...');
  const loginRes = await fetch('http://localhost:3001/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'jpeng', password: 'jpeng2024' })
  });
  const loginData = await loginRes.json();
  console.log('登录结果:', loginData.success ? '成功' : '失败');
  const token = loginData.token;
  
  // 2. 读取当前数据
  console.log('\n2. 读取当前数据...');
  const dataRes = await fetch('http://localhost:3001/api/data');
  const data = await dataRes.json();
  console.log('当前项目数量:', data.projects.length);
  console.log('第一个项目标题:', data.projects[0].title);
  
  // 3. 修改第一个项目标题
  console.log('\n3. 修改第一个项目标题...');
  const newTitle = 'E2E测试-' + new Date().toLocaleTimeString();
  const updateRes = await fetch('http://localhost:3001/api/projects/p1', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ title: newTitle })
  });
  const updateData = await updateRes.json();
  console.log('修改结果:', updateData.title);
  
  // 4. 重新读取数据确认修改成功
  console.log('\n4. 重新读取数据...');
  const dataRes2 = await fetch('http://localhost:3001/api/data');
  const data2 = await dataRes2.json();
  console.log('修改后的第一个项目标题:', data2.projects[0].title);
  console.log('修改是否成功:', data2.projects[0].title === newTitle ? '✓ 成功' : '✗ 失败');
  
  // 5. 检查前台构建文件
  console.log('\n5. 检查前台构建文件...');
  const fs = await import('fs');
  const jsFile = fs.readFileSync('./dist/assets/index-efLMMjKR.js', 'utf-8');
  console.log('构建文件大小:', jsFile.length, '字节');
  console.log('是否包含fetchAllData:', jsFile.includes('fetchAllData') ? '✓ 是' : '✗ 否');
  console.log('是否包含work-section:', jsFile.includes('work-section') ? '✓ 是' : '✗ 否');
  console.log('是否包含in-view:', jsFile.includes('in-view') ? '✓ 是' : '✗ 否');
  
  console.log('\n=== 测试完成 ===');
  console.log('如果修改成功,说明后台→API→数据保存都正常');
  console.log('如果前台不显示,问题可能在:');
  console.log('  - 浏览器缓存(需要强制刷新Ctrl+Shift+R)');
  console.log('  - CSS样式(检查.work-section的opacity)');
  console.log('  - 前端JS错误(打开浏览器控制台查看)');
}

test().catch(e => console.error('测试失败:', e));
