import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '../utils/test-utils';
import { Button } from 'antd';

describe('Button 组件', () => {
  it('应该正确渲染按钮文本', () => {
    render(<Button>测试按钮</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('测试按钮');
  });

  it('应该响应点击事件', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>点击我</Button>);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('应该正确应用type属性', () => {
    render(<Button type="primary">主要按钮</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('ant-btn-primary');
  });

  it('应该在禁用状态下不响应点击', () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>禁用按钮</Button>);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('应该正确设置loading状态', () => {
    render(<Button loading>加载中</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('ant-btn-loading');
    expect(button).toBeDisabled();
  });
});