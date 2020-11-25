import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, InputNumber, Select } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import rules from '../forms/rules'

function GeneratePaymentModal({ visible, onSubmit, onCancel }) {
    const formRef = React.createRef()

    // Resetar o form para initialValues
    useEffect(() => {
        if (formRef.current) {
            formRef.current.resetFields()
        }
    }, [formRef])

    const handleSubmit = () => {
        const values = formRef.current.getFieldsValue()
        onSubmit({
            ...values,
        })
    }

    const createDates = () => {
        const dates = []
        let startMonth = new Date().getMonth()
        let startYear = new Date().getFullYear()

        for (let i = 0; i < 13; i++) {

            if (startMonth > 11) {
                startMonth = 0;
                startYear++;
            }

            const optionDate = new Date(startYear, startMonth)
            const dateString = (optionDate.getMonth() + 1) + '/' + optionDate.getFullYear()

            const date = {
                value: i,
                date: dateString
            }

            startMonth++

            dates.push(date)
        }

        return dates
    }

    const dates = createDates()

    return (
        <Modal
            okText="Gerar"
            okButtonProps={{ icon: <SaveOutlined /> }}
            onOk={handleSubmit}
            onCancel={onCancel}
            visible={visible}
            title={'Gerar mensalidades'}
        >
            <Form ref={formRef} layout="vertical" name="generation">
                <Form.Item
                    name="day"
                    wrapperCol={{ md: 12 }}
                    label="Dia de Vencimento"
                    rules={[rules.required]}
                >
                    <InputNumber defaultValue={1} precision={0} scale={1} min={1} max={31} />
                </Form.Item>
                <Form.Item rules={[rules.required]}
                    name="monthQnt" label="Até qual data gerar mensaldiades?">
                    <Select>
                        {dates.map(d => (
                            <Select.Option key={d.value} value={d.value}>
                                {d.date}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    )
}

GeneratePaymentModal.propTypes = {
    dates: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.number,
            date: PropTypes.string,
        })
    ),
    visible: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
}

GeneratePaymentModal.defaultProps = {
    dates: null,
}

export default GeneratePaymentModal
