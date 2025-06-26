# Model Configuration

English | [中文](llm_configuration.cn.md)

## Quick Start
Cozeloop supports multiple LLM models through the Eino framework:

| Model      | Support Status |
|------------|----------------|
| Ark/ArkBot | ✅             |
| OpenAI     | ✅             |
| DeepSeek   | ✅             |
| Claude     | ✅             |
| Gemini     | ✅             |
| Ollama     | ✅             |
| Qwen       | ✅             |
| Qianfan    | ✅             |

When you want to modify available model information, such as adding/removing models or modifying existing model configurations, you need to perform the following operations:

1. **Modify Configuration File**:
   - The configuration file is located at: [`backend/modules/llm/infra/config/model_repo.yaml`](../backend/modules/llm/infra/config/model_repo.yaml). This file is a YAML configuration list, and the complete model configuration can be found in the full description at the end.
   - For quick integration, you can refer to the minimal configuration for each model type below. Modify the key configurations marked with **Change It** to use.
   - For complete model configurations, you can refer to the example configurations for each model in [`backend/modules/llm/infra/config/model_repo_example`](../backend/modules/llm/infra/config/model_repo_example).
   - To use the **qianfan** model, you also need to configure **qianfan_ak** and **qianfan_sk** in the [`backend/modules/llm/infra/config/runtime_config.yaml`](../backend/modules/llm/infra/config/runtime_config.yaml) file.

2. **Configuration Example**:

   This is a model configuration example, including Ark and OpenAI model configurations. Each model has a unique ID greater than 0, and different models have different configurations. You can refer to the minimal and complete configurations below. The most critical content to modify is the **model** and **api_key**.

   ```yaml
   models:
     - id: 1
       name: "doubao"
       frame: "eino"
       protocol: "ark"
       protocol_config:
         api_key: "***" 
         model: "***"
       param_config:
         param_schemas:
           - name: "temperature"
             label: "Generation Randomness"
             desc: "Increasing temperature makes model output more diverse and creative, while decreasing it makes output more focused on instructions but less diverse. It's recommended not to adjust this simultaneously with 'Top p'."
             type: "float"
             min: "0"
             max: "1.0"
             default_val: "0.7"
           - name: "max_tokens"
             label: "Maximum Response Length"
             desc: "Controls the maximum number of tokens in model output. Typically, 100 tokens equals about 150 Chinese characters."
             type: "int"
             min: "1"
             max: "4096"
             default_val: "2048"
           - name: "top_p"
             label: "Nucleus Sampling Probability"
             desc: "Selects the minimum token set with cumulative probability reaching top_p during generation, excluding tokens outside the set, balancing diversity and reasonableness."
             type: "float"
             min: "0.001"
             max: "1.0"
             default_val: "0.7"
     - id: 2
       name: "openapi"
       frame: "eino"
       protocol: "openai"
       protocol_config:
         api_key: "***" 
         model: "***"
       param_config:
         param_schemas:
           - name: "temperature"
             label: "Generation Randomness"
             desc: "Increasing temperature makes model output more diverse and creative, while decreasing it makes output more focused on instructions but less diverse. It's recommended not to adjust this simultaneously with 'Top p'."
             type: "float"
             min: "0"
             max: "1.0"
             default_val: "0.7"
           - name: "max_tokens"
             label: "Maximum Response Length"
             desc: "Controls the maximum number of tokens in model output. Typically, 100 tokens equals about 150 Chinese characters."
             type: "int"
             min: "1"
             max: "4096"
             default_val: "2048"
           - name: "top_p"
             label: "Nucleus Sampling Probability"
             desc: "Selects the minimum token set with cumulative probability reaching top_p during generation, excluding tokens outside the set, balancing diversity and reasonableness."
             type: "float"
             min: "0.001"
             max: "1.0"
             default_val: "0.7"
   ```

3. **Restart Service**:
   - If using **development mode** to start the service, it will automatically hot reload
   - If using other modes to start the service, you need to restart the service

## Important Notes
Before modifying model configurations, please ensure you understand the following notes:
1. Ensure each model's ID is **globally unique** and **greater than 0**. Do not modify the ID after the model is online.
2. Before deleting a model, ensure there is no online traffic for this model.
3. Ensure that all models available to **evaluators** have strong function call capabilities, otherwise the evaluator may not work properly.

## Minimal Model Configurations

Below are the minimal configurations for each model type. Most content is similar, with the main difference being the **protocol**.

### Ark

```yaml
- id: 1                   # Change It
  name: "your model name" # Change It
  frame: "eino"
  protocol: "ark" 
  protocol_config:
    api_key: "" # Change It. See https://github.com/cloudwego/eino-ext/blob/main/components/model/ark/chatmodel.go
    model: ""   # Change It. See https://github.com/cloudwego/eino-ext/blob/main/components/model/ark/chatmodel.go
  param_config: # Generally no need to modify, determines which parameters can be adjusted in the frontend, their ranges and default values
    param_schemas:
      - name: "temperature"
        label: "Generation Randomness"
        desc: "Increasing temperature makes model output more diverse and creative, while decreasing it makes output more focused on instructions but less diverse. It's recommended not to adjust this simultaneously with 'Top p'."
        type: "float"
        min: "0"
        max: "1.0"
        default_val: "0.7"
      - name: "max_tokens"
        label: "Maximum Response Length"
        desc: "Controls the maximum number of tokens in model output. Typically, 100 tokens equals about 150 Chinese characters."
        type: "int"
        min: "1"
        max: "4096"
        default_val: "2048"
      - name: "top_p"
        label: "Nucleus Sampling Probability"
        desc: "Selects the minimum token set with cumulative probability reaching top_p during generation, excluding tokens outside the set, balancing diversity and reasonableness."
        type: "float"
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
    api_key: "" # Change It. See https://github.com/cloudwego/eino-ext/blob/main/components/model/claude/claude.go
    model: ""   # Change It. See https://github.com/cloudwego/eino-ext/blob/main/components/model/claude/claude.go
  param_config: # Generally no need to modify, determines which parameters can be adjusted in the frontend, their ranges and default values
    param_schemas:
      - name: "temperature"
        label: "Generation Randomness"
        desc: "Increasing temperature makes model output more diverse and creative, while decreasing it makes output more focused on instructions but less diverse. It's recommended not to adjust this simultaneously with 'Top p'."
        type: "float"
        min: "0"
        max: "1.0"
        default_val: "0.7"
      - name: "max_tokens"
        label: "Maximum Response Length"
        desc: "Controls the maximum number of tokens in model output. Typically, 100 tokens equals about 150 Chinese characters."
        type: "int"
        min: "1"
        max: "4096"
        default_val: "2048"
      - name: "top_p"
        label: "Nucleus Sampling Probability"
        desc: "Selects the minimum token set with cumulative probability reaching top_p during generation, excluding tokens outside the set, balancing diversity and reasonableness."
        type: "float"
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
    api_key: "" # Change It. See https://github.com/cloudwego/eino-ext/blob/main/components/model/deepseek/deepseek.go
    model: ""   # Change It. See https://github.com/cloudwego/eino-ext/blob/main/components/model/deepseek/deepseek.go
  param_config: # Generally no need to modify, determines which parameters can be adjusted in the frontend, their ranges and default values
    param_schemas:
      - name: "temperature"
        label: "Generation Randomness"
        desc: "Increasing temperature makes model output more diverse and creative, while decreasing it makes output more focused on instructions but less diverse. It's recommended not to adjust this simultaneously with 'Top p'."
        type: "float"
        min: "0"
        max: "1.0"
        default_val: "0.7"
      - name: "max_tokens"
        label: "Maximum Response Length"
        desc: "Controls the maximum number of tokens in model output. Typically, 100 tokens equals about 150 Chinese characters."
        type: "int"
        min: "1"
        max: "4096"
        default_val: "2048"
      - name: "top_p"
        label: "Nucleus Sampling Probability"
        desc: "Selects the minimum token set with cumulative probability reaching top_p during generation, excluding tokens outside the set, balancing diversity and reasonableness."
        type: "float"
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
    api_key: "" # Change It. See https://github.com/cloudwego/eino-ext/blob/main/components/model/gemini/gemini.go
    model: ""   # Change It. See https://github.com/cloudwego/eino-ext/blob/main/components/model/gemini/gemini.go
  param_config: # Generally no need to modify, determines which parameters can be adjusted in the frontend, their ranges and default values
    param_schemas:
      - name: "temperature"
        label: "Generation Randomness"
        desc: "Increasing temperature makes model output more diverse and creative, while decreasing it makes output more focused on instructions but less diverse. It's recommended not to adjust this simultaneously with 'Top p'."
        type: "float"
        min: "0"
        max: "1.0"
        default_val: "0.7"
      - name: "max_tokens"
        label: "Maximum Response Length"
        desc: "Controls the maximum number of tokens in model output. Typically, 100 tokens equals about 150 Chinese characters."
        type: "int"
        min: "1"
        max: "4096"
        default_val: "2048"
      - name: "top_p"
        label: "Nucleus Sampling Probability"
        desc: "Selects the minimum token set with cumulative probability reaching top_p during generation, excluding tokens outside the set, balancing diversity and reasonableness."
        type: "float"
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
    base_url: "" # Change It. See https://github.com/cloudwego/eino-ext/blob/main/components/model/ollama/chatmodel.go
    model: ""    # Change It. See https://github.com/cloudwego/eino-ext/blob/main/components/model/ollama/chatmodel.go
  param_config:  # Generally no need to modify, determines which parameters can be adjusted in the frontend, their ranges and default values
    param_schemas:
      - name: "temperature"
        label: "Generation Randomness"
        desc: "Increasing temperature makes model output more diverse and creative, while decreasing it makes output more focused on instructions but less diverse. It's recommended not to adjust this simultaneously with 'Top p'."
        type: "float"
        min: "0"
        max: "1.0"
        default_val: "0.7"
      - name: "max_tokens"
        label: "Maximum Response Length"
        desc: "Controls the maximum number of tokens in model output. Typically, 100 tokens equals about 150 Chinese characters."
        type: "int"
        min: "1"
        max: "4096"
        default_val: "2048"
      - name: "top_p"
        label: "Nucleus Sampling Probability"
        desc: "Selects the minimum token set with cumulative probability reaching top_p during generation, excluding tokens outside the set, balancing diversity and reasonableness."
        type: "float"
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
    api_key: "" # Change It. See https://github.com/cloudwego/eino-ext/blob/main/components/model/openai/chatmodel.go
    model: ""   # Change It. See https://github.com/cloudwego/eino-ext/blob/main/components/model/openai/chatmodel.go
  param_config: # Generally no need to modify, determines which parameters can be adjusted in the frontend, their ranges and default values
    param_schemas:
      - name: "temperature"
        label: "Generation Randomness"
        desc: "Increasing temperature makes model output more diverse and creative, while decreasing it makes output more focused on instructions but less diverse. It's recommended not to adjust this simultaneously with 'Top p'."
        type: "float"
        min: "0"
        max: "1.0"
        default_val: "0.7"
      - name: "max_tokens"
        label: "Maximum Response Length"
        desc: "Controls the maximum number of tokens in model output. Typically, 100 tokens equals about 150 Chinese characters."
        type: "int"
        min: "1"
        max: "4096"
        default_val: "2048"
      - name: "top_p"
        label: "Nucleus Sampling Probability"
        desc: "Selects the minimum token set with cumulative probability reaching top_p during generation, excluding tokens outside the set, balancing diversity and reasonableness."
        type: "float"
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
    model: ""   # Change It. See https://github.com/cloudwego/eino-ext/blob/main/components/model/qianfan/chatmodel.go
  param_config: # Generally no need to modify, determines which parameters can be adjusted in the frontend, their ranges and default values
    param_schemas:
      - name: "temperature"
        label: "Generation Randomness"
        desc: "Increasing temperature makes model output more diverse and creative, while decreasing it makes output more focused on instructions but less diverse. It's recommended not to adjust this simultaneously with 'Top p'."
        type: "float"
        min: "0"
        max: "1.0"
        default_val: "0.7"
      - name: "max_tokens"
        label: "Maximum Response Length"
        desc: "Controls the maximum number of tokens in model output. Typically, 100 tokens equals about 150 Chinese characters."
        type: "int"
        min: "1"
        max: "4096"
        default_val: "2048"
      - name: "top_p"
        label: "Nucleus Sampling Probability"
        desc: "Selects the minimum token set with cumulative probability reaching top_p during generation, excluding tokens outside the set, balancing diversity and reasonableness."
        type: "float"
        min: "0.001"
        max: "1.0"
        default_val: "0.7"
```

To use the Qianfan model, you also need to configure **qianfan_ak** and **qianfan_sk** in the [`backend/modules/llm/infra/config/runtime_config.yaml`](../backend/modules/llm/infra/config/runtime_config.yaml) file.

### Qwen
```yaml
- id: 1                   # Change It
  name: "your model name" # Change It
  frame: "eino"
  protocol: "qwen" 
  protocol_config:
    api_key: "" # Change It. See https://github.com/cloudwego/eino-ext/blob/main/components/model/qwen/chatmodel.go
    model: ""   # Change It. See https://github.com/cloudwego/eino-ext/blob/main/components/model/qwen/chatmodel.go
  param_config: # Generally no need to modify, determines which parameters can be adjusted in the frontend, their ranges and default values
    param_schemas:
      - name: "temperature"
        label: "Generation Randomness"
        desc: "Increasing temperature makes model output more diverse and creative, while decreasing it makes output more focused on instructions but less diverse. It's recommended not to adjust this simultaneously with 'Top p'."
        type: "float"
        min: "0"
        max: "1.0"
        default_val: "0.7"
      - name: "max_tokens"
        label: "Maximum Response Length"
        desc: "Controls the maximum number of tokens in model output. Typically, 100 tokens equals about 150 Chinese characters."
        type: "int"
        min: "1"
        max: "4096"
        default_val: "2048"
      - name: "top_p"
        label: "Nucleus Sampling Probability"
        desc: "Selects the minimum token set with cumulative probability reaching top_p during generation, excluding tokens outside the set, balancing diversity and reasonableness."
        type: "float"
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
    api_key: "" # Change It. See https://github.com/cloudwego/eino-ext/blob/main/components/model/arkbot/chatmodel.go
    model: ""   # Change It. See https://github.com/cloudwego/eino-ext/blob/main/components/model/arkbot/chatmodel.go
  param_config: # Generally no need to modify, determines which parameters can be adjusted in the frontend, their ranges and default values
    param_schemas:
      - name: "temperature"
        label: "Generation Randomness"
        desc: "Increasing temperature makes model output more diverse and creative, while decreasing it makes output more focused on instructions but less diverse. It's recommended not to adjust this simultaneously with 'Top p'."
        type: "float"
        min: "0"
        max: "1.0"
        default_val: "0.7"
      - name: "max_tokens"
        label: "Maximum Response Length"
        desc: "Controls the maximum number of tokens in model output. Typically, 100 tokens equals about 150 Chinese characters."
        type: "int"
        min: "1"
        max: "4096"
        default_val: "2048"
      - name: "top_p"
        label: "Nucleus Sampling Probability"
        desc: "Selects the minimum token set with cumulative probability reaching top_p during generation, excluding tokens outside the set, balancing diversity and reasonableness."
        type: "float"
        min: "0.001"
        max: "1.0"
        default_val: "0.7"
```

## Complete Model Configuration

The model code structure definition can be found in [`backend/modules/llm/domain/entity/manage.go`](../backend/modules/llm/domain/entity/manage.go). Below is the complete model configuration description, which explains the meaning of each field and whether it needs to be filled.

```yaml
- id: 1    # Required, must be unique and greater than 0.
  name: "your model name" # Required, model name.
  desc: "" # Optional, model description.
  ability: # Optional, model capability configuration.
     function_call: true # Optional, default is false. Set to true if the model needs function call capability.
     json_mode: false    # Optional, this parameter only indicates model capability, currently has no actual effect.
     multi_modal: true   # Optional, default is false. Set to true if the model needs multimodal capability.
     ability_multi_modal:
        image: true      # Optional, default is false. Set to true if the model needs multimodal image capability.
        ability_image:
           url_enabled: true    # Optional, default is false. Set to true if the model needs multimodal image URL capability.
           binary_enabled: true # Optional, default is false. Set to true if the model needs multimodal image binary capability.
           max_image_size: 20   # Optional, unit is MB. Default is 0, meaning no size limit.
           max_image_count: 20  # Optional, default is 0, meaning no count limit.
  frame: "eino"    # Required, valid values: [eino].
  protocol: "ark"  # Required, valid values: [ark, openai, deepseek, qwen, qianfan, ollama, gemini, claude, arkbot]
  protocol_config: # Required, model configuration.
     base_url: ""  # Optional, if not filled, will use the model's default value.
     api_key: ""   # Required, model API_KEY.
     model: ""     # Required, model name to call.
     protocol_config_ark: # Optional, can be filled when using ark model.
        region: ""        # Optional, see https://github.com/cloudwego/eino-ext/blob/main/components/model/ark/chatmodel.go
        access_key: ""    # Optional, see https://github.com/cloudwego/eino-ext/blob/main/components/model/ark/chatmodel.go
        secret_key: ""    # Optional, see https://github.com/cloudwego/eino-ext/blob/main/components/model/ark/chatmodel.go
        retry_times: ""   # Optional, see https://github.com/cloudwego/eino-ext/blob/main/components/model/ark/chatmodel.go
        custom_headers:   # Optional, see https://github.com/cloudwego/eino-ext/blob/main/components/model/ark/chatmodel.go
     protocol_config_open_ai:         # Optional, can be filled when using openapi model
        by_azure: false               # Optional, see https://github.com/cloudwego/eino-ext/blob/main/components/model/openai/chatmodel.go
        api_version: ""               # Optional, see https://github.com/cloudwego/eino-ext/blob/main/components/model/openai/chatmodel.go
        response_format_type: ""      # Optional, see https://github.com/cloudwego/eino-ext/blob/main/components/model/openai/chatmodel.go    
        ResponseFormatJsonSchema: ""  # Optional, see https://github.com/cloudwego/eino-ext/blob/main/components/model/openai/chatmodel.go
     protocol_config_claude:     # Optional, can be filled when using claude model
        by_bedrock: false        # Optional, see https://github.com/cloudwego/eino-ext/blob/main/components/model/claude/claude.go
        access_key: ""           # Optional, see https://github.com/cloudwego/eino-ext/blob/main/components/model/claude/claude.go
        secret_access_key: ""    # Optional, see https://github.com/cloudwego/eino-ext/blob/main/components/model/claude/claude.go
        session_token: ""        # Optional, see https://github.com/cloudwego/eino-ext/blob/main/components/model/claude/claude.go
        region: ""               # Optional, see https://github.com/cloudwego/eino-ext/blob/main/components/model/claude/claude.go
     protocol_config_deep_seek:  # Optional, can be filled when using deepseek model
        response_format_type: "" # Optional, see https://github.com/cloudwego/eino-ext/blob/main/components/model/deepseek/deepseek.go
     protocol_config_gemini:          # Optional, can be filled when using gemeni model
        response_schema: ""           # Optional, see https://github.com/cloudwego/eino-ext/blob/main/components/model/gemini/gemini.go
        enable_code_execution: false  # Optional, see https://github.com/cloudwego/eino-ext/blob/main/components/model/gemini/gemini.go
        safety_settings:              # Optional, see https://github.com/cloudwego/eino-ext/blob/main/components/model/gemini/gemini.go
           - category: 0
             threshold: 0
     protocol_config_ollama: # Optional, can be filled when using ollama model
        format: ""           # Optional, see https://github.com/cloudwego/eino-ext/blob/main/components/model/ollama/chatmodel.go
        keep_alive_ms: ""    # Optional, see https://github.com/cloudwego/eino-ext/blob/main/components/model/ollama/chatmodel.go
     protocol_config_qwen:              # Optional, can be filled when using qwen model
        response_format_type: ""        # Optional, see https://github.com/cloudwego/eino-ext/blob/main/components/model/qwen/chatmodel.go
        response_format_json_schema: "" # Optional, see https://github.com/cloudwego/eino-ext/blob/main/components/model/qwen/chatmodel.go
     protocol_config_qianfan:           # Optional, can be filled when using qianfan model
        llm_retry_count: ""             # Optional, see https://github.com/cloudwego/eino-ext/blob/main/components/model/qianfan/chatmodel.go
        llm_retry_timeout: ""           # Optional, see https://github.com/cloudwego/eino-ext/blob/main/components/model/qianfan/chatmodel.go
        llm_retry_backoff_factor: ""    # Optional, see https://github.com/cloudwego/eino-ext/blob/main/components/model/qianfan/chatmodel.go
        parallel_tool_calls: ""         # Optional, see https://github.com/cloudwego/eino-ext/blob/main/components/model/qianfan/chatmodel.go
        response_format_type: ""        # Optional, see https://github.com/cloudwego/eino-ext/blob/main/components/model/qianfan/chatmodel.go
        response_format_json_schema: "" # Optional, see https://github.com/cloudwego/eino-ext/blob/main/components/model/qianfan/chatmodel.go
     protocol_config_ark_bot: # Optional, can be filled when using arkbot model
        region: ""            # Optional, see https://github.com/cloudwego/eino-ext/blob/main/components/model/arkbot/chatmodel.go
        access_key: ""        # Optional, see https://github.com/cloudwego/eino-ext/blob/main/components/model/arkbot/chatmodel.go
        secret_key: ""        # Optional, see https://github.com/cloudwego/eino-ext/blob/main/components/model/arkbot/chatmodel.go
        retry_times: ""       # Optional, see https://github.com/cloudwego/eino-ext/blob/main/components/model/arkbot/chatmodel.go
  scenario_configs: # Optional, this is a map. Scenario configuration has two purposes: model availability in the scenario; 2. QPM and TPM limits for the model in the scenario.
     default:
        scenario: "default" # When this model is requested, if the requested scenario is not in scenario_configs, the rate limiting configuration of the default scenario is used. Similarly, if other scenarios don't exist, visibility is also determined by the default scenario configuration.
        quota:
           qpm: 0 # Optional, default is 0, meaning the system doesn't limit QPM.
           tpm: 0 # Optional, default is 0, meaning the system doesn't limit TPM.
        unavailable: false # Optional, default is false, indicating model visibility in this scenario.
     prompt_debug:
        scenario: "prompt_debug" # When this model is requested, if the request is initiated by Prompt, the prompt_debug scenario configuration is used. Also determines model visibility in the Prompt page.
        quota:
           qpm: 0 # Optional, default is 0, meaning the system doesn't limit QPM.
           tpm: 0 # Optional, default is 0, meaning the system doesn't limit TPM.
        unavailable: false # Optional, default is false, indicating model visibility in this scenario.
     evaluator:
        scenario: "evaluator" # When this model is requested, if the request is initiated by Prompt, the evaluator scenario configuration is used. Also determines model visibility in the evaluator page.
        quota:
           qpm: 0 # Optional, default is 0, meaning the system doesn't limit QPM.
           tpm: 0 # Optional, default is 0, meaning the system doesn't limit TPM.
        unavailable: false # Optional, default is false. If this model doesn't support function calls, set to true, as evaluators must use function calls.
  param_config:     # Required.
     param_schemas: # Required, this parameter determines which model parameters can be modified in the prompt and evaluator interfaces. Currently only supports the following parameters.
        - name: "temperature"
          label: "Generation Randomness" # Displayed as name in frontend
          desc: "Increasing temperature makes model output more diverse and creative, while decreasing it makes output more focused on instructions but less diverse. It's recommended not to adjust this simultaneously with 'Top p'." # Displayed as description in frontend
          type: "float" # Required, valid values: [float, int, bool, string].
          min: "0"
          max: "1.0"
          default_val: "0.7"
        - name: "max_tokens"
          label: "Maximum Response Length"  # Displayed as name in frontend
          desc: "Controls the maximum number of tokens in model output. Typically, 100 tokens equals about 150 Chinese characters."
          type: "int" # Required, valid values: [float, int, bool, string].
          min: "1"
          max: "4096"
          default_val: "2048"
        - name: "top_k"
          label: "Top K Probability Sampling"  # Displayed as name in frontend
          desc: "Only samples from the k tokens with highest probability, limiting candidate range and improving generation stability." # Displayed as description in frontend
          type: "int" # Required, valid values: [float, int, bool, string].
          min: "1"
          max: "100"
          default_val: "50"
        - name: "top_p"
          label: "Nucleus Sampling Probability"  # Displayed as name in frontend
          desc: "Selects the minimum token set with cumulative probability reaching top_p during generation, excluding tokens outside the set, balancing diversity and reasonableness." # Displayed as description in frontend
          type: "float" # Required, valid values: [float, int, bool, string].
          min: "0.001"
          max: "1.0"
          default_val: "0.7"
        - name: "frequency_penalty"
          label: "Frequency Penalty"  # Displayed as name in frontend
          desc: "Penalizes already generated tokens, higher frequency means higher penalty, suppressing repetitive content." # Displayed as description in frontend
          type: "float" # Required, valid values: [float, int, bool, string].
          min: "0"
          max: "2.0"
          default_val: "0"
        - name: "presence_penalty"
          label: "Presence Penalty"  # Displayed as name in frontend
          desc: "Penalizes all tokens that have appeared, preventing the same content from appearing repeatedly, increasing content diversity." # Displayed as description in frontend
          type: "float" # Required, valid values: [float, int, bool, string].
          min: "0"
          max: "2.0"
          default_val: "0"
```