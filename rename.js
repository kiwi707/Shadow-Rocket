function operator(proxies = [], targetPlatform, context) {
  // 1. 去重功能
  const uniqueNames = new Set();
  const log = []; // 日志记录

  // 2. 默认配置
  const defaultConfig = {
    in: 'zh', // 默认识别语言
    out: 'cn', // 默认输出
    fgf: ' ', // 默认分隔符
    sn: ' ', // 默认序号分隔符
    blkey: null, // 自定义保留关键词
    prefix: '节点前缀-', // 节点名称前缀
    suffix: '节点后缀', // 节点名称后缀
    clear: false, // 是否清理乱名
    blockquic: false, // QUIC 阻止
    addFlag: false, // 是否添加国旗
    filterInvalid: false // 是否过滤无效节点
  };

  // 3. 解析 URL 参数
  const urlParams = new URLSearchParams(context.url.split('#')[1]);

  // 4. 检查是否有参数
  if (!Array.from(urlParams.entries()).length) {
    console.log('没有输入参数，返回原始节点。');
    return proxies; // 如果没有参数，则不进行任何操作
  }

  // 5. 获取参数
  for (const [key, value] of urlParams) {
    switch (key) {
      case 'in':
        defaultConfig.in = value; // 识别类型
        break;
      case 'out':
        defaultConfig.out = value; // 输出类型
        break;
      case 'fgf':
        defaultConfig.fgf = value; // 分隔符
        break;
      case 'sn':
        defaultConfig.sn = value; // 序号分隔符
        break;
      case 'blkey':
        defaultConfig.blkey = value.split('+'); // 自定义保留关键词
        break;
      case 'clear':
        defaultConfig.clear = true; // 清理乱名
        break;
      case 'blockquic':
        defaultConfig.blockquic = value === 'on'; // QUIC 阻止
        break;
      case 'prefix':
        defaultConfig.prefix = value; // 前缀
        break;
      case 'suffix':
        defaultConfig.suffix = value; // 后缀
        break;
      case 'addFlag':
        defaultConfig.addFlag = value === 'true'; // 是否添加国旗
        break;
      case 'filterInvalid':
        defaultConfig.filterInvalid = value === 'true'; // 是否过滤无效节点
        break;
      default:
        break;
    }
  }

  // 6. 定义过滤关键词
  const filterKeywords = ['无效', '失效', '过滤'];

  // 7. 定义保留关键词及其替换格式
  const retainKeywordsMap = {
    'V': 'W', // 这里添加需要替换的保留关键词
  };

  // 8. 定义格式化节点名的关键词和指定的新名字
  const formatKeywords = {
    '香港': '🇭🇰HK',
  };

  // 9. 用于跟踪同一名称的计数
  const nameCounts = {};

  // 10. 定义上标字符数组
  const superscripts = ['¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹', '¹⁰', '¹¹', '¹²', '¹³', '¹⁴', '¹⁵', '¹⁶', '¹⁷'];

  // 11. 遍历所有节点
  for (const server of proxies) {
    // 12. 过滤无效节点
    if (defaultConfig.filterInvalid && filterKeywords.some(keyword => server.name.includes(keyword))) {
      server.disable = true; // 过滤掉包含关键词的节点
      continue; // 继续下一个节点
    }

    // 13. 如果需要清理乱名
    if (defaultConfig.clear && !server.name.match(/[\u4e00-\u9fa5]/)) {
      server.disable = true; // 清理乱名的逻辑
      continue;
    }

    // 14. 替换保留关键词
    for (const [keyword, replacement] of Object.entries(retainKeywordsMap)) {
      if (server.name.includes(keyword)) {
        server.name = server.name.replace(new RegExp(keyword, 'g'), replacement); // 替换所有匹配的关键词
      }
    }

    // 15. 检查并格式化节点名
    for (const [keyword, newName] of Object.entries(formatKeywords)) {
      if (server.name.includes(keyword)) {
        // 16. 更新计数并生成唯一后缀
        if (!nameCounts[newName]) {
          nameCounts[newName] = 1; // 初始化计数
        } else {
          nameCounts[newName]++; // 增加计数
        }

        // 17. 添加前缀和上标后缀
        const exponent = nameCounts[newName] <= superscripts.length ? superscripts[nameCounts[newName] - 1] : `(${nameCounts[newName]})`; // 超出范围时用普通括号表示
        
        // 添加国旗 emoji
        if (defaultConfig.addFlag) {
          server.name = `${defaultConfig.prefix}${newName}${exponent}${defaultConfig.suffix} ${formatKeywords['香港']}`; // 假设只有香港有国旗
        } else {
          server.name = `${defaultConfig.prefix}${newName}${exponent}${defaultConfig.suffix}`;
        }

        break; // 匹配到一个关键词后退出
      }
    }

    // 18. 如果没有匹配的关键词且有新的名字，则使用传入的新名字
    if (!server.name.includes(defaultConfig.prefix) && defaultConfig.blkey) {
      for (const bl of defaultConfig.blkey) {
        const [original, replacement] = bl.split('>');
        if (server.name.includes(original)) {
          server.name = server.name.replace(new RegExp(original, 'g'), replacement);
          break; // 替换后退出
        }
      }
      server.name = `${defaultConfig.prefix}${server.name}${defaultConfig.suffix}`; // 使用 URL 参数中的新名字
    } else if (!server.name.includes(defaultConfig.prefix)) {
      server.name = `${defaultConfig.prefix}${server.name}${defaultConfig.suffix}`; // 默认处理
    }

    // 19. 确保节点名称唯一
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

  // 20. 输出日志
  console.log('修改日志:', JSON.stringify(log, null, 2));

  return proxies; // 返回处理后的节点
}