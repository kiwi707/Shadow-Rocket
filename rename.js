function operator(proxies = [], context) {
  const uniqueNames = new Set();
  const log = [];

  const filterKeywords = context.filterKeywords ? context.filterKeywords.split(',') : ['无效', '失效', '过滤'];
  const prefix = context.prefix || '节点前缀-';
  const suffix = context.suffix || '节点后缀';
  const retainKeywordsMap = context.retainKeywords ? JSON.parse(context.retainKeywords) : { 'V': 'W' };
  const formatKeywords = context.formatKeywords ? JSON.parse(context.formatKeywords) : { '香港': '🇭🇰HK' };

  for (const server of proxies) {
    if (filterKeywords.some(keyword => server.name.includes(keyword))) {
      server.disable = true;
      continue; 
    }

    // 替换保留关键词
    for (const [keyword, replacement] of Object.entries(retainKeywordsMap)) {
      if (server.name.includes(keyword)) {
        server.name = server.name.replace(new RegExp(keyword, 'g'), replacement);
      }
    }

    // 检查并格式化节点名
    for (const [keyword, newName] of Object.entries(formatKeywords)) {
      if (server.name.includes(keyword)) {
        server.name = `${prefix}${newName}${suffix}`;
        break;
      }
    }

    // 确保节点名称唯一
    let newName = server.name;
    let count = 1;
    while (uniqueNames.has(newName)) {
      newName = `${server.name}-${count++}`;
    }
    uniqueNames.add(newName);
    log.push({ original: server.name, new: newName });
    server.name = newName; 
  }

  console.log('修改日志:', JSON.stringify(log, null, 2));
  return proxies; 
}