脚本使用说明

这段脚本的功能是根据服务器名称中的关键词，对服务器名称进行替换、过滤、跳过处理等操作，并根据特定规则添加前缀、后缀、计数等元素，最后生成符合要求的新服务器名称。

主要功能：

	1.	关键词替换：如果服务器名称中包含特定关键词，则将名称替换为预定义的名称（如国家或地区标识符）。
	2.	过滤关键词：如果服务器名称中包含过滤列表中的关键词，则该服务器名称会被忽略，不做进一步处理。
	3.	跳过关键词：如果服务器名称中包含特定的跳过关键词，不会替换对应的名称，但会保留这些关键词并附加到最终名称中。
	4.	前缀、后缀添加：所有处理后的服务器名称会添加指定的前缀和后缀。
	5.	计数处理：对相同服务器名称进行计数，避免重复。

参数说明：

	1.	customCharStart 和 customCharEnd：
	•	这是要添加的前缀和后缀字符，前缀为 "◎"，后缀为 "ᵀᶻ"。
	2.	keywordsToNames：
	•	一个关键词到指定名称的映射对象。如果服务器名称中匹配了某个关键词，会将服务器名称替换为对应的指定名称。例如，“美|西雅图|US” 对应的名称为 "🇺🇸US"。
	3.	filterKeywords：
	•	一个数组，包含需要过滤的关键词。如果服务器名称中包含这些关键词，则该名称会被忽略，不进行进一步处理。例如，如果名称中包含 "广告" 或 "过期"，该服务器名称会被过滤。
	4.	skipKeywords：
	•	一个数组，包含不进行处理但要保留下来的关键词。如果服务器名称中包含这些关键词，名称会保留下来，不替换为其他内容，但会被附加到最终生成的名称中。例如，如果名称中包含 "GPT"，则该关键词会保留。

处理逻辑：

	1.	过滤关键词：
	•	脚本首先遍历 filterKeywords，如果服务器名称中包含任何一个过滤关键词，则脚本立即返回 false，跳过该服务器名称。
	2.	跳过关键词处理：
	•	脚本遍历 skipKeywords，如果服务器名称中匹配到跳过的关键词，则保留这些部分，并从服务器名称中去除它们，供后续处理。
	3.	关键词替换：
	•	剩余部分的服务器名称会遍历 keywordsToNames 对象。如果名称中包含任何映射的关键词，则替换为对应的名称。
	4.	前缀、计数和后缀：
	•	脚本在生成的服务器名称前面加上指定的前缀 customCharStart，并使用一个全局 map 对象来处理名称重复的问题。对于重复的名称，会在后面加上 -1，-2 等计数以区分。
	•	最后，为名称添加指定的后缀 customCharEnd。
	5.	保留跳过的关键词：
	•	如果原名称中包含跳过的关键词，脚本会将这些关键词附加到处理后的名称后面。

举例说明：

	•	假设服务器名称是 "US洛杉矶节点"：
	1.	服务器名称中包含 "美" 对应的关键词，因此名称被替换为 "🇺🇸US"。
	2.	然后脚本在名称前面添加前缀 "◎"，最后再加上后缀 "ᵀᶻ"，结果为："◎🇺🇸USᵀᶻ"。
	•	假设服务器名称是 "GPT专用节点"：
	1.	服务器名称中匹配到跳过的关键词 "GPT"，名称不会被替换，但 "GPT" 会被保留。
	2.	最终结果为："◎GPTᵀᶻ"。

适用场景：

该脚本适用于需要对服务器名称进行关键词替换、过滤、跳过以及添加自定义前缀后缀等操作的情况。特别适合用于网络配置、订阅管理等需要批量处理服务器名称的场景。

如有其他需求或疑问，欢迎进一步咨询！