function operator(proxies = [], targetPlatform, context) {
  // 获取 URL 参数
  const params = new URLSearchParams(context.request.url.split('?')[1]);

  // 从参数中读取自定义内容，提供默认值
  const prefix = params.get('prefix') || '节点前缀-';
  const suffix = params.get('suffix') || '节点后缀';
  const filterKeywords = params.get('filterKeywords') ? params.get('filterKeywords').split(',') : ['无效', '失效', '过滤'];

  // 去重功能
  const uniqueNames = new Set();
  const log = []; // 日志记录

  // 格式化节点名的关键词和指定的新名字
  const formatKeywords = {
    '香港': '🇭🇰HK',
    // 你可以在这里添加更多关键词
  };

  // 用于跟踪同一名称的计数
  const nameCounts = {};

  // 定义上标字符数组
  const superscripts = ['¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹', '¹⁰', '¹¹', '¹²', '¹³', '¹⁴', '¹⁵', '¹⁶', '¹⁷'];

  // 遍历所有节点
  for (const server of proxies) {
    // 过滤无效节点
    if (filterKeywords.some(keyword => server.name.includes(keyword))) {
      server.disable = true; // 过滤掉包含关键词的节点
    } else {
      // 检查并格式化节点名
      for (const [keyword, newName] of Object.entries(formatKeywords)) {
        if (server.name.includes(keyword)) {
          // 更新计数并生成唯一后缀
          if (!nameCounts[newName]) {
            nameCounts[newName] = 1; // 初始化计数
          } else {
            nameCounts[newName]++; // 增加计数
          }

          // 添加前缀和上标后缀
          const exponent = nameCounts[newName] <= superscripts.length ? superscripts[nameCounts[newName] - 1] : `(${nameCounts[newName]})`; // 超出范围时用普通括号表示
          server.name = `${prefix}${newName}${exponent}${suffix}`;
          break; // 匹配到一个关键词后退出
        }
      }

      // 如果没有匹配的关键词，保留原名
      if (!server.name.includes(prefix)) {
        server.name = `${prefix}${server.name}${suffix}`;
      }

      // 确保节点名称唯一
      let newName = server.name;
      let originalName = newName;
      let count = 1;

      while (uniqueNames.has(newName)) {
        newName = `${originalName}-${count++}`;
      }
      uniqueNames.add(newName);
      log.push({ original: server.name, new: newName });
      server.name = newName; // 最终重命名
    }
  }

  // 输出日志
  console.log('修改日志:', JSON.stringify(log, null, 2));

  return proxies; // 返回处理后的节点
}