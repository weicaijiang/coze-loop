# 模型配置

[English](llm_configuration.md) | 中文

## 快速开始
Cozeloop 通过 Eino 框架支持多种 LLM 模型：

| 模型         | 支持状态 |
|------------|------|
| Ark/ArkBot | ✅    |
| OpenAI     | ✅    |
| DeepSeek   | ✅    |
| Claude     | ✅    | 
| Gemini     | ✅    |
| Ollama     | ✅    |
| Qwen       | ✅    |
| Qianfan    | ✅    |

当您想要修改可用的模型信息，如增删模型，修改现有模型配置，您都需要执行以下操作：

1. **修改配置**：
   - 配置文件位置为：[`conf/default/app/runtime/model_config.yaml`](../conf/default/app/runtime/model_config.yaml)，该文件为配置列表的Yaml文件。
   - 快速接入可参考下方各类模型的最简配置即可，修改其中关键配置即可使用，需要修改的字段使用 **Change It** 做了标注。
   - 各模型完整配置，可以参考 [`backend/modules/llm/infra/config/model_repo_example`](../backend/modules/llm/infra/config/model_repo_example) 内的各模型完整配置示例。
   - 要使用 **qianfan** 模型，还需要在[`conf/default/app/runtime/model_runtime_config.yaml`](../conf/default/app/runtime/model_runtime_config.yaml) 文件中配置qianfan_ak和qianfan_sk
2. **配置示例**：

   这是一个模型配置示例，包含了方舟和 OpenAI 模型配置，每个模型的 ID 唯一且需大于0，每个不同的模型有不同的配置，可参考后文的最简配置和完整配置，其中最关健需要修改的内容就是**model**和**api_key**。

   ```yaml
   models:
     - id: 1
       name: "doubao"
       frame: "eino"
       protocol: "ark"
       protocol_config:
         api_key: "***" # Change it
         model: "***"   # Change it
       param_config:
         param_schemas:
           - name: "temperature"
             label: "生成随机性"
             desc: "调高温度会使得模型的输出更多样性和创新性，反之，降低温度会使输出内容更加遵循指令要求但减少多样性。建议不要与 “Top p” 同时调整。"
             type: "float"
             min: "0"
             max: "1.0"
             default_val: "0.7"
           - name: "max_tokens"
             label: "最大回复长度"
             desc: "控制模型输出的 Tokens 长度上限。通常 100 Tokens 约等于 150 个中文汉字。"
             type: "int"
             min: "1"
             max: "4096"
             default_val: "2048"
           - name: "top_p"
             label: "核采样概率"
             desc: "生成时选取累计概率达 top_p 的最小 token 集合，集合外 token 被排除，平衡多样性与合理性。"
             type: "float" #
             min: "0.001"
             max: "1.0"
             default_val: "0.7"
     - id: 2
       name: "openai"
       frame: "eino"
       protocol: "openai"
       protocol_config:
         api_key: "***" # Change it
         model: "***"   # Change it
       param_config:
         param_schemas:
           - name: "temperature"
             label: "生成随机性"
             desc: "调高温度会使得模型的输出更多样性和创新性，反之，降低温度会使输出内容更加遵循指令要求但减少多样性。建议不要与 “Top p” 同时调整。"
             type: "float"
             min: "0"
             max: "1.0"
             default_val: "0.7"
           - name: "max_tokens"
             label: "最大回复长度"
             desc: "控制模型输出的 Tokens 长度上限。通常 100 Tokens 约等于 150 个中文汉字。"
             type: "int"
             min: "1"
             max: "4096"
             default_val: "2048"
           - name: "top_p"
             label: "核采样概率"
             desc: "生成时选取累计概率达 top_p 的最小 token 集合，集合外 token 被排除，平衡多样性与合理性。"
             type: "float" #
             min: "0.001"
             max: "1.0"
             default_val: "0.7"
   ```

3. **配置生效**：
   - 如果当前服务还未启动，正常启动服务即可
   - 如果服务已经启动，当前使用文件监听更新配置，在有些场景下监听会失效(比如Mac下文件挂载监听可能会有问题)，这时候可以重启一下服务，不用重新build：
      ```bash
      # 需要保持RUN_MODE一致
      docker compose restart app
      ```

## 注意事项
在修改模型配置之前，请确保你已经了解了以下注意事项：
1. 保证每个模型的id**全局唯一且大于0**，模型上线后请勿修改id。
2. 在删除模型之前，请确保此模型已无线上流量
3. 请确保**评估器**可使用的模型都具有较强的function call能力，否则可能导致评估器无法正常工作。

## 模型最简配置

下面列出各模型的最简配置，其中大部分的内容都是相似的，绝大部分都是**protocal**不同。

### Ark

```yaml
- id: 1                   # Change It
  name: "your model name" # Change It
  frame: "eino"
  protocol: "ark" 
  protocol_config:
    api_key: "" # Change It。详情见 https://github.com/cloudwego/eino-ext/blob/main/components/model/ark/chatmodel.go
    model: ""   # Change It。详情见 https://github.com/cloudwego/eino-ext/blob/main/components/model/ark/chatmodel.go
  param_config: # 一般无需修改，决定了前端可调的参数有哪些，可调范围和默认值是多少
    param_schemas:
      - name: "temperature"
        label: "生成随机性"
        desc: "调高温度会使得模型的输出更多样性和创新性，反之，降低温度会使输出内容更加遵循指令要求但减少多样性。建议不要与 “Top p” 同时调整。"
        type: "float"
        min: "0"
        max: "1.0"
        default_val: "0.7"
      - name: "max_tokens"
        label: "最大回复长度"
        desc: "控制模型输出的 Tokens 长度上限。通常 100 Tokens 约等于 150 个中文汉字。"
        type: "int"
        min: "1"
        max: "4096"
        default_val: "2048"
      - name: "top_p"
        label: "核采样概率"
        desc: "生成时选取累计概率达 top_p 的最小 token 集合，集合外 token 被排除，平衡多样性与合理性。"
        type: "float" #
        min: "0.001"
        max: "1.0"
        default_val: "0.7"
```

### Claude

```yaml
- id: 1                    # Change It
  name: "your model name"  # Change It
  frame: "eino"
  protocol: "claude" 
  protocol_config:
    api_key: "" # Change It。详情见 https://github.com/cloudwego/eino-ext/blob/main/components/model/claude/claude.go
    model: ""   # Change It。详情见 https://github.com/cloudwego/eino-ext/blob/main/components/model/claude/claude.go
  param_config: #一般无需修改，决定了前端可调的参数有哪些，可调范围和默认值是多少
    param_schemas:
      - name: "temperature"
        label: "生成随机性"
        desc: "调高温度会使得模型的输出更多样性和创新性，反之，降低温度会使输出内容更加遵循指令要求但减少多样性。建议不要与 “Top p” 同时调整。"
        type: "float"
        min: "0"
        max: "1.0"
        default_val: "0.7"
      - name: "max_tokens"
        label: "最大回复长度"
        desc: "控制模型输出的 Tokens 长度上限。通常 100 Tokens 约等于 150 个中文汉字。"
        type: "int"
        min: "1"
        max: "4096"
        default_val: "2048"
      - name: "top_p"
        label: "核采样概率"
        desc: "生成时选取累计概率达 top_p 的最小 token 集合，集合外 token 被排除，平衡多样性与合理性。"
        type: "float" #
        min: "0.001"
        max: "1.0"
        default_val: "0.7"
```

### Deepseek

```yaml
- id: 1                    # Change It
  name: "your model name"  # Change It
  frame: "eino"
  protocol: "deepseek" 
  protocol_config:
    api_key: "" # Change It。详情见 https://github.com/cloudwego/eino-ext/blob/main/components/model/deepseek/deepseek.go
    model: ""   # Change It。详情见 https://github.com/cloudwego/eino-ext/blob/main/components/model/deepseek/deepseek.go
  param_config: #一般无需修改，决定了前端可调的参数有哪些，可调范围和默认值是多少
    param_schemas:
      - name: "temperature"
        label: "生成随机性"
        desc: "调高温度会使得模型的输出更多样性和创新性，反之，降低温度会使输出内容更加遵循指令要求但减少多样性。建议不要与 “Top p” 同时调整。"
        type: "float"
        min: "0"
        max: "1.0"
        default_val: "0.7"
      - name: "max_tokens"
        label: "最大回复长度"
        desc: "控制模型输出的 Tokens 长度上限。通常 100 Tokens 约等于 150 个中文汉字。"
        type: "int"
        min: "1"
        max: "4096"
        default_val: "2048"
      - name: "top_p"
        label: "核采样概率"
        desc: "生成时选取累计概率达 top_p 的最小 token 集合，集合外 token 被排除，平衡多样性与合理性。"
        type: "float" #
        min: "0.001"
        max: "1.0"
        default_val: "0.7"
```

### Gemini

```yaml
- id: 1                   # Change It
  name: "your model name" # Change It
  frame: "eino"
  protocol: "gemini" 
  protocol_config:
    api_key: "" # Change It。详情见 https://github.com/cloudwego/eino-ext/blob/main/components/model/gemini/gemini.go
    model: ""   # Change It。详情见 https://github.com/cloudwego/eino-ext/blob/main/components/model/gemini/gemini.go
  param_config: #一般无需修改，决定了前端可调的参数有哪些，可调范围和默认值是多少
    param_schemas:
      - name: "temperature"
        label: "生成随机性"
        desc: "调高温度会使得模型的输出更多样性和创新性，反之，降低温度会使输出内容更加遵循指令要求但减少多样性。建议不要与 “Top p” 同时调整。"
        type: "float"
        min: "0"
        max: "1.0"
        default_val: "0.7"
      - name: "max_tokens"
        label: "最大回复长度"
        desc: "控制模型输出的 Tokens 长度上限。通常 100 Tokens 约等于 150 个中文汉字。"
        type: "int"
        min: "1"
        max: "4096"
        default_val: "2048"
      - name: "top_p"
        label: "核采样概率"
        desc: "生成时选取累计概率达 top_p 的最小 token 集合，集合外 token 被排除，平衡多样性与合理性。"
        type: "float" #
        min: "0.001"
        max: "1.0"
        default_val: "0.7"
```

### Ollama

```yaml
- id: 1                   # Change It
  name: "your model name" # Change It
  frame: "eino"
  protocol: "ollama" 
  protocol_config:
    base_url: "" # Change It。详情见 https://github.com/cloudwego/eino-ext/blob/main/components/model/ollama/chatmodel.go
    model: ""    # Change It。详情见 https://github.com/cloudwego/eino-ext/blob/main/components/model/ollama/chatmodel.go
  param_config:  #一般无需修改，决定了前端可调的参数有哪些，可调范围和默认值是多少
    param_schemas:
      - name: "temperature"
        label: "生成随机性"
        desc: "调高温度会使得模型的输出更多样性和创新性，反之，降低温度会使输出内容更加遵循指令要求但减少多样性。建议不要与 “Top p” 同时调整。"
        type: "float"
        min: "0"
        max: "1.0"
        default_val: "0.7"
      - name: "max_tokens"
        label: "最大回复长度"
        desc: "控制模型输出的 Tokens 长度上限。通常 100 Tokens 约等于 150 个中文汉字。"
        type: "int"
        min: "1"
        max: "4096"
        default_val: "2048"
      - name: "top_p"
        label: "核采样概率"
        desc: "生成时选取累计概率达 top_p 的最小 token 集合，集合外 token 被排除，平衡多样性与合理性。"
        type: "float" #
        min: "0.001"
        max: "1.0"
        default_val: "0.7"
```

### OpenAI
```yaml
- id: 1                   # Change It
  name: "your model name" # Change It
  frame: "eino"
  protocol: "openai" 
  protocol_config:
    api_key: "" # Change It。详情见https://github.com/cloudwego/eino-ext/blob/main/components/model/openai/chatmodel.go
    model: ""   # Change It。详情见https://github.com/cloudwego/eino-ext/blob/main/components/model/openai/chatmodel.go
  param_config: #一般无需修改，决定了前端可调的参数有哪些，可调范围和默认值是多少
    param_schemas:
      - name: "temperature"
        label: "生成随机性"
        desc: "调高温度会使得模型的输出更多样性和创新性，反之，降低温度会使输出内容更加遵循指令要求但减少多样性。建议不要与 “Top p” 同时调整。"
        type: "float"
        min: "0"
        max: "1.0"
        default_val: "0.7"
      - name: "max_tokens"
        label: "最大回复长度"
        desc: "控制模型输出的 Tokens 长度上限。通常 100 Tokens 约等于 150 个中文汉字。"
        type: "int"
        min: "1"
        max: "4096"
        default_val: "2048"
      - name: "top_p"
        label: "核采样概率"
        desc: "生成时选取累计概率达 top_p 的最小 token 集合，集合外 token 被排除，平衡多样性与合理性。"
        type: "float" #
        min: "0.001"
        max: "1.0"
        default_val: "0.7"
```

### Qianfan

```yaml
- id: 1                   # Change It
  name: "your model name" # Change It
  frame: "eino"
  protocol: "qianfan" 
  protocol_config:
    model: ""   # Change It。详情见 https://github.com/cloudwego/eino-ext/blob/main/components/model/qianfan/chatmodel.go
  param_config: #一般无需修改，决定了前端可调的参数有哪些，可调范围和默认值是多少
    param_schemas:
      - name: "temperature"
        label: "生成随机性"
        desc: "调高温度会使得模型的输出更多样性和创新性，反之，降低温度会使输出内容更加遵循指令要求但减少多样性。建议不要与 “Top p” 同时调整。"
        type: "float"
        min: "0"
        max: "1.0"
        default_val: "0.7"
      - name: "max_tokens"
        label: "最大回复长度"
        desc: "控制模型输出的 Tokens 长度上限。通常 100 Tokens 约等于 150 个中文汉字。"
        type: "int"
        min: "1"
        max: "4096"
        default_val: "2048"
      - name: "top_p"
        label: "核采样概率"
        desc: "生成时选取累计概率达 top_p 的最小 token 集合，集合外 token 被排除，平衡多样性与合理性。"
        type: "float" #
        min: "0.001"
        max: "1.0"
        default_val: "0.7"
```

使用Qianfan模型需要额外修改[`conf/default/app/runtime/model_runtime_config.yaml`](../conf/default/app/runtime/model_runtime_config.yaml)文件中的**qianfan_ak**和**qianfan_sk**。

### Qwen
```yaml
- id: 1                   # Change It
  name: "your model name" # Change It
  frame: "eino"
  protocol: "qwen" 
  protocol_config:
    api_key: "" # Change It。详情见 https://github.com/cloudwego/eino-ext/blob/main/components/model/qwen/chatmodel.go
    model: ""   # Change It。详情见 https://github.com/cloudwego/eino-ext/blob/main/components/model/qwen/chatmodel.go
  param_config: #一般无需修改，决定了前端可调的参数有哪些，可调范围和默认值是多少
    param_schemas:
      - name: "temperature"
        label: "生成随机性"
        desc: "调高温度会使得模型的输出更多样性和创新性，反之，降低温度会使输出内容更加遵循指令要求但减少多样性。建议不要与 “Top p” 同时调整。"
        type: "float"
        min: "0"
        max: "1.0"
        default_val: "0.7"
      - name: "max_tokens"
        label: "最大回复长度"
        desc: "控制模型输出的 Tokens 长度上限。通常 100 Tokens 约等于 150 个中文汉字。"
        type: "int"
        min: "1"
        max: "4096"
        default_val: "2048"
      - name: "top_p"
        label: "核采样概率"
        desc: "生成时选取累计概率达 top_p 的最小 token 集合，集合外 token 被排除，平衡多样性与合理性。"
        type: "float" #
        min: "0.001"
        max: "1.0"
        default_val: "0.7"
```

### Arkbot

```yaml
- id: 1                   # Change It
  name: "your model name" # Change It
  frame: "eino"
  protocol: "arkbot" 
  protocol_config:
    api_key: "" # Change It。详情见 https://github.com/cloudwego/eino-ext/blob/main/components/model/arkbot/chatmodel.go
    model: ""   # Change It。详情见 https://github.com/cloudwego/eino-ext/blob/main/components/model/arkbot/chatmodel.go
  param_config: #一般无需修改，决定了前端可调的参数有哪些，可调范围和默认值是多少
    param_schemas:
      - name: "temperature"
        label: "生成随机性"
        desc: "调高温度会使得模型的输出更多样性和创新性，反之，降低温度会使输出内容更加遵循指令要求但减少多样性。建议不要与 “Top p” 同时调整。"
        type: "float"
        min: "0"
        max: "1.0"
        default_val: "0.7"
      - name: "max_tokens"
        label: "最大回复长度"
        desc: "控制模型输出的 Tokens 长度上限。通常 100 Tokens 约等于 150 个中文汉字。"
        type: "int"
        min: "1"
        max: "4096"
        default_val: "2048"
      - name: "top_p"
        label: "核采样概率"
        desc: "生成时选取累计概率达 top_p 的最小 token 集合，集合外 token 被排除，平衡多样性与合理性。"
        type: "float" #
        min: "0.001"
        max: "1.0"
        default_val: "0.7"
```

## 模型完整配置

模型具体代码结构定义见[`backend/modules/llm/domain/entity/manage.go`](../backend/modules/llm/domain/entity/manage.go)。下面给出完整的模型配置说明，其中写明了各字段的含义以及是否需要填写。

```yaml
- id: 1    # 必需，必须唯一且大于0。
  name: "your model name" # 必需，模型名称。
  desc: "" # 可选，模型描述。
  ability: # 可选，模型能力配置。
     function_call: true # 可选，默认值为false。如果模型需要使用函数调用能力，请设置为true。
     json_mode: false    # 可选，此参数仅表示模型能力，暂时不会产生实际效果。
     multi_modal: true   # 可选，默认值为false。如果模型需要使用多模态能力，请设置为true。
     ability_multi_modal:
        image: true      # 可选，默认值为false。如果模型需要使用多模态图像能力，请设置为true。
        ability_image:
           url_enabled: true    # 可选，默认值为false。如果模型需要使用多模态图像URL能力，请设置为true。
           binary_enabled: true # 可选，默认值为false。如果模型需要使用多模态图像二进制能力，请设置为true。
           max_image_size: 20   # 可选，单位为MB。默认值为0，表示不限制大小。
           max_image_count: 20  # 可选，默认值为0，表示不限制数量。
  frame: "eino"    # 必需，可选值：[eino]。
  protocol: "ark"  # 必需，可选值：[ark, openai, deepseek, qwen, qianfan, ollama, gemini, claude, arkbot]
  protocol_config: # 必需，模型配置。
     base_url: ""  # 可选，不填会使用模型对应的默认值。
     api_key: ""   # 必需，模型API_KEY.
     model: ""     # 必需，调用的模型名。
     protocol_config_ark: # 可选，使用ark模型时可以填写。
        region: ""        # 可选，详情见https://github.com/cloudwego/eino-ext/blob/main/components/model/ark/chatmodel.go
        access_key: ""    # 可选，详情见https://github.com/cloudwego/eino-ext/blob/main/components/model/ark/chatmodel.go
        secret_key: ""    # 可选，详情见https://github.com/cloudwego/eino-ext/blob/main/components/model/ark/chatmodel.go
        retry_times: ""   # 可选，详情见https://github.com/cloudwego/eino-ext/blob/main/components/model/ark/chatmodel.go
        custom_headers:   # 可选，详情见https://github.com/cloudwego/eino-ext/blob/main/components/model/ark/chatmodel.go
     protocol_config_open_ai:         # 可选，使用openai模型时可以填写
        by_azure: false               # 可选，详情见https://github.com/cloudwego/eino-ext/blob/main/components/model/openai/chatmodel.go
        api_version: ""               # 可选，详情见https://github.com/cloudwego/eino-ext/blob/main/components/model/openai/chatmodel.go
        response_format_type: ""      # 可选，详情见https://github.com/cloudwego/eino-ext/blob/main/components/model/openai/chatmodel.go    
        ResponseFormatJsonSchema: ""  # 可选，详情见https://github.com/cloudwego/eino-ext/blob/main/components/model/openai/chatmodel.go
     protocol_config_claude:     # 可选，使用claude模型时可以填写
        by_bedrock: false        # 可选，详情见https://github.com/cloudwego/eino-ext/blob/main/components/model/claude/claude.go
        access_key: ""           # 可选，详情见https://github.com/cloudwego/eino-ext/blob/main/components/model/claude/claude.go
        secret_access_key: ""    # 可选，详情见https://github.com/cloudwego/eino-ext/blob/main/components/model/claude/claude.go
        session_token: ""        # 可选，详情见https://github.com/cloudwego/eino-ext/blob/main/components/model/claude/claude.go
        region: ""               # 可选，详情见https://github.com/cloudwego/eino-ext/blob/main/components/model/claude/claude.go
     protocol_config_deep_seek:  # 可选，使用deepseek模型时可以填写
        response_format_type: "" #可选，详情见https://github.com/cloudwego/eino-ext/blob/main/components/model/deepseek/deepseek.go
     protocol_config_gemini:          # 可选，使用gemeni模型时可以填写
        response_schema: ""           # 可选，详情见https://github.com/cloudwego/eino-ext/blob/main/components/model/gemini/gemini.go
        enable_code_execution: false  # 可选，详情见https://github.com/cloudwego/eino-ext/blob/main/components/model/gemini/gemini.go
        safety_settings:              # 可选，详情见https://github.com/cloudwego/eino-ext/blob/main/components/model/gemini/gemini.go
           - category: 0
             threshold: 0
     protocol_config_ollama: # 可选，使用ollama模型时可以填写
        format: ""           # 可选，详情见https://github.com/cloudwego/eino-ext/blob/main/components/model/ollama/chatmodel.go
        keep_alive_ms: ""    # 可选，详情见https://github.com/cloudwego/eino-ext/blob/main/components/model/ollama/chatmodel.go
     protocol_config_qwen:              # 可选，使用qwen模型时可以填写
        response_format_type: ""        # 可选，详情见https://github.com/cloudwego/eino-ext/blob/main/components/model/qwen/chatmodel.go
        response_format_json_schema: "" # 可选，详情见https://github.com/cloudwego/eino-ext/blob/main/components/model/qwen/chatmodel.go
     protocol_config_qianfan:           # 可选，使用qianfan模型时可以填写
        llm_retry_count: ""             # 可选，详情见https://github.com/cloudwego/eino-ext/blob/main/components/model/qianfan/chatmodel.go
        llm_retry_timeout: ""           # 可选，详情见https://github.com/cloudwego/eino-ext/blob/main/components/model/qianfan/chatmodel.go
        llm_retry_backoff_factor: ""    # 可选，详情见https://github.com/cloudwego/eino-ext/blob/main/components/model/qianfan/chatmodel.go
        parallel_tool_calls: ""         # 可选，详情见https://github.com/cloudwego/eino-ext/blob/main/components/model/qianfan/chatmodel.go
        response_format_type: ""        # 可选，详情见https://github.com/cloudwego/eino-ext/blob/main/components/model/qianfan/chatmodel.go
        response_format_json_schema: "" # 可选，详情见https://github.com/cloudwego/eino-ext/blob/main/components/model/qianfan/chatmodel.go
     protocol_config_ark_bot: # 可选，使用arkbot模型时可以填写
        region: ""            # 可选，详情见https://github.com/cloudwego/eino-ext/blob/main/components/model/arkbot/chatmodel.go
        access_key: ""        # 可选，详情见https://github.com/cloudwego/eino-ext/blob/main/components/model/arkbot/chatmodel.go
        secret_key: ""        # 可选，详情见https://github.com/cloudwego/eino-ext/blob/main/components/model/arkbot/chatmodel.go
        retry_times: ""       # 可选，详情见https://github.com/cloudwego/eino-ext/blob/main/components/model/arkbot/chatmodel.go
  scenario_configs: # 可选，这是一个map。场景配置有两个作用：模型在该场景中是否可用；2.模型在该场景中的qpm和tpm限制。
     default:
        scenario: "default" # 当本模型被请求时，如果请求的场景不在scenario_configs中，则使用default场景的限流配置。类似的，如果其他场景不存在，则可见性也由default场景的配置决定。
        quota:
           qpm: 0 # 可选，默认值为0，表示系统不限制qpm。
           tpm: 0 # 可选，默认值为0，表示系统不限制tpm。
        unavailable: false # 可选，默认值为false，表示模型在该场景的可见性。
     prompt_debug:
        scenario: "prompt_debug" # 当本模型被请求时，如果请求由Prompt发起，则使用prompt_debug场景的配置。且决定了Prompt页面本模型的可见性
        quota:
           qpm: 0 # 可选，默认值为0，表示系统不限制qpm。
           tpm: 0 # 可选，默认值为0，表示系统不限制tpm。
        unavailable: false # 可选，默认值为false，表示模型在该场景的可见性。
     evaluator:
        scenario: "evaluator" # 当本模型被请求时，如果请求由Prompt发起，则使用evaluator场景的配置。且决定了评估器页面本模型的可见性
        quota:
           qpm: 0 # 可选，默认值为0，表示系统不限制qpm。
           tpm: 0 # 可选，默认值为0，表示系统不限制tpm。
        unavailable: false # 可选。默认值为false。如果此模型不支持函数调用，请设置为true，因为评估器必须使用函数调用。
  param_config:     # 必需。
     param_schemas: # 必需，此参数确定模型的哪些参数可以在提示词和评估器界面中修改。目前仅支持以下参数。
        - name: "temperature"
          label: "生成随机性" # 在前端显示的名称
          desc: "调高温度会使得模型的输出更多样性和创新性，反之，降低温度会使输出内容更加遵循指令要求但减少多样性。建议不要与 “Top p” 同时调整。" # 在前端显示为描述
          type: "float" # 必需，可选值为[float, int, bool, string]。
          min: "0"
          max: "1.0"
          default_val: "0.7"
        - name: "max_tokens"
          label: "最大回复长度"  # 在前端显示为名称
          desc: "控制模型输出的 Tokens 长度上限。通常 100 Tokens 约等于 150 个中文汉字。"
          type: "int" # 必需，可选值为[float, int, bool, string]。
          min: "1"
          max: "4096"
          default_val: "2048"
        - name: "top_k"
          label: "顶部 k 概率采样"  # 在前端显示为名称
          desc: "仅从概率最高的 k 个 token 中采样生成，限制候选范围，提升生成稳定性。" # 在前端显示为描述
          type: "int" # 必需，可选值为[float, int, bool, string]。
          min: "1"
          max: "100"
          default_val: "50"
        - name: "top_p"
          label: "核采样概率"  # 在前端显示为名称
          desc: "生成时选取累计概率达 top_p 的最小 token 集合，集合外 token 被排除，平衡多样性与合理性。" # 在前端显示为描述
          type: "float" # 必需，可选值为[float, int, bool, string]。
          min: "0.001"
          max: "1.0"
          default_val: "0.7"
        - name: "frequency_penalty"
          label: "频率惩罚"  # 在前端显示为名称
          desc: "惩罚已生成过的 token，频率越高惩罚越大，抑制重复内容。" # 在前端显示为描述
          type: "float" # 必需，可选值为[float, int, bool, string]。
          min: "0"
          max: "2.0"
          default_val: "0"
        - name: "presence_penalty"
          label: "出现惩罚"  # 在前端显示为名称
          desc: "惩罚所有出现过的 token，防止同一内容反复出现，增加内容多样性。" # 在前端显示为描述
          type: "float" # 必需，可选值为[float, int, bool, string]。
          min: "0"
          max: "2.0"
          default_val: "0"
```