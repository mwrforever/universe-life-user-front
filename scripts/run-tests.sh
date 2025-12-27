#!/bin/bash

# OAuth2 测试运行脚本
# 提供统一的测试执行入口

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 显示帮助信息
show_help() {
    cat << EOF
OAuth2 测试运行脚本

用法: $0 [选项] [测试类型]

测试类型:
    unit            运行单元测试
    integration     运行集成测试
    e2e             运行端到端测试
    security        运行安全测试
    performance     运行性能测试
    all             运行所有测试
    coverage        运行测试并生成覆盖率报告

选项:
    --watch         监视模式
    --ui            使用测试UI
    --verbose       详细输出
    --clean         清理测试结果
    --help          显示帮助信息

示例:
    $0 unit                 # 运行单元测试
    $0 integration --ui     # 使用UI运行集成测试
    $0 all --coverage       # 运行所有测试并生成覆盖率报告
    $0 clean                # 清理测试结果

EOF
}

# 清理测试结果
clean_tests() {
    log_info "清理测试结果..."
    rm -rf coverage/
    rm -rf test-results/
    rm -rf .nyc_output/
    rm -f junit.xml
    rm -f playwright-report/
    find . -name "*.lcov" -delete
    log_success "测试结果清理完成"
}

# 检查依赖
check_dependencies() {
    log_info "检查测试依赖..."

    # 检查 Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js 未安装"
        exit 1
    fi

    # 检查 npm
    if ! command -v npm &> /dev/null; then
        log_error "npm 未安装"
        exit 1
    fi

    # 检查项目依赖
    if [ ! -d "node_modules" ]; then
        log_info "安装项目依赖..."
        npm install
    fi

    log_success "依赖检查完成"
}

# 运行单元测试
run_unit_tests() {
    log_info "运行单元测试..."

    local cmd="npm run test:unit"

    if [ "$WATCH" = "true" ]; then
        cmd="$cmd -- --watch"
    fi

    if [ "$UI" = "true" ]; then
        cmd="$cmd -- --ui"
    fi

    if [ "$VERBOSE" = "true" ]; then
        cmd="$cmd -- --verbose"
    fi

    eval $cmd

    if [ $? -eq 0 ]; then
        log_success "单元测试通过"
    else
        log_error "单元测试失败"
        exit 1
    fi
}

# 运行集成测试
run_integration_tests() {
    log_info "运行集成测试..."

    local cmd="npm run test:integration"

    if [ "$WATCH" = "true" ]; then
        cmd="$cmd -- --watch"
    fi

    if [ "$UI" = "true" ]; then
        cmd="$cmd -- --ui"
    fi

    if [ "$VERBOSE" = "true" ]; then
        cmd="$cmd -- --verbose"
    fi

    eval $cmd

    if [ $? -eq 0 ]; then
        log_success "集成测试通过"
    else
        log_error "集成测试失败"
        exit 1
    fi
}

# 运行E2E测试
run_e2e_tests() {
    log_info "运行端到端测试..."

    # 确保开发服务器运行
    if ! curl -s http://localhost:3000 > /dev/null; then
        log_info "启动开发服务器..."
        npm run dev &
        SERVER_PID=$!

        # 等待服务器启动
        local retries=30
        while [ $retries -gt 0 ]; do
            if curl -s http://localhost:3000 > /dev/null; then
                break
            fi
            sleep 1
            retries=$((retries - 1))
        done

        if [ $retries -eq 0 ]; then
            log_error "开发服务器启动失败"
            exit 1
        fi

        log_success "开发服务器已启动"
    fi

    local cmd="npm run test:e2e"

    if [ "$UI" = "true" ]; then
        cmd="npm run test:e2e:ui"
    fi

    if [ "$VERBOSE" = "true" ]; then
        cmd="$cmd -- --reporter=list"
    fi

    eval $cmd

    if [ $? -eq 0 ]; then
        log_success "E2E测试通过"
    else
        log_error "E2E测试失败"
        # 如果有服务器PID，则关闭服务器
        if [ ! -z "$SERVER_PID" ]; then
            kill $SERVER_PID
        fi
        exit 1
    fi

    # 关闭开发服务器
    if [ ! -z "$SERVER_PID" ]; then
        kill $SERVER_PID
        log_info "开发服务器已关闭"
    fi
}

# 运行安全测试
run_security_tests() {
    log_info "运行安全测试..."

    local cmd="npm run test:security"

    if [ "$VERBOSE" = "true" ]; then
        cmd="$cmd -- --verbose"
    fi

    eval $cmd

    if [ $? -eq 0 ]; then
        log_success "安全测试通过"
    else
        log_error "安全测试失败"
        exit 1
    fi
}

# 运行性能测试
run_performance_tests() {
    log_info "运行性能测试..."

    local cmd="npm run test:performance"

    if [ "$VERBOSE" = "true" ]; then
        cmd="$cmd -- --verbose"
    fi

    eval $cmd

    if [ $? -eq 0 ]; then
        log_success "性能测试通过"
    else
        log_warning "性能测试完成（有警告）"
    fi
}

# 运行所有测试
run_all_tests() {
    log_info "运行所有测试..."

    # 运行单元测试
    run_unit_tests

    # 运行集成测试
    run_integration_tests

    # 运行安全测试
    run_security_tests

    # 运行性能测试
    run_performance_tests

    # 运行E2E测试
    run_e2e_tests

    log_success "所有测试通过！"
}

# 生成覆盖率报告
generate_coverage() {
    log_info "运行测试并生成覆盖率报告..."

    local cmd="npm run test:coverage"

    eval $cmd

    if [ $? -eq 0 ]; then
        log_success "覆盖率报告已生成"
        log_info "查看报告: open coverage/index.html"
    else
        log_error "覆盖率生成失败"
        exit 1
    fi
}

# 默认值
WATCH=false
UI=false
VERBOSE=false
CLEAN=false

# 解析命令行参数
TEST_TYPE=""
while [[ $# -gt 0 ]]; do
    case $1 in
        --watch)
            WATCH=true
            shift
            ;;
        --ui)
            UI=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        --clean)
            CLEAN=true
            shift
            ;;
        --help)
            show_help
            exit 0
            ;;
        unit|integration|e2e|security|performance|all|coverage)
            TEST_TYPE=$1
            shift
            ;;
        *)
            log_error "未知参数: $1"
            show_help
            exit 1
            ;;
    esac
done

# 清理测试结果
if [ "$CLEAN" = "true" ]; then
    clean_tests
    exit 0
fi

# 检查依赖
check_dependencies

# 运行指定类型的测试
case $TEST_TYPE in
    unit)
        run_unit_tests
        ;;
    integration)
        run_integration_tests
        ;;
    e2e)
        run_e2e_tests
        ;;
    security)
        run_security_tests
        ;;
    performance)
        run_performance_tests
        ;;
    all)
        run_all_tests
        ;;
    coverage)
        generate_coverage
        ;;
    "")
        log_error "请指定测试类型"
        show_help
        exit 1
        ;;
    *)
        log_error "未知测试类型: $TEST_TYPE"
        show_help
        exit 1
        ;;
esac

log_success "测试完成！"