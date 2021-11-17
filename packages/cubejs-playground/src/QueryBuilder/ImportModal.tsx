import { Query } from '@cubejs-client/core';
import React, { useState } from 'react';
import { Modal, Button, Input } from 'antd';
const { TextArea } = Input;

type ImportModalProps = {
  query: Query;
};

export default function ImportModal({ query }: ImportModalProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [queryStr, setQueryStr] = useState(JSON.stringify(query));

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        JSON Import
      </Button>
      <Modal
        title="JSON Import"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <TextArea
          rows={4}
          value={queryStr}
          onChange={(s) => setQueryStr(s.target.value)}
        />
      </Modal>
    </>
  );
}
