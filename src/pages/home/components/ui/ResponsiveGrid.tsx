import React from 'react';
import { Row, Col } from 'antd';
import styled from '@emotion/styled';

// 响应式栅格组件属性
interface ResponsiveGridProps {
  children: React.ReactNode;
  gutter?: [number, number];
  mobileCols?: number;
  tabletCols?: number;
  desktopCols?: number;
  className?: string;
}

// 样式化栅格容器
const GridContainer = styled.div`
  width: 100%;
`;

// 响应式栅格组件
export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  gutter = [16, 16],
  mobileCols = 1,
  tabletCols = 2,
  desktopCols = 4,
  className,
}) => {
  // 计算响应式span
  const getColSpan = () => {
    const totalSpan = 24;

    return {
      xs: totalSpan / mobileCols,
      sm: totalSpan / mobileCols,
      md: totalSpan / tabletCols,
      lg: totalSpan / desktopCols,
      xl: totalSpan / desktopCols,
      xxl: totalSpan / desktopCols,
    };
  };

  const colSpan = getColSpan();

  return (
    <GridContainer className={className}>
      <Row gutter={gutter}>
        {React.Children.map(children, (child, index) => (
          <Col
            key={index}
            xs={colSpan.xs}
            sm={colSpan.sm}
            md={colSpan.md}
            lg={colSpan.lg}
            xl={colSpan.xl}
            xxl={colSpan.xxl}
          >
            {child}
          </Col>
        ))}
      </Row>
    </GridContainer>
  );
};

// 双列瀑布流组件（用于任务卡片）
export const MasonryGrid: React.FC<{
  children: React.ReactNode[];
  gutter?: number;
  className?: string;
}> = ({ children, gutter = 16, className }) => {
  const [columns, setColumns] = React.useState(2);

  // 监听屏幕尺寸变化
  React.useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setColumns(1);
      } else if (width < 1200) {
        setColumns(2);
      } else {
        setColumns(2);
      }
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  // 将子元素分配到不同列
  const distributeColumns = () => {
    const result: React.ReactNode[][] = Array.from({ length: columns }, () => []);

    children.forEach((child, index) => {
      const columnIndex = index % columns;
      result[columnIndex].push(child);
    });

    return result;
  };

  const columnData = distributeColumns();

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        gap: gutter,
        width: '100%',
      }}
    >
      {columnData.map((column, columnIndex) => (
        <div
          key={columnIndex}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: gutter,
          }}
        >
          {column}
        </div>
      ))}
    </div>
  );
};

export default ResponsiveGrid;