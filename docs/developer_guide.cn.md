# 开发指南

[English](developer_guide.md) | 中文

本文档提供了 Cozeloop 项目的开发指南，包括环境配置、代码开发、测试以及故障排查等内容。

## 环境配置

### 开发环境搭建

1. **安装依赖**

- 根据不同的系统正确安装 docker 以及 docker compose，确保可用。可参考[快速开始](quick_start.cn.md#安装依赖)。
- 安装 Go 1.23.4版本及以上, 并配置好 GOPATH，同时将${GOPATH}/bin加入到环境变量PATH中，保证安装的二进制工具可找到并运行。

2. **克隆代码仓库**

    ```bash
    git clone https://github.com/coze-dev/cozeloop.git
    
    cd cozeloop
    ```
3. **配置模型**

根据[模型配置](llm_configuration.cn.md)按需配置模型参数。

4. **启动服务**

根据[启动服务](quick_start.cn.md#启动服务)的说明，启动服务。开发场景下可以使用开发模式和调试模式。

    ```bash
    # 开发模式
    RUN_MODE=dev docker compose up -d --build

    # 调试模式
    RUN_MODE=debug docker compose up -d --build
    ```

5. **访问服务**

前端访问接口为`8082`，后端访问接口为`8888`，可通过 `http://localhost:8082`访问平台。

## 代码开发

### 项目结构

```
├── backend/          # 后端代码
│   ├── api/          # API 接口定义和实现
│   │   ├── handler/  # API 处理
│   │   └── router/   # API 路由
│   ├── cmd/          # 应用入口和服务启动
│   │   ├── conf      # 各模块配置文件
│   │   └── main.go   # 入口函数
│   ├── modules/      # 核心业务模块
│   │   ├── data/     # 数据集模块
│   │   │   ├── application/ # 应用服务层
│   │   │   ├── domain/      # 领域模型层
│   │   │   ├── pkg /        # 公共工具层
│   │   │   └── infra/       # 基础设施层
│   │   ├── evaluation/    # 评测模块
│   │   ├── foundation/    # 基建模块
│   │   ├── llm/           # LLM模块
│   │   ├── observability/ # 观测模块
│   │   └── prompt/        # PE模块
│   ├── pkg/            # 通用工具包和库
│   └── script/         # 脚本
│       ├── errorx/     # 错误码定义及生成工具
│       └── kitex/      # Kitex代码生成工具
├── conf/             # 基础组件配置文件
├── docs/             # 文档
├── frontend/         # 前端代码
└── idl/              # IDL接口定义文件
```

### 开发规范


1. **代码结构**
    - 仓库采用Monorepo的方式，前后端的代码都在同一个仓库
    - 后端的代码设计采用 DDD 的方式，遵循分层架构，每个业务模块都遵循以下分层架构：
        - application：应用服务层，协调领域对象完成业务流程
        - domain：领域模型层，定义核心业务实体和业务逻辑
        - infra：基础设施层，提供技术实现和外部服务集成
        - pkg：模块特定的公共包

2. **Go规范**
    - Go 代码规范可参考[Google规范](https://google.github.io/styleguide/go/best-practices.html)
    - 使用`gofmt`等格式化工具进行代码格式化

3. **IDL规范**
    - Service定义
        - 服务命名采用驼峰命名
        - 一个Thrift文件只定义一个Service, extends聚合除外
    - Method定义
        - 接口命名采用驼峰命名
        - 接口只能拥有一个参数和一个返回值，且是自定义Struct类型
        - 入参须命名为{Method}Request，返回值命名为{Method}Response
        - 每个Request类型须包含Base字段，类型base.Base，字段序号为255，optional类型
        - 每个Response类型须包含BaseResp字段，类型base.BaseResp，字段序号为255
    - Struct定义
        - 结构体命名采用驼峰命名
        - 字段命名采用蛇形命名
        - 新增字段设置为optional，禁止required
        - 禁止修改现有字段的ID和类型
    - 枚举定义
        - 推荐使用typdef来定义枚举值
        - 枚举值命名采用驼峰命名，类型和名字之间用下划线连接
    - API定义
        - 使用Restful风格定义API
        - 参考现有模块的API定义，风格保持一致
    - 注解定义
        - 可参考[Kitex](https://www.cloudwego.io/zh/docs/kitex/tutorials/code-gen/validator/)支持的注解
        - 可参考[Hertz](https://www.cloudwego.cn/zh/docs/hertz/tutorials/toolkit/annotation/#%E6%94%AF%E6%8C%81%E7%9A%84-api-%E6%B3%A8%E8%A7%A3)支持的注解

   规范示例如下：
   ```thrift
    # 单个Service
    typedef string EnumType(ts.enum="true") 

    const EnumType EnumType_Text = "Text"

    struct ExampleRequest {
        1: optional i64 id
    
        255: optional base.Base base
    }

    struct ExampleResponse {
        1: optional string name
        2: optional EnumType enum_type

        255: base.BaseResp base_resp
    }

    service ExampleService {
        ExampleMethod(1: ExampleRequest) (2: ExampleResponse)
    }

    # 多个Service
    service ExampleAService extends idl_a.AService{}
    service ExampleBService extends idl_b.BService{}
    ```

4. **单测规范**
    - UT函数命名
        - 普通函数命名为Test{FunctionName}(t *testing.T)
        - 对象方法命名为Test{ObjectName}_{MethodName}(t *testing.T)
        - 基准测试函数命名为Benchmark{FunctionName}(b *testing.B)
        - 基准测试对象命名为Benchmark{ObjectName}_{MethodName}(b *testing.B)
    - 文件命名
        - 测试文件与被测试文件同名，后缀为`_test.go`，处于同一目录下
    - 测试设计
        - 推荐使用 Table-Driven 的方式定义输入/输出，覆盖多种场景
        - 使用`github.com/stretchr/testify`简化断言逻辑
        - 使用`github.com/uber-go/mock`生成Mock对象，尽量避免Patch打桩的方式

   测试示例如下：
    ```go
    func TestRetryWithMaxTimes1(t *testing.T) {
        type args struct {
            ctx context.Context
            max int
            fn  func() error
        }
        tests := []struct {
            name    string
            args    args
            wantErr bool
        }{
            {
                name: "test1",
                args: args{
                    max: 3,
                    fn: func() error {
                        return nil
                    }
                },
                wantErr: false,
            }
            // Add more test cases.
        }
        for _, tt := range tests {
            t.Run(tt.name, func(t *testing.T) {
                err := RetryWithMaxTimes(tt.args.ctx, tt.args.max, tt.args.fn)
                assert.Equal(t, tt.wantErr, err != nil)
            })
        }
    }
    ```


### 开发流程

1. **创建功能分支**
    ```bash
    git checkout -b feat/your-feature-name
    ```

2. **开发新功能**
- 如果需要修改 IDL，按照规范进行IDL的修改，然后使用脚本生成代码，这时候会生成kitex以及hertz的代码。

    ```bash
    cd ./backend/script/cloudwego
    ./code_gen.sh
    ```

- 如果需要修改依赖注入，遵循当前使用 wire 依赖注入的方式，修改对应目录下 wire.go 后重新生成代码。

    ```bash
    # 修改总体初始化的依赖注入
    cd ./backend/api/handler/coze/loop/apis
    wire
   # 修改子模块的依赖注入
    cd ./backend/modules/observability/application
    wire
    ```
- 如果需要新增数据库/新增 MQ Topic：
  - 新增MySQL表: 在[`conf/default/mysql/init-sql`](../conf/default/mysql/init-sql)下新增建表SQL，注意需要增加`IF NOT EXISTS`。
  - 新增Clickhouse表: 在[`conf/default/clickhouse/init-sql`](../conf/default/clickhouse/init-sql)下新增建表SQL，注意需要增加`IF NOT EXISTS`。
  - 新增RocketMQ Topic: 在[`conf/default/rocketmq/broker/topics.cnf`](../conf/default/rocketmq/broker/topics.cnf)下新增Topic，格式为`{topic}={consumer}`
 
- 按照Go的开发规范进行后端服务开发，如果是在开发模式下运行服务，代码修改后端服务会自动重新进行编译然后启动。其他模式则需要重新进行镜像编译运行，建议使用开发模式进行开发。
    ```bash
    # 重新编译镜像运行，编译时间会比较长
    docker compose up app --build
    ```

-  再提交代码前，需要先添加单测，增量覆盖率在80%以上，确保存量单测都能通过。

    ```bash
    cd backend/
    go test -gcflags="all=-N -l" -count=1 -v ./...
    ```

3. **提交代码**

```bash
   git add .
   git commit -m "feat: add new feature"
```

4. **合并请求**
   - 推送到远程仓库
   - 创建 Pull Request
   - 确保代码的CI通过
   - 等待Code Review

## 测试指南

### 单元测试

1. **运行测试**

    ```bash
   # 运行所有测试确保通过
    cd backend/
    go test -gcflags="all=-N -l" -count=1 -v ./...
    ```

2. **测试覆盖率**
    ```bash
   # 生成测试覆盖率报告
   cd backend/
   go test -gcflags="all=-N -l" -coverprofile=coverage.out ./...
   go tool cover -html=coverage.out
   ```

### 功能测试
   
本地部署后可以打开平台，测试各模块的功能是否正常：

   - Prompt开发与调试
     - Playground能够正常进行调试
     - Prompt创建与管理符合预期
   - 评测实验
     - 新建数据集
     - 新增评估器
     - 新增实验，对刚创建的Prompt进行评测
     - 实验完成并查看分析报告
   - Trace上报与查询
     - Trace界面选择Prompt开发，是否有Trace展示


## 故障排查

### 容器状态

启动时会有如下几个容器：
```text
cozeloop-app: 后端服务
cozeloop-nginx: nginx代理
cozeloop-mysql: mysql数据库
cozeloop-redis: Redis缓存
cozeloop-clickhouse: Clickhouse存储
cozeloop-minio: 对象存储
cozeloop-namesrv: rocketmq nameserver
cozeloop-broker: rocketmq broker
```

查看是否所有容器都已经启动并处理healthy状态:
```bash
docker ps -a
```

如果有服务处于unhealty状态，可以查看对应组件的日志并定位报错原因：
```bash
docker logs cozeloop-app # 后端服务日志
docker logs cozeloop-nginx # nginx日志
docker logs cozeloop-mysql # mysql日志
docker logs cozeloop-redis # redis日志
docker logs cozeloop-clickhouse # ck日志
docker logs cozeloop-minio # minio日志
docker logs cozeloop-namesrv # rocketmq nameserver日志
docker logs cozeloop-broker # rocketmq broker日志
```

对于基础组件，可以参考docker-compose.yaml文件中的说明进入基础组件进行数据查看，下面给两个例子：

```bash
# mysql，查询user表的数据
docker exec -it cozeloop-mysql mysql -u root -pcozeloop-mysql
SHOW DATABASES;
USE cozeloop-mysql;
SHOW TABLES;
SELECT * FROM user LIMIT 10;

# clickhouse，查询span数据
docker exec -it cozeloop-clickhouse bash
clickhouse-client --host cozeloop-clickhouse --port 9008 --password=cozeloop-clickhouse --database=cozeloop-clickhouse
SHOW DATABASES;
USE `cozeloop-clickhouse`;
SHOW TABLES;
SELECT * FROM observability_spans LIMIT 10;
```

### 服务日志


所有容器都正常启动之后，主要关注点就是后端服务的运行日志，如果出现接口报错等情况，我们可以查看服务容器对应的日志，查看是否有错误日志：

   ```bash
   docker logs cozeloop-app
   ```   
   
页面如果接口报错，可以通过F12进入浏览器控制台，查看对应报错的请求，从相应头中获取LogID，位于`x-log-id`，拿到logid后再去容器内查看日志，如果接口正常，可能会搜索不到对应日志：
   ![](../.github/static/img/cozeloop_logid.png)
   ```bash
   docker logs cozeloop-app | grep {logid}
   ```

### **错误码**

服务端的错误定义在各模块的errno目录下，若请求返回了错误码，可以在项目中搜索错误码来简单定位问题，然后再通过上面日志查询的方式定位具体问题。

### **SDK**

若您是通过SDK对接开源平台测试，可以参考SDK的[错误码](https://loop.coze.cn/open/docs/cozeloop/error-codes)信息进行简单定位，如果是服务问题再查看服务日志详细定位。

## 贡献指南

再仔细参考本文档后，若代码规范以及测试均已通过，那么可以参考 [CONTRIBUTING.md](../CONTRIBUTING.md)发起您的贡献，感谢您的支持。
