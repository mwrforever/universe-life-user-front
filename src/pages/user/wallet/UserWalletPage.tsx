/**
 * 钱包页面 - 淘宝风格
 */

import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ConfigProvider,
  Card,
  Empty,
  Spin,
  message,
  Button,
  Segmented,
  Input,
  Tag,
  Modal,
  Form,
} from 'antd';
import {
  WalletOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  TransactionOutlined,
  SearchOutlined,
  PlusOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { TopNavBar } from '@/components/layout/TopNavBar';
import { getTheme } from '@/components/layout/TopNavBar';
import { useAuth } from '@/hooks/useAuth';

type BillType = 'income' | 'expense' | 'freeze' | 'unfreeze';

interface WalletBillItem {
  id: string;
  title: string;
  type: BillType;
  amount: number;
  time: string;
  status: 'success' | 'processing' | 'failed';
  remark?: string;
}

const PageContainer = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 18px 20px 28px;

  @media (max-width: 768px) {
    padding: 14px 12px 22px;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 12px 0 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const TitleArea = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  .title {
    font-size: 20px;
    font-weight: 700;
    color: #1a1a1a;
    line-height: 1.2;
  }

  .subtitle {
    font-size: 12px;
    color: #999;
    margin-top: 2px;
  }
`;

const OverviewGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 14px;
  margin-bottom: 14px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const BalanceCard = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  border: none;

  .ant-card-body {
    padding: 18px 18px 16px;
  }
`;

const BalanceHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const BalanceLabel = styled.div`
  font-size: 13px;
  color: #666;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  .anticon {
    color: #ff6000;
  }
`;

const BalanceAmount = styled.div`
  margin-top: 6px;
  font-size: 34px;
  font-weight: 800;
  color: #1a1a1a;
  letter-spacing: -0.5px;

  .unit {
    font-size: 14px;
    font-weight: 700;
    margin-right: 4px;
    color: #ff6000;
  }
`;

const BalanceMeta = styled.div`
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 12px;
  color: #888;
`;

const MiniStatCard = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  border: none;

  .ant-card-body {
    padding: 18px;
  }
`;

const MiniStatTitle = styled.div`
  font-size: 13px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 8px;

  .anticon {
    color: #ff6000;
  }
`;

const MiniStatValue = styled.div`
  margin-top: 8px;
  font-size: 22px;
  font-weight: 800;
  color: #1a1a1a;

  .unit {
    font-size: 12px;
    font-weight: 700;
    margin-right: 2px;
    color: #ff6000;
  }
`;

const ActionsBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 14px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const PrimaryButton = styled(Button)`
  background: #ff6000 !important;
  border-color: #ff6000 !important;
  border-radius: 10px;
  height: 38px;
  font-weight: 600;
`;

const GhostButton = styled(Button)`
  border-radius: 10px;
  height: 38px;
  font-weight: 600;
`;

const BillsCard = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  border: none;

  .ant-card-body {
    padding: 0;
  }
`;

const BillsHeader = styled.div`
  padding: 16px 18px;
  border-bottom: 1px solid #f2f2f2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const BillsHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 600;

  .anticon {
    color: #ff6000;
  }
`;

const BillsHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SearchBox = styled(Input)`
  width: 260px;

  .ant-input {
    font-size: 13px;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const BillsList = styled.div`
  padding: 12px;
`;

const BillItem = styled.div`
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid #f2f2f2;
  padding: 14px 14px 12px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  transition: all 0.2s ease;

  & + & {
    margin-top: 10px;
  }

  &:hover {
    border-color: #ffe1d6;
    box-shadow: 0 6px 18px rgba(255, 96, 0, 0.08);
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const BillMain = styled.div`
  min-width: 0;

  .title {
    font-size: 14px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    font-size: 12px;
    color: #777;
  }
`;

const BillSide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;

  @media (max-width: 768px) {
    align-items: flex-start;
    flex-direction: row;
    justify-content: space-between;
  }
`;

const AmountText = styled.div<{ positive?: boolean }>`
  font-size: 18px;
  font-weight: 800;
  color: ${p => (p.positive ? '#1a1a1a' : '#1a1a1a')};

  .sign {
    font-size: 14px;
    font-weight: 800;
    margin-right: 2px;
    color: ${p => (p.positive ? '#52c41a' : '#ff4d4f')};
  }

  .unit {
    font-size: 12px;
    font-weight: 700;
    margin-right: 2px;
    color: #999;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 380px;
`;

const NotLoggedInCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 56px 40px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const NotLoggedInTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 10px;
`;

const NotLoggedInDesc = styled.div`
  font-size: 13px;
  color: #999;
  margin-bottom: 18px;
`;

const LoginButton = styled.button`
  background: linear-gradient(135deg, #ff6000 0%, #ff8c00 100%);
  color: #fff;
  border: none;
  padding: 10px 44px;
  border-radius: 22px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(255, 96, 0, 0.28);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(255, 96, 0, 0.34);
  }

  &:active {
    transform: translateY(0);
  }
`;

const billTypeLabel: Record<BillType, string> = {
  income: '收入',
  expense: '支出',
  freeze: '冻结',
  unfreeze: '解冻',
};

const billTypeTagColor: Record<BillType, string> = {
  income: 'green',
  expense: 'red',
  freeze: 'blue',
  unfreeze: 'cyan',
};

const billStatusLabel: Record<WalletBillItem['status'], string> = {
  success: '成功',
  processing: '处理中',
  failed: '失败',
};

const mockBills: WalletBillItem[] = [
  {
    id: 'WB-20251212-0001',
    title: '订单结算到账（电商详情页UI设计）',
    type: 'income',
    amount: 1280,
    time: '2025-12-12 10:20',
    status: 'success',
    remark: '订单号 UO-20251212-0002',
  },
  {
    id: 'WB-20251211-0002',
    title: '提现到支付宝',
    type: 'expense',
    amount: 500,
    time: '2025-12-11 21:16',
    status: 'processing',
  },
  {
    id: 'WB-20251210-0003',
    title: '订单保证金冻结',
    type: 'freeze',
    amount: 99,
    time: '2025-12-10 13:05',
    status: 'success',
  },
  {
    id: 'WB-20251209-0004',
    title: '保证金解冻',
    type: 'unfreeze',
    amount: 99,
    time: '2025-12-09 18:42',
    status: 'success',
  },
];

type BillFilter = 'all' | BillType;

const billFilterOptions: { label: string; value: BillFilter }[] = [
  { label: '全部', value: 'all' },
  { label: '收入', value: 'income' },
  { label: '支出', value: 'expense' },
  { label: '冻结', value: 'freeze' },
  { label: '解冻', value: 'unfreeze' },
];

const UserWalletPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, login, toTopNavBarUser } = useAuth();

  const balance = user?.balance ?? 0;
  const totalEarned = user?.totalEarned ?? 0;
  const frozenAmount = 99;

  const [billFilter, setBillFilter] = useState<BillFilter>('all');
  const [keyword, setKeyword] = useState('');

  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [topupOpen, setTopupOpen] = useState(false);
  const [form] = Form.useForm();

  const filteredBills = useMemo(() => {
    const byType = billFilter === 'all' ? mockBills : mockBills.filter(b => b.type === billFilter);

    const kw = keyword.trim();
    if (!kw) return byType;

    return byType.filter(b => b.title.includes(kw) || b.id.includes(kw) || (b.remark || '').includes(kw));
  }, [billFilter, keyword]);

  const openWithdraw = () => {
    setWithdrawOpen(true);
    form.resetFields();
  };

  const openTopup = () => {
    setTopupOpen(true);
    form.resetFields();
  };

  const handleWithdrawSubmit = async () => {
    const values = await form.validateFields();
    message.info(`提现申请已提交：¥${values.amount}`);
    setWithdrawOpen(false);
  };

  const handleTopupSubmit = async () => {
    const values = await form.validateFields();
    message.info(`充值功能待接入：¥${values.amount}`);
    setTopupOpen(false);
  };

  if (isLoading) {
    return (
      <ConfigProvider theme={getTheme('bright')}>
        <PageContainer>
          <TopNavBar user={toTopNavBarUser()} onNavigate={(path) => navigate(path)} showHomeLink={true} />
          <LoadingContainer>
            <Spin size="large" />
          </LoadingContainer>
        </PageContainer>
      </ConfigProvider>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <ConfigProvider theme={getTheme('bright')}>
        <PageContainer>
          <TopNavBar user={toTopNavBarUser()} onNavigate={(path) => navigate(path)} showHomeLink={true} />
          <ContentWrapper>
            <div style={{ width: '100%', maxWidth: 560, margin: '40px auto' }}>
              <NotLoggedInCard>
                <NotLoggedInTitle>登录后查看钱包</NotLoggedInTitle>
                <NotLoggedInDesc>查看余额、提现、明细记录等</NotLoggedInDesc>
                <LoginButton onClick={() => login()}>立即登录</LoginButton>
              </NotLoggedInCard>
            </div>
          </ContentWrapper>
        </PageContainer>
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider theme={getTheme('bright')}>
      <PageContainer>
        <TopNavBar user={toTopNavBarUser()} onNavigate={(path) => navigate(path)} showHomeLink={true} />

        <ContentWrapper>
          <HeaderRow>
            <TitleArea>
              <WalletOutlined style={{ color: '#ff6000', fontSize: 18 }} />
              <div>
                <div className="title">钱包</div>
                <div className="subtitle">资金明细与提现管理</div>
              </div>
            </TitleArea>
          </HeaderRow>

          <OverviewGrid>
            <BalanceCard>
              <BalanceHeader>
                <BalanceLabel>
                  <WalletOutlined />
                  可用余额
                </BalanceLabel>
                <Tag color="orange">安全保障</Tag>
              </BalanceHeader>

              <BalanceAmount>
                <span className="unit">¥</span>
                {balance.toFixed(2)}
              </BalanceAmount>

              <BalanceMeta>
                <span>冻结：¥{frozenAmount.toFixed(2)}</span>
                <span>累计收益：¥{totalEarned.toFixed(2)}</span>
              </BalanceMeta>

              <ActionsBar>
                <PrimaryButton icon={<ArrowUpOutlined />} onClick={openWithdraw}>
                  提现
                </PrimaryButton>
                <GhostButton icon={<PlusOutlined />} onClick={openTopup}>
                  充值
                </GhostButton>
                <GhostButton
                  icon={<HomeOutlined />}
                  onClick={() => navigate('/')}
                >
                  去首页
                </GhostButton>
              </ActionsBar>
            </BalanceCard>

            <MiniStatCard>
              <MiniStatTitle>
                <ArrowDownOutlined />
                本月收入
              </MiniStatTitle>
              <MiniStatValue>
                <span className="unit">¥</span>
                {Math.min(totalEarned, 2680).toFixed(2)}
              </MiniStatValue>
            </MiniStatCard>

            <MiniStatCard>
              <MiniStatTitle>
                <TransactionOutlined />
                本月支出
              </MiniStatTitle>
              <MiniStatValue>
                <span className="unit">¥</span>
                {Math.min(balance, 520).toFixed(2)}
              </MiniStatValue>
            </MiniStatCard>
          </OverviewGrid>

          <BillsCard>
            <BillsHeader>
              <BillsHeaderLeft>
                <TransactionOutlined />
                资金明细
              </BillsHeaderLeft>

              <BillsHeaderRight>
                <SearchBox
                  allowClear
                  placeholder="搜索明细ID/标题/备注"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  prefix={<SearchOutlined />}
                />
              </BillsHeaderRight>

              <div style={{ width: '100%' }}>
                <Segmented
                  options={billFilterOptions}
                  value={billFilter}
                  onChange={(v) => setBillFilter(v as BillFilter)}
                />
              </div>
            </BillsHeader>

            <BillsList>
              {filteredBills.length === 0 ? (
                <div style={{ padding: '40px 0' }}>
                  <Empty description="暂无明细记录" />
                </div>
              ) : (
                filteredBills.map(b => {
                  const positive = b.type === 'income' || b.type === 'unfreeze';

                  return (
                    <BillItem key={b.id}>
                      <BillMain>
                        <div className="title" title={b.title}>{b.title}</div>
                        <div className="meta">
                          <Tag color={billTypeTagColor[b.type]} style={{ marginInlineEnd: 0 }}>
                            {billTypeLabel[b.type]}
                          </Tag>
                          <Tag color="default" style={{ marginInlineEnd: 0 }}>
                            {billStatusLabel[b.status]}
                          </Tag>
                          <span>{b.id}</span>
                          <span>{b.time}</span>
                          {b.remark && <span>备注：{b.remark}</span>}
                        </div>
                      </BillMain>

                      <BillSide>
                        <AmountText positive={positive}>
                          <span className="sign">{positive ? '+' : '-'}</span>
                          <span className="unit">¥</span>
                          {b.amount.toFixed(2)}
                        </AmountText>
                        <div style={{ fontSize: 12, color: '#999' }}>
                          点击查看详情（待接入）
                        </div>
                      </BillSide>
                    </BillItem>
                  );
                })
              )}
            </BillsList>
          </BillsCard>
        </ContentWrapper>

        <Modal
          title="提现"
          open={withdrawOpen}
          onCancel={() => setWithdrawOpen(false)}
          onOk={handleWithdrawSubmit}
          okText="提交"
          cancelText="取消"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              label="提现金额"
              name="amount"
              rules={[
                { required: true, message: '请输入提现金额' },
                {
                  validator: async (_, value) => {
                    const num = Number(value);
                    if (Number.isNaN(num) || num <= 0) throw new Error('金额需大于0');
                    if (num > balance) throw new Error('提现金额不能超过可用余额');
                  },
                },
              ]}
            >
              <Input placeholder="例如 100" />
            </Form.Item>
            <Form.Item label="到账方式" name="channel" initialValue="alipay">
              <Segmented
                options={[
                  { label: '支付宝', value: 'alipay' },
                  { label: '微信', value: 'wechat' },
                  { label: '银行卡', value: 'bank' },
                ]}
              />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="充值"
          open={topupOpen}
          onCancel={() => setTopupOpen(false)}
          onOk={handleTopupSubmit}
          okText="继续"
          cancelText="取消"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              label="充值金额"
              name="amount"
              rules={[{ required: true, message: '请输入充值金额' }]}
            >
              <Input placeholder="例如 200" />
            </Form.Item>
            <Form.Item label="支付方式" name="pay" initialValue="alipay">
              <Segmented
                options={[
                  { label: '支付宝', value: 'alipay' },
                  { label: '微信', value: 'wechat' },
                  { label: '银行卡', value: 'bank' },
                ]}
              />
            </Form.Item>
          </Form>
        </Modal>
      </PageContainer>
    </ConfigProvider>
  );
};

export default UserWalletPage;
