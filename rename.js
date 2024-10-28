function getUrlParams() {
  const params = {};
  const queryString = window.location.href.split('#')[1]; // 获取#后面的内容
  if (queryString) {
    const queryParts = queryString.split('&');
    queryParts.forEach(part => {
      const [key, value] = part.split('=');
      params[decodeURIComponent(key)] = value ? decodeURIComponent(value) : true; // 处理没有值的参数
    });
  }
  return params;
}

// 获取 URL 参数
const urlParams = getUrlParams();
const prefix = urlParams.prefix || '节点前缀-'; // 默认值
const suffix = urlParams.suffix || '节点后缀'; // 默认值

function operator(proxies = [], targetPlatform, context) {
  // 1. 去重功能
  const uniqueNames = new Set();
  const log = []; // 日志记录

  // 2. 定义过滤关键词
  const filterKeywords = ['无效', '失效', '过滤'];

  // 3. 使用 URL 参数的前缀和后缀
  // const prefix = urlParams.prefix || '节点前缀-'; // 已在外部获取
  // const suffix = urlParams.suffix || '节点后缀'; // 已在外部获取

  // 4. 定义格式化节点名的关键词和指定的新名字
  const formatKeywords = {
    '香港': '🇭🇰HK',
    // 可以添加更多的关键词和相应的新名字
  };

  // 5. 用于跟踪同一名称的计数
  const nameCounts = {};

  // 6. 定义上标字符数组
  const superscripts = ['¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹', '¹⁰', '¹¹', '¹²', '¹³', '¹⁴', '¹⁵', '¹⁶', '¹⁷'];

  // 7. 遍历所有节点
  for (const server of proxies) {
    // 8. 过滤无效节点
    if (filterKeywords.some(keyword => server.name.includes(keyword))) {
      server.disable = true; // 过滤掉包含关键词的节点
    } else {
      // 9. 检查并格式化节点名
      for (const [keyword, newName] of Object.entries(formatKeywords)) {
        if (server.name.includes(keyword)) {
          // 10. 更新计数并生成唯一后缀
          if (!nameCounts[newName]) {
            nameCounts[newName] = 1; // 初始化计数
          } else {
            nameCounts[newName]++; // 增加计数
          }

          // 11. 添加前缀和上标后缀
          const exponent = nameCounts[newName] <= superscripts.length ? superscripts[nameCounts[newName] - 1] : `(${nameCounts[newName]})`; // 超出范围时用普通括号表示
          server.name = `${prefix}${newName}${exponent}${suffix}`; // 去掉了连字符
          break; // 匹配到一个关键词后退出
        }
      }

      // 12. 如果没有匹配的关键词，保留原名并添加前缀后缀
      if (!server.name.includes(prefix)) {
        server.name = `${prefix}${server.name}${suffix}`; // 默认处理
      }

      // 13. 确保节点名称唯一
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