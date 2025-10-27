import React from "react";
import { Modal, QRCode } from "antd";

interface WeChatQRModalProps {
  open: boolean;
  onClose: () => void;
}

export const WeChatQRModal: React.FC<WeChatQRModalProps> = ({
  open,
  onClose
}) => {
  return (
    <Modal
      title="关注微信公众号"
      open={open}
      onCancel={onClose}
      footer={null}
      centered
    >
      <div style={{ textAlign: "center", padding: "20px" }}>
        <div style={{ marginBottom: "16px" }}>
          <QRCode
            value="https://universe-life.com"
            size={200}
          />
        </div>
        <p>扫码关注万象生活公众号</p>
        <p style={{ fontSize: "12px", color: "#666" }}>
          获取更多优惠信息和服务动态
        </p>
      </div>
    </Modal>
  );
};
