function operator(proxies = [], targetPlatform, context) {
  // 解析 URL 参数
  const urlParams = new URL(context.url).searchParams;
  const prefix = urlParams.get('prefix') || '默认前缀';
  const suffix = urlParams.get('suffix') || '默认后缀';

  // 1. 去重功能
  const uniqueNames = new Set();
  const log = []; // 日志记录

  // 2. 定义过滤关键词
  const filterKeywords = ['无效', '失效', '过滤'];

  // 3. 定义格式化节点名的关键词和指定的新名字
  const formatKeywords = {
    '香港': '🇭🇰HK',
    // 可以添加更多的关键词和相应的新名字
  };

  // 4. 用于跟踪同一名称的计数
  const nameCounts = {};

  // 5. 定义上标字符数组
  const superscripts = ['¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹', '¹⁰', '¹¹', '¹²', '¹³', '¹⁴', '¹⁵', '¹⁶', '¹⁷'];

  // 遍历所有节点
  for (const server of proxies) {
    if (filterKeywords.some(keyword => server.name.includes(keyword))) {
      server.disable = true;
    } else {
      for (const [keyword, newName] of Object.entries(formatKeywords)) {
        if (server.name.includes(keyword)) {
          if (!nameCounts[newName]) nameCounts[newName] = 1;
          else nameCounts[newName]++;
          
          const exponent = nameCounts[newName] <= superscripts.length ? superscripts[nameCounts[newName] - 1] : `(${nameCounts[newName]})`;
          server.name = `${prefix}${newName}${exponent}${suffix}`;
          break;
        }
      }

      if (!server.name.includes(prefix)) {
        server.name = `${prefix}${server.name}${suffix}`;
      }

      let newName = server.name;
      let originalName = newName;
      let count = 1;

      while (uniqueNames.has(newName)) {
        newName = `${originalName}-${count++}`;
      }
      uniqueNames.add(newName);
      log.push({ original: server.name, new: newName });
      server.name = newName;
    }
  }

  console.log('修改日志:', JSON.stringify(log, null, 2));

  return proxies;
}