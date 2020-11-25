import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { message, Upload, Modal, Typography } from 'antd'
import { FileImageTwoTone } from '@ant-design/icons'

import * as teamStore from '../../store/ducks/team'

function TeamImageUploadModal({ visible, uploadImage, onCancel }) {
  const key = 'TeamImageUpload'
  const beforeUpload = async file => {
    try {
      onCancel()
      message.loading({ content: 'Enviando arquivo...', key })
      await uploadImage(file)
      message.success({ content: 'Arquivo enviado com sucesso!', key })
    } catch (error) {
      message.error({ content: 'Ocorreu um ao tentar enviar o arquivo. Tente novamente.', key })
    }
  }

  return (
    <Modal visible={visible} title="Atualizar foto da equipe" onCancel={onCancel} footer={null}>
      <Upload.Dragger
        className="text-center"
        beforeUpload={beforeUpload}
        showUploadList={false}
        multiple={false}
      >
        <p style={{ fontSize: 96, marginBottom: 8 }}>
          <FileImageTwoTone />
        </p>
        <Typography.Text type="secondary">
          Clique aqui ou arraste uma imagem para usar como a foto da equipe.
        </Typography.Text>
      </Upload.Dragger>
    </Modal>
  )
}

TeamImageUploadModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  uploadImage: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}

export default connect(null, {
  uploadImage: teamStore.uploadImage,
})(TeamImageUploadModal)
