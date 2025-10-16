/*
 * @Author: 郭郭
 * @Date: 2025/8/15
 * @Description:
 */

import { CustomColumnProps, CustomModalProps } from '@/components/compontent';
import CustomUpload from '@/components/CustomUpload';
import FormItem from '@/components/FormItem';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Drawer, Form, message, Modal } from 'antd';
import cloneDeep from 'lodash/cloneDeep';
import { FormRef } from 'rc-field-form';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import styles from './index.less';

const CustomModal = forwardRef<any, CustomModalProps>(
  (props: Omit<CustomModalProps, 'ref'>, ref) => {
    const {
      type,
      onSubmit,
      columns,
      saveRequest,
      updateRequest,
      detail,
      handleData,
      title,
      formList = {},
      ...other
    } = props;
    const formRef: React.LegacyRef<FormRef<any>> | undefined = useRef<any>();
    const [values, setValues] = useState<any>({});
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [messageApi, messageHolder] = message.useMessage();
    const formKey = '_form_key';
    const modalType: any = {
      modal: Modal,
      drawer: Drawer,
      detail: <></>,
    };

    const Component = modalType[type || 'drawer'];
    const placeholder: any = {
      input: '输入',
      upload: '上传',
      default: '选择',
    };

    const handleColumns = () => {
      const newColumns: CustomColumnProps[] = (columns || []).filter(
        (item: CustomColumnProps) => !item.hideInForm,
      );
      return cloneDeep(newColumns).map((item) => {
        if (item.formKey) {
          const key = /_form_key$/.test(item.formKey) ? '' : formKey;
          item.dataIndex = item.formKey + key;
        }
        return item;
      });
    };
    const [newColumns, setNewColumns] = useState<CustomColumnProps[]>(handleColumns());

    useImperativeHandle(ref, () => ({
      async open(values: { [key: string]: any }) {
        setOpen(true);
        if (values && values.id && detail) {
          const data = await detail(values.id);
          columns?.forEach((item: CustomColumnProps) => {
            if (item.formKey) {
              data[`${item.dataIndex}${formKey}`] = data[item.dataIndex];
            }
          });
          formRef?.current?.setFieldsValue(data || {});
          setValues(data || {});
          return;
        }
        setTimeout(() => {
          formRef?.current?.setFieldsValue(values || {});
          setValues(values || {});
        });
      },
    }));

    const submitEvent = async () => {
      setLoading(true);
      try {
        const formData = await formRef.current?.validateFields();
        const data = { ...values, ...formData };
        let result: any = {};
        for (const key in data) {
          if (new RegExp(formKey).test(key)) {
            result[key.replace(new RegExp(formKey), '')] = data[key];
          } else {
            result[key] = data[key];
          }
        }
        if (handleData) {
          result = handleData(result);
        }
        if (values.id) {
          updateRequest && (await updateRequest(result));
        } else {
          saveRequest && (await saveRequest(result));
        }
        setOpen(false);
        formRef.current?.resetFields();
        onSubmit && onSubmit(true);
        messageApi.success('提交成功');
      } catch (e) {
        console.log(e, 'submit request error');
      }
      setLoading(false);
    };

    const close = () => {
      setOpen(false);
      formRef.current?.resetFields();
      onSubmit && onSubmit();
    };

    const footer = [
      <Button key="cancel" size="large" onClick={close}>
        取消
      </Button>,
      <Button key="submit" type="primary" size="large" loading={loading} onClick={submitEvent}>
        提交
      </Button>,
    ];

    const getPlaceholder = (type: string | undefined, title: any) => {
      return `请${placeholder[(type as string) || 'input'] || placeholder.default}${
        title ? title : ''
      }`;
    };

    useEffect(() => {
      setNewColumns(handleColumns());
    }, [JSON.stringify(columns)]);

    return (
      <>
        {messageHolder}
        <Component
          width={other.width || 600}
          footer={footer}
          title={`${!!values.id ? '编辑' : '新增'}${title}`}
          {...other}
          open={open}
          onClose={close}
          className={styles.formContainer}
        >
          <Form size="large" layout="vertical" autoComplete="off" ref={formRef}>
            {(newColumns || []).map((item: CustomColumnProps) => {
              const defaultPlaceholder = getPlaceholder(item.type, item.title);
              return item.type === 'list' ? (
                <Form.List name={item.dataIndex} key={item.dataIndex}>
                  {(fields, { add, remove }, { errors }) => (
                    <>
                      {fields.map((field, key) => {
                        return (
                          <Form.Item
                            label={key === 0 ? `${item.title}` : ''}
                            key={field.key}
                            rules={item.required ? [{ required: true }] : []}
                            className={styles.dynamicItemContainer}
                          >
                            <div className={styles.listGroupContainer}>
                              <div className={styles.listGroupContent}>
                                {(formList[item.dataIndex] || []).map((list: any) => {
                                  const placeholder = getPlaceholder(list.type, list.title);
                                  return (
                                    <Form.Item
                                      name={[field.name, list.dataIndex]}
                                      label={list.title}
                                      key={list.dataIndex}
                                      labelAlign="right"
                                      rules={[
                                        { required: list.required, message: placeholder },
                                        ...(list.rules || []),
                                      ]}
                                    >
                                      {list.type === 'upload' ? (
                                        <CustomUpload {...list} />
                                      ) : (
                                        <FormItem {...list} defaultPlaceholder={placeholder} />
                                      )}
                                    </Form.Item>
                                  );
                                })}
                              </div>
                              <span className={styles.listDelIcon}>
                                <DeleteOutlined onClick={() => remove(field.name)} />
                              </span>
                            </div>
                          </Form.Item>
                        );
                      })}
                      <Form.Item>
                        <Button type="dashed" block onClick={() => add()}>
                          {'新增' + item.title}
                        </Button>
                        <Form.ErrorList errors={errors} />
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              ) : (
                <Form.Item
                  key={item.dataIndex}
                  label={item.title ? `${item.title}` : ''}
                  name={item.dataIndex}
                  rules={[
                    { required: item.required, message: defaultPlaceholder },
                    ...(item.rules || []),
                  ]}
                >
                  {item.type === 'upload' ? (
                    <CustomUpload {...item} />
                  ) : (
                    <FormItem {...item} defaultPlaceholder={defaultPlaceholder} />
                  )}
                </Form.Item>
              );
            })}
          </Form>
        </Component>
      </>
    );
  },
);

export default CustomModal;
