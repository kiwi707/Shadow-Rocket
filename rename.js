function operator(proxies = [], targetPlatform, context) {
  // 1. 去重功能
  const uniqueNames = new Set();
  const log = []; // 日志记录

  // 2. 定义过滤关键词
  const filterKeywords = ['无效', '失效', '过滤'];

  // 3. 添加前缀和后缀
  const prefix = '节点前缀-'; // 可以根据条件动态设置
  const suffix = '节点后缀'; // 可以根据条件动态设置

  // 4. 定义保留关键词及其替换格式
  const retainKeywordsMap = {
    'V': 'W', // 这里添加需要替换的保留关键词
    // 可以添加更多的关键词和替换格式
  };

  // 5. 定义格式化节点名的关键词和指定的新名字
  const formatKeywords = {
    '香港': '🇭🇰HK',
    // 可以添加更多的关键词和相应的新名字
  };

  // 6. 用于跟踪同一名称的计数
  const nameCounts = {};

  // 7. 定义上标字符数组
  const superscripts = ['¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹', '¹⁰', '¹¹', '¹²', '¹³', '¹⁴', '¹⁵', '¹⁶', '¹⁷'];

  // 8. 遍历所有节点
  for (const server of proxies) {
    // 9. 过滤无效节点
    if (filterKeywords.some(keyword => server.name.includes(keyword))) {
      server.disable = true; // 过滤掉包含关键词的节点
    } else {
      // 10. 替换保留关键词
      for (const [keyword, replacement] of Object.entries(retainKeywordsMap)) {
        if (server.name.includes(keyword)) {
          server.name = server.name.replace(new RegExp(keyword, 'g'), replacement); // 替换所有匹配的关键词
        }
      }

      // 11. 检查并格式化节点名
      for (const [keyword, newName] of Object.entries(formatKeywords)) {
        if (server.name.includes(keyword)) {
          // 12. 更新计数并生成唯一后缀
          if (!nameCounts[newName]) {
            nameCounts[newName] = 1; // 初始化计数
          } else {
            nameCounts[newName]++; // 增加计数
          }

          // 13. 添加前缀和上标后缀
          const exponent = nameCounts[newName] <= superscripts.length ? superscripts[nameCounts[newName] - 1] : `(${nameCounts[newName]})`; // 超出范围时用普通括号表示
          server.name = `${prefix}${newName}${exponent}${suffix}`; // 去掉了连字符
          break; // 匹配到一个关键词后退出
        }
      }

      // 14. 如果没有匹配的关键词，保留原名并添加前缀后缀
      if (!server.name.includes(prefix)) {
        server.name = `${prefix}${server.name}${suffix}`; // 默认处理
      }

      // 15. 确保节点名称唯一
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