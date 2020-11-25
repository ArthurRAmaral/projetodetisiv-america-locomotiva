import React from 'react'
import PropTypes from 'prop-types'
import ImgCrop from 'antd-img-crop'
import { connect } from 'react-redux'
import { Upload, Typography, message } from 'antd'
import { FileImageTwoTone } from '@ant-design/icons'

import * as authStore from '../../store/ducks/auth'

function ProfilePicUpload({ updateProfilePicture, onSuccess }) {
  const key = 'ProfilePicUpload'
  const beforeUpload = async file => {
    try {
      message.loading({ content: 'Enviando arquivo...', key })
      await updateProfilePicture(file)
      message.success({ content: 'Arquivo enviado com sucesso!', key })
      onSuccess()
    } catch (error) {
      message.error({ content: 'Ocorreu um ao tentar enviar o arquivo. Tente novamente.', key })
    }
  }

  return (
    <ImgCrop rotate modalTitle="Editar Imagem">
      <Upload.Dragger
        className="text-center"
        beforeUpload={beforeUpload}
        showUploadList={false}
        multiple={false}
        name="avatar"
      >
        <p style={{ fontSize: 96, marginBottom: 8 }}>
          <FileImageTwoTone />
        </p>
        <Typography.Text type="secondary">
          Clique aqui ou arraste uma imagem para usar como foto de perfil
        </Typography.Text>
        {/* <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibit from uploading company data or
          other band files
        </p> */}
      </Upload.Dragger>
    </ImgCrop>
  )
}

ProfilePicUpload.propTypes = {
  updateProfilePicture: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
}

export default connect(null, {
  updateProfilePicture: authStore.updateProfilePicture,
})(ProfilePicUpload)
