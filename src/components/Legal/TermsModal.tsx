import React from 'react';
import { Modal, Tabs, Button } from 'antd';
import styled from '@emotion/styled';

const { TabPane } = Tabs;

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 16px;
    overflow: hidden;
  }

  .ant-modal-header {
    background: linear-gradient(135deg, #ff6b00 0%, #ff8c00 100%);
    padding: 20px 24px;
    border-bottom: none;

    .ant-modal-title {
      color: white;
      font-weight: 600;
      font-size: 18px;
    }
  }

  .ant-modal-close {
    color: white;
    top: 20px;

    &:hover {
      color: rgba(255, 255, 255, 0.8);
    }
  }

  .ant-modal-body {
    padding: 0;
    max-height: 600px;
    overflow-y: auto;
  }

  .ant-modal-footer {
    padding: 16px 24px;
    border-top: 1px solid #f0f0f0;
  }

  /* 自定义滚动条 */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;

    &:hover {
      background: #a8a8a8;
    }
  }
`;

const ContentContainer = styled.div`
  padding: 24px;

  .ant-tabs-nav {
    margin-bottom: 24px;

    &::before {
      border-bottom: 1px solid #f0f0f0;
    }

    .ant-tabs-tab {
      padding: 12px 16px;
      font-weight: 500;

      &.ant-tabs-tab-active {
        color: #ff6b00;
      }

      &:hover {
        color: #ff8c00;
      }
    }

    .ant-tabs-ink-bar {
      background: #ff6b00;
    }
  }
`;

const Section = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }

  h3 {
    color: #333;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f0f0f0;
  }

  h4 {
    color: #555;
    font-size: 14px;
    font-weight: 600;
    margin: 16px 0 8px 0;
  }

  p,
  li {
    color: #666;
    font-size: 13px;
    line-height: 1.6;
    margin-bottom: 8px;
  }

  ul {
    padding-left: 20px;
    margin-bottom: 12px;
  }

  ol {
    padding-left: 20px;
    margin-bottom: 12px;
  }
`;

const AgreementFooter = styled.div`
  text-align: center;
  padding: 16px 0;
  border-top: 1px solid #f0f0f0;
  margin-top: 20px;

  p {
    color: #999;
    font-size: 12px;
    margin: 0;
  }
`;

interface TermsModalProps {
  visible: boolean;
  onClose: () => void;
  defaultActiveTab?: 'user' | 'privacy' | 'disclaimer';
}

const TermsModal: React.FC<TermsModalProps> = ({ visible, onClose, defaultActiveTab = 'user' }) => {
  return (
    <StyledModal
      title='用户协议与隐私政策'
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key='close' onClick={onClose}>
          我已阅读并同意
        </Button>,
      ]}
      width={600}
      centered
    >
      <ContentContainer>
        <Tabs defaultActiveKey={defaultActiveTab}>
          <TabPane tab='用户服务协议' key='user'>
            <Section>
              <h3>1. 协议的接受与确认</h3>
              <p>
                欢迎使用万象生活平台！本协议是您与万象生活平台运营方之间关于使用万象生活平台服务所订立的协议。请您仔细阅读本协议，您点击"同意"、"下一步"或您的注册、登录、使用等行为将视为对本协议的接受和确认。
              </p>
            </Section>

            <Section>
              <h3>2. 服务说明</h3>
              <p>万象生活平台是一个为用户提供生活服务的综合性平台，包括但不限于：</p>
              <ul>
                <li>生活服务信息发布与查询</li>
                <li>商家入驻与展示</li>
                <li>用户互动与评价</li>
                <li>在线交易与支付</li>
                <li>会员服务与权益</li>
              </ul>
            </Section>

            <Section>
              <h3>3. 用户注册与账户</h3>
              <h4>3.1 注册资格</h4>
              <p>
                您确认，在您完成注册程序或以其他万象生活平台允许的方式实际使用服务时，您应当是具备完全民事权利能力和完全民事行为能力的自然人、法人或其他组织。
              </p>

              <h4>3.2 账户安全</h4>
              <p>
                您须自行负责对您的账户和密码保密，且须对您在该账户名下之所有活动（包括但不限于信息披露、发布信息、网上点击同意或提交各类规则协议、网上续约等）负全部责任。
              </p>
            </Section>

            <Section>
              <h3>4. 用户行为规范</h3>
              <p>您承诺不会利用本服务进行任何违法或不正当的活动，包括但不限于：</p>
              <ul>
                <li>发布或传播虚假信息、骚扰信息、垃圾邮件</li>
                <li>侵犯他人知识产权、隐私权、名誉权等合法权益</li>
                <li>传播病毒、木马、恶意代码等危害网络安全的内容</li>
                <li>进行任何可能对服务正常运行造成不利影响的行为</li>
              </ul>
            </Section>

            <Section>
              <h3>5. 知识产权</h3>
              <p>
                万象生活平台上的所有内容，包括但不限于文字、图片、音频、视频、图表、标识、广告、商标、商号、域名、软件、程序、版面设计、专栏目录与名称、内容分类标准等，均受著作权法、商标法、专利法、反不正当竞争法及相应国际条约等相关法律的保护。
              </p>
            </Section>

            <Section>
              <h3>6. 免责声明</h3>
              <p>在法律允许的最大范围内，万象生活平台不对以下事项承担责任：</p>
              <ul>
                <li>因用户使用或无法使用服务而导致的任何直接或间接损失</li>
                <li>因第三方服务或链接而导致的任何损失或损害</li>
                <li>因不可抗力（如自然灾害、政府行为、网络故障等）导致的服务中断</li>
              </ul>
            </Section>

            <Section>
              <h3>7. 协议的修改与更新</h3>
              <p>
                万象生活平台有权根据需要不时地修改本协议条款。如果您不接受相关修改，应当停止使用相关服务。如果您继续使用相关服务，则视为您接受经修订的协议。
              </p>
            </Section>
          </TabPane>

          <TabPane tab='隐私政策' key='privacy'>
            <Section>
              <h3>1. 信息收集</h3>
              <p>我们可能收集以下类型的信息：</p>
              <ul>
                <li>
                  <strong>账户信息：</strong>用户名、手机号码、电子邮箱等
                </li>
                <li>
                  <strong>使用信息：</strong>使用记录、交易记录、浏览记录等
                </li>
                <li>
                  <strong>设备信息：</strong>设备型号、操作系统、唯一设备标识符等
                </li>
                <li>
                  <strong>位置信息：</strong>GPS定位、基站定位等（需获得您的明确授权）
                </li>
              </ul>
            </Section>

            <Section>
              <h3>2. 信息使用</h3>
              <p>我们可能使用您的个人信息用于：</p>
              <ul>
                <li>提供、维护和改进我们的服务</li>
                <li>向您发送重要通知、服务信息和营销信息</li>
                <li>进行数据分析、用户研究和改进服务体验</li>
                <li>保护服务安全，防范欺诈、滥用等风险</li>
                <li>遵守法律法规要求</li>
              </ul>
            </Section>

            <Section>
              <h3>3. 信息共享</h3>
              <p>除以下情况外，我们不会与任何第三方共享您的个人信息：</p>
              <ul>
                <li>获得您的明确同意</li>
                <li>为履行服务合同所必需</li>
                <li>为遵守法律法规要求</li>
                <li>为保护用户或公众的人身财产安全所必需</li>
              </ul>
            </Section>

            <Section>
              <h3>4. 信息存储</h3>
              <p>我们采用符合业界标准的技术和管理措施来保护您的个人信息安全，包括但不限于：</p>
              <ul>
                <li>使用加密技术保护敏感信息</li>
                <li>限制对个人信息的访问权限</li>
                <li>定期进行安全审计和风险评估</li>
                <li>建立数据备份和恢复机制</li>
              </ul>
            </Section>

            <Section>
              <h3>5. Cookie使用</h3>
              <p>
                我们使用Cookie和类似技术来改善您的使用体验。您可以通过浏览器设置控制Cookie的使用。但如果您禁用Cookie，可能会影响某些服务的正常使用。
              </p>
            </Section>

            <Section>
              <h3>6. 联系我们</h3>
              <p>如果您对本隐私政策有任何疑问或建议，请通过以下方式联系我们：</p>
              <ul>
                <li>电子邮箱：privacy@wanxiangshenghuo.com</li>
                <li>联系电话：400-123-4567</li>
                <li>联系地址：北京市朝阳区某某大厦1001室</li>
              </ul>
            </Section>
          </TabPane>

          <TabPane tab='平台免责声明' key='disclaimer'>
            <Section>
              <h3>1. 法律声明</h3>
              <p>
                万象生活平台依法取得相关经营许可，在中华人民共和国境内合法经营。本平台郑重声明：
              </p>
              <ul>
                <li>严格遵守《中华人民共和国网络安全法》《个人信息保护法》等法律法规</li>
                <li>平台已办理ICP备案号：京ICP备12345678号</li>
                <li>平台已取得增值电信业务经营许可证：京B2-20210001</li>
                <li>平台已按要求进行公安机关备案</li>
              </ul>
            </Section>

            <Section>
              <h3>2. 服务免责</h3>
              <p>万象生活平台作为信息服务平台，对以下事项不承担责任：</p>
              <ul>
                <li>第三方商家提供的产品或服务质量问题</li>
                <li>用户之间因交易产生的纠纷</li>
                <li>因用户个人原因导致的账户安全问题</li>
                <li>不可抗力导致的服务中断或数据丢失</li>
              </ul>
            </Section>

            <Section>
              <h3>3. 风险提示</h3>
              <p>请您在使用本平台服务时注意：</p>
              <ul>
                <li>谨慎甄别商家信息，选择信誉良好的商家进行交易</li>
                <li>妥善保管个人账户信息，定期修改密码</li>
                <li>不要在公共网络环境下进行敏感操作</li>
                <li>遇到可疑情况及时联系平台客服</li>
              </ul>
            </Section>

            <Section>
              <h3>4. 投诉举报</h3>
              <p>如发现违法违规行为，欢迎通过以下方式举报：</p>
              <ul>
                <li>投诉电话：400-123-4568</li>
                <li>举报邮箱：report@wanxiangshenghuo.com</li>
                <li>在线客服：平台内客服系统</li>
              </ul>
              <p>我们将在收到举报后及时处理，并依法保护举报人信息。</p>
            </Section>

            <Section>
              <h3>5. 监管配合</h3>
              <p>万象生活平台承诺：</p>
              <ul>
                <li>积极配合有关部门的监督检查</li>
                <li>及时处理违法违规信息</li>
                <li>定期向监管部门报告平台运营情况</li>
                <li>接受社会各界监督</li>
              </ul>
            </Section>

            <AgreementFooter>
              <p>本声明最后更新时间：2024年10月25日</p>
              <p>万象生活平台 版权所有</p>
            </AgreementFooter>
          </TabPane>
        </Tabs>
      </ContentContainer>
    </StyledModal>
  );
};

export default TermsModal;
